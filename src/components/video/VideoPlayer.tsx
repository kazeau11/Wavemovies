"use client";

import { useEffect, useRef, useState } from "react";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { PlaybackSource } from "@/lib/video/player";
import { cn } from "@/lib/utils";
import { EMBED_IFRAME_PROPS, PlayerShell } from "@/components/video/PlayerShell";

interface VideoPlayerProps {
  source: PlaybackSource;
  title: string;
  posterUrl?: string;
  onProgress?: (currentTime: number, duration: number) => void;
  className?: string;
}

export function VideoPlayer({
  source,
  title,
  posterUrl,
  onProgress,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHideTimer = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    const timer = hideControlsTimer.current;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (source.type === "embed") {
    return (
      <PlayerShell
        className={cn("aspect-video w-full", className)}
        style={{ minHeight: "min(72vh, 820px)" }}
      >
        <iframe
          src={source.url}
          title={title}
          {...EMBED_IFRAME_PROPS}
          className="absolute inset-0 h-full w-full border-0"
        />
      </PlayerShell>
    );
  }

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      await container.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = Number(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-2xl bg-black",
        className
      )}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={source.url}
        poster={posterUrl}
        className="h-full w-full object-contain"
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (video) setDuration(video.duration);
        }}
        onTimeUpdate={() => {
          const video = videoRef.current;
          if (video) {
            setCurrentTime(video.currentTime);
            onProgress?.(video.currentTime, video.duration);
          }
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={togglePlay}
      />

      {source.type === "demo" && (
        <div className="absolute left-4 top-4 rounded-lg bg-black/70 px-3 py-1.5 text-xs text-wave-muted backdrop-blur-sm">
          Demo preview — public domain sample
        </div>
      )}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-12 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="mb-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-wave-accent"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <span className="text-xs text-wave-muted">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-wave-muted sm:inline">{title}</span>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
              aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
