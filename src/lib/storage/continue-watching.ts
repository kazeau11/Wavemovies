import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getActiveProfileId, useProfiles } from "@/lib/storage/profiles";
import { normalizeByProfileState, readByProfile } from "@/lib/storage/normalize";

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

type PersistedContinueWatchingState = Pick<ContinueWatchingState, "byProfile">;

export const useContinueWatching = create<ContinueWatchingState>()(
  persist(
    (set, get) => ({
      byProfile: {},

      updateProgress: (item) => {
        const profileId = getActiveProfileId();
        if (!profileId) return;

        const byProfile = get().byProfile ?? {};
        const current = readByProfile(byProfile, profileId);
        const existing = current.filter((entry) => entry.movieId !== item.movieId);
        const progress = item.duration > 0 ? item.progress / item.duration : 0;

        if (progress >= 0.95) {
          set({
            byProfile: {
              ...byProfile,
              [profileId]: existing,
            },
          });
          return;
        }

        set({
          byProfile: {
            ...byProfile,
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

        const byProfile = get().byProfile ?? {};
        set({
          byProfile: {
            ...byProfile,
            [profileId]: readByProfile(byProfile, profileId).filter(
              (item) => item.movieId !== movieId
            ),
          },
        });
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
      name: "wave-continue-watching-v2",
      version: 2,
      partialize: (state): PersistedContinueWatchingState => ({
        byProfile: state.byProfile ?? {},
      }),
      merge: (persisted, current) => ({
        ...current,
        byProfile: normalizeByProfileState(persisted, getActiveProfileId())
          .byProfile as Record<string, ContinueWatchingItem[]>,
      }),
      migrate: (persisted) =>
        normalizeByProfileState(persisted, getActiveProfileId()) as PersistedContinueWatchingState,
    }
  )
);

export function useContinueWatchingItems() {
  const profileId = useProfiles((state) => state.activeProfileId);
  return useContinueWatching((state) => readByProfile(state.byProfile, profileId));
}
