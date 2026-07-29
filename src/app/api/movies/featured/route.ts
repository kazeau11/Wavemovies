import { NextResponse } from "next/server";
import { getCatalogueProvider } from "@/lib/catalogue";

export async function GET() {
  try {
    const provider = getCatalogueProvider();
    const featured = await provider.getFeatured();
    return NextResponse.json(featured);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch featured movie";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
