import { cn } from "@/lib/utils";

/** Blocks popups and top-navigation from third-party embeds while keeping playback. */
export const EMBED_IFRAME_SANDBOX =
  "allow-scripts allow-same-origin allow-presentation";

interface EmbedFrameProps {
  src: string;
  title: string;
  className?: string;
}

export function EmbedFrame({ src, title, className }: EmbedFrameProps) {
  return (
    <iframe
      src={src}
      title={title}
      sandbox={EMBED_IFRAME_SANDBOX}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      referrerPolicy="no-referrer"
      allowFullScreen
      className={cn("absolute inset-0 h-full w-full border-0", className)}
    />
  );
}
