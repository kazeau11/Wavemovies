import { NextResponse } from "next/server";
import { getFeaturedWatchProviders } from "@/lib/catalogue/provider-logos";

export async function GET() {
  try {
    const providers = await getFeaturedWatchProviders();
    return NextResponse.json({ providers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch providers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
