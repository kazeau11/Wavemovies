import Link from "next/link";
import type { WatchProvider } from "@/lib/catalogue/watch-providers";
import { ProviderLogo } from "@/components/browse/ProviderLogo";
import { PAGE_X } from "@/lib/layout";
import { cn } from "@/lib/utils";

interface ProviderBrowseProps {
  providers: WatchProvider[];
  className?: string;
  compact?: boolean;
  embedded?: boolean;
}

export function ProviderBrowse({
  providers,
  className,
  compact = false,
  embedded = false,
}: ProviderBrowseProps) {
  if (providers.length === 0) return null;

  return (
    <section className={cn(compact ? "pb-1" : "py-6", className)}>
      <div className={cn(embedded ? "pr-10 sm:pr-12 lg:pr-14" : PAGE_X)}>
        <h2
          className={cn(
            "font-bold text-white",
            compact ? "mb-3 text-base sm:text-lg" : "mb-4 text-lg sm:text-xl"
          )}
        >
          Browse by Provider
        </h2>
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1 sm:gap-3.5">
          {providers.map((provider) => (
            <Link
              key={provider.id}
              href={`/provider/${provider.slug}`}
              className="group flex w-[58px] shrink-0 flex-col items-center gap-1.5 sm:w-[64px]"
            >
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[14px] bg-[#141414] p-1.5 ring-1 ring-white/[0.08] transition-all group-hover:ring-wave-accent/40 sm:rounded-2xl sm:p-2">
                <ProviderLogo
                  name={provider.name}
                  logoUrl={provider.logoUrl}
                  size="tile"
                  className="bg-transparent"
                />
              </div>
              <span className="line-clamp-2 w-full text-center text-[10px] leading-tight text-white/50 group-hover:text-white/85 sm:text-[11px]">
                {provider.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
