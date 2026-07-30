import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_AVATAR_ID } from "@/lib/profiles/avatars";

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

function createProfile(name: string, avatarId = DEFAULT_AVATAR_ID): WaveProfile {
  return {
    id: crypto.randomUUID(),
    name: name.trim() || "Profile",
    avatarId,
    createdAt: new Date().toISOString(),
  };
}

export const useProfiles = create<ProfilesState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,

      addProfile: (name, avatarId) => {
        if (get().profiles.length >= MAX_PROFILES) return null;
        const profile = createProfile(name, avatarId);
        set({ profiles: [...get().profiles, profile] });
        return profile;
      },

      updateProfile: (id, patch) => {
        set({
          profiles: get().profiles.map((profile) =>
            profile.id === id ? { ...profile, ...patch } : profile
          ),
        });
      },

      removeProfile: (id) => {
        const profiles = get().profiles.filter((profile) => profile.id !== id);
        const activeProfileId =
          get().activeProfileId === id
            ? profiles[0]?.id ?? null
            : get().activeProfileId;
        set({ profiles, activeProfileId });
      },

      setActiveProfile: (id) => {
        if (id && !get().profiles.some((profile) => profile.id === id)) return;
        set({ activeProfileId: id });
      },

      getActiveProfile: () => {
        const { activeProfileId, profiles } = get();
        if (!activeProfileId) return null;
        return profiles.find((profile) => profile.id === activeProfileId) ?? null;
      },

      canAddProfile: () => get().profiles.length < MAX_PROFILES,
    }),
    { name: "wave-profiles" }
  )
);

export function getActiveProfileId(): string | null {
  return useProfiles.getState().activeProfileId;
}
