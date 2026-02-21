import { NextRequest, NextResponse } from "next/server";
import { confirmBooking, isSandbox } from "@/lib/liteapi";
import { randomUUID } from "crypto";

// Strip phone to E.164 format: keep only + and digits
function cleanPhone(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned || "+10000000000";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.prebookId) {
      return NextResponse.json({ error: "prebookId is required" }, { status: 400 });
    }

    // In production mode, transactionId is required (from Stripe payment)
    if (!isSandbox && !body.transactionId) {
      return NextResponse.json({ error: "transactionId is required" }, { status: 400 });
    }

    // Build payment object based on mode
    const payment: Record<string, unknown> = isSandbox
      ? { method: "ACC_CREDIT_CARD" }
      : { method: "TRANSACTION_ID", transactionId: body.transactionId };

    const phone = cleanPhone(body.phone || "");

    const bookingPayload: Record<string, unknown> = {
      prebookId: body.prebookId,
      clientReference: `zzstay-${randomUUID()}`,
      holder: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone,
      },
      payment,
      guests: [
        {
          occupancyNumber: 1,
          remarks: body.specialRequests || "",
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
        },
      ],
    };

    console.log("Book request payload:", JSON.stringify(bookingPayload, null, 2));
    console.log("Sandbox mode:", isSandbox);

    const result = await confirmBooking(bookingPayload);

    console.log("Book response:", JSON.stringify(result, null, 2));

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to complete booking";
    console.error("Booking error:", message);

    // Parse LiteAPI error details for specific client-side handling
    // Error format: 'LiteAPI Error (HTTP_STATUS): {"code":XXXX,"description":"...","message":"..."}'
    let errorCode: number | undefined;
    let httpStatus = 500;
    const codeMatch = message.match(/"code"\s*:\s*(\d+)/);
    if (codeMatch) errorCode = parseInt(codeMatch[1]);
    const httpMatch = message.match(/LiteAPI Error \((\d+)\)/);
    if (httpMatch) httpStatus = parseInt(httpMatch[1]);

    return NextResponse.json(
      { error: message, code: errorCode, httpStatus },
      { status: 500 }
    );
  }
}
