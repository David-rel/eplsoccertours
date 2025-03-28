import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    if (!checkAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Ensure the event ID is provided
    if (!data.id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "pricePerPerson",
      "coverImage",
      "startDate",
      "endDate",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if the event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: data.id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Update the event
    const event = await prisma.event.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        pricePerPerson: data.pricePerPerson,
        coverImage: data.coverImage,
        paymentLink: data.paymentLink || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        minAge: data.minAge || 0,
        maxAge: data.maxAge || 99,
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Error updating event" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
