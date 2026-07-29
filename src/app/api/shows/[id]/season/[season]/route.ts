import { NextResponse } from "next/server";
import { getTVProvider } from "@/lib/catalogue";

interface RouteParams {
  params: Promise<{ id: string; season: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id, season } = await params;
    const seasonNumber = Number(season);
    if (Number.isNaN(seasonNumber) || seasonNumber < 0) {
      return NextResponse.json({ error: "Invalid season" }, { status: 400 });
    }

    const provider = getTVProvider();
    const seasonData = await provider.getSeason(id, seasonNumber);

    if (!seasonData) {
      return NextResponse.json({ error: "Season not found" }, { status: 404 });
    }

    return NextResponse.json(seasonData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch season";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
