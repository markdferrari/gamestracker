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

  const screenshotSource = game.screenshots?.[0]?.url;
  const coverSource = game.cover?.url;
  const screenshotUrl = normalizeIgdbImage(screenshotSource, 't_screenshot_huge');
  const coverUrl = normalizeIgdbImage(coverSource, 't_cover_big');

  // Get the earliest release date for this game
  const releaseDate = game.release_dates?.[0]?.date || game.first_release_date;
  const releaseDateHuman = game.release_dates?.[0]?.human ||
    (releaseDate ? formatReleaseDate(releaseDate) : 'TBA');

  // Get platform names
  const platforms = game.release_dates
    ?.map(rd => rd.platform?.name)
    .filter((name, index, self) => name && self.indexOf(name) === index) // unique platforms
    || game.platforms?.map(p => p.name) 
    || [];

  const selectedImageUrl = screenshotUrl || coverUrl || '/game-placeholder.svg';
  const imageAspect = screenshotUrl ? 'aspect-[16/9]' : 'aspect-[3/4]';

  return (
    <Link href={`/game/${game.id}`}>
      <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800/70 dark:bg-zinc-900/80">
        {/* Cover Image */}
        <div className={`relative ${imageAspect} w-full overflow-hidden rounded-t-2xl bg-zinc-100 dark:bg-zinc-800`}> 
          <Image
            src={selectedImageUrl}
            alt={game.name}
            fill
            unoptimized
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          <div className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
            {releaseDateHuman}
          </div>
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {game.name}
          </h3>

          {/* Platforms */}
          {platforms.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Gamepad2 className="h-4 w-4" />
              <span className="line-clamp-1">{platforms.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
