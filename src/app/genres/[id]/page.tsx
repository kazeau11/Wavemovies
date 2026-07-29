import { getCatalogueProvider } from "@/lib/catalogue";
import { MovieGrid } from "@/components/movies/MovieGrid";

export const revalidate = 300;

interface GenrePageProps {
  params: Promise<{ id: string }>;
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { id } = await params;
  const provider = getCatalogueProvider();

  let genreName = "Genre";
  let data = { results: [] as Awaited<ReturnType<typeof provider.getByGenre>>["results"], page: 1, totalPages: 0, totalResults: 0 };

  try {
    const genres = await provider.getGenres();
    const genre = genres.find((g) => g.id === id);
    genreName = genre?.name ?? "Genre";
    data = await provider.getByGenre(id, 1);
  } catch {
    /* empty */
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">{genreName}</h1>
      <MovieGrid
        initialMovies={data.results}
        initialPage={data.page}
        totalPages={data.totalPages}
        fetchUrl={`/api/movies?genreId=${id}`}
      />
    </div>
  );
}
