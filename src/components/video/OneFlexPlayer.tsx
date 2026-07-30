"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getOneFlexEmbedUrl } from "@/lib/oneflex";
import { EMBED_IFRAME_PROPS, PlayerShell } from "@/components/video/PlayerShell";

interface OneFlexPlayerProps {
  movieId: string;
  title: string;
  className?: string;
}

export function OneFlexPlayer({ movieId, title, className }: OneFlexPlayerProps) {
  const [embedUrl, setEmbedUrl] = useState("");

  useEffect(() => {
    setEmbedUrl(getOneFlexEmbedUrl(movieId));
  }, [movieId]);

  return (
    <PlayerShell
      className={cn(className)}
      style={{ aspectRatio: "16 / 9", minHeight: "min(72vh, 820px)" }}
    >
      {embedUrl ? (
        <iframe
          key={movieId}
          src={embedUrl}
          title={title}
          {...EMBED_IFRAME_PROPS}
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="flex h-full min-h-[inherit] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-wave-accent border-t-transparent" />
        </div>
      )}
    </PlayerShell>
  );
}
