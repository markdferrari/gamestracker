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
    Improved game detail page
        I want a more modern, user-friendly design on the game detail page.
        It should emphasise the release date and show the poster as a large object.

        Goals
        - Make the release date the primary focus (clear, high-contrast, easy to scan)
        - Present the cover/poster prominently with strong visual hierarchy
        - Improve readabspacing and typography
        - Ensure layout is responsive and looks polished on mobile

        Layout
        - Desktop (≥ 1024px): two-column layout
            - Left column: large poster, release date, platforms, rating summary, external links
            - Right column: title, summary, screenshots, notes, reviews
        - Mobile (< 1024px): single-column layout
            - Poster first, then release date + key metadata, then summary and screenshots

        Poster/Cover
        - Large cover image (3:4 ratio), rounded corners
        - Sticky on desktop left column if possible (not required)
        - Placeholder if cover missing

        Release Date Emphasis
        - Display as a “hero” badge near the cover
        - Show both human date and relative date (e.g., “Feb 5, 2026 — 12 days away”)
        - If unknown: show “TBA” with subdued styling

        Metadata Block
        - Platforms list with platform icons if available
        - Add genre and publisher if IGDB provides it (optional)
        - Clean card styling with subtle borders and shadows

        Screenshots
        - Responsive grid, 2 columns on desktop, 1 on mobile
        - Use consistent aspect ratios and rounded corners

        External Links + Reviews
        - Keep in left column under metadata (desktop)
        - On mobile, stack after metadata

        Accessibility
        - Alt text for all images
        - Proper heading hierarchy (H1 title, H2 sections)

        Acceptance Criteria
        - Release date is visually dominant and easy to find
        - Poster is large and high quality on all breakpoints
        - Layout is clean and readable on mobile
        - No visual regressions to external links/reviews/notes sections
    
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
Feature: 
    Embed official trailers

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