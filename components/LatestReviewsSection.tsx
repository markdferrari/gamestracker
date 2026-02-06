import type { OpenCriticReview } from '@/lib/opencritic';
import { ReviewCarousel } from './ReviewCarousel';
import { Trophy } from 'lucide-react';
import { headers } from 'next/headers';

export async function LatestReviewsSection() {
  let reviews: OpenCriticReview[] = [];

  try {
    const headerList = await headers();
    const host = headerList.get('x-forwarded-host') ?? headerList.get('host');
    const protocol = headerList.get('x-forwarded-proto') ?? 'http';
    const fallbackBaseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'http://localhost:3000';
    const baseUrl = host ? `${protocol}://${host}` : fallbackBaseUrl;
    const requestUrl = `${baseUrl}/api/opencritic/reviewed-this-week?limit=10`;

    const response = await fetch(requestUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`OpenCritic proxy failed: ${response.status} ${response.statusText}`);
    }

    reviews = (await response.json()) as OpenCriticReview[];
  } catch (error) {
    console.error('Failed to fetch latest reviews:', error);
    // Return empty reviews array on error
    reviews = [];
  }

  return (
    <aside className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <Trophy className="h-5 w-5 text-sky-600 dark:text-sky-400" />
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Latest Reviews
        </h2>
      </div>

      <div className="flex-1 overflow-hidden">
        {reviews.length > 0 ? (
          <ReviewCarousel reviews={reviews} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-zinc-200/70 bg-white/80 p-6 text-center dark:border-zinc-800/70 dark:bg-zinc-900/80">
            <div>
              <Trophy className="mx-auto mb-2 h-8 w-8 text-zinc-400 dark:text-zinc-500" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                No reviews available
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
