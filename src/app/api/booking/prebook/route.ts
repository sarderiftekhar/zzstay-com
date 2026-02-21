import { NextRequest, NextResponse } from "next/server";
import { prebookRate, isSandbox } from "@/lib/liteapi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.offerId) {
      return NextResponse.json({ error: "offerId is required" }, { status: 400 });
    }

    console.log("Prebook request - offerId:", body.offerId, "| sandbox:", isSandbox);

    const result = await prebookRate(body.offerId);

    console.log("Prebook response:", JSON.stringify(result, null, 2));

    // Return sandbox flag so client knows whether to show payment form
    return NextResponse.json({ ...result, isSandbox });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to prebook";
    console.error("Prebook error:", message);

    // Parse LiteAPI error details for specific client-side handling
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
