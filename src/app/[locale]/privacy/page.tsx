export default function PrivacyPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-bg-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl font-bold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Privacy Policy
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-sm text-text-secondary">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create a booking,
          contact us, or subscribe to our newsletter. This includes your name, email address,
          phone number, and payment information.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information to process your hotel bookings, send booking confirmations,
          provide customer support, and improve our services. We may also use your email to
          send promotional offers if you have opted in.
        </p>

        <h2>3. Information Sharing</h2>
        <p>
          We share your information with hotel providers to complete your bookings, payment
          processors to handle transactions, and service providers who assist in operating
          our platform. We do not sell your personal information.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information.
          Payment data is encrypted and processed through PCI-compliant payment processors.
        </p>

        <h2>5. Cookies</h2>
        <p>
          We use cookies to remember your preferences (language, currency), improve your
          browsing experience, and analyze site traffic. You can control cookie settings
          through your browser.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal information.
          You may also opt out of marketing communications at any time. Contact us at
          privacy@bookyourhotel.online for any requests.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any
          significant changes by posting the new policy on this page.
        </p>

        <p className="text-text-muted text-xs mt-8">
          Last updated: February 2026
        </p>
      </div>
    </div>
  );
}
