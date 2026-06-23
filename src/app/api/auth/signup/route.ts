import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";
import path from "path";

// Configure Cloudinary if environment variables are present
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_URL ||
  (process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET)
);

if (isCloudinaryConfigured && !process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(req: Request) {
  try {
    const { email, password, name, phone, avatar } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required." }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    // Process avatar upload if present
    let avatarUrl = avatar || null;

    if (avatar && typeof avatar === "string") {
      const matches = avatar.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
      let buffer: Buffer | null = null;
      let fileExt = ".png";

      if (matches) {
        const extension = matches[1];
        fileExt = `.${extension === "jpeg" ? "jpg" : extension}`;
        buffer = Buffer.from(matches[2], "base64");
      } else if (!avatar.startsWith("http://") && !avatar.startsWith("https://") && !avatar.startsWith("/")) {
        // Assume it's a raw base64 string
        buffer = Buffer.from(avatar, "base64");
      } else {
        buffer = null;
      }

      if (buffer) {
        if (isCloudinaryConfigured) {
          // Stream upload to Cloudinary
          const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "kwest-liquor",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result as { secure_url: string });
              }
            );
            uploadStream.end(buffer);
          });
          avatarUrl = result.secure_url;
        } else {
          // Fallback: Local uploads directory
          const uploadsDir = path.join(process.cwd(), "public/uploads");
          try {
            await fs.access(uploadsDir);
          } catch {
            await fs.mkdir(uploadsDir, { recursive: true });
          }

          const fileName = `avatar_${Date.now()}${fileExt}`;
          const filePath = path.join(uploadsDir, fileName);
          await fs.writeFile(filePath, buffer);
          avatarUrl = `/uploads/${fileName}`;
        }
      }
    }

    // Generate unique member number
    let memberNo = "";
    let isUnique = false;
    while (!isUnique) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      memberNo = `KWC-2026-${rand}`;
      const duplicate = await prisma.user.findUnique({
        where: { memberNo },
      });
      if (!duplicate) {
        isUnique = true;
      }
    }

    // Create user
    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        avatar: avatarUrl,
        memberNo,
        tier: "Amber Private Reserve",
      },
    });

    // Create token
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: "user",
    });

    const responseUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      tier: user.tier,
      memberNo: user.memberNo,
      joinedDate: user.joinedDate.toISOString(),
    };

    const res = NextResponse.json({
      user: responseUser,
      token,
    }, { status: 201 });

    // Set HTTPOnly cookie for secure session handling
    res.cookies.set("kwest_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Failed to register user." }, { status: 500 });
  }
}

