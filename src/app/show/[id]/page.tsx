import Link from "next/link";
import { WaveImage } from "@/components/ui/WaveImage";
import { notFound } from "next/navigation";
import { Play, Tv } from "lucide-react";
import { getTVProvider } from "@/lib/catalogue";
import { ShowRow } from "@/components/shows/ShowRow";
import { EpisodeList } from "@/components/shows/EpisodeList";
import { PAGE_X } from "@/lib/layout";
import { cn } from "@/lib/utils";

export const revalidate = 300;

interface ShowPageProps {
  params: Promise<{ id: string }>;
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { id } = await params;
  const provider = getTVProvider();

  let show;
  let related = { results: [] as Awaited<ReturnType<typeof provider.getRelated>>["results"] };

  try {
    show = await provider.getShow(id);
    if (show) {
      related = await provider.getRelated(id, 1);
    }
  } catch {
    notFound();
  }

  if (!show) notFound();

  const backdrop = show.backdropUrl || show.posterUrl || "/placeholder-poster.svg";
  const watchHref = `/watch/show/${show.id}?s=1&e=1`;

  return (
    <div className="bg-wave-bg pb-16">
      <section className="relative h-[58vh] min-h-[420px] w-full overflow-hidden">
        <WaveImage
          src={backdrop}
          alt={show.title}
          fill
          priority
          ultraHd
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wave-bg via-wave-bg/75 to-wave-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-wave-bg/80 via-wave-bg/30 to-transparent" />
      </section>

      <div className={cn("relative mx-auto max-w-[1400px] -mt-36 sm:-mt-40", PAGE_X)}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="relative mx-auto w-[200px] shrink-0 overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 sm:w-[220px] lg:mx-0 lg:w-[240px]">
            <WaveImage
              src={show.posterUrl || "/placeholder-poster.svg"}
              alt={show.title}
              width={240}
              height={360}
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-5 pt-2 lg:pt-6">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {show.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/75">
              {show.releaseYear > 0 && <span>{show.releaseYear}</span>}
              {show.numberOfSeasons > 0 && (
                <span className="flex items-center gap-1.5">
                  <Tv className="h-4 w-4 text-white/50" />
                  {show.numberOfSeasons} Season{show.numberOfSeasons !== 1 ? "s" : ""}
                </span>
              )}
              <span className="rounded border border-white/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90">
                HD
              </span>
            </div>

            {show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {show.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/tv-shows?genreId=${genre.id}`}
                    className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-white/90 transition-colors hover:bg-white/15"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}

            <p className="max-w-2xl text-[15px] leading-relaxed text-white/65 sm:text-base">
              {show.overview || "No description available for this show."}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={watchHref}
                className="inline-flex items-center gap-2.5 rounded-lg bg-wave-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-all hover:bg-wave-accent-2"
              >
                <Play className="h-5 w-5 fill-wave-bg text-wave-bg" />
                Watch Now
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/5 pt-10">
          <h2 className="mb-6 text-xl font-bold text-white">Episodes</h2>
          <EpisodeList showId={show.id} numberOfSeasons={show.numberOfSeasons} />
        </div>

        {related.results.length > 0 && (
          <div className="mt-14 border-t border-white/5 pt-10">
            <ShowRow title="Related TV Shows" shows={related.results} />
          </div>
        )}
      </div>
    </div>
  );
}
