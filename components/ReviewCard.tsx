import Image from 'next/image';
import Link from 'next/link';
import { Star, Trophy } from 'lucide-react';
import type { OpenCriticReview } from '@/lib/opencritic';

interface ReviewCardProps {
  review: OpenCriticReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  // Get the cover image URL - prefer box art sm, fallback to og, then banner
  const rawImageUrl = 
    review.images.box?.sm || 
    review.images.box?.og || 
    review.images.banner?.sm || 
    review.images.banner?.og;
  const imageUrl = rawImageUrl
    ? `/api/image?url=${encodeURIComponent(rawImageUrl)}`
    : null;

  // Create URL-friendly slug for OpenCritic link
  const slug = review.name.toLowerCase().replace(/\s+/g, '-');
  const openCriticUrl = `https://opencritic.com/game/${review.id}/${slug}`;

  // Tier color mapping
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

  return (
    <Link href={openCriticUrl} target="_blank" rel="noopener noreferrer">
      <div className="group relative h-full overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800/70 dark:bg-zinc-900/80">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${review.name} cover`}
              fill
              unoptimized
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-zinc-200 dark:bg-zinc-700">
              <Trophy className="h-12 w-12 text-zinc-400 dark:text-zinc-500" aria-label="No Image" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          {/* Tier Badge */}
          {review.tier && (
            <div
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getTierColor(review.tier)}`}
            >
              <Trophy className="h-3 w-3" />
              {review.tier}
            </div>
          )}

          {/* Game Title */}
          <h3 className="line-clamp-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {review.name}
          </h3>

          {/* Score and Reviews */}
          <div className="flex items-center gap-3">
            {review.topCriticScore !== undefined && (
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {review.topCriticScore}
                </span>
              </div>
            )}
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {review.numReviews} reviews
            </span>
          </div>

          {/* Percent Recommended */}
          {review.percentRecommended !== undefined && (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {review.percentRecommended}% recommended
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
