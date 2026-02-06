import { getReviewedThisWeek } from '@/lib/opencritic';

export const revalidate = 86400;

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
