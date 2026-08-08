import { NextRequest, NextResponse } from "next/server";

const CINEJOY_ORIGIN = process.env.CINEJOY_ORIGIN ?? "https://cinejoy.to";

function getUpstreamBase(): string | null {
  const upstream = process.env.CINEJOY_CATALOGUE_UPSTREAM?.trim();
  if (upstream) return upstream.replace(/\/$/, "");

  const tmdbKey = process.env.TMDB_API_KEY?.trim();
  if (tmdbKey) return `https://api.themoviedb.org/3`;

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const upstream = getUpstreamBase();
  if (!upstream) {
    return NextResponse.json(
      {
        error:
          "Catalogue not configured. Set CINEJOY_CATALOGUE_UPSTREAM or TMDB_API_KEY in environment variables.",
      },
      { status: 503 }
    );
  }

  const { path } = await params;
  const pathname = `/${path.join("/")}`;
  const search = request.nextUrl.search;
  const tmdbKey = process.env.TMDB_API_KEY?.trim();

  const target = new URL(`${pathname}${search}`, `${upstream}/`);

  if (tmdbKey && upstream.includes("themoviedb.org")) {
    target.searchParams.set("api_key", tmdbKey);
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (!upstream.includes("themoviedb.org")) {
    headers.Origin = CINEJOY_ORIGIN;
    headers.Referer = `${CINEJOY_ORIGIN}/`;
  }

  try {
    const response = await fetch(target.toString(), { headers, next: { revalidate: 300 } });
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Catalogue proxy failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
