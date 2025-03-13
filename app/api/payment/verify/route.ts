import { NextRequest, NextResponse } from "next/server";

async function verifyCard(cardData: any) {
  try {
    const response = await fetch(
      "https://api.sandbox.accept.blue/api/v2/transactions/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            process.env.BRYTEWIRE_API_KEY || ""
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          card: cardData.cardNumber,
          expiry_month: parseInt(cardData.expiryMonth),
          expiry_year: parseInt(cardData.expiryYear),
          cvv2: cardData.cvv,
          avs_address: cardData.billingAddress,
          avs_zip: cardData.billingZip,
          name: cardData.cardholderName,
          transaction_flags: {
            is_customer_initiated: true,
            cardholder_present: false,
            card_present: false,
          },
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying card:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const verificationResult = await verifyCard(data);

    return NextResponse.json(verificationResult);
  } catch (error) {
    console.error("Error in verify route:", error);
    return NextResponse.json(
      { error: "Error verifying card" },
      { status: 500 }
    );
  }
}
