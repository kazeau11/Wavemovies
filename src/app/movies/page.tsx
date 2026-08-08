import { Suspense } from "react";
import { getCatalogueProvider } from "@/lib/catalogue";
import { getFeaturedWatchProviders } from "@/lib/catalogue/provider-logos";
import { MovieGrid } from "@/components/movies/MovieGrid";
import { ProviderFilter } from "@/components/browse/ProviderFilter";

export const revalidate = 300;

interface MoviesPageProps {
  searchParams: Promise<{ section?: string; genreId?: string; watchProviderId?: string }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams;
  const section = params.section ?? "popular";
  const provider = getCatalogueProvider();
  const watchProviders = await getFeaturedWatchProviders().catch(() => []);

  let data;
  let title = "Movies";
  let fetchUrl = `/api/movies?section=${section}`;

  if (params.watchProviderId) {
    data = await provider.getByWatchProvider(params.watchProviderId, 1);
    const providerName =
      watchProviders.find((entry) => entry.id === params.watchProviderId)?.name ?? "Provider";
    title = `Movies on ${providerName}`;
    fetchUrl = `/api/movies?watchProviderId=${params.watchProviderId}`;
  } else if (params.genreId) {
    data = await provider.getByGenre(params.genreId, 1);
    title = "Movies by Genre";
    fetchUrl = `/api/movies?genreId=${params.genreId}`;
  } else {
    switch (section) {
      case "trending":
        data = await provider.getTrending(1);
        title = "Trending Movies";
        break;
      case "recently-added":
        data = await provider.getRecentlyAdded(1);
        title = "Recently Added";
        break;
      case "top-rated":
        data = await provider.getTopRated(1);
        title = "Top Rated";
        break;
      default:
        data = await provider.getPopular(1);
        title = "Popular Movies";
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="mt-1 text-sm text-wave-muted">Discover new movies to watch</p>
      </div>

      <Suspense fallback={null}>
        <ProviderFilter providers={watchProviders} />
      </Suspense>

      <MovieGrid
        initialMovies={data.results}
        initialPage={data.page}
        totalPages={data.totalPages}
        fetchUrl={fetchUrl}
      />
    </div>
  );
}
