"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { WatchProvider } from "@/lib/catalogue/watch-providers";
import { ProviderLogo } from "@/components/browse/ProviderLogo";
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

  const pillClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "border-wave-accent bg-wave-accent/15 text-wave-accent"
        : "border-white/10 text-white/70 hover:border-white/20 hover:text-white"
    );

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link href={buildHref()} className={pillClass(!activeId)}>
        All Providers
      </Link>
      {providers.slice(0, 8).map((provider) => (
        <Link
          key={provider.id}
          href={buildHref(provider.id)}
          className={pillClass(activeId === provider.id)}
        >
          <ProviderLogo name={provider.name} logoUrl={provider.logoUrl} size="sm" />
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
