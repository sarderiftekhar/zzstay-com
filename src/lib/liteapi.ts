import { LITEAPI_BASE_URL, LITEAPI_BOOK_URL } from "./constants";

const API_KEY = process.env.LITEAPI_API_KEY || "";

export const isSandbox = API_KEY.startsWith("sand_");

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  params?: Record<string, string | number | boolean | undefined>;
  baseUrl?: string;
}

// X-API-Key authentication for ALL endpoints (matching official LiteAPI SDK)
function getHeaders(): Record<string, string> {
  return {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, params, baseUrl = LITEAPI_BASE_URL } = options;

  let url = `${baseUrl}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) url += `?${queryString}`;
  }

  const headers = getHeaders();

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseText = await response.text();
  let data: T;

  try {
    data = JSON.parse(responseText);
  } catch {
    if (!response.ok) {
      throw new Error(`LiteAPI Error (${response.status}): ${responseText}`);
    }
    throw new Error(`LiteAPI returned invalid JSON: ${responseText.slice(0, 200)}`);
  }

  if (!response.ok) {
    // Try to extract error message from JSON response
    const errObj = data as Record<string, unknown>;
    const errMsg = errObj.error || errObj.message || errObj.errors || responseText;
    throw new Error(`LiteAPI Error (${response.status}): ${typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)}`);
  }

  return data;
}

// Places autocomplete
export async function searchPlaces(text: string) {
  return apiRequest<{ data: Array<{ placeId: string; displayName: string; formattedAddress: string; types: string[] }> }>(
    "/data/places",
    { params: { textQuery: text } }
  );
}

// Hotel search with rates
export async function searchHotelRates(params: {
  checkin: string;
  checkout: string;
  adults: number;
  children?: number;
  childrenAges?: number[];
  currency?: string;
  guestNationality?: string;
  hotelIds?: string[];
  placeId?: string;
  countryCode?: string;
  cityName?: string;
  latitude?: number;
  longitude?: number;
  occupancies: Array<{ adults: number; children?: number[] }>;
  starRating?: number[];
  hotelName?: string;
  minRating?: number;
  minReviewsCount?: number;
  limit?: number;
  includeHotelData?: boolean;
  timeout?: number;
}) {
  return apiRequest<{ data: unknown[] }>("/hotels/rates", {
    method: "POST",
    body: params as unknown as Record<string, unknown>,
  });
}

// Minimum rates search
export async function searchMinRates(params: {
  checkin: string;
  checkout: string;
  adults: number;
  currency?: string;
  guestNationality?: string;
  countryCode?: string;
  cityName?: string;
  latitude?: number;
  longitude?: number;
  occupancies: Array<{ adults: number; children?: number[] }>;
}) {
  return apiRequest<{ data: unknown[] }>("/hotels/min-rates", {
    method: "POST",
    body: params as unknown as Record<string, unknown>,
  });
}

// Hotel details
export async function getHotelDetails(hotelId: string) {
  return apiRequest<{ data: Record<string, unknown> }>(`/data/hotel`, {
    params: { hotelId },
  });
}

// Hotel reviews
export async function getHotelReviews(hotelId: string, limit: number = 10, offset: number = 0) {
  return apiRequest<{ data: unknown[] }>("/data/reviews", {
    params: { hotelId, limit, offset },
  });
}

// Prebook - lock rate (uses book.liteapi.travel)
// In sandbox mode: no usePaymentSdk (no Stripe needed)
// In production: usePaymentSdk: true to get Stripe secretKey + transactionId
export async function prebookRate(offerId: string) {
  const body: Record<string, unknown> = { offerId };
  if (!isSandbox) {
    body.usePaymentSdk = true;
  }
  return apiRequest<{ data: Record<string, unknown> }>("/rates/prebook", {
    method: "POST",
    body,
    baseUrl: LITEAPI_BOOK_URL,
  });
}

// Book - confirm reservation (uses book.liteapi.travel)
export async function confirmBooking(params: Record<string, unknown>) {
  return apiRequest<{ data: Record<string, unknown> }>("/rates/book", {
    method: "POST",
    body: params,
    baseUrl: LITEAPI_BOOK_URL,
  });
}

// Retrieve booking
export async function getBooking(bookingId: string) {
  return apiRequest<{ data: Record<string, unknown> }>(`/bookings/${bookingId}`);
}

// Cancel booking
export async function cancelBooking(bookingId: string) {
  return apiRequest<{ data: Record<string, unknown> }>(`/bookings/${bookingId}`, {
    method: "PUT",
  });
}

// Get available currencies
export async function getCurrencies() {
  return apiRequest<{ data: Array<{ code: string; name: string }> }>("/data/currencies");
}

// Get hotels list by city
export async function getHotelsByCity(cityName: string, countryCode: string) {
  return apiRequest<{ data: unknown[] }>("/data/hotels", {
    params: { cityName, countryCode },
  });
}
