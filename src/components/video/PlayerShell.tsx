"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerShellProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function PlayerShell({ children, className, style }: PlayerShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    const element = containerRef.current;
    if (!element) return;

    try {
      if (document.fullscreenElement === element) {
        await document.exitFullscreen();
      } else {
        await element.requestFullscreen();
      }
    } catch {
      /* Browser blocked fullscreen */
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "group/player relative w-full overflow-hidden rounded-xl bg-black shadow-2xl shadow-black/60 ring-1 ring-white/10",
        isFullscreen && "!rounded-none !ring-0",
        className
      )}
      style={
        isFullscreen
          ? { aspectRatio: "unset", minHeight: "100vh", width: "100%", ...style }
          : style
      }
    >
      {children}
      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute right-3 top-3 z-20 rounded-lg bg-black/75 p-2.5 text-white opacity-100 transition-colors hover:bg-black/90 sm:opacity-0 sm:group-hover/player:opacity-100 sm:focus:opacity-100"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
      </button>
    </div>
  );
}

export const EMBED_IFRAME_PROPS = {
  allow:
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
  allowFullScreen: true,
} as const;
