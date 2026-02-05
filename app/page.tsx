import { getUpcomingPSGames, getRecentlyReleasedGames } from '@/lib/igdb';
import type { IGDBGame } from '@/lib/igdb';
import { GameCard } from '@/components/GameCard';
import { PlatformFilter } from '@/components/PlatformFilter';
import { ViewToggle } from '@/components/ViewToggle';
import { Suspense } from 'react';
import Image from 'next/image';

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

  const title = view === 'recent' ? 'Recently Released' : 'Coming Soon';
  const subtitle = view === 'recent' 
    ? 'Games released in the past 60 days'
    : 'Upcoming game releases';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-zinc-200 dark:bg-zinc-900/80 dark:ring-zinc-800">
            <Image
              src="/logo.png"
              alt="WhenCanIPlayIt.com"
              width={260}
              height={260}
              priority
            />
          </div>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
            {subtitle}
          </p>
        </div>

        {/* View Toggle */}
        <Suspense fallback={<div>Loading...</div>}>
          <div className="mb-6">
            <ViewToggle />
          </div>
        </Suspense>

        {/* Platform Filter */}
        <Suspense fallback={<div>Loading filters...</div>}>
          <PlatformFilter />
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
      </main>
    </div>
  );
}
