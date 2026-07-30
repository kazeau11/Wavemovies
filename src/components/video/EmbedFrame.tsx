import { cn } from "@/lib/utils";

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
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      referrerPolicy="no-referrer"
      allowFullScreen
      className={cn("absolute inset-0 h-full w-full border-0", className)}
    />
  );
}
