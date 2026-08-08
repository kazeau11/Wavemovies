import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WaveLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  href?: string;
}

const sizes = {
  sm: { icon: 28, text: "text-base" },
  md: { icon: 34, text: "text-xl" },
  lg: { icon: 44, text: "text-2xl" },
};

export function WaveLogo({ size = "md", showText = true, className, href = "/" }: WaveLogoProps) {
  const { icon, text } = sizes[size];

  const content = (
    <div className={cn("flex items-center gap-2", className)} suppressHydrationWarning>
      <Image
        src="/wave-logo.png"
        alt="Cinejoy"
        width={icon}
        height={icon}
        className="object-contain"
        priority
      />
      {showText && (
        <span className={cn("font-bold tracking-tight text-wave-accent", text)}>Cinejoy</span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-85">
        {content}
      </Link>
    );
  }

  return content;
}
