import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProviderLogoProps {
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { box: "h-5 w-5", img: 20 },
  md: { box: "h-10 w-10", img: 40 },
  lg: { box: "h-14 w-14", img: 56 },
};

export function ProviderLogo({ name, logoUrl, size = "md", className }: ProviderLogoProps) {
  const { box, img } = sizeMap[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/50",
        box,
        className
      )}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={name}
          width={img}
          height={img}
          className="h-[85%] w-[85%] object-contain"
        />
      ) : (
        <span className="text-[10px] font-bold uppercase text-white/70">{name.slice(0, 2)}</span>
      )}
    </div>
  );
}
