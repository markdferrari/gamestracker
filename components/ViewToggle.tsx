'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const VIEWS = [
  { id: 'upcoming', name: 'Coming Soon' },
  { id: 'recent', name: 'Recently Released' },
];

export function ViewToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'upcoming';

  const handleViewChange = (viewId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('view', viewId);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      {VIEWS.map((view) => (
        <button
          key={view.id}
          onClick={() => handleViewChange(view.id)}
          className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
            currentView === view.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
          } border border-zinc-200 dark:border-zinc-700`}
        >
          {view.name}
        </button>
      ))}
    </div>
  );
}
