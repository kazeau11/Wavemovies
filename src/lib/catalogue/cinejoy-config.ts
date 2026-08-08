/** Cinejoy site + catalogue configuration. */
export const CINEJOY_SITE = process.env.CINEJOY_ORIGIN ?? "https://cinejoy.to";

export function getCinejoyCatalogueBaseUrl(): string {
  if (process.env.CINEJOY_API_URL) {
    return process.env.CINEJOY_API_URL.replace(/\/$/, "");
  }

  const site =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return `${site.replace(/\/$/, "")}/api/cinejoy/catalogue`;
}

export function getCinejoyOrigin(): string {
  return CINEJOY_SITE;
}
