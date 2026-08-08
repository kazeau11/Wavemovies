import Link from "next/link";
import type { WatchProvider } from "@/lib/catalogue/watch-providers";
import { ProviderLogo } from "@/components/browse/ProviderLogo";
import { PAGE_PL, PAGE_X } from "@/lib/layout";
import { cn } from "@/lib/utils";

interface ProviderBrowseProps {
  providers: WatchProvider[];
  className?: string;
}

export function ProviderBrowse({ providers, className }: ProviderBrowseProps) {
  if (providers.length === 0) return null;

  return (
    <section className={cn("py-2", className)}>
      <div className={cn("mb-3", PAGE_X)}>
        <h2 className="text-base font-bold text-white sm:text-lg">Browse by Provider</h2>
      </div>

      <div
        className={cn(
          "scrollbar-hide flex w-full gap-3 overflow-x-auto pb-1 sm:gap-3.5",
          PAGE_PL,
          "pr-10 sm:pr-12 lg:pr-14",
          "xl:justify-between xl:gap-2"
        )}
      >
        {providers.map((provider) => (
          <Link
            key={provider.id}
            href={`/provider/${provider.slug}`}
            className="group flex w-[58px] shrink-0 flex-col items-center gap-1.5 sm:w-[64px] xl:w-[68px] xl:shrink"
          >
            <div className="aspect-square w-full overflow-hidden rounded-[14px] ring-1 ring-white/[0.08] transition-all group-hover:ring-wave-accent/50 sm:rounded-2xl">
              <ProviderLogo
                name={provider.name}
                logoUrl={provider.logoUrl}
                size="tile"
                fill
                className="rounded-[14px] sm:rounded-2xl"
              />
            </div>
            <span className="line-clamp-2 w-full text-center text-[10px] leading-tight text-white/50 group-hover:text-white/85 sm:text-[11px]">
              {provider.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
