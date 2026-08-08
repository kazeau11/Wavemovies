import {
  CATALOGUE_API_ORIGIN_FALLBACK,
  getCatalogueApiOrigin,
} from "@/lib/catalogue/cinejoy-config";

export async function fetchCatalogueApi<T>(
  url: string,
  primaryOrigin = getCatalogueApiOrigin()
): Promise<T> {
  const origins = Array.from(
    new Set([primaryOrigin, CATALOGUE_API_ORIGIN_FALLBACK].filter(Boolean))
  );

  for (const origin of origins) {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Origin: origin,
        Referer: `${origin}/`,
      },
      next: { revalidate: 300 },
    });

    if (response.ok) {
      return response.json() as Promise<T>;
    }
  }

  throw new Error(`Catalogue API error for ${url}`);
}
