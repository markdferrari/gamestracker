"use client";

import { useEffect, useState } from 'react';
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
  const currentStudio = searchParams.get('studio') || '';

  const [studios, setStudios] = useState<Array<{ id: number; name: string }>>([]);
  const [studioLoading, setStudioLoading] = useState(true);
  const [studioError, setStudioError] = useState(false);

  const handlePlatformChange = (platformId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('platform', platformId);
    router.push(`/?${params.toString()}`);
  };

  const handleStudioChange = (studioId: string) => {
    const params = new URLSearchParams(searchParams);
    if (studioId) {
      params.set('studio', studioId);
    } else {
      params.delete('studio');
    }
    router.push(`/?${params.toString()}`);
  };

  useEffect(() => {
    let isActive = true;
    const fetchStudios = async () => {
      setStudioLoading(true);
      setStudioError(false);

      try {
        const response = await fetch('/api/studios');
        if (!response.ok) {
          throw new Error('Failed to load studios');
        }
        const data: Array<{ id: number; name: string }> = await response.json();
        if (!isActive) return;
        setStudios(data);
      } catch (error) {
        if (!isActive) return;
        setStudioError(true);
        setStudios([]);
      } finally {
        if (!isActive) return;
        setStudioLoading(false);
      }
    };

    void fetchStudios();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
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
      <div className="flex flex-col gap-1">
        <label htmlFor="studio-filter" className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Studio
        </label>
        <select
          id="studio-filter"
          value={currentStudio}
          onChange={(event) => handleStudioChange(event.target.value)}
          className="max-w-full rounded-2xl border border-zinc-200/80 bg-white/90 px-3 py-2 text-sm font-semibold text-zinc-700 uppercase tracking-wide shadow-sm transition hover:border-sky-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-zinc-800/70 dark:bg-zinc-900/80 dark:text-zinc-200"
        >
          <option value="">All studios</option>
          {studios.map((studio) => (
            <option key={studio.id} value={studio.id.toString()}>
              {studio.name}
            </option>
          ))}
        </select>
        {studioLoading && (
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">Loading studios…</span>
        )}
        {studioError && (
          <span className="text-xs uppercase tracking-[0.3em] text-red-500">Failed to load studios</span>
        )}
      </div>
    </div>
  );
}
