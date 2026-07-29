export interface Movie {
  id: string;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  releaseYear: number;
  genres: Genre[];
  rating: number;
  runtime: number | null;
  streamUrl?: string | null;
  embedUrl?: string | null;
  trailerUrl?: string | null;
  provider: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface PaginatedResult<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface MovieQuery {
  page?: number;
  genreId?: string;
  query?: string;
}

export interface CatalogueProvider {
  readonly name: string;
  getFeatured(): Promise<Movie | null>;
  getTrending(page?: number): Promise<PaginatedResult<Movie>>;
  getPopular(page?: number): Promise<PaginatedResult<Movie>>;
  getRecentlyAdded(page?: number): Promise<PaginatedResult<Movie>>;
  getTopRated(page?: number): Promise<PaginatedResult<Movie>>;
  getByGenre(genreId: string, page?: number): Promise<PaginatedResult<Movie>>;
  search(query: string, page?: number): Promise<PaginatedResult<Movie>>;
  getMovie(id: string): Promise<Movie | null>;
  getRelated(id: string, page?: number): Promise<PaginatedResult<Movie>>;
  getGenres(): Promise<Genre[]>;
}

export type MovieSection =
  | "trending"
  | "popular"
  | "recently-added"
  | "top-rated";

export interface TVShow {
  id: string;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  firstAirDate: string;
  releaseYear: number;
  genres: Genre[];
  rating: number;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  trailerUrl?: string | null;
  provider: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  overview: string;
  stillUrl: string;
  runtime: number | null;
  airDate: string;
}

export interface Season {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  episodes: Episode[];
}

export type TVSection =
  | "trending"
  | "popular"
  | "top-rated"
  | "airing-today"
  | "on-the-air";

export interface TVCatalogueProvider {
  readonly name: string;
  getTrending(page?: number): Promise<PaginatedResult<TVShow>>;
  getPopular(page?: number): Promise<PaginatedResult<TVShow>>;
  getTopRated(page?: number): Promise<PaginatedResult<TVShow>>;
  getAiringToday(page?: number): Promise<PaginatedResult<TVShow>>;
  getOnTheAir(page?: number): Promise<PaginatedResult<TVShow>>;
  getByGenre(genreId: string, page?: number): Promise<PaginatedResult<TVShow>>;
  search(query: string, page?: number): Promise<PaginatedResult<TVShow>>;
  getShow(id: string): Promise<TVShow | null>;
  getRelated(id: string, page?: number): Promise<PaginatedResult<TVShow>>;
  getSeason(showId: string, seasonNumber: number): Promise<Season | null>;
  getGenres(): Promise<Genre[]>;
  getShowsByIds(ids: string[]): Promise<TVShow[]>;
}
