"use client";

import { Database, Film, Info } from "lucide-react";
import { WaveLogo } from "@/components/ui/WaveLogo";

export default function SettingsPage() {
  const provider = process.env.NEXT_PUBLIC_CATALOGUE_PROVIDER ?? "tmdb";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-white">Settings</h1>
      <p className="mb-8 text-wave-muted">Configure your Wave experience</p>

      <div className="space-y-6">
        <section className="rounded-2xl glass p-6">
          <WaveLogo size="md" href={undefined} className="mb-4" />
          <h2 className="text-lg font-semibold text-white">About Wave</h2>
          <p className="mt-2 text-sm leading-relaxed text-wave-muted">
            Wave is a modern movie streaming platform with a modular catalogue system.
            Switch between authorised data providers without rebuilding the interface.
          </p>
        </section>

        <section className="rounded-2xl glass p-6">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-wave-accent" />
            <h2 className="text-lg font-semibold text-white">Catalogue Provider</h2>
          </div>
          <p className="mt-3 text-sm text-wave-muted">
            Active provider: <span className="font-medium text-white capitalize">{provider}</span>
          </p>
          <div className="mt-4 space-y-3 text-sm text-wave-muted">
            <p>
              Wave loads movies dynamically from the{" "}
              <strong className="text-white">1Flex catalogue</strong> at{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5">db.1flex.org</code> — the same
              database used by 1flex.org. Over 1 million titles with posters, backdrops, genres,
              ratings and runtime.
            </p>
            <p>
              To switch to direct TMDB, set{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5">CATALOGUE_PROVIDER=tmdb</code> and
              add your TMDB API key.
            </p>
          </div>
        </section>

        <section className="rounded-2xl glass p-6">
          <div className="flex items-center gap-3">
            <Film className="h-5 w-5 text-wave-accent-2" />
            <h2 className="text-lg font-semibold text-white">Playback</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-wave-muted">
            When an authorised streaming source is available from your catalogue provider, Wave plays it
            directly. Otherwise, public-domain demo previews are used to keep the player fully functional.
          </p>
        </section>

        <section className="rounded-2xl glass p-6">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-wave-accent-3" />
            <h2 className="text-lg font-semibold text-white">Data Storage</h2>
          </div>
          <p className="mt-3 text-sm text-wave-muted">
            Your watchlist and continue-watching progress are stored locally in your browser.
            No account is required.
          </p>
        </section>
      </div>
    </div>
  );
}
