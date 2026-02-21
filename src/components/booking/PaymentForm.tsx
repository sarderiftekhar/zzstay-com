"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface PaymentFormProps {
  clientSecret: string;
  onPaymentSuccess: (postalCode: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function PaymentForm({
  clientSecret,
  onPaymentSuccess,
  loading,
  setLoading,
}: PaymentFormProps) {
  const t = useTranslations("booking");
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [postalCode, setPostalCode] = useState("");

  async function handleSubmit() {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found");
      setLoading(false);
      return;
    }

    if (!postalCode.trim()) {
      setError("Please enter your billing postcode / ZIP code");
      setLoading(false);
      return;
    }

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            address: {
              postal_code: postalCode.trim(),
            },
          },
        },
      });

    if (stripeError) {
      setError(stripeError.message || "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "requires_capture") {
      onPaymentSuccess(postalCode.trim());
    } else {
      setError(`Payment status: ${paymentIntent?.status}. Please try again.`);
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2
        className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        <CreditCard size={20} className="text-accent" />
        {t("paymentDetails")}
      </h2>

      {/* Card details */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Card Details
        </label>
        <div className="border border-border rounded-lg p-4 focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent transition-colors">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#111111",
                  fontFamily: "system-ui, sans-serif",
                  "::placeholder": {
                    color: "#888888",
                  },
                },
                invalid: {
                  color: "#dc2626",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Billing postcode / ZIP */}
      <div className="mt-4">
        <label
          htmlFor="postalCode"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          Billing Postcode / ZIP Code
        </label>
        <input
          id="postalCode"
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
          placeholder="e.g. SW1A 1AA or 10001"
          maxLength={12}
          autoComplete="postal-code"
          className="w-full px-4 py-3 text-sm border border-border rounded-lg bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
        />
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
        <Lock size={12} className="text-accent" />
        Your payment information is encrypted and secure. Processed by Stripe.
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-error/20 rounded-lg text-sm text-error">
          {error}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        loading={loading}
        disabled={!stripe || loading}
        size="lg"
        className="w-full mt-6"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            {t("processing")}
          </span>
        ) : (
          t("confirmAndPay")
        )}
      </Button>
    </div>
  );
}
