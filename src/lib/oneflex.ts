const CINEJOY_ORIGIN = process.env.CINEJOY_ORIGIN ?? "https://cinejoy.to";

/** Stream embed templates — Cinejoy uses the same TMDB catalogue + Videasy-style hosts. */
export const ONEFLEX_EMBED_PROVIDERS: Record<
  string,
  { label: string; movie: string; tv: string }
> = {
  CINEJOY: {
    label: "Cinejoy",
    movie: `${CINEJOY_ORIGIN}/embed/movie/{id}`,
    tv: `${CINEJOY_ORIGIN}/embed/tv/{id}/{season}/{episode}`,
  },
  MAIN_1: {
    label: "Main 1",
    movie: "https://www.viduki.net/1/movie/{id}?color=2563eb",
    tv: "https://www.viduki.net/1/tv/{id}/{season}/{episode}?color=2563eb",
  },
  MAIN_2: {
    label: "Main 2",
    movie: "https://player.videasy.to/movie/{id}?color=2563eb&overlay=true",
    tv: "https://player.videasy.to/tv/{id}/{season}/{episode}?color=2563eb&overlay=true",
  },
  MAIN_3: {
    label: "Main 3",
    movie: "https://vidfast.pro/movie/{id}?autoPlay=true&title=false&poster=false&theme=2563eb",
    tv: "https://vidfast.pro/tv/{id}/{season}/{episode}?autoPlay=true&title=false&poster=false&theme=2563eb",
  },
  MAIN_4: {
    label: "Main 4",
    movie:
      "https://vidlink.pro/movie/{id}?primaryColor=2563eb&title=false&poster=false&autoplay=true&nextbutton=false",
    tv: "https://vidlink.pro/tv/{id}/{season}/{episode}?primaryColor=2563eb&title=false&poster=false&autoplay=true&nextbutton=false",
  },
  MAIN_5: {
    label: "Main 5",
    movie:
      "https://vidrock.ru/movie/{id}?theme=2563eb&autoplay=true&autonext=false&download=false&nextbutton=false",
    tv: "https://vidrock.ru/tv/{id}/{season}/{episode}?theme=2563eb&autoplay=true&autonext=true&download=false&nextbutton=false",
  },
  MAIN_6: {
    label: "Main 6",
    movie: "https://player.vidzee.wtf/embed/movie/{id}?color=2563eb",
    tv: "https://player.vidzee.wtf/embed/tv/{id}/{season}/{episode}?color=2563eb",
  },
  MULTILANGUAGE: {
    label: "Multi-language",
    movie: "https://www.viduki.net/2/movie/{id}?color=2563eb",
    tv: "https://www.viduki.net/2/tv/{id}/{season}/{episode}?color=2563eb",
  },
  PREMIUM_EMBEDS: {
    label: "Premium",
    movie: "https://www.viduki.net/4/movie/{id}?color=2563eb",
    tv: "https://www.viduki.net/4/tv/{id}/{season}/{episode}?color=2563eb",
  },
};

export const ONEFLEX_EMBED_SERVER_IDS = Object.keys(ONEFLEX_EMBED_PROVIDERS);

/** Default embed server (Videasy — same as original Wave setup). */
export function getOneFlexEmbedUrl(movieId: string, serverId?: string): string {
  const custom =
    typeof window === "undefined"
      ? process.env.ONEFLEX_EMBED_URL
      : process.env.NEXT_PUBLIC_ONEFLEX_EMBED_URL;

  if (custom) {
    return custom.replace("{id}", movieId);
  }

  const resolvedServer =
    serverId ??
    process.env.ONEFLEX_EMBED_SERVER ??
    process.env.NEXT_PUBLIC_ONEFLEX_EMBED_SERVER ??
    "MAIN_2";

  const provider =
    ONEFLEX_EMBED_PROVIDERS[resolvedServer] ?? ONEFLEX_EMBED_PROVIDERS.MAIN_2;
  return provider.movie.replace("{id}", movieId);
}

/** Build TV episode embed URL for the given season/episode. */
export function getOneFlexTVEmbedUrl(
  showId: string,
  season: number,
  episode: number,
  serverId?: string
): string {
  const custom =
    typeof window === "undefined"
      ? process.env.ONEFLEX_TV_EMBED_URL
      : process.env.NEXT_PUBLIC_ONEFLEX_TV_EMBED_URL;

  if (custom) {
    return custom
      .replace("{id}", showId)
      .replace("{season}", String(season))
      .replace("{episode}", String(episode));
  }

  const resolvedServer =
    serverId ??
    process.env.ONEFLEX_EMBED_SERVER ??
    process.env.NEXT_PUBLIC_ONEFLEX_EMBED_SERVER ??
    "MAIN_2";

  const provider =
    ONEFLEX_EMBED_PROVIDERS[resolvedServer] ?? ONEFLEX_EMBED_PROVIDERS.MAIN_2;
  return provider.tv
    .replace("{id}", showId)
    .replace("{season}", String(season))
    .replace("{episode}", String(episode));
}

/** Legacy full-page play URL (fallback). */
export function getOneFlexWatchUrl(movieId: string): string {
  const origin = process.env.CINEJOY_ORIGIN ?? "https://cinejoy.to";
  const token = process.env.ONEFLEX_PLAY_TOKEN ?? "ptsrMhLRCiUV3AKQ";
  const template =
    process.env.ONEFLEX_WATCH_URL ??
    `${origin}/play?id={id}&type=movie&token={token}`;
  return template.replace("{id}", movieId).replace("{token}", token);
}
