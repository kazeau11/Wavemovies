"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getOneFlexTVEmbedUrl } from "@/lib/oneflex";
import { EMBED_IFRAME_PROPS, PlayerShell } from "@/components/video/PlayerShell";

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

  if (!embedUrl) {
    return (
      <div
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-black",
          className
        )}
        style={{ aspectRatio: "16 / 9", minHeight: "min(72vh, 820px)" }}
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-wave-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <PlayerShell
      className={cn(className)}
      style={{ aspectRatio: "16 / 9", minHeight: "min(72vh, 820px)" }}
    >
      <iframe
        key={`${showId}-${season}-${episode}`}
        src={embedUrl}
        title={title}
        {...EMBED_IFRAME_PROPS}
        className="absolute inset-0 h-full w-full border-0"
      />
    </PlayerShell>
  );
}
