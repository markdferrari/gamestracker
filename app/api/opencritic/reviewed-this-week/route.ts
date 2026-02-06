import { getReviewedThisWeek } from '@/lib/opencritic';
import { NextResponse } from 'next/server';

let lastSuccessfulReviews: Awaited<ReturnType<typeof getReviewedThisWeek>> | null = null;
let lastSuccessfulAt = 0;
const STALE_MAX_AGE_MS = 60 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawLimit = searchParams.get('limit');
  const limit = rawLimit ? Number(rawLimit) : undefined;
  const safeLimit = Number.isFinite(limit) && limit && limit > 0 ? limit : undefined;

  try {
    const reviews = await getReviewedThisWeek(safeLimit);
    lastSuccessfulReviews = reviews;
    lastSuccessfulAt = Date.now();
    return NextResponse.json(reviews, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('OpenCritic proxy failed:', error);
    if (lastSuccessfulReviews && Date.now() - lastSuccessfulAt <= STALE_MAX_AGE_MS) {
      return NextResponse.json(lastSuccessfulReviews, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'X-OpenCritic-Stale': 'true',
        },
      });
    }

    return NextResponse.json([], {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }
}
