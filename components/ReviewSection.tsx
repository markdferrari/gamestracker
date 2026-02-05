import { ExternalLink, Star } from 'lucide-react';
import { getGameReviews, shouldShowReviews, formatRating, type GameReviews } from '@/lib/reviews';
import type { IGDBGame } from '@/lib/igdb';

interface ReviewSectionProps {
  game: IGDBGame;
}

export function ReviewSection({ game }: ReviewSectionProps) {
  // Check if game is recent enough to show reviews
  const releaseDate = game.release_dates?.[0]?.date || game.first_release_date;
  
  if (!shouldShowReviews(releaseDate)) {
    return null;
  }

  const reviews = getGameReviews({
    external_games: game.external_games,
    aggregated_rating: game.aggregated_rating,
    aggregated_rating_count: game.aggregated_rating_count,
    name: game.name,
  });

  if (!reviews.hasReviews && !reviews.openCriticUrl) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Reviews & Ratings
      </h2>

      <div className="mt-4 space-y-4">
        {/* IGDB Community Rating */}
        {reviews.igdbRating && (
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    IGDB Community Rating
                  </span>
                </div>
                {reviews.igdbRatingCount && (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Based on {reviews.igdbRatingCount.toLocaleString()} ratings
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {formatRating(reviews.igdbRating)}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  out of 100
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Site Links */}
        <div className="grid gap-3 sm:grid-cols-2">
          {reviews.metacriticUrl && (
            <a
              href={reviews.metacriticUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-600 dark:hover:bg-blue-950"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-yellow-500 text-sm font-bold text-white">
                  MC
                </div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  Metacritic Reviews
                </span>
              </div>
              <ExternalLink className="h-4 w-4 flex-shrink-0 text-zinc-600 dark:text-zinc-400" />
            </a>
          )}

          {reviews.openCriticUrl && (
            <a
              href={reviews.openCriticUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-600 dark:hover:bg-blue-950"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-red-500 text-sm font-bold text-white">
                  OC
                </div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  OpenCritic Reviews
                </span>
              </div>
              <ExternalLink className="h-4 w-4 flex-shrink-0 text-zinc-600 dark:text-zinc-400" />
            </a>
          )}
        </div>

        {/* No reviews message for very recent games */}
        {!reviews.hasReviews && releaseDate && releaseDate > (Date.now() / 1000) - (7 * 24 * 60 * 60) && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              🎮 This game was recently released. Reviews may not be available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
