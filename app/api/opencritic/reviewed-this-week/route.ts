import { getReviewedThisWeek } from '@/lib/opencritic';
import {
  OPENCRITIC_CAROUSEL_TTL_SECONDS,
  OPENCRITIC_JITTER_SECONDS,
  jitterTtl,
} from '@/lib/opencritic-cache';

const reviewedRevalidate = jitterTtl(OPENCRITIC_CAROUSEL_TTL_SECONDS, OPENCRITIC_JITTER_SECONDS);

export const revalidate = reviewedRevalidate;

export async function GET() {
  try {
    const reviews = await getReviewedThisWeek(10);
    return new Response(JSON.stringify({ reviews }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch latest reviews:', error);
    return new Response(JSON.stringify({ reviews: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
