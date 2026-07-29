import { NextResponse } from "next/server";
import { getTVProvider } from "@/lib/catalogue";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const provider = getTVProvider();
    const show = await provider.getShow(id);

    if (!show) {
      return NextResponse.json({ error: "TV show not found" }, { status: 404 });
    }

    return NextResponse.json(show);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch TV show";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
