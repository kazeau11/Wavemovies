import { DEFAULT_AVATAR_ID } from "@/lib/profiles/avatars";
import type { WaveProfile } from "@/lib/storage/profiles";

type LegacyItemsState = {
  items?: unknown[];
  byProfile?: Record<string, unknown[]>;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function normalizeByProfileState(
  persisted: unknown,
  profileId: string | null
): { byProfile: Record<string, unknown[]> } {
  if (!isRecord(persisted)) {
    return { byProfile: {} };
  }

  const state = persisted as LegacyItemsState;
  if (isRecord(state.byProfile)) {
    return { byProfile: state.byProfile };
  }

  const legacyItems = Array.isArray(state.items) ? state.items : [];
  if (!profileId || legacyItems.length === 0) {
    return { byProfile: {} };
  }

  return { byProfile: { [profileId]: legacyItems } };
}

export function readByProfile<T>(
  byProfile: Record<string, T[]> | undefined,
  profileId: string | null
): T[] {
  if (!profileId || !isRecord(byProfile)) return [];
  const items = byProfile[profileId];
  return Array.isArray(items) ? items : [];
}

export function sanitizeProfiles(profiles: unknown): WaveProfile[] {
  if (!Array.isArray(profiles)) return [];

  return profiles
    .filter(
      (profile): profile is WaveProfile =>
        isRecord(profile) &&
        typeof profile.id === "string" &&
        typeof profile.name === "string"
    )
    .map((profile) => ({
      id: profile.id,
      name: profile.name.slice(0, 20),
      avatarId:
        typeof profile.avatarId === "string" && profile.avatarId.length > 0
          ? profile.avatarId
          : DEFAULT_AVATAR_ID,
      createdAt:
        typeof profile.createdAt === "string"
          ? profile.createdAt
          : new Date().toISOString(),
    }));
}

export function sanitizeActiveProfileId(
  activeProfileId: unknown,
  profiles: WaveProfile[]
): string | null {
  if (typeof activeProfileId !== "string") {
    return profiles.length === 1 ? profiles[0].id : null;
  }

  return profiles.some((profile) => profile.id === activeProfileId)
    ? activeProfileId
    : profiles.length === 1
      ? profiles[0].id
      : null;
}
