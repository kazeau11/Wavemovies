"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCinematic =
    pathname === "/" ||
    pathname.startsWith("/movie/") ||
    pathname.startsWith("/show/") ||
    pathname.startsWith("/watch/") ||
    pathname === "/tv-shows";

  return (
    <main className={cn("min-h-screen bg-wave-bg", !isCinematic && "pt-[72px]")}>
      {children}
    </main>
  );
}
