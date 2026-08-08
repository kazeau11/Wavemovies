import type {
  Genre,
  PaginatedResult,
  Season,
  TVCatalogueProvider,
  TVShow,
} from "../types";
import { getTmdbImageUrl } from "@/lib/images";
import { fetchCinejoyCatalogue } from "../cinejoy-api";
import { getCinejoyCatalogueBaseUrl } from "../cinejoy-config";

interface OneFlexTV {
  id: number;
  name: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  vote_average?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
}

interface OneFlexVideo {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

interface OneFlexEpisode {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview?: string;
  still_path?: string | null;
  runtime?: number;
  air_date?: string;
}

interface OneFlexSeason {
  season_number: number;
  name: string;
  episodes: OneFlexEpisode[];
}

interface OneFlexPaginated {
  page: number;
  results: OneFlexTV[];
  total_pages: number;
  total_results: number;
}

export class OneFlexTVProvider implements TVCatalogueProvider {
  readonly name = "cinejoy";

  private baseUrl: string;
  private genresCache: Map<number, string> | null = null;

  constructor() {
    this.baseUrl = getCinejoyCatalogueBaseUrl();
  }

  private async fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(path.startsWith("/") ? path : `/${path}`, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }

    return fetchCinejoyCatalogue<T>(url.toString());
  }

  private imageUrl(path: string | null | undefined, size: "poster" | "backdrop" | "hero"): string {
    return getTmdbImageUrl(path, size);
  }

  private async getTrailerUrl(showId: string): Promise<string | null> {
    try {
      const data = await this.fetchApi<{ results: OneFlexVideo[] }>(`/tv/${showId}/videos`);
      const videos = data.results ?? [];
      const trailer =
        videos.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ??
        videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
        videos.find((v) => v.site === "YouTube");
      if (!trailer) return null;
      return `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`;
    } catch {
      return null;
    }
  }

  private async getGenresMap(): Promise<Map<number, string>> {
    if (this.genresCache) return this.genresCache;
    const data = await this.fetchApi<{ genres: Array<{ id: number; name: string }> }>(
      "/genre/tv/list"
    );
    this.genresCache = new Map(data.genres.map((g) => [g.id, g.name]));
    return this.genresCache;
  }

  private normalizeShow(raw: OneFlexTV, genresMap?: Map<number, string>): TVShow {
    const firstAirDate = raw.first_air_date ?? "";
    const releaseYear = firstAirDate ? new Date(firstAirDate).getFullYear() : 0;

    let genres: Genre[] = [];
    if (raw.genres?.length) {
      genres = raw.genres.map((g) => ({ id: String(g.id), name: g.name }));
    } else if (raw.genre_ids?.length && genresMap) {
      genres = raw.genre_ids
        .map((id) => {
          const name = genresMap.get(id);
          return name ? { id: String(id), name } : null;
        })
        .filter(Boolean) as Genre[];
    }

    return {
      id: String(raw.id),
      title: raw.name,
      overview: raw.overview ?? "",
      posterUrl: this.imageUrl(raw.poster_path, "poster"),
      backdropUrl: this.imageUrl(raw.backdrop_path, "hero"),
      firstAirDate,
      releaseYear: Number.isNaN(releaseYear) ? 0 : releaseYear,
      genres,
      rating: raw.vote_average ?? 0,
      numberOfSeasons: raw.number_of_seasons ?? 0,
      numberOfEpisodes: raw.number_of_episodes ?? 0,
      provider: this.name,
    };
  }

  private async normalizePaginated(
    data: OneFlexPaginated,
    page = 1
  ): Promise<PaginatedResult<TVShow>> {
    const genresMap = await this.getGenresMap();
    return {
      results: data.results.map((s) => this.normalizeShow(s, genresMap)),
      page: data.page ?? page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  }

  async getTrending(page = 1): Promise<PaginatedResult<TVShow>> {
    const data = await this.fetchApi<OneFlexPaginated>("/trending/tv/day", {
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getPopular(page = 1): Promise<PaginatedResult<TVShow>> {
    const data = await this.fetchApi<OneFlexPaginated>("/tv/popular", {
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getTopRated(page = 1): Promise<PaginatedResult<TVShow>> {
    const data = await this.fetchApi<OneFlexPaginated>("/tv/top_rated", {
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getAiringToday(page = 1): Promise<PaginatedResult<TVShow>> {
    const data = await this.fetchApi<OneFlexPaginated>("/tv/airing_today", {
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getOnTheAir(page = 1): Promise<PaginatedResult<TVShow>> {
    const data = await this.fetchApi<OneFlexPaginated>("/tv/on_the_air", {
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getByGenre(genreId: string, page = 1): Promise<PaginatedResult<TVShow>> {
    const data = await this.fetchApi<OneFlexPaginated>("/discover/tv", {
      with_genres: genreId,
      page: String(page),
      sort_by: "popularity.desc",
    });
    return this.normalizePaginated(data, page);
  }

  async getByWatchProvider(watchProviderId: string, page = 1): Promise<PaginatedResult<TVShow>> {
    const data = await this.fetchApi<OneFlexPaginated>("/discover/tv", {
      with_watch_providers: watchProviderId,
      watch_region: process.env.WATCH_REGION ?? "US",
      page: String(page),
      sort_by: "popularity.desc",
    });
    return this.normalizePaginated(data, page);
  }

  async search(query: string, page = 1): Promise<PaginatedResult<TVShow>> {
    const data = await this.fetchApi<OneFlexPaginated>("/search/tv", {
      query,
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getShow(id: string): Promise<TVShow | null> {
    const [raw, trailerUrl] = await Promise.all([
      this.fetchApi<OneFlexTV>(`/tv/${id}`),
      this.getTrailerUrl(id),
    ]);
    const show = this.normalizeShow(raw, new Map(raw.genres?.map((g) => [g.id, g.name])));
    return { ...show, trailerUrl };
  }

  async getRelated(id: string, page = 1): Promise<PaginatedResult<TVShow>> {
    const data = await this.fetchApi<OneFlexPaginated>(`/tv/${id}/similar`, {
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getSeason(showId: string, seasonNumber: number): Promise<Season | null> {
    try {
      const data = await this.fetchApi<OneFlexSeason>(`/tv/${showId}/season/${seasonNumber}`);
      return {
        seasonNumber: data.season_number,
        name: data.name,
        episodeCount: data.episodes?.length ?? 0,
        episodes: (data.episodes ?? []).map((ep) => ({
          id: String(ep.id),
          episodeNumber: ep.episode_number,
          seasonNumber: ep.season_number ?? seasonNumber,
          title: ep.name,
          overview: ep.overview ?? "",
          stillUrl: this.imageUrl(ep.still_path, "backdrop"),
          runtime: ep.runtime ?? null,
          airDate: ep.air_date ?? "",
        })),
      };
    } catch {
      return null;
    }
  }

  async getGenres(): Promise<Genre[]> {
    const data = await this.fetchApi<{ genres: Array<{ id: number; name: string }> }>(
      "/genre/tv/list"
    );
    return data.genres.map((g) => ({ id: String(g.id), name: g.name }));
  }

  async getShowsByIds(ids: string[]): Promise<TVShow[]> {
    const shows = await Promise.all(
      ids.map((id) =>
        this.getShow(id).catch(() => null)
      )
    );
    return shows.filter((show): show is TVShow => show !== null);
  }
}
