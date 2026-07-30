"use client";

import { ONEFLEX_EMBED_PROVIDERS } from "@/lib/oneflex";

interface EmbedServerPickerProps {
  value: string;
  onChange: (serverId: string) => void;
}

const SERVER_OPTIONS = Object.entries(ONEFLEX_EMBED_PROVIDERS).map(([id, { label }]) => ({
  id,
  label,
}));

export function EmbedServerPicker({ value, onChange }: EmbedServerPickerProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <label htmlFor="embed-server" className="text-sm text-wave-muted">
        Stream host
      </label>
      <select
        id="embed-server"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-wave-accent/40 focus:outline-none"
      >
        {SERVER_OPTIONS.map(({ id, label }) => (
          <option key={id} value={id} className="bg-wave-bg">
            {label}
          </option>
        ))}
      </select>
      <p className="text-xs text-white/40">
        Getting redirected? Switch host and press Play again.
      </p>
    </div>
  );
}
