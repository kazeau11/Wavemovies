"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";
import { useWatchlist, useWatchlistItems } from "@/lib/storage/watchlist";
import { Button } from "@/components/ui/Button";

export default function WatchlistPage() {
  const items = useWatchlistItems();
  const { removeItem, clearAll } = useWatchlist();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Watchlist</h1>
          <p className="mt-1 text-wave-muted">
            {items.length} {items.length === 1 ? "movie" : "movies"} saved
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl glass py-20">
          <Bookmark className="mb-4 h-12 w-12 text-wave-muted" />
          <p className="text-lg font-medium text-white">Your watchlist is empty</p>
          <p className="mt-2 text-sm text-wave-muted">
            Add movies to your watchlist to save them for later
          </p>
          <Link href="/movies" className="mt-6">
            <Button>Browse Movies</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.movieId}
              className="group flex gap-4 rounded-2xl glass glass-hover p-4 transition-all duration-300"
            >
              <Link href={`/movie/${item.movieId}`} className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={item.posterUrl || "/placeholder-poster.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between py-1">
                <div>
                  <Link href={`/movie/${item.movieId}`}>
                    <h3 className="font-semibold text-white transition-colors group-hover:text-wave-accent">
                      {item.title}
                    </h3>
                  </Link>
                  {item.releaseYear > 0 && (
                    <p className="mt-1 text-xs text-wave-muted">{item.releaseYear}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/watch/${item.movieId}`}>
                    <Button size="sm">Watch</Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.movieId)}
                    aria-label="Remove from watchlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
