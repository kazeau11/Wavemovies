import type { Movie } from "./types";

/** Swap a catalogue entry for another movie everywhere it appears. */
export const CATALOGUE_MOVIE_SWAPS: Record<string, string> = {
  "1311031": "1084244", // Demon Slayer: Infinity Castle → Toy Story 5
};

export async function swapCatalogueMovies(
  movies: Movie[],
  getMovie: (id: string) => Promise<Movie | null>
): Promise<Movie[]> {
  const replacements = new Map<string, Movie>();

  for (const movie of movies) {
    const replacementId = CATALOGUE_MOVIE_SWAPS[movie.id];
    if (replacementId && !replacements.has(replacementId)) {
      const fetched = await getMovie(replacementId);
      if (fetched) replacements.set(replacementId, fetched);
    }
  }

  const seen = new Set<string>();
  const result: Movie[] = [];

  for (const movie of movies) {
    const replacementId = CATALOGUE_MOVIE_SWAPS[movie.id];
    const next =
      replacementId && replacements.has(replacementId)
        ? replacements.get(replacementId)!
        : movie;

    if (seen.has(next.id)) continue;
    seen.add(next.id);
    result.push(next);
  }

  return result;
}
