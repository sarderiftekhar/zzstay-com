import { useTranslations } from "next-intl";
import { Shield, Globe, Users, Award } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("common");

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="bg-bg-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            About <span className="text-accent-bright" style={{ fontFamily: "var(--font-ephesis)" }}>BookYourHotel</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We help travelers find the best hotel deals worldwide. Same stays, better prices.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <section>
          <h2
            className="text-2xl font-bold text-text-primary mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Our Mission
          </h2>
          <p className="text-text-secondary leading-relaxed">
            BookYourHotel was founded with a simple belief: you should never overpay for a hotel room.
            We compare prices across multiple providers to ensure you always get the best rate
            for the exact same hotel, same room, same dates. Our technology scans over 2 million
            hotels worldwide to find you the perfect stay at the best price.
          </p>
        </section>

        {/* Values */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            { icon: Shield, title: "Trust & Transparency", desc: "No hidden fees. The price you see is the price you pay." },
            { icon: Globe, title: "Global Coverage", desc: "Over 2 million hotels across 190+ countries worldwide." },
            { icon: Users, title: "Customer First", desc: "24/7 support and a dedicated team to help with your bookings." },
            { icon: Award, title: "Best Price Guarantee", desc: "We compare rates to ensure you get the best deal every time." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <item.icon size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
