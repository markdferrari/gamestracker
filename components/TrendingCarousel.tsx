'use client';

import type { TrendingGame } from '@/lib/opencritic';
import { AutoScrollCarousel } from './AutoScrollCarousel';
import { CarouselCard } from './CarouselCard';

interface TrendingCarouselProps {
  games: TrendingGame[];
}

const buildPlatformLabel = (game: TrendingGame) =>
  game.platforms?.[0]?.name;

export function TrendingCarousel({ games }: TrendingCarouselProps) {
  const getKey = (game: TrendingGame, index: number) => `${game.id}-${index}`;

  return (
    <AutoScrollCarousel
      items={games}
      getItemKey={getKey}
      renderItem={(game) => {
        const slug = game.name.toLowerCase().replace(/\s+/g, '-');
        const openCriticUrl = `https://opencritic.com/game/${game.id}/${slug}`;
        const href = game.igdbId ? `/game/${game.igdbId}?oc=${game.id}` : openCriticUrl;
        const isExternal = href.startsWith('http');
        const rawImageUrl =
          game.igdbCoverUrl ||
          game.images.box?.sm ||
          game.images.box?.og ||
          game.images.banner?.sm ||
          game.images.banner?.og;
        const platformLabel = buildPlatformLabel(game);
        const roundedScore = game.topCriticScore ? Math.round(game.topCriticScore) : undefined;

        return (
          <CarouselCard
            href={href}
            isExternal={isExternal}
            imageUrl={rawImageUrl ?? undefined}
            name={game.name}
            tier={game.tier}
            platformLabel={platformLabel}
            releaseDate={game.releaseDate}
            score={roundedScore}
            percentRecommended={game.percentRecommended}
          />
        );
      }}
    />
  );
}

