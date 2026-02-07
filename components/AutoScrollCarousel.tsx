'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface AutoScrollCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey: (item: T, index: number) => string;
}

export function AutoScrollCarousel<T>({
  items,
  renderItem,
  getItemKey,
}: AutoScrollCarouselProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!scrollRef.current || items.length === 0 || isPaused) return;

    const scrollContainer = scrollRef.current;
    let scrollPosition = 0;

    const scroll = () => {
      if (!scrollContainer) return;

      scrollPosition += 1;

      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 50);

    return () => clearInterval(intervalId);
  }, [items.length, isPaused]);

  if (items.length === 0) {
    return <div />;
  }

  const duplicatedItems = [...items, ...items];

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
          {duplicatedItems.map((item, index) => {
            const realIndex = index % items.length;
            const repeat = Math.floor(index / items.length);
            const baseKey = getItemKey(item, realIndex);
            return (
              <div key={`${baseKey}-${repeat}`} className="min-w-fit">
                {renderItem(item, realIndex)}
              </div>
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
