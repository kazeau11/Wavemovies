import type {
  CatalogueProvider,
  Genre,
  Movie,
  PaginatedResult,
} from "../types";
import { getTmdbImageUrl } from "@/lib/images";
import { getOneFlexEmbedUrl } from "@/lib/oneflex";

interface OneFlexMovie {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  vote_average?: number;
  runtime?: number;
}

interface OneFlexVideo {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

interface OneFlexPaginated {
  page: number;
  results: OneFlexMovie[];
  total_pages: number;
  total_results: number;
}

/**
 * 1Flex catalogue provider — metadata from db.1flex.org, playback via your 1flex.org site.
 */
export class OneFlexProvider implements CatalogueProvider {
  readonly name = "oneflex";

  private baseUrl: string;
  private origin: string;
  private genresCache: Map<number, string> | null = null;

  constructor() {
    this.baseUrl = process.env.ONEFLEX_API_URL ?? "https://db.1flex.org";
    this.origin = process.env.ONEFLEX_ORIGIN ?? "https://cinejoy.to";
  }

  private async fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(path.startsWith("/") ? path : `/${path}`, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        Origin: this.origin,
        Referer: `${this.origin}/`,
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`1Flex catalogue error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  private imageUrl(path: string | null | undefined, size: "poster" | "backdrop" | "hero"): string {
    return getTmdbImageUrl(path, size);
  }

  private async getTrailerUrl(movieId: string): Promise<string | null> {
    try {
      const data = await this.fetchApi<{ results: OneFlexVideo[] }>(`/movie/${movieId}/videos`);
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
      "/genre/movie/list"
    );
    this.genresCache = new Map(data.genres.map((g) => [g.id, g.name]));
    return this.genresCache;
  }

  private normalizeMovie(raw: OneFlexMovie, genresMap?: Map<number, string>): Movie {
    const releaseDate = raw.release_date ?? "";
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 0;

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
      title: raw.title,
      overview: raw.overview ?? "",
      posterUrl: this.imageUrl(raw.poster_path, "poster"),
      backdropUrl: this.imageUrl(raw.backdrop_path, "hero"),
      releaseDate,
      releaseYear: Number.isNaN(releaseYear) ? 0 : releaseYear,
      genres,
      rating: raw.vote_average ?? 0,
      runtime: raw.runtime ?? null,
      embedUrl: getOneFlexEmbedUrl(
        String(raw.id),
        process.env.ONEFLEX_EMBED_SERVER ?? "MAIN_2"
      ),
      provider: this.name,
    };
  }

  private async normalizePaginated(
    data: OneFlexPaginated,
    page = 1
  ): Promise<PaginatedResult<Movie>> {
    const genresMap = await this.getGenresMap();
    return {
      results: data.results.map((m) => this.normalizeMovie(m, genresMap)),
      page: data.page ?? page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  }

  async getFeatured(): Promise<Movie | null> {
    const data = await this.fetchApi<OneFlexPaginated>("/trending/movie/day", { page: "1" });
    const first = data.results[0];
    if (!first) return null;
    const genresMap = await this.getGenresMap();
    return this.normalizeMovie(first, genresMap);
  }

  async getTrending(page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<OneFlexPaginated>("/trending/movie/day", {
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getPopular(page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<OneFlexPaginated>("/movie/popular", {
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getRecentlyAdded(page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<OneFlexPaginated>("/movie/upcoming", {
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getTopRated(page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<OneFlexPaginated>("/movie/top_rated", {
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getByGenre(genreId: string, page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<OneFlexPaginated>("/discover/movie", {
      with_genres: genreId,
      page: String(page),
      sort_by: "popularity.desc",
    });
    return this.normalizePaginated(data, page);
  }

  async getByWatchProvider(watchProviderId: string, page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<OneFlexPaginated>("/discover/movie", {
      with_watch_providers: watchProviderId,
      watch_region: process.env.WATCH_REGION ?? "US",
      page: String(page),
      sort_by: "popularity.desc",
    });
    return this.normalizePaginated(data, page);
  }

  async search(query: string, page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<OneFlexPaginated>("/search/movie", {
      query,
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getMovie(id: string): Promise<Movie | null> {
    const [raw, trailerUrl] = await Promise.all([
      this.fetchApi<OneFlexMovie>(`/movie/${id}`),
      this.getTrailerUrl(id),
    ]);
    const movie = this.normalizeMovie(raw, new Map(raw.genres?.map((g) => [g.id, g.name])));
    return { ...movie, trailerUrl };
  }

  async getRelated(id: string, page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<OneFlexPaginated>(`/movie/${id}/similar`, {
      page: String(page),
    });
    return this.normalizePaginated(data, page);
  }

  async getGenres(): Promise<Genre[]> {
    const data = await this.fetchApi<{ genres: Array<{ id: number; name: string }> }>(
      "/genre/movie/list"
    );
    return data.genres.map((g) => ({ id: String(g.id), name: g.name }));
  }
}
