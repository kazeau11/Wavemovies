"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import type { TVShow } from "@/lib/catalogue/types";
import { ShowCard } from "./ShowCard";
import { cn } from "@/lib/utils";
import { PAGE_PL, PAGE_X } from "@/lib/layout";

interface ShowRowProps {
  title: string;
  shows: TVShow[];
  href?: string;
  className?: string;
  variant?: "poster" | "landscape";
}

export function ShowRow({
  title,
  shows,
  href,
  className,
  variant = "poster",
}: ShowRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(updateScrollButtons, 300);
  };

  if (shows.length === 0) return null;

  const cardWidth =
    variant === "landscape"
      ? "w-[300px] shrink-0 sm:w-[340px] md:w-[380px] lg:w-[420px]"
      : "w-[120px] shrink-0 sm:w-[135px] md:w-[150px] lg:w-[165px]";

  return (
    <section className={cn("relative", className)}>
      <div className={cn("mb-4 flex items-center justify-between", PAGE_X)}>
        <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm font-medium text-wave-muted transition-colors hover:text-wave-accent"
          >
            Explore all
          </Link>
        )}
      </div>

      <div className="group/row relative">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-1 top-[38%] z-10 hidden -translate-y-1/2 rounded-full bg-black/70 p-2 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/90 group-hover/row:opacity-100 md:block"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className={cn("scrollbar-hide flex gap-2 overflow-x-auto pb-1 sm:gap-2.5", PAGE_PL)}
        >
          {shows.map((show, index) => (
            <div key={show.id} className={cardWidth}>
              <ShowCard show={show} index={index} variant={variant} />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-3 top-[38%] z-10 hidden -translate-y-1/2 rounded-full bg-black/70 p-2 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/90 group-hover/row:opacity-100 md:block"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </section>
  );
}
