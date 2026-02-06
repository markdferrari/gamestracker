import { NextResponse } from 'next/server';
import { getReviewedThisWeek } from '@/lib/opencritic';

export const revalidate = 60 * 60 * 24 * 7;

export async function GET() {
  try {
    const reviews = await getReviewedThisWeek(10);
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Failed to fetch latest reviews:', error);
    return NextResponse.json({ reviews: [] });
  }
}
