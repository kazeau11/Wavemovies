const DEMO_STREAMS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

export interface PlaybackSource {
  type: "direct" | "embed" | "demo";
  url: string;
  label: string;
}

export function getDemoStreamUrl(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DEMO_STREAMS.length;
  return DEMO_STREAMS[index];
}

export function resolvePlaybackSource(movie: {
  id: string;
  title: string;
  streamUrl?: string | null;
  embedUrl?: string | null;
  trailerUrl?: string | null;
}): PlaybackSource {
  if (movie.streamUrl) {
    return {
      type: "direct",
      url: movie.streamUrl,
      label: "Stream",
    };
  }

  if (movie.embedUrl) {
    return {
      type: "embed",
      url: movie.embedUrl,
      label: "1Flex Player",
    };
  }

  if (movie.trailerUrl) {
    return {
      type: "embed",
      url: movie.trailerUrl,
      label: "Official Trailer",
    };
  }

  return {
    type: "demo",
    url: getDemoStreamUrl(movie.id),
    label: "Demo Preview (Public Domain)",
  };
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

export function formatRating(rating: number): string {
  return rating > 0 ? rating.toFixed(1) : "N/A";
}
