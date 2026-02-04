Project Spec: PS-Release HQ (Next.js 16)
1. Overview

A "Project Command Center" for PlayStation enthusiasts to track upcoming game releases via the IGDB API and manage personal hype notes/research via local Markdown files.

Core Tech Stack:

    Framework: Next.js 15 (App Router)

    Styling: Tailwind CSS

    Data Source 1: IGDB API (via Twitch OAuth)

    Data Source 2: Local File System (data/notes/*.md)

    Icons: Lucide React

2. Technical Architecture
Data Strategy

    Server Components: Use for the main dashboard and game detail pages to fetch IGDB data securely (keeping API keys private).

    Caching: Implement next: { revalidate: 86400 } (24 hours) for IGDB fetches to stay within API limits.

    File System: Use fs and path inside Server Components to read local .md files corresponding to game IDs.

Directory Structure
Plaintext

/gamestracker
  /app
    /api/watchlist/route.ts   # JSON API for list management
    /game/[id]/page.tsx       # Dynamic route for game details
    /page.tsx                 # Dashboard (Upcoming Releases)
    /layout.tsx               # Sidebar & Main Nav
  /components
    /GameCard.tsx             # Visual card for release list
    /StatusBadge.tsx          # "Hype" status indicator
  /data
    /notes/                   # User's personal markdown files (e.g., 12345.md)
  /lib
    /igdb.ts                  # Logic for Twitch Auth & API calls
  /.env.local                 # IGDB_CLIENT_ID, IGDB_CLIENT_SECRET

3. Key Requirements & Features
Phase 1: The "Coming Soon" Dashboard

    Query: Fetch games from IGDB where platforms = (48, 167) (PS4/PS5) and release_dates.date > [current_timestamp].

    UI: A responsive grid of cards showing:

        Game Cover Art

        Title

        Human-readable release date

        Platform icons (PS4/PS5)

Phase 2: Game Detail & Local Integration

    Dynamic Page: Clicking a card leads to /game/[id].

    Hybrid View: 1. Display official summary and screenshots from IGDB. 2. Search the /data/notes/ folder for a file named [id].md. 3. If found, parse using gray-matter and render content below the official info.

Phase 3: Simple Watchlist (Practice CRUD)

    Feature: A "Track this Game" button on the detail page.

    Persistence: For this practice version, saving a game should write the ID to a data/watchlist.json file.

    Route Handler: Create a POST route in /api/watchlist to handle this file write.

4. API Implementation Details (for IGDB)

    Auth: Must implement a getAccessToken() function in lib/igdb.ts that handles the POST to https://id.twitch.tv/oauth2/token.

    Fields: Request name, summary, cover.url, first_release_date, platforms, screenshots.url, release_dates.human.

5. Implementation Instructions for the Agent

    Step 1: Initialize Next.js with Tailwind and TypeScript.

    Step 2: Set up the lib/igdb.ts helper to handle Twitch authentication.

    Step 3: Build the main page.tsx as a Server Component to list upcoming PS5 games.

    Step 4: Implement the dynamic route [id]/page.tsx and the markdown file-reading logic.

    Step 5: Add a basic sidebar that lists titles of all .md files currently in the data/notes folder.