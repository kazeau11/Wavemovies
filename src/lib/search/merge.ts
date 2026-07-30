import type { Movie, SearchResult, TVShow } from "@/lib/catalogue/types";

function sortKey(title: string, query: string): [number, number, string] {
  const lower = title.toLowerCase();
  const q = query.toLowerCase();
  const exact = lower === q ? 0 : 1;
  const starts = lower.startsWith(q) ? 0 : 1;
  return [exact, starts, lower];
}

export function mergeSearchResults(
  movies: Movie[],
  shows: TVShow[],
  query: string
): SearchResult[] {
  const results: SearchResult[] = [
    ...movies.map((item) => ({ mediaType: "movie" as const, item })),
    ...shows.map((item) => ({ mediaType: "tv" as const, item })),
  ];

  return results.sort((a, b) => {
    const keyA = sortKey(a.item.title, query);
    const keyB = sortKey(b.item.title, query);
    if (keyA[0] !== keyB[0]) return keyA[0] - keyB[0];
    if (keyA[1] !== keyB[1]) return keyA[1] - keyB[1];
    return keyA[2].localeCompare(keyB[2]);
  });
}
