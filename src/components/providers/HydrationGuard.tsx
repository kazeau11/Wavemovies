import Script from "next/script";

/**
 * Strips attributes injected by browser extensions (e.g. Bitdefender
 * bis_skin_checked) before React hydrates, preventing false mismatch warnings.
 */
export function HydrationGuard() {
  return (
    <Script id="hydration-extension-guard" strategy="beforeInteractive">
      {`
(function () {
  var LEGACY_KEYS = ["wave-profiles", "wave-watchlist-v2", "wave-continue-watching-v2"];
  for (var i = 0; i < LEGACY_KEYS.length; i++) {
    try { localStorage.removeItem(LEGACY_KEYS[i]); } catch (e) {}
  }

  var STORAGE_KEYS = ["wave-watchlist", "wave-continue-watching"];
  for (var j = 0; j < STORAGE_KEYS.length; j++) {
    var storageKey = STORAGE_KEYS[j];
    try {
      var raw = localStorage.getItem(storageKey);
      if (!raw) continue;
      var parsed = JSON.parse(raw);
      var state = parsed && parsed.state;
      if (
        !state ||
        typeof state !== "object" ||
        state.byProfile != null ||
        (state.items != null && !Array.isArray(state.items))
      ) {
        localStorage.removeItem(storageKey);
      }
    } catch (e) {
      try { localStorage.removeItem(storageKey); } catch (err) {}
    }
  }

  var ATTRS = ["bis_skin_checked", "bis_register"];
  function strip(node) {
    if (!node || node.nodeType !== 1) return;
    for (var i = 0; i < ATTRS.length; i++) {
      if (node.hasAttribute(ATTRS[i])) node.removeAttribute(ATTRS[i]);
    }
    for (var j = 0; j < node.children.length; j++) strip(node.children[j]);
  }
  if (document.documentElement) strip(document.documentElement);
  if (typeof MutationObserver !== "undefined" && document.documentElement) {
    new MutationObserver(function (mutations) {
      for (var k = 0; k < mutations.length; k++) {
        var m = mutations[k];
        if (
          m.type === "attributes" &&
          m.attributeName &&
          ATTRS.indexOf(m.attributeName) !== -1 &&
          m.target
        ) {
          m.target.removeAttribute(m.attributeName);
        }
        if (m.addedNodes) {
          for (var n = 0; n < m.addedNodes.length; n++) strip(m.addedNodes[n]);
        }
      }
    }).observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
  }
})();
      `}
    </Script>
  );
}
