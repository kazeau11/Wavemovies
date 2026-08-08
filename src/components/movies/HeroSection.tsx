"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import type { Movie } from "@/lib/catalogue/types";
import { WaveImage } from "@/components/ui/WaveImage";
import { PAGE_PL } from "@/lib/layout";
import { cn } from "@/lib/utils";

const SLIDE_MS = 6000;

interface HeroSectionProps {
  movies: Movie[];
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (direction: "prev" | "next") => {
      if (movies.length === 0) return;
      setIndex((current) =>
        direction === "next"
          ? (current + 1) % movies.length
          : (current - 1 + movies.length) % movies.length
      );
    },
    [movies.length]
  );

  useEffect(() => {
    if (movies.length <= 1) return;
    const timer = setInterval(() => go("next"), SLIDE_MS);
    return () => clearInterval(timer);
  }, [movies.length, go]);

  if (movies.length === 0) return null;

  const movie = movies[index];
  const backdrop = movie.backdropUrl || movie.posterUrl || "/placeholder-poster.svg";

  return (
    <section className="relative h-[85vh] min-h-[540px] w-full overflow-hidden bg-wave-bg">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <WaveImage
            src={backdrop}
            alt={movie.title}
            fill
            priority={index === 0}
            ultraHd
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 hero-gradient pointer-events-none" />
      <div className="absolute inset-0 hero-gradient-side pointer-events-none" />

      <div
        className={cn(
          "relative z-10 flex h-full w-full items-center pt-[72px]",
          PAGE_PL
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
            className="flex max-w-xl flex-col items-start text-left sm:max-w-2xl lg:max-w-3xl"
          >
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
              #{index + 1} Today
            </span>

            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              {movie.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/75">
              {movie.releaseYear > 0 && <span>{movie.releaseYear}</span>}
              <span className="rounded border border-white/30 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90">
                HD
              </span>
            </div>

            <p className="mt-4 line-clamp-3 max-w-lg text-[15px] leading-relaxed text-white/65 sm:text-base">
              {movie.overview || "No description available."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/watch/${movie.id}`}
                className="inline-flex items-center gap-2.5 rounded-lg bg-wave-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-all hover:bg-wave-accent-2"
              >
                <Play className="h-4 w-4 fill-white text-white" />
                Play
              </Link>
              <Link
                href={`/movie/${movie.id}`}
                className="inline-flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15"
              >
                <Info className="h-4 w-4" />
                More Info
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {movies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {movies.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-wave-accent" : "w-1.5 bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Show ${m.title}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
