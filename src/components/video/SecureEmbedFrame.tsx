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
  const [active, setActive] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-black shadow-2xl shadow-black/60 ring-1 ring-white/10",
        className
      )}
      style={{ aspectRatio: "16 / 9", minHeight: "min(72vh, 820px)" }}
    >
      {!active ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-wave-surface to-black px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-wave-accent/15 ring-1 ring-wave-accent/30">
            <Play className="h-8 w-8 fill-wave-accent text-wave-accent" />
          </div>
          <div className="max-w-md space-y-2">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-sm text-white/55">
              Tap Play to start. If you see a 404 or sandbox error, pick another{" "}
              <strong className="text-white/70">Stream host</strong> below and try again.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActive(true)}
            className="inline-flex items-center gap-2.5 rounded-lg bg-wave-accent px-8 py-3 text-sm font-semibold text-wave-bg transition-colors hover:bg-cyan-300"
          >
            <Play className="h-5 w-5 fill-wave-bg text-wave-bg" />
            Play
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-wave-muted transition-colors hover:text-wave-accent"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open stream in new tab instead
          </a>
          <p className="flex items-center gap-1.5 text-xs text-white/40">
            <ShieldAlert className="h-3.5 w-3.5" />
            Close any pop-up tabs — never download from ads
          </p>
        </div>
      ) : (
        <iframe
          key={src}
          src={src}
          title={title}
          referrerPolicy="no-referrer"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      )}
    </div>
  );
}
