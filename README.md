# Wave — Modern Movie Streaming Platform

Wave is a production-quality movie streaming website with a dark UI, smooth animations, and a modular catalogue system.

## Features

- **Homepage** — Featured hero, search, genres, trending, popular, recently added, continue watching
- **Movie pages** — Poster, backdrop, metadata, related movies, Watch Now
- **Built-in video player** — Direct MP4, embed, or public-domain demo fallback
- **Search & filtering** — Full catalogue search with genre/category filters
- **Infinite scroll** — Paginated catalogue loading
- **Watchlist & continue watching** — Local persistence via browser storage
- **Responsive design** — Desktop, tablet, and mobile layouts
- **Modular catalogue** — Swap TMDB or 1Flex providers via environment config

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy environment config:

```bash
cp .env.example .env.local
```

3. Add your free TMDB API key to `.env.local`:

```
TMDB_API_KEY=your_key_here
```

Get a key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Catalogue Providers

### TMDB (default)

Legal, authorised movie metadata API. Set in `.env.local`:

```
CATALOGUE_PROVIDER=tmdb
TMDB_API_KEY=your_key
```

### 1Flex (modular)

When you have authorised 1Flex API access, configure:

```
CATALOGUE_PROVIDER=oneflex
ONEFLEX_API_URL=https://your-authorised-api-endpoint
ONEFLEX_API_KEY=your_key
```

The `OneFlexProvider` expects standard REST endpoints (`/movies/trending`, `/movies/{id}`, etc.) and does not scrape or redistribute protected content.

## Project Structure

```
src/
├── app/                    # Next.js pages & API routes
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── movies/             # Cards, rows, hero, grid
│   └── video/              # Video player
└── lib/
    ├── catalogue/          # Modular provider system
    │   └── providers/      # tmdb.ts, oneflex.ts
    ├── storage/            # Watchlist, continue watching
    └── video/              # Playback resolution logic
```

## Playback

Wave resolves playback in this order:

1. Authorised `streamUrl` from catalogue provider
2. Authorised `embedUrl` for iframe embedding
3. Public-domain demo preview (keeps UI fully functional)

## Legal Notice

Wave does not scrape, copy, or redistribute copyrighted movies or protected streaming URLs. Configure only authorised API/catalogue sources you have permission to use.
