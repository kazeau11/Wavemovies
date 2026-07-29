import { NextResponse } from "next/server";
import { getCatalogueProvider } from "@/lib/catalogue";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? "1");

    const provider = getCatalogueProvider();
    const data = await provider.getRelated(id, page);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch related movies";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
