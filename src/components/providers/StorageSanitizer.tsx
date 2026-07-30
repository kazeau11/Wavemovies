import Script from "next/script";

/**
 * Repairs or removes corrupted Wave localStorage entries before React boots.
 */
export function StorageSanitizer() {
  return (
    <Script id="wave-storage-sanitizer" strategy="beforeInteractive">
      {`
(function () {
  var KEYS = ["wave-profiles", "wave-watchlist-v2", "wave-continue-watching-v2"];
  for (var i = 0; i < KEYS.length; i++) {
    var key = KEYS[i];
    try {
      var raw = localStorage.getItem(key);
      if (!raw) continue;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        localStorage.removeItem(key);
        continue;
      }
      var state = parsed.state;
      if (!state || typeof state !== "object") continue;
      if (key === "wave-profiles" && state.profiles != null && !Array.isArray(state.profiles)) {
        state.profiles = [];
        localStorage.setItem(key, JSON.stringify(parsed));
      }
      if (state.byProfile != null && (typeof state.byProfile !== "object" || Array.isArray(state.byProfile))) {
        state.byProfile = {};
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    } catch (e) {
      try { localStorage.removeItem(key); } catch (err) {}
    }
  }
})();
      `}
    </Script>
  );
}
