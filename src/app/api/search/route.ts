import { NextResponse } from "next/server";
import { getCatalogueProvider, getTVProvider } from "@/lib/catalogue";
import type { UnifiedSearchResult } from "@/lib/catalogue/types";
import { mergeSearchResults } from "@/lib/search/merge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() ?? "";
    const page = Number(searchParams.get("page") ?? "1");

    if (!query) {
      return NextResponse.json({
        results: [],
        page: 1,
        totalResults: 0,
        hasMore: false,
      } satisfies UnifiedSearchResult);
    }

    const empty = { results: [], page, totalPages: 0, totalResults: 0 };

    const [movies, shows] = await Promise.all([
      getCatalogueProvider().search(query, page).catch(() => empty),
      getTVProvider().search(query, page).catch(() => empty),
    ]);

    return NextResponse.json({
      results: mergeSearchResults(movies.results, shows.results, query),
      page,
      totalResults: movies.totalResults + shows.totalResults,
      hasMore: page < movies.totalPages || page < shows.totalPages,
    } satisfies UnifiedSearchResult);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
