import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Gamepad2 } from 'lucide-react';
import { getGameById, formatReleaseDate } from '@/lib/igdb';
import { getGameNote } from '@/lib/notes';
import { GameLinks } from '@/components/GameLinks';
import { ReviewSection } from '@/components/ReviewSection';
import { ScreenshotGallery } from '@/components/ScreenshotGallery';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ oc?: string }>;
}

const formatReleaseBadge = (unixSeconds: number) => {
  const now = Date.now();
  const target = unixSeconds * 1000;
  const diffMs = target - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays > 0) {
    return `${diffDays} days away`;
  }

  return `${Math.abs(diffDays)} days ago`;
};

export default async function GameDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const gameId = parseInt(id, 10);

  if (isNaN(gameId)) {
    notFound();
  }

  // Fetch game data and user notes in parallel
  const [game, note] = await Promise.all([
    getGameById(gameId),
    getGameNote(gameId),
  ]);

  if (!game) {
    notFound();
  }

  // Get the cover image URL
  const coverUrl = game.cover?.url
    ? `/api/image?url=${encodeURIComponent(
        `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`,
      )}`
    : null;

  // Get screenshots
  const screenshots = game.screenshots?.map(s => 
    `/api/image?url=${encodeURIComponent(
      `https:${s.url.replace('t_thumb', 't_screenshot_big')}`,
    )}`
  ) || [];

  const similarGames = (game.similar_games ?? [])
    .slice(0, 6)
    .map((similar) => ({
      id: similar.id,
      name: similar.name,
      coverUrl: similar.cover?.url
        ? `/api/image?url=${encodeURIComponent(
            `https:${similar.cover.url.replace('t_thumb', 't_cover_big')}`,
          )}`
        : null,
    }));

  // Get release date
  const releaseDate = game.release_dates?.[0]?.date || game.first_release_date;
  const releaseDateHuman = game.release_dates?.[0]?.human || 
    (releaseDate ? formatReleaseDate(releaseDate) : 'TBA');
  const releaseDateBadge = releaseDate
    ? formatReleaseBadge(releaseDate)
    : 'TBA';

  // Get platforms
  const platforms = game.release_dates
    ?.map(rd => rd.platform?.name)
    .filter((name, index, self) => name && self.indexOf(name) === index)
    || game.platforms?.map(p => p.name) 
    || [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_45%)]">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to games
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Cover & Meta */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div
                  className="mb-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 px-4 py-3 text-white dark:from-zinc-100 dark:to-zinc-300 dark:text-zinc-900"
                  data-testid="release-date-hero"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
                    Release date
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {releaseDateHuman}
                  </div>
                  <div className="text-sm opacity-80">{releaseDateBadge}</div>
                </div>

                {coverUrl ? (
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                    <Image
                      src={coverUrl}
                      alt={game.name}
                      fill
                      unoptimized
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 80vw, 360px"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[3/4] items-center justify-center rounded-xl bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    No cover available
                  </div>
                )}
              </div>

              {/* Meta Information */}
              <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Release Date</span>
                  </div>
                  <p className="mt-1 text-zinc-900 dark:text-zinc-100">{releaseDateHuman}</p>
                </div>

                {platforms.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Gamepad2 className="h-4 w-4" />
                      <span className="font-medium">Platforms</span>
                    </div>
                    <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                      {platforms.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews & Ratings */}
            <div className="mt-6">
              <ReviewSection
                game={game}
                openCriticIdFromQuery={(() => {
                  const raw = resolvedSearchParams?.oc;
                  if (!raw) return null;
                  const parsed = parseInt(raw, 10);
                  return Number.isNaN(parsed) ? null : parsed;
                })()}
              />
            </div>

            {/* External Links */}
            <div className="mt-6">
              <GameLinks websites={game.websites} />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {game.name}
              </h1>
              {platforms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <span
                      key={platform}
                      className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              )}
              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                <Calendar className="h-3.5 w-3.5" />
                <span>{releaseDateHuman}</span>
              </div>
            </div>

            {/* Summary */}
            {game.summary && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  About
                </h2>
                <p className="mt-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {game.summary}
                </p>
              </div>
            )}

            <div className="mt-8 border-t border-zinc-200/70 pt-8 dark:border-zinc-800/70" />

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Screenshots
                </h2>
                <div className="mt-4">
                  <ScreenshotGallery screenshots={screenshots} title={game.name} />
                </div>
              </div>
            )}

            {similarGames.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Similar games
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {similarGames.map((similar) => (
                    <Link
                      key={similar.id}
                      href={`/game/${similar.id}`}
                      className="group rounded-2xl border border-zinc-200/70 bg-white/90 p-3 transition hover:border-sky-500 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-950/70"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                        {similar.coverUrl ? (
                          <Image
                            src={similar.coverUrl}
                            alt={similar.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 160px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[0.55rem] uppercase tracking-[0.4em] text-zinc-400">
                            No cover
                          </div>
                        )}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {similar.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Notes */}
            {note && (
              <div className="mt-8 rounded-lg border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  📝 My Notes
                </h2>
                {note.data.hype_level && (
                  <div className="mt-2">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Hype Level: {note.data.hype_level}
                    </span>
                  </div>
                )}
                <div className="prose prose-zinc mt-4 max-w-none dark:prose-invert">
                  {note.content.split('\n').map((line, index) => {
                    if (line.startsWith('## ')) {
                      return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.replace('## ', '')}</h3>;
                    } else if (line.startsWith('- ')) {
                      return <li key={index} className="ml-4">{line.replace('- ', '')}</li>;
                    } else if (line.trim()) {
                      return <p key={index} className="mb-2">{line}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
