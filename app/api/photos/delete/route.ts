import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Basic auth check using environment variables
const checkAuth = (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error("Admin credentials not configured in environment variables");
    return false;
  }

  return (
    authHeader ===
    "Basic " + Buffer.from(`${username}:${password}`).toString("base64")
  );
};

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    if (!checkAuth(req)) {
      console.log("Authentication failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { filename } = body;

    console.log("Delete request for file:", filename);

    if (!filename) {
      console.log("No filename provided");
      return NextResponse.json(
        { error: "No filename provided" },
        { status: 400 }
      );
    }

    // Ensure the filename ends with a valid image extension
    if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(filename)) {
      console.log("Invalid file extension:", filename);
      return NextResponse.json(
        { error: "Invalid file extension" },
        { status: 400 }
      );
    }

    // Check for any potentially dangerous characters in the filename
    if (
      filename.includes("..") ||
      filename.startsWith("/") ||
      filename.startsWith("\\")
    ) {
      console.log("Potentially dangerous filename:", filename);
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const filepath = join(process.cwd(), "public", "uploads", filename);

    // Check if file exists before attempting to delete
    if (!existsSync(filepath)) {
      console.log("File not found:", filepath);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete the file
    await unlink(filepath);
    console.log("File deleted successfully:", filepath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      {
        error: "Error deleting file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
