import { getCatalogueProvider, getTVProvider } from "@/lib/catalogue";
import type { Movie, PaginatedResult, TVShow } from "@/lib/catalogue/types";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { ShowGrid } from "@/components/shows/ShowGrid";
import { SearchBar } from "@/components/ui/SearchBar";

export const revalidate = 60;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

const emptyMovies: PaginatedResult<Movie> = {
  results: [],
  page: 1,
  totalPages: 0,
  totalResults: 0,
};

const emptyShows: PaginatedResult<TVShow> = {
  results: [],
  page: 1,
  totalPages: 0,
  totalResults: 0,
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let movieResults = emptyMovies;
  let showResults = emptyShows;

  if (query) {
    try {
      const [movies, shows] = await Promise.all([
        getCatalogueProvider().search(query, 1).catch(() => emptyMovies),
        getTVProvider().search(query, 1).catch(() => emptyShows),
      ]);
      movieResults = movies;
      showResults = shows;
    } catch {
      /* handled below */
    }
  }

  const totalResults = movieResults.totalResults + showResults.totalResults;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-white">Search</h1>
      <SearchBar defaultValue={query} autoFocus className="mb-8 max-w-xl" />

      {query ? (
        <>
          <p className="mb-6 text-wave-muted">
            {totalResults > 0
              ? `Found ${totalResults} results for "${query}"`
              : `No results found for "${query}"`}
          </p>

          {showResults.results.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-4 text-xl font-bold text-white">TV Shows</h2>
              <ShowGrid
                initialShows={showResults.results}
                initialPage={showResults.page}
                totalPages={showResults.totalPages}
                fetchUrl={`/api/shows?q=${encodeURIComponent(query)}`}
              />
            </section>
          )}

          {movieResults.results.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-white">Movies</h2>
              <MovieGrid
                initialMovies={movieResults.results}
                initialPage={movieResults.page}
                totalPages={movieResults.totalPages}
                fetchUrl={`/api/movies?q=${encodeURIComponent(query)}`}
              />
            </section>
          )}
        </>
      ) : (
        <p className="text-wave-muted">Enter a search term to find movies and TV shows.</p>
      )}
    </div>
  );
}
