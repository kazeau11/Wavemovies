import { NextResponse } from "next/server";
import { getCatalogueProvider } from "@/lib/catalogue";

export async function GET() {
  try {
    const provider = getCatalogueProvider();
    const genres = await provider.getGenres();
    return NextResponse.json(genres);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch genres";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
