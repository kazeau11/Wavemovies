"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getOneFlexEmbedUrl } from "@/lib/oneflex";
import { SecureEmbedFrame } from "./SecureEmbedFrame";
import { EmbedServerPicker } from "./EmbedServerPicker";

const DEFAULT_SERVER =
  process.env.NEXT_PUBLIC_ONEFLEX_EMBED_SERVER ??
  process.env.ONEFLEX_EMBED_SERVER ??
  "MAIN_2";

interface OneFlexPlayerProps {
  movieId: string;
  title: string;
  className?: string;
}

export function OneFlexPlayer({ movieId, title, className }: OneFlexPlayerProps) {
  const [serverId, setServerId] = useState(DEFAULT_SERVER);
  const [embedUrl, setEmbedUrl] = useState("");

  useEffect(() => {
    setEmbedUrl(getOneFlexEmbedUrl(movieId, serverId));
  }, [movieId, serverId]);

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
    <div>
      <SecureEmbedFrame key={`${movieId}-${serverId}`} src={embedUrl} title={title} className={className} />
      <EmbedServerPicker value={serverId} onChange={setServerId} />
    </div>
  );
}
