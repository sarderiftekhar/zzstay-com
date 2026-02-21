export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "BookYourHotel";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bookyourhotel.online";

export const LANGUAGES = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "es", name: "Español", dir: "ltr" },
  { code: "fr", name: "Français", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
] as const;

export const DEFAULT_LOCALE = "en";
export const LOCALES = LANGUAGES.map((l) => l.code);

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
] as const;

export const DEFAULT_CURRENCY = "USD";

export const LITEAPI_BASE_URL = "https://api.liteapi.travel/v3.0";
export const LITEAPI_BOOK_URL = "https://book.liteapi.travel/v3.0";

/** Map country code (from navigator.language region or IP geo) → currency code */
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // Americas
  US: "USD", CA: "CAD", MX: "MXN", BR: "BRL",
  // UK
  GB: "GBP",
  // Eurozone (all 20 member states)
  FR: "EUR", DE: "EUR", ES: "EUR", IT: "EUR", NL: "EUR",
  BE: "EUR", AT: "EUR", PT: "EUR", IE: "EUR", FI: "EUR", GR: "EUR",
  LU: "EUR", SK: "EUR", SI: "EUR", LT: "EUR", LV: "EUR", EE: "EUR",
  MT: "EUR", CY: "EUR", HR: "EUR",
  // Non-eurozone Europe (map to EUR for convenience)
  SE: "EUR", DK: "EUR", PL: "EUR", CZ: "EUR", HU: "EUR",
  RO: "EUR", BG: "EUR", NO: "EUR", IS: "EUR",
  // Switzerland
  CH: "CHF",
  // Middle East
  AE: "AED", SA: "SAR", QA: "SAR", KW: "SAR", BH: "SAR", OM: "SAR",
  // Asia
  JP: "JPY", CN: "CNY", IN: "INR", KR: "KRW", SG: "SGD",
  TH: "THB", MY: "MYR", ID: "IDR", PH: "PHP",
  // Oceania
  AU: "AUD", NZ: "AUD",
  // Other
  TR: "TRY",
};

/** Fallback: language code → currency (when no country region in locale, e.g. "ar") */
export const LANG_TO_CURRENCY: Record<string, string> = {
  ar: "AED", ja: "JPY", zh: "CNY", ko: "KRW", tr: "TRY",
  pt: "BRL", hi: "INR", th: "THB", ms: "MYR", id: "IDR",
};

export const FEATURED_DESTINATIONS = [
  { name: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", slug: "dubai" },
  { name: "London", country: "United Kingdom", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80", slug: "london" },
  { name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", slug: "paris" },
  { name: "New York", country: "United States", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80", slug: "new-york" },
  { name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", slug: "tokyo" },
  { name: "Istanbul", country: "Turkey", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80", slug: "istanbul" },
];

export const STAR_RATINGS = [1, 2, 3, 4, 5] as const;

export const SORT_OPTIONS = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Rating: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
] as const;
