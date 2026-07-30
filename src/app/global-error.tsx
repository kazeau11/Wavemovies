"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const clearWaveData = () => {
    try {
      localStorage.removeItem("wave-profiles");
      localStorage.removeItem("wave-watchlist-v2");
      localStorage.removeItem("wave-continue-watching-v2");
    } catch {
      /* ignore */
    }
    window.location.href = "/";
  };

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-3 text-sm text-white/60">
            Wave hit a problem loading saved data on this device.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => reset()}>Try Again</Button>
            <Button variant="outline" onClick={clearWaveData}>
              Reset App Data
            </Button>
          </div>
          <Link href="/" className="mt-6 inline-block text-sm text-white/50 hover:text-white">
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
