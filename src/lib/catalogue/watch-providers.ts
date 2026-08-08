export interface WatchProvider {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
}

const tmdbLogo = (path: string) => `https://image.tmdb.org/t/p/w154${path}`;

/** TMDB watch provider IDs (US) with verified logo paths. */
export const FEATURED_WATCH_PROVIDERS: WatchProvider[] = [
  { id: "8", slug: "netflix", name: "Netflix", logoUrl: tmdbLogo("/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg") },
  {
    id: "9",
    slug: "amazon-prime-video",
    name: "Amazon Prime Video",
    logoUrl: tmdbLogo("/pvske1MyAoymrs5bguRfVqYiM9a.jpg"),
  },
  {
    id: "337",
    slug: "disney-plus",
    name: "Disney Plus",
    logoUrl: tmdbLogo("/97yvRBw1GzX7fXprcF80er19ot.jpg"),
  },
  {
    id: "350",
    slug: "apple-tv-plus",
    name: "Apple TV+",
    logoUrl: tmdbLogo("/mcbz1LgtErU9p4UdbZ0rG6RTWHX.jpg"),
  },
  {
    id: "2",
    slug: "apple-tv",
    name: "Apple TV",
    logoUrl: tmdbLogo("/SPnB1qiCkYfirS2it3hZORwGVn.jpg"),
  },
  { id: "15", slug: "hulu", name: "Hulu", logoUrl: tmdbLogo("/bxBlRPEPpMVDc4jMhSrTf2339DW.jpg") },
  {
    id: "1899",
    slug: "hbo-max",
    name: "HBO Max",
    logoUrl: tmdbLogo("/jbe4gVSfRlbPTdESXhEKpornsfu.jpg"),
  },
  {
    id: "2303",
    slug: "paramount-plus",
    name: "Paramount Plus",
    logoUrl: tmdbLogo("/fts6X10Jn4QT0X6ac3udKEn2tJA.jpg"),
  },
  {
    id: "386",
    slug: "peacock",
    name: "Peacock Premium",
    logoUrl: tmdbLogo("/2aGrp1xw3qhwCYvNGAJZPdjfeeX.jpg"),
  },
  {
    id: "283",
    slug: "crunchyroll",
    name: "Crunchyroll",
    logoUrl: tmdbLogo("/fzN5Jok5Ig1eJ7gyNGoMhnLSCfh.jpg"),
  },
  { id: "43", slug: "starz", name: "Starz", logoUrl: tmdbLogo("/yIKwylTLP1u8gl84Is7FItpYLGL.jpg") },
  {
    id: "526",
    slug: "amc-plus",
    name: "AMC+",
    logoUrl: tmdbLogo("/ovmu6uot1XVvsemM2dDySXLiX57.jpg"),
  },
  {
    id: "636",
    slug: "mgm-plus",
    name: "MGM Plus",
    logoUrl: tmdbLogo("/lD7HKUmXDvUya58DceiTA809Zbf.jpg"),
  },
  {
    id: "188",
    slug: "youtube-premium",
    name: "YouTube Premium",
    logoUrl: tmdbLogo("/rMb93u1tBeErSYLv79zSTR07UdO.jpg"),
  },
  {
    id: "192",
    slug: "youtube",
    name: "YouTube",
    logoUrl: tmdbLogo("/pTnn5JwWr4p3pG8H6VrpiQo7Vs0.jpg"),
  },
  { id: "73", slug: "tubi", name: "Tubi TV", logoUrl: tmdbLogo("/zLYr7OPvpskMA4S79E3vlCi71iC.jpg") },
  {
    id: "300",
    slug: "pluto-tv",
    name: "Pluto TV",
    logoUrl: tmdbLogo("/dB8G41Q6tSL5NBisrIeqByfepBc.jpg"),
  },
];

export function getWatchProviderBySlug(slug: string): WatchProvider | undefined {
  return FEATURED_WATCH_PROVIDERS.find((provider) => provider.slug === slug);
}

export function getWatchProviderById(id: string): WatchProvider | undefined {
  return FEATURED_WATCH_PROVIDERS.find((provider) => provider.id === id);
}

export const WATCH_REGION = process.env.WATCH_REGION ?? "US";
