'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const PLATFORMS = [
  { id: '167', name: 'PlayStation 5' },
  { id: '6', name: 'PC' },
  { id: '169', name: 'Xbox Series S/X' },
  { id: '471', name: 'Nintendo Switch 2' },
];

export function PlatformFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPlatform = searchParams.get('platform') || '167';

  const handlePlatformChange = (platformId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('platform', platformId);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Platform
      </span>
      <div className="flex flex-wrap gap-2 rounded-full border border-zinc-200/70 bg-white/80 p-2 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-900/80">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handlePlatformChange(platform.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              currentPlatform === platform.id
                ? 'bg-sky-500 text-white shadow shadow-sky-500/40'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`}
          >
            {platform.name}
          </button>
        ))}
      </div>
    </div>
  );
}
