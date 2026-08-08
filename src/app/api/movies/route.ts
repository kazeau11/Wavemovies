import { NextResponse } from "next/server";
import { getCatalogueProvider } from "@/lib/catalogue";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") ?? "popular";
    const page = Number(searchParams.get("page") ?? "1");
    const genreId = searchParams.get("genreId") ?? undefined;
    const watchProviderId = searchParams.get("watchProviderId") ?? undefined;
    const query = searchParams.get("q") ?? undefined;

    const provider = getCatalogueProvider();

    if (query) {
      const data = await provider.search(query, page);
      return NextResponse.json(data);
    }

    if (watchProviderId) {
      const data = await provider.getByWatchProvider(watchProviderId, page);
      return NextResponse.json(data);
    }

    if (genreId) {
      const data = await provider.getByGenre(genreId, page);
      return NextResponse.json(data);
    }

    switch (section) {
      case "trending":
        return NextResponse.json(await provider.getTrending(page));
      case "recently-added":
        return NextResponse.json(await provider.getRecentlyAdded(page));
      case "top-rated":
        return NextResponse.json(await provider.getTopRated(page));
      case "popular":
      default:
        return NextResponse.json(await provider.getPopular(page));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch movies";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
