"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  variant?: "default" | "pill";
}

export function SearchBar({
  className,
  defaultValue = "",
  autoFocus,
  variant = "default",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <Search
        className={cn(
          "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-wave-muted",
          variant === "pill" ? "left-3.5" : "left-3"
        )}
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={variant === "pill" ? "Search movies or shows..." : "Search movies..."}
        autoFocus={autoFocus}
        className={cn(
          "w-full text-sm text-white placeholder:text-wave-muted/70 transition-all duration-200 focus:outline-none",
          variant === "pill"
            ? "rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 backdrop-blur-sm focus:border-white/20 focus:bg-white/10"
            : "rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 focus:border-wave-accent/40 focus:bg-white/10 focus:ring-2 focus:ring-wave-accent/20"
        )}
      />
    </form>
  );
}
