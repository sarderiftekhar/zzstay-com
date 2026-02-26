"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface BookingState {
  offerId: string | null;
  hotelId: string | null;
  hotelName: string;
  hotelAddress: string;
  hotelCity: string;
  hotelCountry: string;
  hotelStarRating: number;
  hotelFacilities: string[];
  roomName: string;
  boardName: string;
  checkIn: string;
  checkOut: string;
  currency: string;
  totalRate: number;
  prebookId: string | null;
  clientSecret: string | null;
  transactionId: string | null;
  cancellationPolicy: string;
  cancellationDeadline: string;
  checkinTime: string;
  checkoutTime: string;
  maxOccupancy: number;
  roomImage: string;
  adults: number;
  children: number;

  setSelectedRoom: (room: {
    offerId: string;
    hotelId: string;
    hotelName: string;
    hotelAddress: string;
    hotelCity: string;
    hotelCountry: string;
    hotelStarRating: number;
    hotelFacilities: string[];
    roomName: string;
    boardName: string;
    checkIn: string;
    checkOut: string;
    currency: string;
    totalRate: number;
    cancellationPolicy: string;
    cancellationDeadline: string;
    checkinTime: string;
    checkoutTime: string;
    maxOccupancy: number;
    roomImage: string;
    adults: number;
    children: number;
  }) => void;
  setPrebook: (prebookId: string, clientSecret?: string, transactionId?: string) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      offerId: null,
      hotelId: null,
      hotelName: "",
      hotelAddress: "",
      hotelCity: "",
      hotelCountry: "",
      hotelStarRating: 0,
      hotelFacilities: [],
      roomName: "",
      boardName: "",
      checkIn: "",
      checkOut: "",
      currency: "USD",
      totalRate: 0,
      prebookId: null,
      clientSecret: null,
      transactionId: null,
      cancellationPolicy: "",
      cancellationDeadline: "",
      checkinTime: "",
      checkoutTime: "",
      maxOccupancy: 2,
      roomImage: "",
      adults: 2,
      children: 0,

      setSelectedRoom: (room) =>
        set({
          ...room,
          prebookId: null,
          clientSecret: null,
          transactionId: null,
        }),
      setPrebook: (prebookId, clientSecret, transactionId) =>
        set({ prebookId, clientSecret, transactionId }),
      reset: () =>
        set({
          offerId: null,
          hotelId: null,
          hotelName: "",
          hotelAddress: "",
          hotelCity: "",
          hotelCountry: "",
          hotelStarRating: 0,
          hotelFacilities: [],
          roomName: "",
          boardName: "",
          checkIn: "",
          checkOut: "",
          currency: "USD",
          totalRate: 0,
          prebookId: null,
          clientSecret: null,
          transactionId: null,
          cancellationPolicy: "",
          cancellationDeadline: "",
          checkinTime: "",
          checkoutTime: "",
          maxOccupancy: 2,
          roomImage: "",
          adults: 2,
          children: 0,
        }),
    }),
    {
      name: "byh-booking",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
