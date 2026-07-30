"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Plus, Check } from "lucide-react";
import type { Movie } from "@/lib/catalogue/types";
import { useProfiles } from "@/lib/storage/profiles";
import { useWatchlist } from "@/lib/storage/watchlist";
import { useHasMounted } from "@/lib/hooks/use-has-mounted";
import { WaveImage } from "@/components/ui/WaveImage";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  showProgress?: number;
  className?: string;
  variant?: "poster" | "landscape";
}

export function MovieCard({
  movie,
  index = 0,
  showProgress,
  className,
  variant = "poster",
}: MovieCardProps) {
  const mounted = useHasMounted();
  const profileId = useProfiles((state) => state.activeProfileId);
  const { isInWatchlist, toggleItem } = useWatchlist();
  const inList = mounted && profileId && isInWatchlist(movie.id);
  const isLandscape = variant === "landscape";

  const imageSrc = isLandscape
    ? movie.backdropUrl || movie.posterUrl || "/placeholder-poster.svg"
    : movie.posterUrl || "/placeholder-poster.svg";

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={cn("group relative shrink-0", className)}
      suppressHydrationWarning
    >
      <Link href={`/movie/${movie.id}`} className="block">
        <div
          className={cn(
            "relative overflow-hidden bg-wave-card transition-all duration-300",
            isLandscape
              ? "aspect-[16/9] rounded-lg shadow-md group-hover:shadow-lg group-hover:shadow-black/40"
              : "aspect-[2/3] rounded-xl shadow-lg group-hover:shadow-xl group-hover:shadow-black/30"
          )}
        >
          <WaveImage
            src={imageSrc}
            alt={movie.title}
            fill
            ultraHd={isLandscape}
            quality={85}
            sizes={
              isLandscape
                ? "(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 420px"
                : "(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          {!isLandscape && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          )}

          {isLandscape && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent px-3 pb-2.5 pt-10 text-left">
              <h3 className="line-clamp-1 text-sm font-semibold text-white">{movie.title}</h3>
              <p className="mt-0.5 text-xs text-white/65">
                {movie.releaseYear > 0 ? movie.releaseYear : "—"}
                {movie.genres.length > 0 && ` · ${movie.genres[0].name}`}
              </p>
            </div>
          )}

          {showProgress !== undefined && showProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-wave-accent"
                style={{ width: `${Math.min(showProgress * 100, 100)}%` }}
              />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
              <Play className="h-5 w-5 fill-white text-white" />
            </div>
          </div>
        </div>

        {!isLandscape && (
          <div className="mt-2.5 space-y-0.5">
            <h3 className="line-clamp-1 text-sm font-medium text-white/90 transition-colors group-hover:text-wave-accent">
              {movie.title}
            </h3>
            <p className="text-xs text-wave-muted">
              {movie.releaseYear > 0 ? movie.releaseYear : "—"}
              {movie.genres.length > 0 && ` · ${movie.genres[0].name}`}
            </p>
          </div>
        )}
      </Link>

      {!isLandscape && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleItem({
              movieId: movie.id,
              title: movie.title,
              posterUrl: movie.posterUrl,
              backdropUrl: movie.backdropUrl,
              releaseYear: movie.releaseYear,
              rating: movie.rating,
            });
          }}
          className={cn(
            "absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200",
            inList
              ? "bg-wave-accent text-wave-bg"
              : "bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-black/80"
          )}
          aria-label={inList ? "Remove from watchlist" : "Add to watchlist"}
        >
          {inList ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </button>
      )}
    </motion.div>
  );
}
