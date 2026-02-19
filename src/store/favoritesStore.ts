"use client";

import { create } from "zustand";

interface FavoritesState {
  favoriteIds: Set<string>;
  loaded: boolean;
  setFavorites: (ids: string[]) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  reset: () => void;
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favoriteIds: new Set<string>(),
  loaded: false,
  setFavorites: (ids) => set({ favoriteIds: new Set(ids), loaded: true }),
  addFavorite: (id) => {
    const next = new Set(get().favoriteIds);
    next.add(id);
    set({ favoriteIds: next });
  },
  removeFavorite: (id) => {
    const next = new Set(get().favoriteIds);
    next.delete(id);
    set({ favoriteIds: next });
  },
  isFavorite: (id) => get().favoriteIds.has(id),
  reset: () => set({ favoriteIds: new Set<string>(), loaded: false }),
}));
