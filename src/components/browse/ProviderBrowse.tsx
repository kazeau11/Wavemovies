import Link from "next/link";
import type { WatchProvider } from "@/lib/catalogue/watch-providers";
import { ProviderLogo } from "@/components/browse/ProviderLogo";
import { PAGE_X } from "@/lib/layout";
import { cn } from "@/lib/utils";

interface ProviderBrowseProps {
  providers: WatchProvider[];
  className?: string;
}

export function ProviderBrowse({ providers, className }: ProviderBrowseProps) {
  if (providers.length === 0) return null;

  return (
    <section className={cn("py-6", className)}>
      <div className={PAGE_X}>
        <h2 className="mb-5 text-xl font-bold text-white sm:text-2xl">Browse by Provider</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {providers.map((provider) => (
            <Link
              key={provider.id}
              href={`/provider/${provider.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all hover:border-wave-accent/40 hover:bg-white/[0.08]"
            >
              <ProviderLogo name={provider.name} logoUrl={provider.logoUrl} size="lg" />
              <span className="line-clamp-2 text-center text-xs font-medium text-white/80 group-hover:text-white">
                {provider.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
