import { NextRequest, NextResponse } from "next/server";
import { getBooking } from "@/lib/liteapi";

export async function POST(request: NextRequest) {
  try {
    const { bookingId, lastName } = await request.json();

    if (!bookingId || !lastName) {
      return NextResponse.json(
        { error: "Booking ID and last name are required" },
        { status: 400 }
      );
    }

    const result = await getBooking(bookingId.trim());

    if (!result?.data) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify last name matches (case-insensitive)
    const bookingLastName = (result.data as Record<string, unknown>).lastName as string;
    if (
      !bookingLastName ||
      bookingLastName.toLowerCase().trim() !== lastName.toLowerCase().trim()
    ) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Booking lookup error:", error);
    return NextResponse.json(
      { error: "Failed to look up booking" },
      { status: 500 }
    );
  }
}
