import Link from "next/link";
import { WaveLogo } from "@/components/ui/WaveLogo";
import { PAGE_X } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-white/5 bg-wave-bg">
      <div className={cn("mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 py-8 sm:flex-row", PAGE_X)}>
        <WaveLogo size="sm" />
        <p className="text-xs text-wave-muted">
          © {new Date().getFullYear()} Wave. Stream beautifully.
        </p>
        <div className="flex gap-5 text-xs text-wave-muted">
          <Link href="/movies" className="transition-colors hover:text-white">
            Movies
          </Link>
          <Link href="/genres" className="transition-colors hover:text-white">
            Genres
          </Link>
        </div>
      </div>
    </footer>
  );
}
