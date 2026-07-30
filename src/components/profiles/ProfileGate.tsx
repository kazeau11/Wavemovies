"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { useProfiles, MAX_PROFILES, useSafeProfiles } from "@/lib/storage/profiles";
import { DEFAULT_AVATAR_ID } from "@/lib/profiles/avatars";
import { ProfileAvatar } from "@/components/profiles/ProfileAvatar";
import { useHasMounted } from "@/lib/hooks/use-has-mounted";
import { cn } from "@/lib/utils";

export function ProfileGate() {
  const mounted = useHasMounted();
  const profiles = useSafeProfiles();
  const activeProfileId = useProfiles((state) => state.activeProfileId);
  const { setActiveProfile, addProfile, canAddProfile } = useProfiles();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!mounted || profiles.length === 0) return;
    if (activeProfileId && profiles.some((profile) => profile.id === activeProfileId)) {
      return;
    }
    if (profiles.length === 1) {
      setActiveProfile(profiles[0].id);
    }
  }, [mounted, profiles, activeProfileId, setActiveProfile]);

  if (!mounted) return null;

  const activeValid =
    activeProfileId && profiles.some((profile) => profile.id === activeProfileId);

  if (activeValid) return null;

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const profile = addProfile(trimmed, DEFAULT_AVATAR_ID);
    if (profile) {
      setActiveProfile(profile.id);
      setCreating(false);
      setName("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-4">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {profiles.length === 0 ? "Welcome to Wave" : "Who's watching?"}
        </h1>
        <p className="mt-2 text-wave-muted">
          {profiles.length === 0
            ? "Create a profile — we'll remember this device next time."
            : "Pick a profile to continue. Up to 4 per device."}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => setActiveProfile(profile.id)}
              className="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
            >
              <ProfileAvatar avatarId={profile.avatarId} size="xl" />
              <span className="max-w-[120px] truncate text-sm font-medium text-white/80 group-hover:text-white">
                {profile.name}
              </span>
            </button>
          ))}

          {canAddProfile() && !creating && (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
            >
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-white/25 bg-white/5 text-white/50 transition-colors group-hover:border-wave-accent group-hover:text-wave-accent">
                <Plus className="h-10 w-10" />
              </div>
              <span className="text-sm font-medium text-white/60 group-hover:text-white">
                Add Profile
              </span>
            </button>
          )}
        </div>

        {creating && (
          <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5">
            <label className="mb-2 block text-left text-sm text-wave-muted">
              Profile name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={20}
              placeholder="Enter a name"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-white outline-none focus:border-wave-accent/50"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setName("");
                }}
                className="rounded-lg px-4 py-2 text-sm text-wave-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!name.trim() || profiles.length >= MAX_PROFILES}
                className={cn(
                  "rounded-lg bg-wave-accent px-4 py-2 text-sm font-semibold text-wave-bg",
                  !name.trim() && "opacity-50"
                )}
              >
                Create
              </button>
            </div>
          </div>
        )}

        {profiles.length > 0 && (
          <Link
            href="/profile"
            className="mt-8 inline-flex items-center gap-2 text-sm text-wave-muted transition-colors hover:text-white"
          >
            <Pencil className="h-4 w-4" />
            Manage profiles
          </Link>
        )}
      </div>
    </div>
  );
}
