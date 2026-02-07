'use client';

import type { OpenCriticReview } from '@/lib/opencritic';
import { AutoScrollCarousel } from './AutoScrollCarousel';
import { CarouselCard } from './CarouselCard';

interface ReviewCarouselProps {
  reviews: OpenCriticReview[];
}

export function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const getKey = (review: OpenCriticReview, index: number) => `${review.id}-${index}`;

  return (
    <AutoScrollCarousel
      items={reviews}
      getItemKey={getKey}
      renderItem={(review) => {
        const slug = review.name.toLowerCase().replace(/\s+/g, '-');
        const openCriticUrl = `https://opencritic.com/game/${review.id}/${slug}`;
        const href = review.igdbId ? `/game/${review.igdbId}?oc=${review.id}` : openCriticUrl;
        const isExternal = href.startsWith('http');
        const rawImageUrl =
          review.igdbCoverUrl ||
          review.images.box?.sm ||
          review.images.box?.og ||
          review.images.banner?.sm ||
          review.images.banner?.og;
        const roundedScore = review.topCriticScore ? Math.round(review.topCriticScore) : undefined;

        return (
          <CarouselCard
            href={href}
            isExternal={isExternal}
            imageUrl={rawImageUrl ?? undefined}
            name={review.name}
            tier={review.tier}
            releaseDate={review.releaseDate}
            score={roundedScore}
            percentRecommended={review.percentRecommended}
          />
        );
      }}
    />
  );
}
