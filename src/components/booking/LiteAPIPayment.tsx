"use client";

import { useEffect, useRef, useState } from "react";
import { CreditCard, Lock, Loader2 } from "lucide-react";

interface LiteAPIPaymentProps {
  secretKey: string;
  transactionId: string;
  prebookId: string;
  returnUrl: string;
}

declare global {
  interface Window {
    LiteAPIPayment: new (config: Record<string, unknown>) => {
      handlePayment: () => void;
    };
  }
}

export default function LiteAPIPaymentForm({
  secretKey,
  transactionId,
  prebookId,
  returnUrl,
}: LiteAPIPaymentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const script = document.createElement("script");
    script.src =
      "https://payment-wrapper.liteapi.travel/dist/liteAPIPayment.js?v=a1";
    script.async = true;

    script.onload = () => {
      try {
        if (!window.LiteAPIPayment) {
          setError("Payment SDK failed to load");
          setLoading(false);
          return;
        }

        const config = {
          publicKey: "sandbox",
          appearance: { theme: "flat" },
          options: { business: { name: "ZZStay" } },
          targetElement: "#liteapi-payment-container",
          secretKey,
          returnUrl: `${returnUrl}?tid=${encodeURIComponent(transactionId)}&pid=${encodeURIComponent(prebookId)}`,
        };

        const payment = new window.LiteAPIPayment(config);
        payment.handlePayment();
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize payment"
        );
        setLoading(false);
      }
    };

    script.onerror = () => {
      setError("Failed to load payment SDK");
      setLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [secretKey, transactionId, prebookId, returnUrl]);

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2
        className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        <CreditCard size={20} className="text-accent" />
        Payment Details
      </h2>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-accent" />
          <span className="ml-2 text-sm text-text-muted">
            Loading payment form...
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-error/20 rounded-lg text-sm text-error">
          {error}
        </div>
      )}

      <div id="liteapi-payment-container" ref={containerRef} />

      <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
        <Lock size={12} className="text-accent" />
        Your payment information is encrypted and secure. Processed securely via
        LiteAPI.
      </div>
    </div>
  );
}
