"use client";

import { useEffect, useState } from "react";
import { MovieRow } from "@/components/movies/MovieRow";
import { useContinueWatchingItems } from "@/lib/storage/continue-watching";
import { useHasMounted } from "@/lib/hooks/use-has-mounted";
import type { Movie } from "@/lib/catalogue/types";

interface ContinueWatchingSectionProps {
  variant?: "poster" | "landscape";
}

export function ContinueWatchingSection({ variant = "poster" }: ContinueWatchingSectionProps) {
  const mounted = useHasMounted();
  const items = useContinueWatchingItems();
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (items.length === 0) {
      setMovies([]);
      return;
    }

    Promise.all(
      items.slice(0, 10).map(async (item) => {
        try {
          const res = await fetch(`/api/movies/${item.movieId}`);
          if (res.ok) return res.json() as Promise<Movie>;
        } catch {
          /* ignore */
        }
        return {
          id: item.movieId,
          title: item.title,
          overview: "",
          posterUrl: item.posterUrl,
          backdropUrl: item.backdropUrl,
          releaseDate: "",
          releaseYear: 0,
          genres: [],
          rating: 0,
          runtime: null,
          provider: "local",
        } satisfies Movie;
      })
    ).then(setMovies);
  }, [items]);

  if (!mounted || items.length === 0) return null;

  const progressMap = Object.fromEntries(
    items.map((item) => [
      item.movieId,
      item.duration > 0 ? item.progress / item.duration : 0,
    ])
  );

  return (
    <MovieRow
      title="Continue Watching"
      movies={movies}
      progressMap={progressMap}
      href="/profile"
      variant={variant}
    />
  );
}
