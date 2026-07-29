export type ImageSize = "poster" | "backdrop" | "hero";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

/** TMDB size presets — hero/backdrop use original (~4K when available) */
const SIZE_MAP: Record<ImageSize, string> = {
  poster: "w780",
  backdrop: "original",
  hero: "original",
};

export function getTmdbImageUrl(
  path: string | null | undefined,
  size: ImageSize = "poster"
): string {
  if (!path) return "/placeholder-poster.svg";
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${TMDB_IMAGE_BASE}/${SIZE_MAP[size]}${normalized}`;
}

export function isExternalImage(url: string): boolean {
  return url.startsWith("http");
}
