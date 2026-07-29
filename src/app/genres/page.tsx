import Link from "next/link";
import { getCatalogueProvider } from "@/lib/catalogue";
import { Film } from "lucide-react";

export const revalidate = 3600;

export default async function GenresPage() {
  let genres: Awaited<ReturnType<ReturnType<typeof getCatalogueProvider>["getGenres"]>> = [];

  try {
    const provider = getCatalogueProvider();
    genres = await provider.getGenres();
  } catch {
    /* empty */
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-white">Genres</h1>
      <p className="mb-8 text-wave-muted">Browse movies by category</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/genres/${genre.id}`}
            className="group flex items-center gap-3 rounded-2xl glass glass-hover p-5 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <Film className="h-5 w-5 text-blue-400" />
            </div>
            <span className="font-medium text-white group-hover:text-blue-300">{genre.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
