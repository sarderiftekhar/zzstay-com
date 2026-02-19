export default function TermsPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-bg-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl font-bold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Terms of Service
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-sm text-text-secondary">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using BookYourHotel, you agree to be bound by these Terms of Service.
          If you do not agree with any part of these terms, please do not use our services.
        </p>

        <h2>2. Service Description</h2>
        <p>
          BookYourHotel provides a hotel search and booking platform. We act as an intermediary
          between you and hotel providers. We compare rates from multiple sources to help
          you find the best prices.
        </p>

        <h2>3. Booking Terms</h2>
        <p>
          When you make a booking through BookYourHotel, you enter into a contract with the hotel
          provider. Cancellation policies, check-in/check-out times, and other hotel-specific
          terms are set by each hotel and displayed during the booking process.
        </p>

        <h2>4. Pricing</h2>
        <p>
          All prices are displayed in the currency you select. Final pricing, including taxes
          and fees, is shown before you confirm your booking. Prices are subject to availability
          and may change until a booking is confirmed.
        </p>

        <h2>5. Payment</h2>
        <p>
          Payment is processed securely through our payment partner, Stripe. We accept major
          credit and debit cards. Your payment information is encrypted and never stored on
          our servers.
        </p>

        <h2>6. Cancellations and Refunds</h2>
        <p>
          Cancellation policies vary by hotel and room type. Free cancellation options and
          non-refundable rates are clearly marked during the booking process. Please review
          the cancellation policy before confirming your booking.
        </p>

        <h2>7. Liability</h2>
        <p>
          BookYourHotel is not liable for any issues arising from your stay at a hotel, including
          but not limited to service quality, facility conditions, or disputes with hotel
          staff. We facilitate bookings but do not control hotel operations.
        </p>

        <h2>8. Contact</h2>
        <p>
          For questions about these terms, contact us at legal@bookyourhotel.online.
        </p>

        <p className="text-text-muted text-xs mt-8">
          Last updated: February 2026
        </p>
      </div>
    </div>
  );
}
