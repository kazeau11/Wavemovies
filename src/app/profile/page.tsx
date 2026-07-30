"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Bookmark, LogOut, Plus, Trash2 } from "lucide-react";
import {
  useContinueWatching,
  useContinueWatchingItems,
} from "@/lib/storage/continue-watching";
import { useWatchlistItems } from "@/lib/storage/watchlist";
import { useProfiles, MAX_PROFILES } from "@/lib/storage/profiles";
import { DEFAULT_AVATAR_ID } from "@/lib/profiles/avatars";
import { ProfileAvatar } from "@/components/profiles/ProfileAvatar";
import { AvatarPicker } from "@/components/profiles/AvatarPicker";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const continueItems = useContinueWatchingItems();
  const watchlistItems = useWatchlistItems();
  const { removeItem, clearAll: clearContinue } = useContinueWatching();
  const {
    profiles,
    activeProfileId,
    getActiveProfile,
    updateProfile,
    addProfile,
    removeProfile,
    setActiveProfile,
    canAddProfile,
  } = useProfiles();

  const activeProfile = getActiveProfile();
  const [editingId, setEditingId] = useState<string | null>(activeProfileId);
  const [name, setName] = useState(activeProfile?.name ?? "");
  const [avatarId, setAvatarId] = useState(activeProfile?.avatarId ?? DEFAULT_AVATAR_ID);
  const [newProfileName, setNewProfileName] = useState("");

  const editingProfile = profiles.find((profile) => profile.id === editingId) ?? activeProfile;

  const startEdit = (profileId: string) => {
    const profile = profiles.find((entry) => entry.id === profileId);
    if (!profile) return;
    setEditingId(profileId);
    setName(profile.name);
    setAvatarId(profile.avatarId);
  };

  const saveProfile = () => {
    if (!editingId || !name.trim()) return;
    updateProfile(editingId, { name: name.trim(), avatarId });
  };

  const handleAddProfile = () => {
    const trimmed = newProfileName.trim();
    if (!trimmed) return;
    const profile = addProfile(trimmed, DEFAULT_AVATAR_ID);
    if (profile) {
      setNewProfileName("");
      startEdit(profile.id);
    }
  };

  const handleSwitchProfile = () => {
    setActiveProfile(null);
  };

  if (!activeProfile) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-wave-muted">Select a profile to continue.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <ProfileAvatar avatarId={activeProfile.avatarId} size="lg" />
          <div>
            <h1 className="text-3xl font-bold text-white">{activeProfile.name}</h1>
            <p className="mt-1 text-wave-muted">Your Wave profile on this device</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleSwitchProfile}>
          <LogOut className="h-4 w-4" />
          Switch Profile
        </Button>
      </div>

      <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold text-white">Profiles on this device</h2>
        <p className="mt-1 text-sm text-wave-muted">
          Up to {MAX_PROFILES} profiles — each keeps its own watchlist and continue watching.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => {
                setActiveProfile(profile.id);
                startEdit(profile.id);
              }}
              className={`flex flex-col items-center gap-2 rounded-xl p-3 transition-colors ${
                profile.id === activeProfileId
                  ? "bg-wave-accent/10 ring-1 ring-wave-accent/40"
                  : "hover:bg-white/5"
              }`}
            >
              <ProfileAvatar avatarId={profile.avatarId} size="md" />
              <span className="max-w-[100px] truncate text-sm text-white">{profile.name}</span>
            </button>
          ))}
        </div>

        {editingProfile && (
          <div className="mt-8 space-y-5 border-t border-white/10 pt-8">
            <h3 className="font-semibold text-white">Edit {editingProfile.name}</h3>
            <div>
              <label className="mb-2 block text-sm text-wave-muted">Profile name</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={20}
                className="w-full max-w-sm rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-white outline-none focus:border-wave-accent/50"
              />
            </div>
            <div>
              <label className="mb-3 block text-sm text-wave-muted">
                Choose a profile picture (50 to choose from)
              </label>
              <AvatarPicker value={avatarId} onChange={setAvatarId} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={saveProfile}>Save Profile</Button>
              {profiles.length > 1 && editingId && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    removeProfile(editingId);
                    const next = profiles.find((profile) => profile.id !== editingId);
                    if (next) startEdit(next.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Profile
                </Button>
              )}
            </div>
          </div>
        )}

        {canAddProfile() && (
          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm text-wave-muted">Add another profile</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(event) => setNewProfileName(event.target.value)}
                maxLength={20}
                placeholder="Profile name"
                className="w-full max-w-sm rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-white outline-none focus:border-wave-accent/50"
              />
            </div>
            <Button onClick={handleAddProfile} disabled={!newProfileName.trim()}>
              <Plus className="h-4 w-4" />
              Add Profile
            </Button>
          </div>
        )}
      </section>

      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl glass p-6 text-center">
          <Clock className="mx-auto mb-2 h-8 w-8 text-blue-400" />
          <p className="text-2xl font-bold text-white">{continueItems.length}</p>
          <p className="text-sm text-wave-muted">Continue Watching</p>
        </div>
        <div className="rounded-2xl glass p-6 text-center">
          <Bookmark className="mx-auto mb-2 h-8 w-8 text-blue-500" />
          <p className="text-2xl font-bold text-white">{watchlistItems.length}</p>
          <p className="text-sm text-wave-muted">Watchlist</p>
        </div>
      </div>

      {continueItems.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Continue Watching</h2>
            <Button variant="ghost" size="sm" onClick={clearContinue}>
              Clear All
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {continueItems.map((item) => {
              const progress = item.duration > 0 ? (item.progress / item.duration) * 100 : 0;
              return (
                <div key={item.movieId} className="group overflow-hidden rounded-2xl glass">
                  <Link href={`/watch/${item.movieId}`} className="relative block aspect-video">
                    <Image
                      src={item.backdropUrl || item.posterUrl || "/placeholder-poster.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </Link>
                  <div className="flex items-center justify-between p-4">
                    <Link href={`/movie/${item.movieId}`}>
                      <h3 className="font-medium text-white group-hover:text-blue-300">
                        {item.title}
                      </h3>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.movieId)}>
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/watchlist">
          <Button variant="secondary">View Watchlist</Button>
        </Link>
        <Link href="/about">
          <Button variant="outline">About</Button>
        </Link>
      </div>
    </div>
  );
}
