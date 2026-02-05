Project Spec: PS-WhenCanIPlayIt.com (Next.js 16)
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


Feature:
    A "Track this Game" button on the detail page.

    Persistence: Can this be written to a cookie for users?
    Route Handler: Create a POST route in /api/watchlist to handle this file write.

Feature:
    Light/dark mode toggle
Feature:
    Mobile device optimisation
Feature:
    Branding

Feature: link to reviews for released games

    Purpose: Help users discover critical and user reception for recently released games
    
    Data Source: 
    - Primary: OpenCritic API (free tier available, aggregate scores + review links)
    - Fallback: Parse external_games data from IGDB for Metacritic IDs
    - Alternative: Use IGDB websites field to find review site links
    
    Display Requirements:
    1. Game Detail Page:
       - Show review section below external links (if game was released in past 6 months)
       - Display aggregate scores with distinctive styling
       - Show "Top Critic Average" and "% Recommended" if available
       - Link to full reviews on OpenCritic/Metacritic
       - List 3-5 individual review snippets with scores and publication names
       
    2. Game Cards (Recently Released view only):
       - Optional: Show small score badge (e.g., "85" with OpenCritic/Metacritic logo)
       - Badge only appears if game has been released for 7+ days (reviews take time)
    
    Technical Implementation:
    - Create lib/reviews.ts with functions to fetch review data
    - Check IGDB's external_games field for Metacritic/OpenCritic IDs
    - Cache review data for 7 days (reviews don't change often)
    - Gracefully handle missing review data (not all games get reviewed)
    
    User Experience:
    - Reviews only shown for games released within past 180 days
    - Clear visual distinction between aggregate scores and individual reviews
    - "No reviews yet" message for newly released games
    - Links open in new tabs
    
    Future Enhancement:
    - User review aggregation
    - Filter games by review score
    - Review score trends over time


Feature:
    Hide button to dismiss games
    Should be persistent, again via cookies?
4. API Implementation Details (for IGDB)

    Auth: Must implement a getAccessToken() function in lib/igdb.ts that handles the POST to https://id.twitch.tv/oauth2/token.

    Fields: Request name, summary, cover.url, first_release_date, platforms, screenshots.url, release_dates.human.

5. Implementation Instructions for the Agent

    Step 1: Initialize Next.js with Tailwind and TypeScript if not already done so.

    Step 2: Set up the lib/igdb.ts helper to handle Twitch authentication.

    Step 3: Build the main page.tsx as a Server Component to list upcoming PS5 games.

    Step 4: Implement the dynamic route [id]/page.tsx and the markdown file-reading logic.

    Step 5: Add a basic sidebar that lists titles of all .md files currently in the data/notes folder.