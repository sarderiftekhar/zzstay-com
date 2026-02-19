"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays, format } from "date-fns";

interface SearchState {
  location: string;
  placeId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childrenAges: number[];
  rooms: number;
  latitude?: number;
  longitude?: number;
  starRatings: number[];
  hotelName: string;
  budget: string;

  setLocation: (location: string, placeId: string) => void;
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (adults: number, children: number, childrenAges: number[]) => void;
  setRooms: (rooms: number) => void;
  setCoordinates: (lat: number, lng: number) => void;
  setStarRatings: (stars: number[]) => void;
  setHotelName: (name: string) => void;
  setBudget: (budget: string) => void;
  reset: () => void;
}

const tomorrow = addDays(new Date(), 1);
const dayAfterTomorrow = addDays(new Date(), 2);

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      location: "",
      placeId: "",
      checkIn: format(tomorrow, "yyyy-MM-dd"),
      checkOut: format(dayAfterTomorrow, "yyyy-MM-dd"),
      adults: 2,
      children: 0,
      childrenAges: [],
      rooms: 1,
      latitude: undefined,
      longitude: undefined,
      starRatings: [],
      hotelName: "",
      budget: "",

      setLocation: (location, placeId) => set({ location, placeId }),
      setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
      setGuests: (adults, children, childrenAges) =>
        set({ adults, children, childrenAges }),
      setRooms: (rooms) => set({ rooms }),
      setCoordinates: (latitude, longitude) => set({ latitude, longitude }),
      setStarRatings: (starRatings) => set({ starRatings }),
      setHotelName: (hotelName) => set({ hotelName }),
      setBudget: (budget) => set({ budget }),
      reset: () =>
        set({
          location: "",
          placeId: "",
          checkIn: format(addDays(new Date(), 1), "yyyy-MM-dd"),
          checkOut: format(addDays(new Date(), 2), "yyyy-MM-dd"),
          adults: 2,
          children: 0,
          childrenAges: [],
          rooms: 1,
          starRatings: [],
          hotelName: "",
          budget: "",
        }),
    }),
    { name: "bookyourhotel-search" }
  )
);
