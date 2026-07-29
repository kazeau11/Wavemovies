"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Season } from "@/lib/catalogue/types";
import { WaveImage } from "@/components/ui/WaveImage";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface EpisodeListProps {
  showId: string;
  numberOfSeasons: number;
}

export function EpisodeList({ showId, numberOfSeasons }: EpisodeListProps) {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [season, setSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState(true);

  const seasons = Array.from(
    { length: Math.max(numberOfSeasons, 1) },
    (_, i) => i + 1
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/shows/${showId}/season/${selectedSeason}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json() as Promise<Season>;
      })
      .then((data) => {
        if (!cancelled) setSeason(data);
      })
      .catch(() => {
        if (!cancelled) setSeason(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [showId, selectedSeason]);

  return (
    <div className="space-y-4">
      {seasons.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {seasons.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSeason(s)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                selectedSeason === s
                  ? "bg-wave-accent text-wave-bg"
                  : "bg-white/10 text-white/80 hover:bg-white/15"
              )}
            >
              Season {s}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-wave-accent border-t-transparent" />
        </div>
      ) : season && season.episodes.length > 0 ? (
        <div className="space-y-2">
          {season.episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/watch/show/${showId}?s=${ep.seasonNumber}&e=${ep.episodeNumber}`}
              className="group flex items-center gap-4 rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
            >
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md bg-black/40">
                {ep.stillUrl ? (
                  <WaveImage
                    src={ep.stillUrl}
                    alt={ep.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Play className="h-5 w-5 text-white/40" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Play className="h-6 w-6 fill-white text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-wave-muted">
                  E{ep.episodeNumber}
                  {ep.airDate && ` · ${new Date(ep.airDate).toLocaleDateString()}`}
                </p>
                <h3 className="line-clamp-1 font-medium text-white group-hover:text-wave-accent">
                  {ep.title}
                </h3>
                {ep.overview && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-white/50">{ep.overview}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-wave-muted">No episodes available for this season.</p>
      )}
    </div>
  );
}
