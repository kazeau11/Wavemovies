import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCatalogueProvider, getTVProvider } from "@/lib/catalogue";
import { getFeaturedWatchProviders } from "@/lib/catalogue/provider-logos";
import { getWatchProviderBySlug } from "@/lib/catalogue/watch-providers";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { ShowGrid } from "@/components/shows/ShowGrid";
import { cn } from "@/lib/utils";

export const revalidate = 300;

interface ProviderPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function ProviderPage({ params, searchParams }: ProviderPageProps) {
  const { slug } = await params;
  const { type = "movies" } = await searchParams;
  const providerInfo = getWatchProviderBySlug(slug);

  if (!providerInfo) {
    notFound();
  }

  const movieProvider = getCatalogueProvider();
  const tvProvider = getTVProvider();
  const allProviders = await getFeaturedWatchProviders().catch(() => []);
  const current = allProviders.find((entry) => entry.slug === slug) ?? providerInfo;
  const isMovies = type !== "series";

  const movieData = isMovies
    ? await movieProvider.getByWatchProvider(providerInfo.id, 1)
    : null;
  const showData = !isMovies
    ? await tvProvider.getByWatchProvider(providerInfo.id, 1)
    : null;

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white/5">
            {current.logoUrl ? (
              <Image
                src={current.logoUrl}
                alt={current.name}
                width={64}
                height={64}
                className="h-12 w-12 object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-white/70">
                {current.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm text-wave-muted">Provider</p>
            <h1 className="text-3xl font-bold text-white">{current.name}</h1>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/provider/${slug}?type=movies`}
            className={cn(
              "rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors",
              isMovies
                ? "bg-wave-accent text-wave-bg"
                : "bg-white/10 text-white hover:bg-white/15"
            )}
          >
            Movies
          </Link>
          <Link
            href={`/provider/${slug}?type=series`}
            className={cn(
              "rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors",
              !isMovies
                ? "bg-wave-accent text-wave-bg"
                : "bg-white/10 text-white hover:bg-white/15"
            )}
          >
            Series
          </Link>
        </div>
      </div>

      {isMovies && movieData ? (
        <MovieGrid
          initialMovies={movieData.results}
          initialPage={movieData.page}
          totalPages={movieData.totalPages}
          fetchUrl={`/api/movies?watchProviderId=${providerInfo.id}`}
        />
      ) : showData ? (
        <ShowGrid
          initialShows={showData.results}
          initialPage={showData.page}
          totalPages={showData.totalPages}
          fetchUrl={`/api/shows?watchProviderId=${providerInfo.id}`}
        />
      ) : null}
    </div>
  );
}
