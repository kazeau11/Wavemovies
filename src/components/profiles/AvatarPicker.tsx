"use client";

import { PROFILE_AVATARS } from "@/lib/profiles/avatars";
import { ProfileAvatar } from "@/components/profiles/ProfileAvatar";
import { cn } from "@/lib/utils";

interface AvatarPickerProps {
  value: string;
  onChange: (avatarId: string) => void;
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div className="grid max-h-[320px] grid-cols-5 gap-2 overflow-y-auto pr-1 sm:grid-cols-10">
      {PROFILE_AVATARS.map((avatar) => (
        <button
          key={avatar.id}
          type="button"
          onClick={() => onChange(avatar.id)}
          className={cn(
            "rounded-full p-0.5 transition-transform hover:scale-105",
            value === avatar.id && "scale-105"
          )}
          aria-label={`Choose avatar ${avatar.id}`}
        >
          <ProfileAvatar avatarId={avatar.id} size="md" selected={value === avatar.id} />
        </button>
      ))}
    </div>
  );
}
