"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);

    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith("wave-")) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      /* ignore */
    }

    const reloadKey = "wave-recovery-reload";
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, "1");
      window.location.replace("/");
      return;
    }

    sessionStorage.removeItem(reloadKey);
    reset();
  }, [error, reset]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <p className="text-sm text-white/60">Loading Wave...</p>
      </body>
    </html>
  );
}
