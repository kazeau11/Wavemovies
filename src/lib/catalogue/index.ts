import type { CatalogueProvider, TVCatalogueProvider } from "./types";
import { OneFlexProvider } from "./providers/oneflex";
import { OneFlexTVProvider } from "./providers/oneflex-tv";
import { TmdbProvider } from "./providers/tmdb";

let cachedProvider: CatalogueProvider | null = null;
let cachedTVProvider: TVCatalogueProvider | null = null;

export function getCatalogueProvider(): CatalogueProvider {
  if (cachedProvider) return cachedProvider;

  const providerName = process.env.CATALOGUE_PROVIDER ?? "oneflex";
  const hasTmdbKey = Boolean(process.env.TMDB_API_KEY?.trim());

  if (providerName.toLowerCase() === "tmdb" && hasTmdbKey) {
    cachedProvider = new TmdbProvider();
  } else {
    cachedProvider = new OneFlexProvider();
  }

  return cachedProvider;
}

export function getTVProvider(): TVCatalogueProvider {
  if (cachedTVProvider) return cachedTVProvider;

  const providerName = process.env.CATALOGUE_PROVIDER ?? "oneflex";

  switch (providerName.toLowerCase()) {
    case "oneflex":
      cachedTVProvider = new OneFlexTVProvider();
      break;
    default:
      cachedTVProvider = new OneFlexTVProvider();
      break;
  }

  return cachedTVProvider;
}

export function resetCatalogueProvider(): void {
  cachedProvider = null;
  cachedTVProvider = null;
}

export * from "./types";
export * from "./replacements";
