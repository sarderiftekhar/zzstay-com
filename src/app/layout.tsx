import type { Metadata } from "next";
import { Playfair_Display, Ephesis } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const ephesis = Ephesis({
  variable: "--font-ephesis",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BookYourHotel - Simple Booking, Perfect Stays.",
    template: "%s | BookYourHotel",
  },
  description:
    "Search over 2 million hotels worldwide and find the best deals. Simple booking, perfect stays.",
  keywords: ["hotels", "booking", "travel", "best prices", "hotel deals"],
  openGraph: {
    title: "BookYourHotel - Simple Booking, Perfect Stays.",
    description: "Search over 2 million hotels worldwide and find the best deals.",
    type: "website",
    siteName: "BookYourHotel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${ephesis.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
