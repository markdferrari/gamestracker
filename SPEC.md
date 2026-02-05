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

Phase 3: Recent releases

    I want a tab on the main page that switches to "Recently released" games
    - It should pull the most recently released games for each platform, going back a max of 60 days.
    - All other behaviour should match the current main page.
    - Rename the main page to "Coming soon"

Feature:
    A "Track this Game" button on the detail page.

    Persistence: Can this be written to a cookie for users?
    Route Handler: Create a POST route in /api/watchlist to handle this file write.

Feature:
    Light/dark mode toggle

Feature: SST (Ion) Deployment to AWS
  
  Overview:
    Deploy Next.js application to AWS using SST Ion (v3), which provides:
    - AWS infrastructure as code with Pulumi/Terraform
    - Automatic CloudFront CDN setup
    - Lambda for server-side rendering
    - Environment variable management
    - Custom domain configuration with existing Route53 and ACM
  
  Infrastructure Dependencies:
    - Route53 Hosted Zone: whencaniplayit.com (created via Terraform in /iac)
    - ACM Certificate: *.whencaniplayit.com (to be imported)
    - AWS Profile: markdferrari
    - Region: eu-west-1
  
  SST Configuration (sst.config.ts):
    1. AWS Provider setup with profile "markdferrari"
    2. Next.js site configuration:
       - Domain: whencaniplayit.com
       - Environment variables from .env.local:
         * IGDB_CLIENT_ID
         * IGDB_CLIENT_SECRET
       - Custom domain using existing Route53 zone
       - SSL certificate from ACM
    3. Build settings:
       - OpenNext adapter for AWS Lambda
       - Image optimization via Lambda
       - ISR (Incremental Static Regeneration) support
  
  Package.json Scripts:
    - "sst:dev" - Local development with SST
    - "sst:deploy" - Deploy to AWS (production)
    - "sst:remove" - Remove all AWS resources
  
  Deployment Workflow:
    1. Install SST: npm install --save-dev sst
    2. Initialize SST: npx sst init
    3. Configure sst.config.ts with domain and environment
    4. Set up secrets: npx sst secret set IGDB_CLIENT_ID <value>
    5. Deploy: npm run sst:deploy
  
  File Storage Considerations:
    - data/notes/*.md files need to be handled:
      Decision: Store in S3 bucket and read via AWS SDK
    - Recommended: Migrate to S3 for production, keep local for dev
  
  Security:
    - Secrets managed via SST Secret
    - API keys never in code or version control
    - IAM roles with least privilege
    - CloudFront with HTTPS only
  

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