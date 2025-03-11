import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    console.log("BryteWire payment link generation API called");

    // Check authentication
    if (!checkAuth(req)) {
      console.log("Authentication failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get BryteWire API key from environment variables
    const apiKey = process.env.BRYTEWIRE_API_KEY;
    console.log("API Key available:", !!apiKey);

    if (!apiKey) {
      console.error(
        "BryteWire API key not configured in environment variables"
      );
      return NextResponse.json(
        { error: "BryteWire API key not configured in environment variables" },
        { status: 500 }
      );
    }

    // Parse request body
    const data = await req.json();
    const { eventName, description, price, startDate, endDate } = data;

    if (!eventName || !price) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: eventName and price are required" },
        { status: 400 }
      );
    }

    // Format the event date range for the payment description
    const formattedStartDate = startDate
      ? new Date(startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "TBD";

    const formattedEndDate = endDate
      ? new Date(endDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "TBD";

    const dateRange =
      startDate && endDate
        ? `${formattedStartDate} - ${formattedEndDate}`
        : "Dates TBD";

    try {
      // Make the API call to BryteWire to generate a payment link

      // Try a different API endpoint format
      const apiUrl = "https://accept.blue/api/v1/create-payment-link";

      // Prepare the payload with event details
      const paymentDetails = {
        name: eventName,
        description: `${
          description?.substring(0, 100) || eventName
        } (${dateRange})`,
        amount: parseFloat(price) * 100, // Convert to cents/smallest currency unit
        currency: "USD",
        api_key: apiKey,
        success_url:
          process.env.NEXT_PUBLIC_BASE_URL ||
          "https://eplsoccertours.com/events",
        cancel_url:
          process.env.NEXT_PUBLIC_BASE_URL ||
          "https://eplsoccertours.com/events",
      };

      console.log("Making API request to Accept.blue");
      console.log("Request payload:", {
        ...paymentDetails,
        api_key: "[REDACTED]", // Don't log the actual API key
      });

      // Make the API call with AWS-style auth
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          auth_token: apiKey, // Try auth_token parameter for authentication
          ...paymentDetails,
        }),
      });

      // Handle the response
      if (!response.ok) {
        const errorText = await response.text();
        console.error("BryteWire API error:", errorText);

        // If we're in development mode, return a test link instead of failing
        if (process.env.NODE_ENV === "development") {
          console.log("Development mode: Generating test link instead");
          const testId = `test-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}`;
          const testUrl = `https://pay.brytewire.com/${testId}?amount=${price}&name=${encodeURIComponent(
            eventName
          )}`;

          return NextResponse.json({
            success: true,
            paymentLink: testUrl,
            paymentLinkId: testId,
            testMode: true,
            note: "This is a test payment link (API call failed)",
          });
        }

        return NextResponse.json(
          {
            error: `BryteWire API error: ${errorText}`,
            details: `Status code: ${response.status}`,
          },
          { status: response.status }
        );
      }

      // Parse the successful response
      const responseData = await response.json();
      console.log("BryteWire API response:", responseData);

      // Return the payment link information
      return NextResponse.json({
        success: true,
        paymentLink:
          responseData.url || responseData.payment_url || responseData.link,
        paymentLinkId: responseData.id || responseData.payment_id,
      });
    } catch (error) {
      console.error("Error calling BryteWire API:", error);

      // In development mode, return a test link instead of failing
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode: Generating test link after error");
        const testId = `test-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 10)}`;
        const testUrl = `https://pay.brytewire.com/${testId}?amount=${price}&name=${encodeURIComponent(
          eventName
        )}`;

        return NextResponse.json({
          success: true,
          paymentLink: testUrl,
          paymentLinkId: testId,
          testMode: true,
          note: "This is a test payment link (API connection failed)",
        });
      }

      return NextResponse.json(
        {
          error: "Failed to connect to BryteWire API",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in BryteWire payment link generation route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
