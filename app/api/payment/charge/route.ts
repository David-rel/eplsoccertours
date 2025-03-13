import { NextRequest, NextResponse } from "next/server";

async function processCharge(chargeData: any) {
  try {
    const response = await fetch(
      "https://api.sandbox.accept.blue/api/v2/transactions/charge",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            process.env.BRYTEWIRE_API_KEY || ""
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          amount: chargeData.amount,
          card: chargeData.cardNumber,
          expiry_month: parseInt(chargeData.expiryMonth),
          expiry_year: parseInt(chargeData.expiryYear),
          cvv2: chargeData.cvv,
          name: chargeData.cardholderName,
          avs_address: chargeData.billingAddress,
          avs_zip: chargeData.billingZip,
          billing_info: {
            first_name: chargeData.firstName,
            last_name: chargeData.lastName,
            street: chargeData.address,
            city: chargeData.city,
            state: chargeData.state,
            zip: chargeData.zipCode,
            country: chargeData.country,
            phone: chargeData.phone,
          },
          transaction_details: {
            description: `Event Registration: ${chargeData.eventName}`,
            invoice_number: `REG-${Date.now()}`,
          },
          customer: {
            email: chargeData.email,
            identifier: chargeData.fullName,
          },
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
    console.error("Error processing charge:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const chargeResult = await processCharge(data);

    return NextResponse.json(chargeResult);
  } catch (error) {
    console.error("Error in charge route:", error);
    return NextResponse.json(
      { error: "Error processing payment" },
      { status: 500 }
    );
  }
}
