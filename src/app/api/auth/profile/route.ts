import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
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

if (isCloudinaryConfigured) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
}


// GET — fetch profile of the currently authenticated user
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("kwest_session")?.value
      || req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.userId || payload.userId === "admin-id") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        tier: true,
        memberNo: true,
        joinedDate: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err: any) {
    console.error("Profile GET error:", err);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}

// PATCH — update name, phone, avatar of the authenticated user
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("kwest_session")?.value
      || req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.userId || payload.userId === "admin-id") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, avatar } = await req.json();
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    if (avatar !== undefined) {
      if (avatar && typeof avatar === "string") {
        let buffer: Buffer | null = null;
        let fileExt = ".png";

        if (avatar.startsWith("data:")) {
          const matches = avatar.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
          if (matches) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            buffer = Buffer.from(base64Data, "base64");

            if (mimeType) {
              const ext = mimeType.split("/")[1];
              if (ext) {
                if (ext === "jpeg") fileExt = ".jpg";
                else if (ext === "svg+xml") fileExt = ".svg";
                else fileExt = `.${ext}`;
              }
            }
          }
        } else if (
          !avatar.startsWith("http://") &&
          !avatar.startsWith("https://") &&
          !avatar.startsWith("/") &&
          /^[a-zA-Z0-9+/\r\n]+={0,2}$/.test(avatar)
        ) {
          buffer = Buffer.from(avatar, "base64");
        }

        if (buffer) {
          if (isCloudinaryConfigured) {
            const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: "kwest-liquor-avatars",
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result as { secure_url: string });
                }
              );
              uploadStream.end(buffer);
            });
            updateData.avatar = result.secure_url;
          } else {
            const uploadsDir = path.join(process.cwd(), "public/uploads");
            try {
              await fs.access(uploadsDir);
            } catch {
              await fs.mkdir(uploadsDir, { recursive: true });
            }

            const fileName = `avatar_${payload.userId}_${Date.now()}${fileExt}`;
            const filePath = path.join(uploadsDir, fileName);
            await fs.writeFile(filePath, buffer);
            updateData.avatar = `/uploads/${fileName}`;
          }
        } else {
          updateData.avatar = avatar;
        }
      } else {
        updateData.avatar = avatar;
      }
    }

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        tier: true,
        memberNo: true,
        joinedDate: true,
      },
    });

    return NextResponse.json({ user });
  } catch (err: any) {
    console.error("Profile PATCH error:", err);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
