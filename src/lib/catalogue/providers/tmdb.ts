import type {
  CatalogueProvider,
  Genre,
  Movie,
  PaginatedResult,
} from "../types";

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  vote_average: number;
  runtime?: number;
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbPaginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export class TmdbProvider implements CatalogueProvider {
  readonly name = "tmdb";

  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.TMDB_API_KEY ?? "";
    this.baseUrl = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
  }

  private get isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey !== "your_tmdb_api_key_here");
  }

  private imageUrl(path: string | null | undefined, size: "w500" | "w780" | "original" = "w500"): string {
    if (!path) return "/placeholder-poster.svg";
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  private async fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
    if (!this.isConfigured) {
      throw new Error(
        "TMDB API key is not configured. Add TMDB_API_KEY to your .env.local file."
      );
    }

    const url = new URL(`${this.baseUrl}${path}`);
    url.searchParams.set("api_key", this.apiKey);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  private normalizeMovie(raw: TmdbMovie, genresMap?: Map<number, string>): Movie {
    const releaseDate = raw.release_date ?? "";
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 0;

    let genres: Genre[] = [];
    if (raw.genres) {
      genres = raw.genres.map((g) => ({ id: String(g.id), name: g.name }));
    } else if (raw.genre_ids && genresMap) {
      genres = raw.genre_ids
        .map((id) => genresMap.get(id))
        .filter(Boolean)
        .map((name) => ({ id: String(raw.genre_ids!.find((gid) => genresMap.get(gid) === name)), name: name! }));
    }

    return {
      id: String(raw.id),
      title: raw.title,
      overview: raw.overview,
      posterUrl: this.imageUrl(raw.poster_path),
      backdropUrl: this.imageUrl(raw.backdrop_path, "w780"),
      releaseDate,
      releaseYear: Number.isNaN(releaseYear) ? 0 : releaseYear,
      genres,
      rating: raw.vote_average,
      runtime: raw.runtime ?? null,
      provider: this.name,
    };
  }

  private async getGenresMap(): Promise<Map<number, string>> {
    const data = await this.fetchApi<{ genres: TmdbGenre[] }>("/genre/movie/list");
    return new Map(data.genres.map((g) => [g.id, g.name]));
  }

  private async normalizePaginated(
    data: TmdbPaginated<TmdbMovie>,
    genresMap?: Map<number, string>
  ): Promise<PaginatedResult<Movie>> {
    const map = genresMap ?? (await this.getGenresMap());
    return {
      results: data.results.map((m) => this.normalizeMovie(m, map)),
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  }

  async getFeatured(): Promise<Movie | null> {
    const data = await this.fetchApi<TmdbPaginated<TmdbMovie>>("/movie/now_playing", { page: "1" });
    const genresMap = await this.getGenresMap();
    const first = data.results[0];
    return first ? this.normalizeMovie(first, genresMap) : null;
  }

  async getTrending(page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<TmdbPaginated<TmdbMovie>>("/trending/movie/week", {
      page: String(page),
    });
    return this.normalizePaginated(data);
  }

  async getPopular(page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<TmdbPaginated<TmdbMovie>>("/movie/popular", {
      page: String(page),
    });
    return this.normalizePaginated(data);
  }

  async getRecentlyAdded(page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<TmdbPaginated<TmdbMovie>>("/movie/upcoming", {
      page: String(page),
    });
    return this.normalizePaginated(data);
  }

  async getTopRated(page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<TmdbPaginated<TmdbMovie>>("/movie/top_rated", {
      page: String(page),
    });
    return this.normalizePaginated(data);
  }

  async getByGenre(genreId: string, page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<TmdbPaginated<TmdbMovie>>("/discover/movie", {
      with_genres: genreId,
      page: String(page),
      sort_by: "popularity.desc",
    });
    return this.normalizePaginated(data);
  }

  async getByWatchProvider(watchProviderId: string, page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<TmdbPaginated<TmdbMovie>>("/discover/movie", {
      with_watch_providers: watchProviderId,
      watch_region: process.env.WATCH_REGION ?? "US",
      page: String(page),
      sort_by: "popularity.desc",
    });
    return this.normalizePaginated(data);
  }

  async search(query: string, page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<TmdbPaginated<TmdbMovie>>("/search/movie", {
      query,
      page: String(page),
    });
    return this.normalizePaginated(data);
  }

  async getMovie(id: string): Promise<Movie | null> {
    const raw = await this.fetchApi<TmdbMovie>(`/movie/${id}`);
    return this.normalizeMovie(raw, new Map(raw.genres?.map((g) => [g.id, g.name])));
  }

  async getRelated(id: string, page = 1): Promise<PaginatedResult<Movie>> {
    const data = await this.fetchApi<TmdbPaginated<TmdbMovie>>(`/movie/${id}/similar`, {
      page: String(page),
    });
    return this.normalizePaginated(data);
  }

  async getGenres(): Promise<Genre[]> {
    const data = await this.fetchApi<{ genres: TmdbGenre[] }>("/genre/movie/list");
    return data.genres.map((g) => ({ id: String(g.id), name: g.name }));
  }
}
