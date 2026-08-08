import { Suspense } from "react";
import Link from "next/link";
import { getTVProvider } from "@/lib/catalogue";
import { getFeaturedWatchProviders } from "@/lib/catalogue/provider-logos";
import { TV_GENRE_ROWS } from "@/lib/catalogue/tv-genres";
import { TV_CLASSIC_IDS } from "@/lib/catalogue/tv-classics";
import { ShowRow } from "@/components/shows/ShowRow";
import { ShowGrid } from "@/components/shows/ShowGrid";
import { ProviderFilter } from "@/components/browse/ProviderFilter";
import { SearchBar } from "@/components/ui/SearchBar";
import { WaveImage } from "@/components/ui/WaveImage";
import { Play } from "lucide-react";
import { PAGE_PL, PAGE_X } from "@/lib/layout";
import { cn } from "@/lib/utils";
export const revalidate = 300;

interface TVShowsPageProps {
  searchParams: Promise<{ section?: string; genreId?: string; watchProviderId?: string }>;
}

const empty = { results: [], page: 1, totalPages: 0, totalResults: 0 };

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function TVShowsPage({ searchParams }: TVShowsPageProps) {
  const params = await searchParams;
  const provider = getTVProvider();
  const watchProviders = await getFeaturedWatchProviders().catch(() => []);

  if (params.section || params.genreId || params.watchProviderId) {
    let data;
    let title = "All Shows";
    let fetchUrl = `/api/shows?section=${params.section ?? "popular"}`;

    if (params.watchProviderId) {
      data = await safeFetch(() => provider.getByWatchProvider(params.watchProviderId!, 1), empty);
      const providerName =
        watchProviders.find((entry) => entry.id === params.watchProviderId)?.name ?? "Provider";
      title = `Series on ${providerName}`;
      fetchUrl = `/api/shows?watchProviderId=${params.watchProviderId}`;
    } else if (params.genreId) {
      const genre = TV_GENRE_ROWS.find((g) => g.id === params.genreId);
      data = await safeFetch(() => provider.getByGenre(params.genreId!, 1), empty);
      title = genre ? `${genre.name} Series` : "TV Shows by Genre";
      fetchUrl = `/api/shows?genreId=${params.genreId}`;
    } else {
      switch (params.section) {
        case "trending":
          data = await safeFetch(() => provider.getTrending(1), empty);
          title = "Trending TV Shows";
          break;
        case "top-rated":
          data = await safeFetch(() => provider.getTopRated(1), empty);
          title = "Top Rated TV Shows";
          break;
        case "airing-today":
          data = await safeFetch(() => provider.getAiringToday(1), empty);
          title = "Airing Today";
          break;
        case "on-the-air":
          data = await safeFetch(() => provider.getOnTheAir(1), empty);
          title = "Currently On The Air";
          break;
        default:
          data = await safeFetch(() => provider.getPopular(1), empty);
          title = "Popular TV Shows";
      }
    }

    return (
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="mt-1 text-sm text-wave-muted">Discover new series to watch</p>
        </div>

        <Suspense fallback={null}>
          <ProviderFilter providers={watchProviders} basePath="/tv-shows" />
        </Suspense>

        <ShowGrid
          initialShows={data.results}
          initialPage={data.page}
          totalPages={data.totalPages}
          fetchUrl={fetchUrl}
        />
      </div>
    );
  }

  const [trending, popular, topRated, airingToday, onTheAir, breakingBad, classics, ...genreResults] =
    await Promise.all([
      safeFetch(() => provider.getTrending(1), empty),
      safeFetch(() => provider.getPopular(1), empty),
      safeFetch(() => provider.getTopRated(1), empty),
      safeFetch(() => provider.getAiringToday(1), empty),
      safeFetch(() => provider.getOnTheAir(1), empty),
      safeFetch(() => provider.getShow("1396"), null),
      safeFetch(() => provider.getShowsByIds([...TV_CLASSIC_IDS]), []),
      ...TV_GENRE_ROWS.map((g) =>
        safeFetch(() => provider.getByGenre(g.id, 1), empty)
      ),
    ]);

  const featured = breakingBad ?? classics[0] ?? trending.results[0];
  const top10 = trending.results.slice(0, 10);
  return (
    <div className="bg-wave-bg pb-16">
      {featured && (
        <section className="relative h-[58vh] min-h-[420px] w-full overflow-hidden">
          <WaveImage
            src={featured.backdropUrl || featured.posterUrl || "/placeholder-poster.svg"}
            alt={featured.title}
            fill
            priority
            ultraHd
            className="object-cover object-top"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wave-bg via-wave-bg/75 to-wave-bg/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-wave-bg/80 via-wave-bg/30 to-transparent" />
          <div className={cn("absolute bottom-0 left-0 max-w-xl pb-16", PAGE_PL)}>
            <span className="inline-block rounded bg-wave-accent/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-wave-bg">
              TV Shows
            </span>
            <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {featured.title}
            </h1>
            {featured.overview && (
              <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-white/65">
                {featured.overview}
              </p>
            )}
            <Link
              href={`/watch/show/${featured.id}?s=1&e=1`}
              className="mt-5 inline-flex items-center gap-2.5 rounded-lg bg-wave-accent px-7 py-3 text-sm font-semibold text-wave-bg shadow-lg shadow-cyan-500/15 transition-all hover:bg-cyan-300"
            >
              <Play className="h-5 w-5 fill-wave-bg text-wave-bg" />
              Watch Now
            </Link>
            <Link
              href={`/show/${featured.id}`}
              className="ml-3 mt-5 inline-flex items-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              More Info
            </Link>
          </div>
        </section>
      )}

      <div className={cn("space-y-8 sm:space-y-10", featured ? "-mt-6" : "pt-8")}>
        <div className={PAGE_X}>
          <SearchBar variant="pill" className="max-w-xl" />
          <p className="mt-2 text-sm text-wave-muted">
            Search 200k+ shows — try &quot;Breaking Bad&quot;, &quot;The Sopranos&quot;, &quot;Game of Thrones&quot;
          </p>
        </div>

        {classics.length > 0 && (
          <ShowRow title="Binge Classics" shows={classics} />
        )}

        <ShowRow
          title="Top Rated TV Shows"
          shows={topRated.results}
          href="/tv-shows?section=top-rated"
        />
        <ShowRow
          title="Trending TV Shows"
          shows={trending.results}
          href="/tv-shows?section=trending"
        />
        <ShowRow
          title="Popular TV Shows"
          shows={popular.results}
          href="/tv-shows?section=popular"
        />
        {top10.length > 0 && (
          <section className={PAGE_X}>
            <h2 className="mb-4 text-lg font-bold text-white sm:text-xl">Top 10 TV Shows Today</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {top10.map((show, index) => (
                <Link
                  key={show.id}
                  href={`/show/${show.id}`}
                  className="group flex items-center gap-3 rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  <span className="text-3xl font-bold text-white/20">{index + 1}</span>
                  <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-md">
                    <WaveImage
                      src={show.posterUrl || "/placeholder-poster.svg"}
                      alt={show.title}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <span className="line-clamp-2 text-sm font-medium text-white group-hover:text-wave-accent">
                    {show.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <ShowRow
          title="Airing Today"
          shows={airingToday.results}
          href="/tv-shows?section=airing-today"
        />
        <ShowRow
          title="Currently On The Air"
          shows={onTheAir.results}
          href="/tv-shows?section=on-the-air"
        />

        {TV_GENRE_ROWS.map((genre, index) => (
          <ShowRow
            key={genre.id}
            title={`${genre.name} Series`}
            shows={genreResults[index]?.results ?? []}
            href={`/tv-shows?genreId=${genre.id}`}
          />
        ))}
      </div>
    </div>
  );
}
