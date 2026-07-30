"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getOneFlexEmbedUrl } from "@/lib/oneflex";
import { SecureEmbedFrame } from "./SecureEmbedFrame";

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

  return <SecureEmbedFrame src={embedUrl} title={title} className={className} />;
}
