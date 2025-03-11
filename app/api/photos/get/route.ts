import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const uploadDir = join(process.cwd(), "public", "uploads");

    // Read all files in the uploads directory
    const files = await readdir(uploadDir);

    // Filter for image files and create URLs
    const photos = files
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map((filename) => ({
        filename,
        url: `/uploads/${filename}`,
      }));

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error getting photos:", error);
    return NextResponse.json(
      { error: "Error getting photos" },
      { status: 500 }
    );
  }
}
