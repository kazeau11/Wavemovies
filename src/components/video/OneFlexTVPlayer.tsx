"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getOneFlexTVEmbedUrl } from "@/lib/oneflex";
import { SecureEmbedFrame } from "./SecureEmbedFrame";
import { EmbedServerPicker } from "./EmbedServerPicker";

const DEFAULT_SERVER =
  process.env.NEXT_PUBLIC_ONEFLEX_EMBED_SERVER ??
  process.env.ONEFLEX_EMBED_SERVER ??
  "MAIN_3";

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
  const [serverId, setServerId] = useState(DEFAULT_SERVER);
  const [embedUrl, setEmbedUrl] = useState("");

  useEffect(() => {
    setEmbedUrl(getOneFlexTVEmbedUrl(showId, season, episode, serverId));
  }, [showId, season, episode, serverId]);

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
      <SecureEmbedFrame
        key={`${showId}-${season}-${episode}-${serverId}`}
        src={embedUrl}
        title={title}
        className={className}
      />
      <EmbedServerPicker value={serverId} onChange={setServerId} />
    </div>
  );
}
