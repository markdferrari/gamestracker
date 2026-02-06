'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { OpenCriticReview, TrendingGame } from '@/lib/opencritic';
import { useEffect, useRef, useState } from 'react';

type CarouselItem = OpenCriticReview | TrendingGame;

interface ReviewCarouselProps {
  reviews: OpenCriticReview[];
}

export function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!scrollRef.current || reviews.length === 0 || isPaused) return;

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
  }, [reviews.length, isPaused]);

  if (reviews.length === 0) {
    return <div />;
  }

  // Duplicate reviews for seamless loop
  const duplicatedReviews = [...reviews, ...reviews];

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
          {duplicatedReviews.map((review, index) => {
            const slug = review.name.toLowerCase().replace(/\s+/g, '-');
            const openCriticUrl = `https://opencritic.com/game/${review.id}/${slug}`;
            const roundedScore = review.topCriticScore ? Math.round(review.topCriticScore) : null;

            const href = review.igdbId ? `/game/${review.igdbId}` : openCriticUrl;
            const internalHrefWithOc = review.igdbId
              ? `/game/${review.igdbId}?oc=${review.id}`
              : openCriticUrl;
            const isExternal = internalHrefWithOc.startsWith('http');

            const getTierColor = (tier?: string) => {
              switch (tier) {
                case 'Mighty':
                  return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200';
                case 'Strong':
                  return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200';
                case 'Fair':
                  return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200';
                case 'Weak':
                  return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200';
                default:
                  return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-200';
              }
            };

            const rawImageUrl = 
              review.igdbCoverUrl ||
              review.images.box?.sm || 
              review.images.box?.og || 
              review.images.banner?.sm || 
              review.images.banner?.og;

            return (
              <Link
                key={`${review.id}-${index}`}
                {...(isExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : undefined)}
                href={internalHrefWithOc}
                className="group block"
              >
                <div className="flex flex-col gap-3 rounded-lg border border-zinc-200/70 bg-white/80 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800/70 dark:bg-zinc-900/80 min-w-fit">
                  {/* Cover Image */}
                  <div className="relative h-40 w-28 flex-shrink-0 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
                    {rawImageUrl ? (
                      <Image
                        src={rawImageUrl}
                        alt={`${review.name} cover`}
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
                        {review.name}
                      </h3>
                      {review.tier && (
                        <span
                          className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase ${getTierColor(review.tier)}`}
                        >
                          {review.tier}
                        </span>
                      )}
                    </div>

                    {/* Score and Percent Recommended */}
                    <div className="flex flex-col gap-1">
                      {roundedScore !== null && (
                        <div className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            {roundedScore}
                          </span>
                        </div>
                      )}
                      
                      {/* Hover-revealed percent recommended */}
                      {review.percentRecommended !== undefined && (
                        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:max-h-6 group-hover:opacity-100">
                          <span className="text-xs text-zinc-600 dark:text-zinc-400">
                            {Math.round(review.percentRecommended)}% recommend
                          </span>
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
