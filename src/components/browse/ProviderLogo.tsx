"use client";

import { cn } from "@/lib/utils";

interface ProviderLogoProps {
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg" | "tile";
  className?: string;
}

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  tile: "h-full w-full",
};

export function ProviderLogo({ name, logoUrl, size = "md", className }: ProviderLogoProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden",
        sizeMap[size],
        className
      )}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={name}
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="text-[10px] font-bold uppercase text-white/70">{name.slice(0, 2)}</span>
      )}
    </div>
  );
}
