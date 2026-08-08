import { FEATURED_WATCH_PROVIDERS, WATCH_REGION } from "@/lib/catalogue/watch-providers";

interface TmdbProviderLogo {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

async function fetchProviderLogos(): Promise<Map<number, string>> {
  const baseUrl = process.env.ONEFLEX_API_URL ?? "https://db.1flex.org";
  const origin = process.env.ONEFLEX_ORIGIN ?? "https://cinejoy.to";

  const url = new URL("/watch/providers/movie", baseUrl);
  url.searchParams.set("watch_region", WATCH_REGION);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      Origin: origin,
      Referer: `${origin}/`,
    },
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    return new Map();
  }

  const data = (await response.json()) as { results?: TmdbProviderLogo[] };
  const logos = new Map<number, string>();

  for (const entry of data.results ?? []) {
    if (entry.logo_path) {
      logos.set(entry.provider_id, `https://image.tmdb.org/t/p/w92${entry.logo_path}`);
    }
  }

  return logos;
}

export async function getFeaturedWatchProviders() {
  const logos = await fetchProviderLogos().catch(() => new Map<number, string>());

  return FEATURED_WATCH_PROVIDERS.map((provider) => ({
    ...provider,
    logoUrl: logos.get(Number(provider.id)) ?? provider.logoUrl,
  }));
}
