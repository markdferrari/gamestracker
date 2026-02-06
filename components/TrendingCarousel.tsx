'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { TrendingGame } from '@/lib/opencritic';
import { Star } from 'lucide-react';

interface TrendingCarouselProps {
  games: TrendingGame[];
}

export function TrendingCarousel({ games }: TrendingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!scrollRef.current || games.length === 0 || isPaused) return;

    const scrollContainer = scrollRef.current;
    let scrollPosition = 0;

    const scroll = () => {
      if (!scrollContainer) return;
      
      scrollPosition += 1;
      
      // Reset to start when reaching the end
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 50);

    return () => clearInterval(intervalId);
  }, [games.length, isPaused]);

  if (games.length === 0) {
    return <div />;
  }

  // Duplicate games for seamless loop
  const duplicatedGames = [...games, ...games];

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className="hide-scrollbar w-full overflow-x-scroll"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex flex-row gap-4">
          {duplicatedGames.map((game, index) => {
            const slug = game.name.toLowerCase().replace(/\s+/g, '-');
            const openCriticUrl = `https://opencritic.com/game/${game.id}/${slug}`;
            const roundedScore = game.topCriticScore ? Math.round(game.topCriticScore) : null;
            const platformNames = game.platforms?.map((p) => p.name).join(', ') || 'Unknown';

            const href = game.igdbId ? `/game/${game.igdbId}?oc=${game.id}` : openCriticUrl;
            const isExternal = href.startsWith('http');

            const rawImageUrl =
              game.igdbCoverUrl ||
              game.images.box?.sm ||
              game.images.box?.og ||
              game.images.banner?.sm ||
              game.images.banner?.og;

            return (
              <Link
                key={`${game.id}-${index}`}
                {...(isExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : undefined)}
                href={href}
                className="group block"
              >
                <div className="flex flex-col gap-3 rounded-lg border border-zinc-200/70 bg-white/80 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-900/80 min-w-fit">
                  {/* Cover Image */}
                  <div className="relative h-40 w-28 flex-shrink-0 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
                    {rawImageUrl ? (
                      <Image
                        src={rawImageUrl}
                        alt={`${game.name} cover`}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-zinc-200 dark:bg-zinc-700">
                        <Star className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex min-w-0 flex-col justify-between gap-2">
                    <div>
                      <h3 className="line-clamp-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {game.name}
                      </h3>
                      {platformNames && platformNames !== 'Unknown' && (
                        <span className="mt-1 inline-block rounded bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                          {platformNames.split(', ')[0]}
                        </span>
                      )}
                    </div>

                    {/* Release Date and Score */}
                    <div className="flex flex-col gap-1">
                      {game.releaseDate && (
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">
                          {new Date(game.releaseDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      )}

                      {/* Hover-revealed score */}
                      {roundedScore !== null && (
                        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:max-h-6 group-hover:opacity-100">
                          <div className="flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              {roundedScore}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

