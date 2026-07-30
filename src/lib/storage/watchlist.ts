import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WatchlistItem {
  movieId: string;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  releaseYear: number;
  rating: number;
  addedAt: string;
}

interface WatchlistState {
  items: WatchlistItem[];
  isInWatchlist: (movieId: string) => boolean;
  addItem: (item: Omit<WatchlistItem, "addedAt">) => void;
  removeItem: (movieId: string) => void;
  toggleItem: (item: Omit<WatchlistItem, "addedAt">) => void;
  clearAll: () => void;
}

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isInWatchlist: (movieId) => get().items.some((i) => i.movieId === movieId),
      addItem: (item) => {
        if (get().isInWatchlist(item.movieId)) return;
        set({
          items: [{ ...item, addedAt: new Date().toISOString() }, ...get().items],
        });
      },
      removeItem: (movieId) =>
        set({ items: get().items.filter((i) => i.movieId !== movieId) }),
      toggleItem: (item) => {
        if (get().isInWatchlist(item.movieId)) {
          get().removeItem(item.movieId);
        } else {
          get().addItem(item);
        }
      },
      clearAll: () => set({ items: [] }),
    }),
    { name: "wave-watchlist" }
  )
);
