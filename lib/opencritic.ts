// OpenCritic API helpers for fetching game reviews

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

  if (limit && limit > 0) {
    return data.slice(0, limit);
  }

  return data;
}
