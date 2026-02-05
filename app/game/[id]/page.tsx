import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Gamepad2 } from 'lucide-react';
import { getGameById, formatReleaseDate } from '@/lib/igdb';
import { getGameNote } from '@/lib/notes';
import { GameLinks } from '@/components/GameLinks';
import { ReviewSection } from '@/components/ReviewSection';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GameDetailPage({ params }: PageProps) {
  const { id } = await params;
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
    ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
    : null;

  // Get screenshots
  const screenshots = game.screenshots?.map(s => 
    `https:${s.url.replace('t_thumb', 't_screenshot_big')}`
  ) || [];

  // Get release date
  const releaseDate = game.release_dates?.[0]?.date || game.first_release_date;
  const releaseDateHuman = game.release_dates?.[0]?.human || 
    (releaseDate ? formatReleaseDate(releaseDate) : 'TBA');

  // Get platforms
  const platforms = game.release_dates
    ?.map(rd => rd.platform?.name)
    .filter((name, index, self) => name && self.indexOf(name) === index)
    || game.platforms?.map(p => p.name) 
    || [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
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
          <div className="lg:col-span-1">
            {coverUrl && (
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                <Image
                  src={coverUrl}
                  alt={game.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Meta Information */}
            <div className="mt-6 space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
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

            {/* Reviews & Ratings */}
            <div className="mt-6">
              <ReviewSection game={game} />
            </div>

            {/* External Links */}
            <div className="mt-6">
              <GameLinks websites={game.websites} />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {game.name}
            </h1>

            {/* Summary */}
            {game.summary && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  About
                </h2>
                <p className="mt-2 text-zinc-700 leading-relaxed dark:text-zinc-300">
                  {game.summary}
                </p>
              </div>
            )}

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Screenshots
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {screenshots.map((screenshot, index) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={screenshot}
                        alt={`${game.name} screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
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
