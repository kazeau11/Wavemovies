export interface WatchProvider {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
}

/** TMDB watch provider IDs (US) — matches Cinejoy browse list. */
export const FEATURED_WATCH_PROVIDERS: WatchProvider[] = [
  { id: "8", slug: "netflix", name: "Netflix" },
  { id: "9", slug: "amazon-prime-video", name: "Amazon Prime Video" },
  { id: "337", slug: "disney-plus", name: "Disney Plus" },
  { id: "350", slug: "apple-tv-plus", name: "Apple TV+" },
  { id: "15", slug: "hulu", name: "Hulu" },
  { id: "384", slug: "hbo-max", name: "HBO Max" },
  { id: "531", slug: "paramount-plus", name: "Paramount Plus" },
  { id: "386", slug: "peacock", name: "Peacock Premium" },
  { id: "283", slug: "crunchyroll", name: "Crunchyroll" },
  { id: "43", slug: "starz", name: "Starz" },
  { id: "526", slug: "amc-plus", name: "AMC+" },
  { id: "636", slug: "mgm-plus", name: "MGM Plus" },
  { id: "188", slug: "youtube-premium", name: "YouTube Premium" },
  { id: "192", slug: "youtube", name: "YouTube" },
  { id: "73", slug: "tubi", name: "Tubi TV" },
  { id: "300", slug: "pluto-tv", name: "Pluto TV" },
];

export function getWatchProviderBySlug(slug: string): WatchProvider | undefined {
  return FEATURED_WATCH_PROVIDERS.find((provider) => provider.slug === slug);
}

export function getWatchProviderById(id: string): WatchProvider | undefined {
  return FEATURED_WATCH_PROVIDERS.find((provider) => provider.id === id);
}

export const WATCH_REGION = process.env.WATCH_REGION ?? "US";
