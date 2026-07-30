import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ContinueWatchingItem {
  movieId: string;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  progress: number;
  duration: number;
  updatedAt: string;
}

interface ContinueWatchingState {
  items: ContinueWatchingItem[];
  updateProgress: (item: Omit<ContinueWatchingItem, "updatedAt">) => void;
  removeItem: (movieId: string) => void;
  clearAll: () => void;
}

export const useContinueWatching = create<ContinueWatchingState>()(
  persist(
    (set, get) => ({
      items: [],
      updateProgress: (item) => {
        const existing = get().items.filter((i) => i.movieId !== item.movieId);
        const progress = item.duration > 0 ? item.progress / item.duration : 0;
        if (progress >= 0.95) {
          set({ items: existing });
          return;
        }
        set({
          items: [
            {
              ...item,
              updatedAt: new Date().toISOString(),
            },
            ...existing,
          ].slice(0, 20),
        });
      },
      removeItem: (movieId) =>
        set({ items: get().items.filter((i) => i.movieId !== movieId) }),
      clearAll: () => set({ items: [] }),
    }),
    { name: "wave-continue-watching" }
  )
);
