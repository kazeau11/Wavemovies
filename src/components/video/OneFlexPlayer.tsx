"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getOneFlexEmbedUrl } from "@/lib/oneflex";
import { EmbedFrame } from "@/components/video/EmbedFrame";

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
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-black shadow-2xl shadow-black/60 ring-1 ring-white/10",
        className
      )}
      style={{ aspectRatio: "16 / 9", minHeight: "min(72vh, 820px)" }}
    >
      {embedUrl ? (
        <EmbedFrame key={movieId} src={embedUrl} title={title} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-wave-accent border-t-transparent" />
        </div>
      )}
    </div>
  );
}
