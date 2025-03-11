import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  if (checkAuth(req)) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
