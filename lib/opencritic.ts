// OpenCritic API helpers for fetching game reviews

import { searchGameByName } from './igdb';

const OPENCRITIC_BASE_URL = 'https://opencritic-api.p.rapidapi.com';

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
        if (igdbGame?.cover?.url) {
          // Convert thumbnail URL to cover_big (264x352)
          const coverUrl = igdbGame.cover.url.replace('t_thumb', 't_cover_big');
          return { ...game, igdbCoverUrl: coverUrl };
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
