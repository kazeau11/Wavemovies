import { FEATURED_WATCH_PROVIDERS, WATCH_REGION } from "@/lib/catalogue/watch-providers";
import { fetchCinejoyCatalogue } from "@/lib/catalogue/cinejoy-api";
import { getCinejoyCatalogueBaseUrl } from "@/lib/catalogue/cinejoy-config";

interface TmdbProviderLogo {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

async function fetchProviderLogos(): Promise<Map<number, string>> {
  const baseUrl = getCinejoyCatalogueBaseUrl();
  const url = new URL("/watch/providers/movie", baseUrl);
  url.searchParams.set("watch_region", WATCH_REGION);

  const data = await fetchCinejoyCatalogue<{ results?: TmdbProviderLogo[] }>(url.toString());

  const logos = new Map<number, string>();

  for (const entry of data.results ?? []) {
    if (entry.logo_path) {
      logos.set(entry.provider_id, `https://image.tmdb.org/t/p/w154${entry.logo_path}`);
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
