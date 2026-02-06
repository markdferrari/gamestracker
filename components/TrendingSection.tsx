import { getRecentlyReleased } from '@/lib/opencritic';
import type { TrendingGame } from '@/lib/opencritic';
import { TrendingCarousel } from './TrendingCarousel';
import { Flame } from 'lucide-react';

export async function TrendingSection() {
  let games: TrendingGame[] = [];

  try {
    games = await getRecentlyReleased(10);
  } catch (error) {
    console.error('Failed to fetch trending games:', error);
    // Return empty games array on error
    games = [];
  }

  return (
    <aside className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Trending
        </h2>
      </div>

      <div className="flex-1 overflow-hidden">
        {games.length > 0 ? (
          <TrendingCarousel games={games} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-zinc-200/70 bg-white/80 p-6 text-center dark:border-zinc-800/70 dark:bg-zinc-900/80">
            <div>
              <Flame className="mx-auto mb-2 h-8 w-8 text-zinc-400 dark:text-zinc-500" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                No games available
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
