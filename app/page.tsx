import { getGameGenres, getUpcomingPSGames, getRecentlyReleasedGames } from '@/lib/igdb';
import type { IGDBGame } from '@/lib/igdb';
import { GameCard } from '@/components/GameCard';
import { LatestReviewsSection } from '@/components/LatestReviewsSection';
import { PlatformFilter } from '@/components/PlatformFilter';
import { TrendingSection } from '@/components/TrendingSection';
import { ViewToggle } from '@/components/ViewToggle';
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{ platform?: string; view?: string; genre?: string; studio?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const platformParam = params.platform || '1';
  const studioParam = params.studio;
  const platformFilter =
    platformParam === 'pc'
      ? ({ type: 'family', id: 4 } as const)
      : ({ type: 'family', id: parseInt(platformParam, 10) || 1 } as const);
  const view = params.view || 'upcoming';
  const genreParam = params.genre;
  const genresPromise = getGameGenres();
  
  let games: IGDBGame[] = [];
  let error = null;

  const parsedStudioId = studioParam ? parseInt(studioParam, 10) : undefined;
  const studioFilterId = typeof parsedStudioId === 'number' && !Number.isNaN(parsedStudioId) ? parsedStudioId : undefined;

  try {
    const genreId = genreParam ? parseInt(genreParam, 10) : undefined;
    if (view === 'recent') {
      games = await getRecentlyReleasedGames(platformFilter, genreId, studioFilterId);
    } else {
      games = await getUpcomingPSGames(platformFilter, genreId, studioFilterId);
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch games';
    games = [];
  }

  const genres = await genresPromise.catch(() => []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_45%)]">
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-zinc-200/70 bg-white/90 p-8 shadow-xl shadow-slate-900/5 dark:border-zinc-800/80 dark:bg-zinc-950/75">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-500">
            Tracking all the upcoming releases so you don&apos;t have to
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Stay ahead of every big game drop and score update.
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
            We surface verified release windows, recent review momentum, and trending scores so you can queue your next session with confidence.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
          <aside className="space-y-6 min-w-0">
            <Suspense fallback={
              <div className="rounded-2xl border border-zinc-200/70 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-2 h-4 rounded bg-zinc-200 dark:bg-zinc-700" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="mb-2 h-20 rounded bg-zinc-100 dark:bg-zinc-800" />
                ))}
              </div>
            }>
              <div className="rounded-2xl border border-zinc-200/70 bg-white/90 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/70">
                <LatestReviewsSection />
              </div>
            </Suspense>

            <div className="rounded-2xl border border-zinc-200/70 bg-white/90 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/70">
              <TrendingSection />
            </div>
          </aside>

          <section className="space-y-6 min-w-0">
            {error && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Mobile filters — visible above gamecard component on small screens */}
            <div className="rounded-3xl border border-zinc-200/70 bg-white/90 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/70 lg:hidden max-w-full overflow-hidden min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zinc-500">
                Filters
              </p>
              <div className="mt-4">
                <Suspense fallback={<div>Loading filters...</div>}>
                  <PlatformFilter genres={genres} />
                </Suspense>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200/70 bg-white/90 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/70 max-w-full overflow-hidden min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Suspense fallback={<div className="inline-flex rounded-full bg-zinc-200 h-10 w-60 dark:bg-zinc-800" />}>
                  <ViewToggle />
                </Suspense>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Ranked by nearest release
                </p>
              </div>
              <div className="mt-5 space-y-4">
                {games.length > 0 ? (
                  games.map((game) => <GameCard key={game.id} game={game} />)
                ) : (
                  !error && (
                    <div className="rounded-2xl border border-dashed border-zinc-200/70 bg-zinc-50/70 p-8 text-center text-sm text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-900/60 dark:text-zinc-300">
                      {view === 'recent' ? 'No recently released games found.' : 'No upcoming games found.'}
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6 hidden lg:block min-w-0">
            <div className="rounded-3xl border border-zinc-200/70 bg-white/90 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/70">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zinc-500">
                Filters
              </p>
              <div className="mt-4">
                <Suspense fallback={<div>Loading filters...</div>}>
                  <PlatformFilter genres={genres} />
                </Suspense>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
