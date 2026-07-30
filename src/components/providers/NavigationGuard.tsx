"use client";

import { useEffect } from "react";

/**
 * Prevents new tabs/windows from the Wave app shell (window.open, target=_blank, etc.).
 * Embed players are additionally sandboxed in EmbedFrame.
 */
export function NavigationGuard() {
  useEffect(() => {
    const originalOpen = window.open;

    window.open = function (...args) {
      void args;
      return null;
    };

    const blockNewTabNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented) return;

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;

      const opensNewTab =
        anchor.getAttribute("target")?.toLowerCase() === "_blank" ||
        event.button === 1 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey;

      if (opensNewTab) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("click", blockNewTabNavigation, true);
    document.addEventListener("auxclick", blockNewTabNavigation, true);

    return () => {
      window.open = originalOpen;
      document.removeEventListener("click", blockNewTabNavigation, true);
      document.removeEventListener("auxclick", blockNewTabNavigation, true);
    };
  }, []);

  return null;
}
