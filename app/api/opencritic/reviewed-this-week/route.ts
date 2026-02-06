import { NextResponse } from 'next/server';
import { getReviewedThisWeek } from '@/lib/opencritic';

export const revalidate = 604800; // 7 days in seconds

export async function GET() {
  try {
    const reviews = await getReviewedThisWeek(10);
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Failed to fetch latest reviews:', error);
    return NextResponse.json({ reviews: [] });
  }
}
