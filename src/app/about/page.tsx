import { Film, Sparkles, Tv, Zap } from "lucide-react";
import { WaveLogo } from "@/components/ui/WaveLogo";

const highlights = [
  {
    icon: Film,
    title: "Massive catalogue",
    text: "Over a million movies and hundreds of thousands of TV shows — trending hits, classics, and everything in between.",
  },
  {
    icon: Tv,
    title: "Movies & TV, one place",
    text: "No jumping between apps. Browse films, binge series, and search it all together in one clean place.",
  },
  {
    icon: Zap,
    title: "Built to feel fast",
    text: "Clean layout, smooth browsing, and a player that gets out of your way so you can just watch.",
  },
  {
    icon: Sparkles,
    title: "Made for movie nights",
    text: "Genres, trending rows, and a cinematic layout built like a real streaming platform — because Wave is one.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center sm:text-left">
        <WaveLogo size="lg" href={undefined} className="mb-6 justify-center sm:justify-start" />
        <h1 className="text-3xl font-bold text-white sm:text-4xl">About Wave</h1>
        <p className="mt-3 text-lg text-wave-muted">
          The streaming site that actually feels like a streaming site.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <p className="text-base leading-relaxed text-white/90">
          <span className="font-semibold text-wave-accent">Wave Movies</span> is built for
          people who want the good stuff without the clutter. Huge library, sharp design, movies
          and TV shows in the same flow — it&apos;s one of the cleanest ways to find something
          and hit play.
        </p>
        <p className="mt-4 text-base leading-relaxed text-white/75">
          Whether you&apos;re hunting the latest blockbuster, rewinding a classic, or starting a
          new series, Wave brings it together in a dark, cinematic UI that looks and feels
          premium. No noise — just titles, posters, and playback that works.
        </p>
        <p className="mt-4 text-base font-medium text-white">
          Straight up: if you want a modern movie &amp; TV hub that hits different, Wave is it.
        </p>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {highlights.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-wave-accent/30 hover:bg-white/[0.04]"
          >
            <Icon className="mb-3 h-6 w-6 text-wave-accent" />
            <h2 className="font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-wave-muted">{text}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-wave-muted sm:text-left">
        Wave Movies — stream beautifully.
      </p>
    </div>
  );
}
