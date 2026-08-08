"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { WatchProvider } from "@/lib/catalogue/watch-providers";
import { cn } from "@/lib/utils";

interface ProviderFilterProps {
  providers: WatchProvider[];
  basePath?: string;
}

export function ProviderFilter({ providers, basePath = "/movies" }: ProviderFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("watchProviderId");
  const path = basePath || pathname;

  const buildHref = (watchProviderId?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (watchProviderId) {
      params.set("watchProviderId", watchProviderId);
    } else {
      params.delete("watchProviderId");
    }
    params.delete("page");
    const query = params.toString();
    return query ? `${path}?${query}` : path;
  };

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link
        href={buildHref()}
        className={cn(
          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          !activeId
            ? "border-wave-accent bg-wave-accent/15 text-wave-accent"
            : "border-white/10 text-white/70 hover:border-white/20 hover:text-white"
        )}
      >
        All Providers
      </Link>
      {providers.slice(0, 8).map((provider) => (
        <Link
          key={provider.id}
          href={buildHref(provider.id)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            activeId === provider.id
              ? "border-wave-accent bg-wave-accent/15 text-wave-accent"
              : "border-white/10 text-white/70 hover:border-white/20 hover:text-white"
          )}
        >
          {provider.name}
        </Link>
      ))}
      <Link
        href="/provider/netflix"
        className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
      >
        More providers →
      </Link>
    </div>
  );
}
