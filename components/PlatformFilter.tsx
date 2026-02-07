'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const PLATFORMS = [
  { id: '1', name: 'PlayStation' },
  { id: '2', name: 'Xbox' },
  { id: '5', name: 'Nintendo' },
  { id: 'pc', name: 'PC' },
];

interface PlatformFilterProps {
  genres: Array<{ id: number; name: string }>;
}

export function PlatformFilter({ genres }: PlatformFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPlatform = searchParams.get('platform') || '1';
  const currentGenre = searchParams.get('genre') || '';

  const handleSelectChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="grid gap-4">
      <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">
        Platform
        <select
          value={currentPlatform}
          onChange={(event) => handleSelectChange('platform', event.target.value)}
          className="mt-2 w-full rounded-2xl border border-zinc-200/70 bg-white px-3 py-2 text-sm text-zinc-800 dark:border-zinc-800/70 dark:bg-zinc-950/70 dark:text-zinc-100"
        >
          {PLATFORMS.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-xs uppercase tracking-[0.3em] text-zinc-500">
        Genre
        <select
          value={currentGenre}
          onChange={(event) => handleSelectChange('genre', event.target.value)}
          className="mt-2 w-full rounded-2xl border border-zinc-200/70 bg-white px-3 py-2 text-sm text-zinc-800 dark:border-zinc-800/70 dark:bg-zinc-950/70 dark:text-zinc-100"
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id.toString()}>
              {genre.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
