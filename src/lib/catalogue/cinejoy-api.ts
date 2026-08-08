import { getCinejoyOrigin } from "@/lib/catalogue/cinejoy-config";

export async function fetchCinejoyCatalogue<T>(url: string): Promise<T> {
  const origin = getCinejoyOrigin();

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Origin: origin,
      Referer: `${origin}/`,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Cinejoy catalogue error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
