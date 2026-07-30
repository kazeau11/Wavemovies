"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Movie, SearchResult, TVShow } from "@/lib/catalogue/types";
import { MovieCard } from "@/components/movies/MovieCard";
import { ShowCard } from "@/components/shows/ShowCard";
import { mergeSearchResults } from "@/lib/search/merge";
import { Loader2 } from "lucide-react";

function splitResults(results: SearchResult[]) {
  const movies: Movie[] = [];
  const shows: TVShow[] = [];

  for (const result of results) {
    if (result.mediaType === "movie") movies.push(result.item);
    else shows.push(result.item);
  }

  return { movies, shows };
}

interface SearchGridProps {
  initialResults: SearchResult[];
  initialPage: number;
  hasMore: boolean;
  query: string;
}

export function SearchGrid({
  initialResults,
  initialPage,
  hasMore: initialHasMore,
  query,
}: SearchGridProps) {
  const [results, setResults] = useState<SearchResult[]>(initialResults);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults(initialResults);
    setPage(initialPage);
    setHasMore(initialHasMore);
  }, [query, initialResults, initialPage, initialHasMore]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&page=${nextPage}`
      );
      const data = await res.json();
      if (data.results?.length) {
        setResults((prev) => {
          const combined = [...prev, ...(data.results as SearchResult[])];
          const { movies, shows } = splitResults(combined);
          return mergeSearchResults(movies, shows, query);
        });
        setPage(nextPage);
        setHasMore(Boolean(data.hasMore));
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page, query]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loadMore]);

  return (
    <>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {results.map((result, index) => (
          <div key={`${result.mediaType}-${result.item.id}-${index}`}>
            {result.mediaType === "movie" ? (
              <MovieCard movie={result.item} index={index % 12} />
            ) : (
              <ShowCard show={result.item} index={index % 12} />
            )}
          </div>
        ))}
      </div>

      <div ref={observerRef} className="flex justify-center py-8">
        {loading && <Loader2 className="h-8 w-8 animate-spin text-wave-accent" />}
        {!hasMore && results.length > 0 && (
          <p className="text-sm text-wave-muted">You&apos;ve reached the end</p>
        )}
      </div>
    </>
  );
}
