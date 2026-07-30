import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getActiveProfileId, useProfiles } from "@/lib/storage/profiles";

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
  byProfile: Record<string, WatchlistItem[]>;
  isInWatchlist: (movieId: string) => boolean;
  addItem: (item: Omit<WatchlistItem, "addedAt">) => void;
  removeItem: (movieId: string) => void;
  toggleItem: (item: Omit<WatchlistItem, "addedAt">) => void;
  clearAll: () => void;
}

type LegacyWatchlistState = { items?: WatchlistItem[] };

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      byProfile: {},

      isInWatchlist: (movieId) => {
        const profileId = getActiveProfileId();
        if (!profileId) return false;
        return (get().byProfile[profileId] ?? []).some(
          (item) => item.movieId === movieId
        );
      },

      addItem: (item) => {
        const profileId = getActiveProfileId();
        if (!profileId || get().isInWatchlist(item.movieId)) return;

        const current = get().byProfile[profileId] ?? [];
        set({
          byProfile: {
            ...get().byProfile,
            [profileId]: [
              { ...item, addedAt: new Date().toISOString() },
              ...current,
            ],
          },
        });
      },

      removeItem: (movieId) => {
        const profileId = getActiveProfileId();
        if (!profileId) return;

        set({
          byProfile: {
            ...get().byProfile,
            [profileId]: (get().byProfile[profileId] ?? []).filter(
              (item) => item.movieId !== movieId
            ),
          },
        });
      },

      toggleItem: (item) => {
        if (get().isInWatchlist(item.movieId)) {
          get().removeItem(item.movieId);
        } else {
          get().addItem(item);
        }
      },

      clearAll: () => {
        const profileId = getActiveProfileId();
        if (!profileId) return;

        set({
          byProfile: {
            ...get().byProfile,
            [profileId]: [],
          },
        });
      },
    }),
    {
      name: "wave-watchlist-v2",
      migrate: (persisted) => {
        const state = persisted as LegacyWatchlistState & WatchlistState;
        if (state.byProfile) return state;

        const legacyItems = state.items ?? [];
        const profileId = getActiveProfileId();
        if (!profileId || legacyItems.length === 0) {
          return { byProfile: {} };
        }

        return { byProfile: { [profileId]: legacyItems } };
      },
      version: 1,
    }
  )
);

export function useWatchlistItems() {
  const profileId = useProfiles((state) => state.activeProfileId);
  return useWatchlist((state) =>
    profileId ? state.byProfile[profileId] ?? [] : []
  );
}
