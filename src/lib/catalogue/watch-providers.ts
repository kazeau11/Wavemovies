export interface WatchProvider {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
}

const tmdbLogo = (path: string) => `https://image.tmdb.org/t/p/w154${path}`;

/** TMDB watch provider IDs (US) with logo fallbacks. */
export const FEATURED_WATCH_PROVIDERS: WatchProvider[] = [
  { id: "8", slug: "netflix", name: "Netflix", logoUrl: tmdbLogo("/t2yyOv40HZOePMRfhQY5UdCTTHz.jpg") },
  {
    id: "9",
    slug: "amazon-prime-video",
    name: "Amazon Prime Video",
    logoUrl: tmdbLogo("/emthp39XA2YScoAU1l4pF0hWr3.jpg"),
  },
  {
    id: "337",
    slug: "disney-plus",
    name: "Disney Plus",
    logoUrl: tmdbLogo("/7rwgM5xEmWT1Bk2H1oKz0NMsY.jpg"),
  },
  {
    id: "350",
    slug: "apple-tv-plus",
    name: "Apple TV+",
    logoUrl: tmdbLogo("/peURlLlr8MNGcTl8Wz5zEQ8e.jpg"),
  },
  { id: "15", slug: "hulu", name: "Hulu", logoUrl: tmdbLogo("/bnoewDApCzazbNioRNt8HuxUn53.jpg") },
  {
    id: "384",
    slug: "hbo-max",
    name: "HBO Max",
    logoUrl: tmdbLogo("/aS2zvJWzDdHDZekqXsFcWnXjJ2.jpg"),
  },
  {
    id: "531",
    slug: "paramount-plus",
    name: "Paramount Plus",
    logoUrl: tmdbLogo("/6uhKBfgmQ9l0AapQogWre7bOjb.jpg"),
  },
  {
    id: "386",
    slug: "peacock",
    name: "Peacock Premium",
    logoUrl: tmdbLogo("/gIEdQfZhOSxjjQCUCoVw9B5CH0B.jpg"),
  },
  {
    id: "283",
    slug: "crunchyroll",
    name: "Crunchyroll",
    logoUrl: tmdbLogo("/8nIk2q0arPmT8D5QG5qB4JmPq7V.jpg"),
  },
  { id: "43", slug: "starz", name: "Starz", logoUrl: tmdbLogo("/gi8T8gU8753U7mj68bg7v8Bjn06.jpg") },
  {
    id: "526",
    slug: "amc-plus",
    name: "AMC+",
    logoUrl: tmdbLogo("/4KAy18EWxl8zIK4YSG0Qvcc5pNu.jpg"),
  },
  {
    id: "636",
    slug: "mgm-plus",
    name: "MGM Plus",
    logoUrl: tmdbLogo("/xTVM8xxo5GWh67ShZZHKDxNqmcy.jpg"),
  },
  {
    id: "188",
    slug: "youtube-premium",
    name: "YouTube Premium",
    logoUrl: tmdbLogo("/fuqemt6EszTbZCVrXpKx3Vl9V1.jpg"),
  },
  {
    id: "192",
    slug: "youtube",
    name: "YouTube",
    logoUrl: tmdbLogo("/lScoBCTquVyPkN1R5WEJX1xeBf.jpg"),
  },
  { id: "73", slug: "tubi", name: "Tubi TV", logoUrl: tmdbLogo("/zwaeTLjGpJtS1ZBR7S8x8KWjxA.jpg") },
  {
    id: "300",
    slug: "pluto-tv",
    name: "Pluto TV",
    logoUrl: tmdbLogo("/4nMKBFNxtKBgG9tNWKiN8n8LAsm.jpg"),
  },
];

export function getWatchProviderBySlug(slug: string): WatchProvider | undefined {
  return FEATURED_WATCH_PROVIDERS.find((provider) => provider.slug === slug);
}

export function getWatchProviderById(id: string): WatchProvider | undefined {
  return FEATURED_WATCH_PROVIDERS.find((provider) => provider.id === id);
}

export const WATCH_REGION = process.env.WATCH_REGION ?? "US";
