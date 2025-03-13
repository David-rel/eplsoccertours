import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get the event ID from the query parameters if it exists
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      // Return a single event if ID is provided
      const eventId = parseInt(id);
      if (isNaN(eventId)) {
        return NextResponse.json(
          { error: "Invalid event ID" },
          { status: 400 }
        );
      }

      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }

      return NextResponse.json({ event });
    } else {
      // Return all events if no ID is provided
      const events = await prisma.event.findMany({
        orderBy: {
          startDate: "asc",
        },
      });

      return NextResponse.json({ events });
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Error fetching events" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
