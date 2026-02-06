import { getUpcomingPSGames, getRecentlyReleasedGames } from '@/lib/igdb';
import type { IGDBGame } from '@/lib/igdb';
import { GameCard } from '@/components/GameCard';
import { PlatformFilter } from '@/components/PlatformFilter';
import { ViewToggle } from '@/components/ViewToggle';
import { LatestReviewsSection } from '@/components/LatestReviewsSection';
import { TrendingSection } from '@/components/TrendingSection';
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{ platform?: string; view?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const platformId = parseInt(params.platform || '167', 10);
  const view = params.view || 'upcoming';
  
  let games: IGDBGame[] = [];
  let error = null;

  try {
    if (view === 'recent') {
      games = await getRecentlyReleasedGames(platformId);
    } else {
      games = await getUpcomingPSGames(platformId);
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch games';
    games = [];
  }

  const subtitle = view === 'recent' 
    ? 'Games released in the past 60 days'
    : 'Upcoming game releases';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_45%)]">
      <main className="mx-auto flex max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Left Sidebar - Latest Reviews */}
        <Suspense fallback={
          <div className="w-80 flex-shrink-0">
            <div className="animate-pulse rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 h-6 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded bg-zinc-100 dark:bg-zinc-800" />
                ))}
              </div>
            </div>
          </div>
        }>
          <div className="hidden w-80 flex-shrink-0 lg:block">
            <div className="sticky top-4 h-[calc(100vh-8rem)]">
              <LatestReviewsSection />
            </div>
          </div>
        </Suspense>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-10 flex flex-col items-center text-center">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {subtitle}
            </p>
          </div>

          {/* Platform Filter */}
          <Suspense fallback={<div>Loading filters...</div>}>
            <div className="mb-8 flex justify-center">
              <PlatformFilter />
            </div>
          </Suspense>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Error:</strong> {error}
            </p>
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              Make sure you've set IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in .env.local
            </p>
          </div>
        )}

        {/* Games Grid */}
        {games.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          !error && (
            <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">
                {view === 'recent' ? 'No recently released games found.' : 'No upcoming games found.'}
              </p>
            </div>
          )
        )}
        </div>

        {/* Right Sidebar - Trending */}
        <Suspense fallback={
          <div className="w-80 flex-shrink-0">
            <div className="animate-pulse rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 h-6 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded bg-zinc-100 dark:bg-zinc-800" />
                ))}
              </div>
            </div>
          </div>
        }>
          <div className="hidden w-80 flex-shrink-0 lg:block">
            <div className="sticky top-4 h-[calc(100vh-8rem)]">
              <TrendingSection />
            </div>
          </div>
        </Suspense>
      </main>
    </div>
  );
}
