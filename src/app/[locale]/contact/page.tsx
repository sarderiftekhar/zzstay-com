"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const t = useTranslations("nav");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="bg-bg-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("contact")}
          </h1>
          <p className="text-lg text-gray-400">
            We&apos;re here to help. Reach out to us anytime.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2
                className="text-2xl font-bold text-text-primary mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Get in Touch
              </h2>
              <p className="text-text-secondary">
                Have questions about your booking or need help finding the perfect hotel?
                Our team is ready to assist you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Mail size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Email</p>
                  <p className="font-medium text-text-primary">support@bookyourhotel.online</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Phone size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Phone</p>
                  <p className="font-medium text-text-primary">+1 (800) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Address</p>
                  <p className="font-medium text-text-primary">123 Travel Street, Suite 100</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-border p-6">
            {submitted ? (
              <div className="text-center py-8">
                <Send size={40} className="mx-auto text-accent mb-4" />
                <h3 className="text-lg font-bold text-text-primary mb-2">Message Sent!</h3>
                <p className="text-sm text-text-muted">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input id="name" label="Name" required />
                  <Input id="email" label="Email" type="email" required />
                </div>
                <Input id="subject" label="Subject" required />
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
