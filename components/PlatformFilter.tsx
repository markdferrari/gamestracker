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
    <div className="mb-6 flex items-center gap-4">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Platform:
      </label>
      <div className="flex gap-2">
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handlePlatformChange(platform.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              currentPlatform === platform.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            } border border-zinc-200 dark:border-zinc-700`}
          >
            {platform.name}
          </button>
        ))}
      </div>
    </div>
  );
}
