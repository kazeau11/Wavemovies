import { NextResponse } from "next/server";
import { getCatalogueProvider } from "@/lib/catalogue";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const provider = getCatalogueProvider();
    const movie = await provider.getMovie(id);

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch movie";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
