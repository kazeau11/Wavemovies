"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Movie } from "@/lib/catalogue/types";
import { MovieCard } from "./MovieCard";
import { Loader2 } from "lucide-react";

interface MovieGridProps {
  initialMovies: Movie[];
  initialPage: number;
  totalPages: number;
  fetchUrl: string;
}

export function MovieGrid({ initialMovies, initialPage, totalPages, fetchUrl }: MovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialPage < totalPages);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const separator = fetchUrl.includes("?") ? "&" : "?";
      const res = await fetch(`${fetchUrl}${separator}page=${nextPage}`);
      const data = await res.json();
      if (data.results?.length) {
        setMovies((prev) => [...prev, ...data.results]);
        setPage(nextPage);
        setHasMore(nextPage < data.totalPages);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, hasMore, loading, page]);

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
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.id}-${index}`} movie={movie} index={index % 12} />
        ))}
      </div>

      <div ref={observerRef} className="flex justify-center py-8">
        {loading && (
          <Loader2 className="h-8 w-8 animate-spin text-wave-accent" />
        )}
        {!hasMore && movies.length > 0 && (
          <p className="text-sm text-wave-muted">You&apos;ve reached the end</p>
        )}
      </div>
    </>
  );
}
