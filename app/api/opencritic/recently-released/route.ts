import { getRecentlyReleased } from '@/lib/opencritic';
import {
  OPENCRITIC_CAROUSEL_TTL_SECONDS,
  OPENCRITIC_JITTER_SECONDS,
  jitterTtl,
} from '@/lib/opencritic-cache';

const trendingRevalidate = jitterTtl(OPENCRITIC_CAROUSEL_TTL_SECONDS, OPENCRITIC_JITTER_SECONDS);

export const revalidate = trendingRevalidate;

export async function GET() {
  try {
    const games = await getRecentlyReleased(6);
    return new Response(JSON.stringify({ games }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch trending games:', error);
    return new Response(JSON.stringify({ games: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
