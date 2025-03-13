import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Create the registration in the database
    const registration = await prisma.registration.create({
      data: {
        eventId: data.eventId,
        fullName: data.fullName,
        email: data.primaryContact.email,
        phone: data.primaryContact.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        dateOfBirth: new Date(data.dateOfBirth),
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        specialRequirements: data.specialRequirements,
        numberOfParticipants: data.participants,
        totalPrice: data.totalPrice,
        transactionId: data.transactionId,
        travelers: data.travelers,
        travelersSummary: data.travelersSummary,
        status: "CONFIRMED",
        registrationDate: new Date(data.registrationDate),
      },
    });

    // Send confirmation email
    // TODO: Implement email sending

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Error creating registration" },
      { status: 500 }
    );
  }
}
