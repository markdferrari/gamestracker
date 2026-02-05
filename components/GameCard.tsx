import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Gamepad2 } from 'lucide-react';
import type { IGDBGame } from '@/lib/igdb';
import { formatReleaseDate } from '@/lib/igdb';

interface GameCardProps {
  game: IGDBGame;
}

export function GameCard({ game }: GameCardProps) {
  // Get the cover image URL and convert to high-res
  const coverUrl = game.cover?.url
    ? `/api/image?url=${encodeURIComponent(
        `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`,
      )}`
    : '/placeholder-game.png';

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

  return (
    <Link href={`/game/${game.id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={coverUrl}
            alt={game.name}
            fill
            unoptimized
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {game.name}
          </h3>

          {/* Release Date */}
          <div className="mb-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-4 w-4" />
            <span>{releaseDateHuman}</span>
          </div>

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
