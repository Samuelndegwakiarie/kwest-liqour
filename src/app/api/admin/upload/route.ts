import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";
import path from "path";

// Configure Cloudinary if environment variables are present
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

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

      return NextResponse.json({ url: result.secure_url });
    } else {
      // Fallback: Local uploads directory
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      
      try {
        await fs.access(uploadsDir);
      } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
      }

      // Generate a clean safe filename
      const fileExt = path.extname(file.name) || ".png";
      const baseName = path.basename(file.name, fileExt).replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `${baseName}_${Date.now()}${fileExt}`;
      const filePath = path.join(uploadsDir, fileName);

      await fs.writeFile(filePath, buffer);
      
      return NextResponse.json({ url: `/uploads/${fileName}` });
    }
  } catch (err: unknown) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Image upload failed: " + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}
