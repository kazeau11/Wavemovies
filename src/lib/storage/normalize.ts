type LegacyItemsState = { items?: unknown[]; byProfile?: Record<string, unknown[]> };

export function normalizeByProfileState(
  persisted: unknown,
  profileId: string | null
): { byProfile: Record<string, unknown[]> } {
  if (!persisted || typeof persisted !== "object") {
    return { byProfile: {} };
  }

  const state = persisted as LegacyItemsState;
  if (state.byProfile && typeof state.byProfile === "object") {
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
  if (!profileId || !byProfile) return [];
  return byProfile[profileId] ?? [];
}
