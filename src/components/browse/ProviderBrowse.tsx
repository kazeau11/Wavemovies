import Link from "next/link";
import type { WatchProvider } from "@/lib/catalogue/watch-providers";
import { ProviderLogo } from "@/components/browse/ProviderLogo";
import { PAGE_X } from "@/lib/layout";
import { cn } from "@/lib/utils";

interface ProviderBrowseProps {
  providers: WatchProvider[];
  className?: string;
  overlay?: boolean;
}

export function ProviderBrowse({ providers, className, overlay = false }: ProviderBrowseProps) {
  if (providers.length === 0) return null;

  return (
    <section
      className={cn(
        overlay ? "relative z-20 -mt-24 pb-2 sm:-mt-28" : "py-6",
        className
      )}
    >
      <div className={PAGE_X}>
        <h2 className="mb-4 text-lg font-bold text-white sm:text-xl">Browse by Provider</h2>
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2 sm:gap-5">
          {providers.map((provider) => (
            <Link
              key={provider.id}
              href={`/provider/${provider.slug}`}
              className="group flex w-[72px] shrink-0 flex-col items-center gap-2 sm:w-[80px]"
            >
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-black/60 p-2 ring-1 ring-white/10 transition-all group-hover:ring-wave-accent/50 sm:rounded-[18px] sm:p-2.5">
                <ProviderLogo
                  name={provider.name}
                  logoUrl={provider.logoUrl}
                  size="tile"
                  className="bg-transparent"
                />
              </div>
              <span className="line-clamp-2 w-full text-center text-[11px] leading-tight text-white/55 group-hover:text-white/90 sm:text-xs">
                {provider.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
