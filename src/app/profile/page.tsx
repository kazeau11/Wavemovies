"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Clock, Bookmark, Sparkles } from "lucide-react";
import { useContinueWatching } from "@/lib/storage/continue-watching";
import { useWatchlist } from "@/lib/storage/watchlist";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { items: continueItems, removeItem, clearAll: clearContinue } = useContinueWatching();
  const { items: watchlistItems } = useWatchlist();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
          <User className="h-10 w-10 text-white" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-white">Your Profile</h1>
          <p className="mt-1 text-wave-muted">Manage your Wave streaming experience</p>
        </div>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl glass p-6 text-center">
          <Clock className="mx-auto mb-2 h-8 w-8 text-blue-400" />
          <p className="text-2xl font-bold text-white">{continueItems.length}</p>
          <p className="text-sm text-wave-muted">Continue Watching</p>
        </div>
        <div className="rounded-2xl glass p-6 text-center">
          <Bookmark className="mx-auto mb-2 h-8 w-8 text-blue-500" />
          <p className="text-2xl font-bold text-white">{watchlistItems.length}</p>
          <p className="text-sm text-wave-muted">Watchlist</p>
        </div>
        <div className="rounded-2xl glass p-6 text-center">
          <Sparkles className="mx-auto mb-2 h-8 w-8 text-blue-300" />
          <p className="text-2xl font-bold text-white">Wave</p>
          <p className="text-sm text-wave-muted">Streaming Platform</p>
        </div>
      </div>

      {continueItems.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Continue Watching</h2>
            <Button variant="ghost" size="sm" onClick={clearContinue}>
              Clear All
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {continueItems.map((item) => {
              const progress = item.duration > 0 ? (item.progress / item.duration) * 100 : 0;
              return (
                <div key={item.movieId} className="group overflow-hidden rounded-2xl glass">
                  <Link href={`/watch/${item.movieId}`} className="relative block aspect-video">
                    <Image
                      src={item.backdropUrl || item.posterUrl || "/placeholder-poster.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </Link>
                  <div className="flex items-center justify-between p-4">
                    <Link href={`/movie/${item.movieId}`}>
                      <h3 className="font-medium text-white group-hover:text-blue-300">{item.title}</h3>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.movieId)}>
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <Link href="/watchlist">
        <Button variant="secondary">View Watchlist</Button>
      </Link>
    </div>
  );
}
