import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getActiveProfileId, useProfiles } from "@/lib/storage/profiles";

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
  byProfile: Record<string, ContinueWatchingItem[]>;
  updateProgress: (item: Omit<ContinueWatchingItem, "updatedAt">) => void;
  removeItem: (movieId: string) => void;
  clearAll: () => void;
}

type LegacyContinueState = { items?: ContinueWatchingItem[] };

export const useContinueWatching = create<ContinueWatchingState>()(
  persist(
    (set, get) => ({
      byProfile: {},

      updateProgress: (item) => {
        const profileId = getActiveProfileId();
        if (!profileId) return;

        const current = get().byProfile[profileId] ?? [];
        const existing = current.filter((entry) => entry.movieId !== item.movieId);
        const progress = item.duration > 0 ? item.progress / item.duration : 0;

        if (progress >= 0.95) {
          set({
            byProfile: {
              ...get().byProfile,
              [profileId]: existing,
            },
          });
          return;
        }

        set({
          byProfile: {
            ...get().byProfile,
            [profileId]: [
              { ...item, updatedAt: new Date().toISOString() },
              ...existing,
            ].slice(0, 20),
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
      name: "wave-continue-watching-v2",
      migrate: (persisted) => {
        const state = persisted as LegacyContinueState & ContinueWatchingState;
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

export function useContinueWatchingItems() {
  const profileId = useProfiles((state) => state.activeProfileId);
  return useContinueWatching((state) =>
    profileId ? state.byProfile[profileId] ?? [] : []
  );
}
