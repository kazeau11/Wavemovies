import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getActiveProfileId, useProfiles } from "@/lib/storage/profiles";
import { normalizeByProfileState, readByProfile } from "@/lib/storage/normalize";

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

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      byProfile: {},

      isInWatchlist: (movieId) => {
        const profileId = getActiveProfileId();
        if (!profileId) return false;
        return readByProfile(get().byProfile, profileId).some(
          (item) => item.movieId === movieId
        );
      },

      addItem: (item) => {
        const profileId = getActiveProfileId();
        if (!profileId || get().isInWatchlist(item.movieId)) return;

        const byProfile = get().byProfile ?? {};
        const current = byProfile[profileId] ?? [];
        set({
          byProfile: {
            ...byProfile,
            [profileId]: [{ ...item, addedAt: new Date().toISOString() }, ...current],
          },
        });
      },

      removeItem: (movieId) => {
        const profileId = getActiveProfileId();
        if (!profileId) return;

        const byProfile = get().byProfile ?? {};
        set({
          byProfile: {
            ...byProfile,
            [profileId]: (byProfile[profileId] ?? []).filter(
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

        const byProfile = get().byProfile ?? {};
        set({
          byProfile: {
            ...byProfile,
            [profileId]: [],
          },
        });
      },
    }),
    {
      name: "wave-watchlist-v2",
      version: 2,
      migrate: (persisted) =>
        normalizeByProfileState(persisted, getActiveProfileId()) as Pick<
          WatchlistState,
          "byProfile"
        >,
      onRehydrateStorage: () => (state) => {
        if (state && !state.byProfile) {
          state.byProfile = {};
        }
      },
    }
  )
);

export function useWatchlistItems() {
  const profileId = useProfiles((state) => state.activeProfileId);
  return useWatchlist((state) => readByProfile(state.byProfile, profileId));
}
