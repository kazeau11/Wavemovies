"use client";

import { useEffect } from "react";

/** Block pop-ups and new tabs from hijacking the parent page while watching. */
export function useWatchGuard(active = true) {
  useEffect(() => {
    if (!active) return;

    const originalOpen = window.open.bind(window);
    window.open = () => null;

    const blockAuxClick = (event: MouseEvent) => {
      if (event.button === 1) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const blockBlankTarget = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("a[target='_blank']");
      if (target) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("auxclick", blockAuxClick, true);
    document.addEventListener("click", blockBlankTarget, true);

    return () => {
      window.open = originalOpen;
      document.removeEventListener("auxclick", blockAuxClick, true);
      document.removeEventListener("click", blockBlankTarget, true);
    };
  }, [active]);
}
