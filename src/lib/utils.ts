import { format, parseISO } from "date-fns";

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  const hasDecimals = amount % 1 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(amount);
}

export function formatDate(date: string | Date, pattern: string = "MMM dd, yyyy"): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isNaN(d.getTime())) return "N/A";
  return format(d, pattern);
}

export function formatDateISO(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getStarRatingText(rating: number): string {
  if (rating >= 4.5) return "Exceptional";
  if (rating >= 4) return "Excellent";
  if (rating >= 3.5) return "Very Good";
  if (rating >= 3) return "Good";
  if (rating >= 2.5) return "Average";
  return "Below Average";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getNightsCount(checkIn: string | Date, checkOut: string | Date): number {
  const start = typeof checkIn === "string" ? parseISO(checkIn) : checkIn;
  const end = typeof checkOut === "string" ? parseISO(checkOut) : checkOut;
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function generateGuestSummary(adults: number, children: number, rooms: number): string {
  const parts: string[] = [];
  parts.push(`${adults} Adult${adults !== 1 ? "s" : ""}`);
  if (children > 0) parts.push(`${children} Child${children !== 1 ? "ren" : ""}`);
  parts.push(`${rooms} Room${rooms !== 1 ? "s" : ""}`);
  return parts.join(", ");
}
