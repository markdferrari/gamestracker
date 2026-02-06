// OpenCritic API helpers for fetching game reviews

import { searchGameByName } from './igdb';

const OPENCRITIC_BASE_URL = 'https://opencritic-api.p.rapidapi.com';

export interface OpenCriticGameDetails {
  id: number;
  name: string;
  tier?: string;
  topCriticScore?: number;
  numReviews?: number;
  percentRecommended?: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export async function getOpenCriticGameDetails(
  openCriticId: number
): Promise<OpenCriticGameDetails | null> {
  const rapidApiKey = process.env.RAPID_API_KEY;

  if (!rapidApiKey) {
    throw new Error('RAPID_API_KEY environment variable is required');
  }

  const response = await fetch(`${OPENCRITIC_BASE_URL}/game/${openCriticId}`, {
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com',
    },
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    return null;
  }

  const data: unknown = await response.json();
  if (!isRecord(data)) {
    return null;
  }

  const id = typeof data.id === 'number' ? data.id : openCriticId;
  const name = typeof data.name === 'string' ? data.name : '';
  const tier = typeof data.tier === 'string' ? data.tier : undefined;
  const topCriticScore =
    typeof data.topCriticScore === 'number' ? data.topCriticScore : undefined;
  const numReviews = typeof data.numReviews === 'number' ? data.numReviews : undefined;
  const percentRecommended =
    typeof data.percentRecommended === 'number' ? data.percentRecommended : undefined;

  if (!name) {
    return null;
  }

  return {
    id,
    name,
    tier,
    topCriticScore,
    numReviews,
    percentRecommended,
  };
}

export interface OpenCriticReview {
  id: number;
  name: string;
  images: {
    box?: { sm?: string; og?: string };
    banner?: { sm?: string; og?: string };
  };
  tier?: string;
  topCriticScore?: number;
  numReviews: number;
  percentRecommended?: number;
  releaseDate?: string;
  igdbCoverUrl?: string; // Added for fallback to IGDB images
  igdbId?: number; // Added for internal linking to /game/[id]
}

export interface TrendingGame {
  id: number;
  name: string;
  images: {
    box?: { sm?: string; og?: string };
    banner?: { sm?: string; og?: string };
  };
  platforms?: Array<{ id: number; name: string }>;
  releaseDate?: string;
  topCriticScore?: number;
  numReviews?: number;
  percentRecommended?: number;
  igdbCoverUrl?: string; // Added for fallback to IGDB images
  igdbId?: number; // Added for internal linking to /game/[id]
}

/**
 * Fetches games that have been reviewed this week from OpenCritic
 * @param limit Optional maximum number of games to return (default: all)
 * @returns Array of reviewed games
 */
export async function getReviewedThisWeek(
  limit?: number
): Promise<OpenCriticReview[]> {
  const rapidApiKey = process.env.RAPID_API_KEY;

  if (!rapidApiKey) {
    throw new Error('RAPID_API_KEY environment variable is required');
  }

  const response = await fetch(
    `${OPENCRITIC_BASE_URL}/game/reviewed-this-week`,
    {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com',
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `OpenCritic API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data: OpenCriticReview[] = await response.json();

  // Enrich with IGDB cover images
  const enrichedData = await Promise.all(
    data.map(async (game) => {
      try {
        const igdbGame = await searchGameByName(game.name);
        if (igdbGame) {
          const enriched: OpenCriticReview = {
            ...game,
            igdbId: igdbGame.id,
          };

          if (igdbGame.cover?.url) {
            // Convert thumbnail URL to cover_big (264x352)
            enriched.igdbCoverUrl = igdbGame.cover.url.replace('t_thumb', 't_cover_big');
          }

          return enriched;
        }
      } catch (error) {
        console.error(`Failed to fetch IGDB cover for ${game.name}:`, error);
      }
      return game;
    })
  );

  if (limit && limit > 0) {
    return enrichedData.slice(0, limit);
  }

  return enrichedData;
}

/**
 * Fetches recently released games from OpenCritic
 * @param limit Optional maximum number of games to return (default: all)
 * @returns Array of recently released games
 */
export async function getRecentlyReleased(
  limit?: number
): Promise<TrendingGame[]> {
  const rapidApiKey = process.env.RAPID_API_KEY;

  if (!rapidApiKey) {
    throw new Error('RAPID_API_KEY environment variable is required');
  }

  const response = await fetch(
    `${OPENCRITIC_BASE_URL}/game/recently-released`,
    {
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com',
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `OpenCritic API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data: TrendingGame[] = await response.json();

  // Enrich with IGDB cover images
  const enrichedData = await Promise.all(
    data.map(async (game) => {
      try {
        const igdbGame = await searchGameByName(game.name);
        if (igdbGame) {
          const enriched: TrendingGame = {
            ...game,
            igdbId: igdbGame.id,
          };

          if (igdbGame.cover?.url) {
            // Convert thumbnail URL to cover_big (264x352)
            enriched.igdbCoverUrl = igdbGame.cover.url.replace('t_thumb', 't_cover_big');
          }

          return enriched;
        }
      } catch (error) {
        console.error(`Failed to fetch IGDB cover for ${game.name}:`, error);
      }
      return game;
    })
  );

  if (limit && limit > 0) {
    return enrichedData.slice(0, limit);
  }

  return enrichedData;
}
