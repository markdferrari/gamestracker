'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const PLATFORMS = [
  { id: '1', name: 'PlayStation' },
  { id: '2', name: 'Xbox' },
  { id: '5', name: 'Nintendo' },
  { id: 'pc', name: 'PC' },
];

export function PlatformFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPlatform = searchParams.get('platform') || '1';

  const handlePlatformChange = (platformId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('platform', platformId);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
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
