import { getCatalogueProvider, getTVProvider } from "@/lib/catalogue";
import type { UnifiedSearchResult } from "@/lib/catalogue/types";
import { mergeSearchResults } from "@/lib/search/merge";
import { SearchGrid } from "@/components/search/SearchGrid";
import { SearchBar } from "@/components/ui/SearchBar";

export const revalidate = 60;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

const empty: UnifiedSearchResult = {
  results: [],
  page: 1,
  totalResults: 0,
  hasMore: false,
};

async function unifiedSearch(query: string, page = 1): Promise<UnifiedSearchResult> {
  const emptyPage = { results: [], page, totalPages: 0, totalResults: 0 };

  const [movies, shows] = await Promise.all([
    getCatalogueProvider().search(query, page).catch(() => emptyPage),
    getTVProvider().search(query, page).catch(() => emptyPage),
  ]);

  return {
    results: mergeSearchResults(movies.results, shows.results, query),
    page,
    totalResults: movies.totalResults + shows.totalResults,
    hasMore: page < movies.totalPages || page < shows.totalPages,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let data = empty;

  if (query) {
    try {
      data = await unifiedSearch(query, 1);
    } catch {
      /* handled below */
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-white">Search</h1>
      <SearchBar defaultValue={query} autoFocus className="mb-8 max-w-xl" />

      {query ? (
        <>
          <p className="mb-6 text-wave-muted">
            {data.totalResults > 0
              ? `Found ${data.totalResults} results for "${query}"`
              : `No results found for "${query}"`}
          </p>

          {data.results.length > 0 ? (
            <SearchGrid
              initialResults={data.results}
              initialPage={data.page}
              hasMore={data.hasMore}
              query={query}
            />
          ) : null}
        </>
      ) : (
        <p className="text-wave-muted">Search movies and TV shows together.</p>
      )}
    </div>
  );
}
