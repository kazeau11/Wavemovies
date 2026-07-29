import { getCatalogueProvider } from "@/lib/catalogue";
import { MovieGrid } from "@/components/movies/MovieGrid";

export const revalidate = 300;

interface MoviesPageProps {
  searchParams: Promise<{ section?: string; genreId?: string }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const params = await searchParams;
  const section = params.section ?? "popular";
  const provider = getCatalogueProvider();

  let data;
  let title = "All Movies";
  let fetchUrl = `/api/movies?section=${section}`;

  if (params.genreId) {
    data = await provider.getByGenre(params.genreId, 1);
    title = "Movies by Genre";
    fetchUrl = `/api/movies?genreId=${params.genreId}`;
  } else {
    switch (section) {
      case "trending":
        data = await provider.getTrending(1);
        title = "Trending Movies";
        break;
      case "recently-added":
        data = await provider.getRecentlyAdded(1);
        title = "Recently Added";
        break;
      case "top-rated":
        data = await provider.getTopRated(1);
        title = "Top Rated";
        break;
      default:
        data = await provider.getPopular(1);
        title = "Popular Movies";
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
      <h1 className="mb-8 text-3xl font-bold text-white">{title}</h1>
      <MovieGrid
        initialMovies={data.results}
        initialPage={data.page}
        totalPages={data.totalPages}
        fetchUrl={fetchUrl}
      />
    </div>
  );
}
