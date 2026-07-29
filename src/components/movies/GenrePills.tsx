"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Genre } from "@/lib/catalogue/types";
import { cn } from "@/lib/utils";

interface GenrePillsProps {
  genres: Genre[];
  activeGenreId?: string;
  className?: string;
}

export function GenrePills({ genres, activeGenreId, className }: GenrePillsProps) {
  if (genres.length === 0) return null;

  return (
    <div className={cn("scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-8", className)}>
      <Link href="/movies">
        <motion.span
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "inline-block shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            !activeGenreId
              ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white"
              : "glass glass-hover text-wave-muted"
          )}
        >
          All
        </motion.span>
      </Link>
      {genres.map((genre) => (
        <Link key={genre.id} href={`/genres/${genre.id}`}>
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "inline-block shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeGenreId === genre.id
                ? "bg-gradient-to-r from-wave-accent to-wave-accent-2 text-white"
                : "glass glass-hover text-wave-muted"
            )}
          >
            {genre.name}
          </motion.span>
        </Link>
      ))}
    </div>
  );
}
