"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { isExternalImage } from "@/lib/images";

interface WaveImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  /** Load full-resolution source without Next.js compression (best for 4K hero) */
  ultraHd?: boolean;
}

export function WaveImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  quality = 90,
  ultraHd = false,
}: WaveImageProps) {
  const [error, setError] = useState(false);
  const imageSrc = error ? "/placeholder-poster.svg" : src;

  const useNative = ultraHd || isExternalImage(imageSrc);

  if (useNative && fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setError(true)}
      />
    );
  }

  if (useNative) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={quality}
      onError={() => setError(true)}
    />
  );
}
