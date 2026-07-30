export interface ProfileAvatar {
  id: string;
  emoji: string;
  gradient: string;
}

const EMOJIS = [
  "🎬", "🍿", "🎭", "🌊", "⭐", "🔥", "🎸", "🎮", "🏀", "⚡",
  "🦊", "🐼", "🦁", "🐯", "🐸", "🦄", "🐙", "🦋", "🐺", "🐨",
  "😎", "🤩", "😈", "👻", "🤖", "👽", "🥷", "🧙", "🧛", "🦸",
  "🎯", "🎨", "🎧", "📷", "🚀", "🌙", "☀️", "🌈", "💎", "👑",
  "🎪", "🎰", "🏎️", "🏄", "🧊", "🍕", "🌮", "🍉", "🎂", "💜",
];

const GRADIENTS = [
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-700",
  "from-rose-500 to-pink-700",
  "from-amber-400 to-orange-600",
  "from-emerald-400 to-teal-600",
  "from-sky-400 to-indigo-600",
  "from-fuchsia-500 to-purple-800",
  "from-lime-400 to-green-600",
  "from-red-500 to-rose-700",
  "from-blue-400 to-cyan-600",
];

export const PROFILE_AVATARS: ProfileAvatar[] = EMOJIS.map((emoji, index) => ({
  id: String(index + 1).padStart(2, "0"),
  emoji,
  gradient: GRADIENTS[index % GRADIENTS.length],
}));

export const DEFAULT_AVATAR_ID = "01";

export function getProfileAvatar(avatarId: string): ProfileAvatar {
  return (
    PROFILE_AVATARS.find((avatar) => avatar.id === avatarId) ?? PROFILE_AVATARS[0]
  );
}
