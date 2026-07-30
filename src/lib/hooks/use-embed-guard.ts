"use client";

import { useEffect } from "react";

/** Block pop-ups and top-level hijacks while the embed player is active. */
export function useEmbedGuard(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const originalOpen = window.open.bind(window);
    window.open = () => null;

    const onBlur = () => {
      // Pop-under ads often steal focus — refocus Wave when the embed blurs the window.
      requestAnimationFrame(() => {
        if (document.visibilityState === "visible") {
          window.focus();
        }
      });
    };

    window.addEventListener("blur", onBlur);

    return () => {
      window.open = originalOpen;
      window.removeEventListener("blur", onBlur);
    };
  }, [active]);
}
