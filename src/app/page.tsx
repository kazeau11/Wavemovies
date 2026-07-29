import { getCatalogueProvider, getTVProvider, swapCatalogueMovies } from "@/lib/catalogue";
import { TV_CLASSIC_IDS } from "@/lib/catalogue/tv-classics";
import { HeroSection } from "@/components/movies/HeroSection";
import { MovieRow } from "@/components/movies/MovieRow";
import { ShowRow } from "@/components/shows/ShowRow";
import { ContinueWatchingSection } from "@/components/movies/ContinueWatchingSection";
import { PAGE_PL } from "@/lib/layout";
import { cn } from "@/lib/utils";

export const revalidate = 300;

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const provider = getCatalogueProvider();
  const tvProvider = getTVProvider();

  const [trending, popular, recentlyAdded, topRated, tvClassics] = await Promise.all([
    safeFetch(() => provider.getTrending(1), { results: [], page: 1, totalPages: 0, totalResults: 0 }),
    safeFetch(() => provider.getPopular(1), { results: [], page: 1, totalPages: 0, totalResults: 0 }),
    safeFetch(() => provider.getRecentlyAdded(1), { results: [], page: 1, totalPages: 0, totalResults: 0 }),
    safeFetch(() => provider.getTopRated(1), { results: [], page: 1, totalPages: 0, totalResults: 0 }),
    safeFetch(() => tvProvider.getShowsByIds([...TV_CLASSIC_IDS]), []),
  ]);

  const swap = (movies: typeof trending.results) =>
    safeFetch(() => swapCatalogueMovies(movies, (id) => provider.getMovie(id)), movies);

  const heroMovies = (await swap(trending.results.slice(0, 5))).slice(0, 5);
  const trendingMovies = await swap(trending.results);
  const popularMovies = await swap(popular.results);
  const recentlyAddedMovies = await swap(recentlyAdded.results);
  const topRatedMovies = await swap(topRated.results);

  return (
    <div className="bg-wave-bg pb-16">
      {heroMovies.length > 0 ? (
        <HeroSection movies={heroMovies} />
      ) : (
        <section className={cn("relative flex h-[88vh] min-h-[560px] items-end bg-wave-surface pb-20", PAGE_PL)}>
          <div className="absolute inset-0 hero-gradient" />
          <div className="relative max-w-xl text-left">
            <span className="inline-block rounded bg-wave-accent/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-wave-bg">
              Wave
            </span>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Welcome to Wave</h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/60">
              Loading movies from the 1Flex catalogue. If this persists, check your network connection.
            </p>
          </div>
        </section>
      )}

      <div className="-mt-6 space-y-8 sm:-mt-8 sm:space-y-10">
        <ContinueWatchingSection variant="poster" />

        <MovieRow
          title="Trending Movies"
          movies={trendingMovies}
          href="/movies?section=trending"
          variant="poster"
        />

        {tvClassics.length > 0 && (
          <ShowRow
            title="Binge Classics"
            shows={tvClassics}
            href="/tv-shows"
            variant="poster"
          />
        )}

        <MovieRow
          title="Popular Movies"          movies={popularMovies}
          href="/movies?section=popular"
          variant="poster"
        />
        <MovieRow
          title="Top Rated"
          movies={topRatedMovies}
          href="/movies?section=top-rated"
          variant="poster"
        />
        <MovieRow
          title="Recently Added"
          movies={recentlyAddedMovies}
          href="/movies?section=recently-added"
          variant="poster"
        />
      </div>
    </div>
  );
}
