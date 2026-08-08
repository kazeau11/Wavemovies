/** TMDB-compatible catalogue API (same movie data as cinejoy.to). */
export function getCatalogueBaseUrl(): string {
  return (
    process.env.CATALOGUE_API_URL ??
    process.env.CINEJOY_API_URL ??
    "https://db.1flex.org"
  ).replace(/\/$/, "");
}

export function getCatalogueApiOrigin(): string {
  return (
    process.env.CATALOGUE_API_ORIGIN ??
    process.env.CINEJOY_ORIGIN ??
    "https://www.1flex.org"
  );
}

export const CATALOGUE_API_ORIGIN_FALLBACK = "https://www.1flex.org";

export const CINEJOY_SITE = process.env.CINEJOY_ORIGIN ?? "https://cinejoy.to";
