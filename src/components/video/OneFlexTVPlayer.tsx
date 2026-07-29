"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getOneFlexTVEmbedUrl } from "@/lib/oneflex";

interface OneFlexTVPlayerProps {
  showId: string;
  season: number;
  episode: number;
  title: string;
  className?: string;
}

export function OneFlexTVPlayer({
  showId,
  season,
  episode,
  title,
  className,
}: OneFlexTVPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState("");

  useEffect(() => {
    setEmbedUrl(getOneFlexTVEmbedUrl(showId, season, episode));
  }, [showId, season, episode]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-black shadow-2xl shadow-black/60 ring-1 ring-white/10",
        className
      )}
      style={{ aspectRatio: "16 / 9", minHeight: "min(72vh, 820px)" }}
    >
      {embedUrl ? (
        <iframe
          key={`${showId}-${season}-${episode}`}
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-wave-accent border-t-transparent" />
        </div>
      )}
    </div>
  );
}
