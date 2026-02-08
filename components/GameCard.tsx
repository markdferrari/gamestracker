import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import type { IGDBGame } from '@/lib/igdb';
import { formatReleaseDate } from '@/lib/igdb';

interface GameCardProps {
  game: IGDBGame;
}

export function GameCard({ game }: GameCardProps) {
  const normalizeIgdbImage = (url?: string, variant = 't_cover_big') =>
    url
      ? `/api/image?url=${encodeURIComponent(
          `https:${url.replace('t_thumb', variant)}`,
        )}`
      : undefined;

  const coverUrl = normalizeIgdbImage(game.cover?.url, 't_cover_big');

  const releaseDate = game.release_dates?.[0]?.date || game.first_release_date;
  const releaseDateHuman =
    game.release_dates?.[0]?.human ||
    (releaseDate ? formatReleaseDate(releaseDate) : 'TBA');

  const platforms =
    game.release_dates
      ?.map(rd => rd.platform?.name)
      .filter((name, index, self) => name && self.indexOf(name) === index) ||
    game.platforms?.map(p => p.name) ||
    [];

  const selectedImageUrl = coverUrl || '/game-placeholder.svg';

  return (
    <Link href={`/game/${game.id}`}>
      <div className="group overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800/70 dark:bg-zinc-900/80">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-56 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 md:h-56 md:w-40 md:shrink-0">
            <Image
              src={selectedImageUrl}
              alt={game.name}
              fill
              unoptimized
              className="object-contain p-3 transition-opacity group-hover:opacity-95"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 33vw"
            />
          </div>

          <div className="space-y-3 p-4 md:p-6">
            <div className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
              {releaseDateHuman}
            </div>
            <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {game.name}
            </h3>

            {platforms.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Gamepad2 className="h-4 w-4" />
                <span className="line-clamp-1">{platforms.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
