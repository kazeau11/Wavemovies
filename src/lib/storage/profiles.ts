import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_AVATAR_ID } from "@/lib/profiles/avatars";
import {
  normalizeByProfileState,
  readByProfile,
  sanitizeActiveProfileId,
  sanitizeProfiles,
} from "@/lib/storage/normalize";

export const MAX_PROFILES = 4;

export interface WaveProfile {
  id: string;
  name: string;
  avatarId: string;
  createdAt: string;
}

interface ProfilesState {
  profiles: WaveProfile[];
  activeProfileId: string | null;
  addProfile: (name: string, avatarId?: string) => WaveProfile | null;
  updateProfile: (
    id: string,
    patch: Partial<Pick<WaveProfile, "name" | "avatarId">>
  ) => void;
  removeProfile: (id: string) => void;
  setActiveProfile: (id: string | null) => void;
  getActiveProfile: () => WaveProfile | null;
  canAddProfile: () => boolean;
}

type PersistedProfilesState = Pick<ProfilesState, "profiles" | "activeProfileId">;

function createProfileId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function createProfile(name: string, avatarId = DEFAULT_AVATAR_ID): WaveProfile {
  return {
    id: createProfileId(),
    name: name.trim() || "Profile",
    avatarId,
    createdAt: new Date().toISOString(),
  };
}

function getSafeProfiles(profiles: WaveProfile[] | undefined): WaveProfile[] {
  return sanitizeProfiles(profiles);
}

export const useProfiles = create<ProfilesState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,

      addProfile: (name, avatarId) => {
        const profiles = getSafeProfiles(get().profiles);
        if (profiles.length >= MAX_PROFILES) return null;
        const profile = createProfile(name, avatarId);
        set({ profiles: [...profiles, profile] });
        return profile;
      },

      updateProfile: (id, patch) => {
        const profiles = getSafeProfiles(get().profiles);
        set({
          profiles: profiles.map((profile) =>
            profile.id === id ? { ...profile, ...patch } : profile
          ),
        });
      },

      removeProfile: (id) => {
        const profiles = getSafeProfiles(get().profiles).filter(
          (profile) => profile.id !== id
        );
        const activeProfileId =
          get().activeProfileId === id
            ? profiles[0]?.id ?? null
            : sanitizeActiveProfileId(get().activeProfileId, profiles);
        set({ profiles, activeProfileId });
      },

      setActiveProfile: (id) => {
        const profiles = getSafeProfiles(get().profiles);
        if (id && !profiles.some((profile) => profile.id === id)) return;
        set({ activeProfileId: id });
      },

      getActiveProfile: () => {
        const profiles = getSafeProfiles(get().profiles);
        const activeProfileId = sanitizeActiveProfileId(get().activeProfileId, profiles);
        if (!activeProfileId) return null;
        return profiles.find((profile) => profile.id === activeProfileId) ?? null;
      },

      canAddProfile: () => getSafeProfiles(get().profiles).length < MAX_PROFILES,
    }),
    {
      name: "wave-profiles",
      partialize: (state): PersistedProfilesState => ({
        profiles: getSafeProfiles(state.profiles),
        activeProfileId: state.activeProfileId,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<PersistedProfilesState> | undefined;
        const profiles = sanitizeProfiles(saved?.profiles);
        return {
          ...current,
          profiles,
          activeProfileId: sanitizeActiveProfileId(saved?.activeProfileId, profiles),
        };
      },
    }
  )
);

export function getActiveProfileId(): string | null {
  const profiles = sanitizeProfiles(useProfiles.getState().profiles);
  return sanitizeActiveProfileId(useProfiles.getState().activeProfileId, profiles);
}

export function useSafeProfiles() {
  return useProfiles((state) => sanitizeProfiles(state.profiles));
}
