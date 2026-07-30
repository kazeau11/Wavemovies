"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Movie } from "@/lib/catalogue/types";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { OneFlexPlayer } from "@/components/video/OneFlexPlayer";
import { resolvePlaybackSource } from "@/lib/video/player";
import { PAGE_X } from "@/lib/layout";
import { cn } from "@/lib/utils";

export default function WatchPage() {
  const params = useParams<{ id: string }>();
  const movieId = params?.id ?? "";
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!movieId) {
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(`/api/movies/${movieId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json() as Promise<Movie>;
      })
      .then((data) => {
        if (!cancelled) setMovie(data);
      })
      .catch(() => {
        if (!cancelled) {
          setMovie(null);
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  if (!movieId || error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-wave-bg">
        <p className="text-wave-muted">Movie not found</p>
        <Link href="/" className="text-wave-accent hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  if (loading || !movie) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-wave-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-wave-accent border-t-transparent" />
      </div>
    );
  }

  const source = resolvePlaybackSource(movie);
  const useOneFlex = source.type === "embed" && source.label === "1Flex Player";

  return (
    <div className="min-h-screen bg-wave-bg pb-12">
      <div className={cn("mx-auto max-w-[1400px] py-6", PAGE_X)}>
        <Link
          href={`/movie/${movieId}`}
          className="mb-5 inline-flex items-center gap-2 text-sm text-wave-muted transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {movie.title}
        </Link>

        <h1 className="mb-5 text-2xl font-bold text-white sm:text-3xl">{movie.title}</h1>

        {useOneFlex ? (
          <OneFlexPlayer movieId={movie.id} title={movie.title} />
        ) : (
          <VideoPlayer
            source={source}
            title={movie.title}
            posterUrl={movie.backdropUrl || movie.posterUrl}
            className="min-h-[min(72vh,820px)]"
          />
        )}
      </div>
    </div>
  );
}
