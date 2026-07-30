import { getProfileAvatar } from "@/lib/profiles/avatars";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  avatarId: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  selected?: boolean;
}

const sizeClasses = {
  sm: "h-9 w-9 text-lg",
  md: "h-14 w-14 text-2xl",
  lg: "h-20 w-20 text-3xl",
  xl: "h-28 w-28 text-5xl",
};

export function ProfileAvatar({
  avatarId,
  size = "md",
  className,
  selected,
}: ProfileAvatarProps) {
  const avatar = getProfileAvatar(avatarId);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br shadow-lg ring-2 ring-transparent transition-all",
        avatar.gradient,
        sizeClasses[size],
        selected && "ring-wave-accent scale-105",
        className
      )}
      aria-hidden
    >
      <span className="select-none drop-shadow-sm">{avatar.emoji}</span>
    </div>
  );
}
