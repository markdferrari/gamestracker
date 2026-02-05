// IGDB API helpers for fetching PlayStation game data

let cachedToken: { access_token: string; expires_at: number } | null = null;

export interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
  game_status?: number;
  cover?: {
    url: string;
  };
  first_release_date?: number;
  platforms?: Array<{ id: number; name: string }>;
  screenshots?: Array<{ url: string }>;
  release_dates?: Array<{
    human: string;
    date: number;
    date_format?: number;
    status?: number;
    platform: { id: number; name: string };
  }>;
  websites?: Array<{
    category: number;
    url: string;
  }>;
  external_games?: Array<{
    category: number;
    uid: string;
  }>;
  aggregated_rating?: number;
  aggregated_rating_count?: number;
}

interface IGDBReleaseDate {
  id: number;
  date: number;
  human?: string;
  date_format?: number;
  status?: number;
  platform?: { id: number; name: string };
  game: {
    id: number;
    name: string;
    summary?: string;
    game_status?: number;
    cover?: { url: string };
    first_release_date?: number;
    platforms?: Array<{ id: number; name: string }>;
    screenshots?: Array<{ url: string }>;
  };
}

/**
 * Get Twitch OAuth token for IGDB API access
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expires_at > Date.now()) {
    return cachedToken.access_token;
  }

  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('IGDB_CLIENT_ID and IGDB_CLIENT_SECRET must be set in .env.local');
  }

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Cache the token (expires_in is in seconds, convert to milliseconds)
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000 - 60000, // Subtract 1 minute for safety
  };

  return data.access_token;
}

/**
 * Make a request to the IGDB API
 */
async function igdbRequest<T>(endpoint: string, body: string): Promise<T> {
  const token = await getAccessToken();
  const clientId = process.env.IGDB_CLIENT_ID!;

  const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!response.ok) {
    throw new Error(`IGDB API error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetch upcoming games for a specific platform
 */
export async function getUpcomingPSGames(platformId: number = 167): Promise<IGDBGame[]> {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const sixMonthsAhead = currentTimestamp + (60 * 60 * 24 * 180); // 6 months

  const query = `
    fields date, human, date_format, status, platform.id, platform.name,
      game.id, game.name, game.summary, game.cover.url, game.first_release_date,
      game.game_status, game.platforms.name, game.screenshots.url;
    where game.platforms = (${platformId}) & date != null & date > ${currentTimestamp} & date <= ${sixMonthsAhead}
      & platform = ${platformId} & date_format != 7 & game.game_status != 0;
    sort date asc;
    limit 100;
  `;

  const isTbc = (human?: string) => {
    if (!human) return false;
    const normalized = human.toLowerCase();
    return normalized.includes('tbc') || normalized.includes('tbd');
  };

  const releaseDates = await igdbRequest<IGDBReleaseDate[]>('release_dates', query);
  const gamesById = new Map<number, IGDBGame>();

  for (const releaseDate of releaseDates) {
    if (!releaseDate.game || isTbc(releaseDate.human)) continue;
    if (releaseDate.date <= currentTimestamp || releaseDate.date > sixMonthsAhead) continue;

    const existing = gamesById.get(releaseDate.game.id);
    const game: IGDBGame = existing ?? {
      id: releaseDate.game.id,
      name: releaseDate.game.name,
      summary: releaseDate.game.summary,
      game_status: releaseDate.game.game_status,
      cover: releaseDate.game.cover,
      first_release_date: releaseDate.game.first_release_date,
      platforms: releaseDate.game.platforms,
      screenshots: releaseDate.game.screenshots,
      release_dates: [],
    };

    game.release_dates = game.release_dates ?? [];
    game.release_dates.push({
      human: releaseDate.human ?? '',
      date: releaseDate.date,
      date_format: releaseDate.date_format,
      status: releaseDate.status,
      platform: releaseDate.platform ?? { id: platformId, name: '' },
    });

    gamesById.set(game.id, game);
  }

  const games = Array.from(gamesById.values());
  const getPlatformReleaseDate = (game: IGDBGame) => {
    if (!game.release_dates || game.release_dates.length === 0) return null;

    const dates = game.release_dates
      .filter(
        (rd) =>
          rd.platform?.id === platformId &&
          typeof rd.date === 'number' &&
          rd.date > currentTimestamp &&
          rd.date <= sixMonthsAhead &&
          rd.date_format !== 7 &&
          !isTbc(rd.human),
      )
      .map((rd) => rd.date);

    if (dates.length === 0) return null;
    return Math.min(...dates);
  };

  return games
    .map((game) => ({
      ...game,
      release_dates: (game.release_dates ?? []).sort((a, b) => a.date - b.date),
    }))
    .filter((game) => {
      const date = getPlatformReleaseDate(game);
      return typeof date === 'number' && date > currentTimestamp;
    })
    .sort((a, b) => {
      const aDate = getPlatformReleaseDate(a) ?? 0;
      const bDate = getPlatformReleaseDate(b) ?? 0;
      return aDate - bDate;
    })
    .slice(0, 20);
}

/**
 * Fetch recently released games for a specific platform (past 60 days)
 */
export async function getRecentlyReleasedGames(platformId: number = 167): Promise<IGDBGame[]> {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const sixtyDaysAgo = currentTimestamp - (60 * 24 * 60 * 60); // 60 days in seconds

  const query = `
    fields name, summary, cover.url, first_release_date, game_status, platforms.name, screenshots.url, release_dates.human, release_dates.date, release_dates.platform.name, release_dates.platform.id;
    where platforms = (${platformId}) & release_dates.date != null & release_dates.date >= ${sixtyDaysAgo} & release_dates.date <= ${currentTimestamp} & release_dates.platform = ${platformId} & game_status = 0;
    sort release_dates.date desc;
    limit 50;
  `;

  const games = await igdbRequest<IGDBGame[]>('games', query);
  
  // Filter games to ensure they have valid release dates within the past 60 days for the specific platform
  const filteredGames = games.filter((game: IGDBGame) => {
    if (!game.release_dates || game.release_dates.length === 0) return false;
    
    // Only include if this specific platform has a release in the past 60 days
    const platformReleaseDates = game.release_dates.filter(rd => rd.platform?.id === platformId);
    
    return platformReleaseDates.some(rd => 
      rd.date && 
      rd.date >= sixtyDaysAgo && 
      rd.date <= currentTimestamp
    );
  });
  
  // Sort by the platform-specific release date and limit to 20
  return filteredGames
    .sort((a: IGDBGame, b: IGDBGame) => {
      const aDate = a.release_dates?.find((rd: { platform?: { id: number }; date?: number }) => rd.platform?.id === platformId)?.date || 0;
      const bDate = b.release_dates?.find((rd: { platform?: { id: number }; date?: number }) => rd.platform?.id === platformId)?.date || 0;
      return bDate - aDate; // Descending order (newest first)
    })
    .slice(0, 20);
}

/**
 * Fetch a single game by ID
 */
export async function getGameById(id: number): Promise<IGDBGame | null> {
  const query = `
    fields name, summary, cover.url, first_release_date, platforms.name, screenshots.url, release_dates.human, release_dates.date, release_dates.platform.name, websites.category, websites.url, external_games.category, external_games.uid, aggregated_rating, aggregated_rating_count;
    where id = ${id};
  `;

  const results = await igdbRequest<IGDBGame[]>('games', query);
  return results.length > 0 ? results[0] : null;
}

/**
 * Format a Unix timestamp to a human-readable date
 */
export function formatReleaseDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
