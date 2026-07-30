"use client";

import { useState } from "react";
import { ExternalLink, Play, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecureEmbedFrameProps {
  src: string;
  title: string;
  className?: string;
}

export function SecureEmbedFrame({ src, title, className }: SecureEmbedFrameProps) {
  const [opened, setOpened] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const openStream = (sameTab = false) => {
    if (sameTab) {
      window.location.href = src;
      return;
    }

    const popup = window.open(src, "_blank", "noopener,noreferrer");
    if (!popup) {
      setBlocked(true);
      return;
    }
    setBlocked(false);
    setOpened(true);
  };

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-wave-surface to-black px-6 py-12 text-center shadow-2xl shadow-black/60 ring-1 ring-white/10",
        className
      )}
      style={{ aspectRatio: "16 / 9", minHeight: "min(72vh, 820px)" }}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-wave-accent/15 ring-1 ring-wave-accent/30">
        <Play className="h-8 w-8 fill-wave-accent text-wave-accent" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-white">{title}</h2>

      <p className="mt-2 max-w-md text-sm text-white/55">
        Streams open in a new tab so the player works correctly and Wave stays safe.
        Close any pop-up ads in that tab — never download anything.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => openStream(false)}
          className="inline-flex items-center gap-2.5 rounded-lg bg-wave-accent px-8 py-3 text-sm font-semibold text-wave-bg transition-colors hover:bg-cyan-300"
        >
          <Play className="h-5 w-5 fill-wave-bg text-wave-bg" />
          Play in new tab
        </button>
        <button
          type="button"
          onClick={() => openStream(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          <ExternalLink className="h-4 w-4" />
          Play here
        </button>
      </div>

      {opened && !blocked && (
        <p className="mt-4 text-sm text-wave-accent">
          Stream tab opened — switch to it to watch.
        </p>
      )}

      {blocked && (
        <p className="mt-4 max-w-sm text-sm text-amber-400">
          Pop-up blocked. Click &quot;Play here&quot; or allow pop-ups for this site.
        </p>
      )}

      <p className="mt-6 flex items-center gap-1.5 text-xs text-white/40">
        <ShieldAlert className="h-3.5 w-3.5" />
        Use Stream host below if one source has too many ads
      </p>
    </div>
  );
}
