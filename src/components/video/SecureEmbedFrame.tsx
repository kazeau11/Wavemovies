"use client";

import { useState } from "react";
import { Play, ShieldAlert } from "lucide-react";
import { useEmbedGuard } from "@/lib/hooks/use-embed-guard";
import { cn } from "@/lib/utils";

interface SecureEmbedFrameProps {
  src: string;
  title: string;
  className?: string;
  frameClassName?: string;
}

export function SecureEmbedFrame({
  src,
  title,
  className,
  frameClassName,
}: SecureEmbedFrameProps) {
  const [active, setActive] = useState(false);
  useEmbedGuard(active);

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
              Tap Play below. Only click inside the black player area — close any
              other tabs that open automatically.
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
          <p className="flex items-center gap-1.5 text-xs text-white/40">
            <ShieldAlert className="h-3.5 w-3.5" />
            Free streams may show ads — never download anything from pop-ups
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
          className={cn("absolute inset-0 h-full w-full border-0", frameClassName)}
        />
      )}
    </div>
  );
}
