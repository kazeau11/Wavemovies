"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { TVShow } from "@/lib/catalogue/types";
import { OneFlexTVPlayer } from "@/components/video/OneFlexTVPlayer";
import { PAGE_X } from "@/lib/layout";
import { cn } from "@/lib/utils";

export default function WatchShowPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const showId = params?.id ?? "";
  const season = Number(searchParams.get("s") ?? "1");
  const episode = Number(searchParams.get("e") ?? "1");

  const [show, setShow] = useState<TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!showId) {
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(`/api/shows/${showId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json() as Promise<TVShow>;
      })
      .then((data) => {
        if (!cancelled) setShow(data);
      })
      .catch(() => {
        if (!cancelled) {
          setShow(null);
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [showId]);

  if (!showId || error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-wave-bg">
        <p className="text-wave-muted">TV show not found</p>
        <Link href="/tv-shows" className="text-wave-accent hover:underline">
          Back to TV Shows
        </Link>
      </div>
    );
  }

  if (loading || !show) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-wave-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-wave-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wave-bg pb-12">
      <div className={cn("mx-auto max-w-[1400px] py-6", PAGE_X)}>
        <Link
          href={`/show/${showId}`}
          className="mb-5 inline-flex items-center gap-2 text-sm text-wave-muted transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {show.title}
        </Link>

        <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl">{show.title}</h1>
        <p className="mb-5 text-sm text-wave-muted">
          Season {season} · Episode {episode}
        </p>

        <OneFlexTVPlayer
          showId={show.id}
          season={season}
          episode={episode}
          title={`${show.title} S${season}E${episode}`}
        />
      </div>
    </div>
  );
}
