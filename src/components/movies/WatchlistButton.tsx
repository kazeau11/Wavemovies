"use client";

import { Plus, Check } from "lucide-react";
import type { Movie } from "@/lib/catalogue/types";
import { useProfiles } from "@/lib/storage/profiles";
import { useWatchlist } from "@/lib/storage/watchlist";
import { useHasMounted } from "@/lib/hooks/use-has-mounted";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  movie: Movie;
}

export function WatchlistButton({ movie }: WatchlistButtonProps) {
  const mounted = useHasMounted();
  const profileId = useProfiles((state) => state.activeProfileId);
  const { isInWatchlist, toggleItem } = useWatchlist();
  const inList = mounted && profileId && isInWatchlist(movie.id);

  return (
    <button
      type="button"
      onClick={() =>
        toggleItem({
          movieId: movie.id,
          title: movie.title,
          posterUrl: movie.posterUrl,
          backdropUrl: movie.backdropUrl,
          releaseYear: movie.releaseYear,
          rating: movie.rating,
        })
      }
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg border px-7 py-3 text-sm font-semibold transition-all",
        inList
          ? "border-wave-accent/40 bg-wave-accent/10 text-wave-accent"
          : "border-white/15 bg-white/10 text-white backdrop-blur-md hover:bg-white/15"
      )}
    >
      {inList ? (
        <>
          <Check className="h-5 w-5" />
          In Watchlist
        </>
      ) : (
        <>
          <Plus className="h-5 w-5" />
          Add to Watchlist
        </>
      )}
    </button>
  );
}
