import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!type || !["logo", "gallery", "profile"].includes(type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds limit (5MB)" },
        { status: 400 }
      );
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
        { status: 400 }
      );
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", type);
    await checkDirectory(uploadDir);

    // Generate unique filename
    const fileName = `${type}_${session.user.id}_${Date.now()}_${file.name}`;
    const filePath = join(uploadDir, fileName);

    // Save file
    await writeFile(filePath, buffer);

    // Return file URL
    const fileUrl = `/uploads/${type}/${fileName}`;

    return NextResponse.json(
      { message: "File uploaded successfully", url: fileUrl },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

// Helper function to check and create directory if it doesn't exist
async function checkDirectory(directory: string) {
  try {
    const { mkdir } = require("fs/promises");
    const { existsSync } = require("fs");

    if (!existsSync(directory)) {
      await mkdir(directory, { recursive: true });
    }
  } catch (error) {
    console.error("Error creating directory:", error);
    throw error;
  }
}
