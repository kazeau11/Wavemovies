"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WaveLogo } from "@/components/ui/WaveLogo";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/ui/SearchBar";
import { PAGE_X } from "@/lib/layout";
import { useProfiles } from "@/lib/storage/profiles";
import { ProfileAvatar } from "@/components/profiles/ProfileAvatar";
import { useHasMounted } from "@/lib/hooks/use-has-mounted";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv-shows", label: "TV Shows" },
  { href: "/genres", label: "Genres" },
  { href: "/movies?section=trending", label: "Trending" },
  { href: "/movies?section=top-rated", label: "Top Rated" },
  { href: "/watchlist", label: "My List" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const mounted = useHasMounted();
  const activeProfile = useProfiles((state) => state.getActiveProfile());
  const [mobileOpen, setMobileOpen] = useState(false);
  const isCinematic =
    pathname === "/" ||
    pathname.startsWith("/movie/") ||
    pathname.startsWith("/show/") ||
    pathname === "/tv-shows";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isCinematic
          ? "bg-gradient-to-b from-black/70 via-black/30 to-transparent"
          : "border-b border-white/5 bg-wave-bg/95 backdrop-blur-md"
      )}
    >
      <nav
        className={cn(
          "flex h-[72px] w-full items-center gap-6 sm:gap-8 lg:gap-10",
          PAGE_X
        )}
      >
        <WaveLogo size="md" className="shrink-0" />

        <ul className="hidden list-none items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : href.includes("?")
                  ? false
                  : pathname === href || pathname.startsWith(`${href.split("?")[0]}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "text-[15px] font-medium transition-colors duration-200",
                    active ? "text-white" : "text-white/55 hover:text-white"
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          <SearchBar variant="pill" className="hidden w-48 md:block lg:w-60 xl:w-72" />
          <Link
            href="/profile"
            className="hidden h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/5 transition-colors hover:bg-white/10 sm:flex"
            aria-label="Profile"
          >
            {mounted && activeProfile ? (
              <ProfileAvatar avatarId={activeProfile.avatarId} size="sm" className="h-9 w-9 text-base" />
            ) : (
              <span className="h-4 w-4 rounded-full bg-white/20" />
            )}
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-white/60 transition-colors hover:text-white lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-wave-bg/98 backdrop-blur-md lg:hidden"
          >
            <div className="space-y-4 px-5 py-4">
              <SearchBar variant="pill" />
              <ul className="flex list-none flex-col gap-1">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
