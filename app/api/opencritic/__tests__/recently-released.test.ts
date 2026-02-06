import { GET, revalidate } from '@/app/api/opencritic/recently-released/route';
import * as opencriticLib from '@/lib/opencritic';
import {
  OPENCRITIC_CAROUSEL_TTL_SECONDS,
  OPENCRITIC_JITTER_SECONDS,
} from '@/lib/opencritic-cache';

jest.mock('@/lib/opencritic', () => ({
  getRecentlyReleased: jest.fn(),
}));

describe('GET /api/opencritic/recently-released', () => {
  const mockGames: opencriticLib.TrendingGame[] = [
    {
      id: 1,
      name: 'Game One',
      images: { box: { og: 'https://example.com/game1.jpg' } },
      platforms: [{ id: 6, name: 'PC' }],
      releaseDate: '2026-02-06',
      topCriticScore: 82,
      numReviews: 20,
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the trending games', async () => {
    (opencriticLib.getRecentlyReleased as jest.Mock).mockResolvedValue(mockGames);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ games: mockGames });
    expect(opencriticLib.getRecentlyReleased).toHaveBeenCalledWith(6);
  });

  it('handles API errors without caching them', async () => {
    (opencriticLib.getRecentlyReleased as jest.Mock).mockRejectedValue(new Error('boom'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ games: [] });
  });

  it('exports a jittered revalidate value', () => {
    expect(revalidate).toBeGreaterThanOrEqual(
      OPENCRITIC_CAROUSEL_TTL_SECONDS - OPENCRITIC_JITTER_SECONDS
    );
    expect(revalidate).toBeLessThanOrEqual(
      OPENCRITIC_CAROUSEL_TTL_SECONDS + OPENCRITIC_JITTER_SECONDS
    );
  });
});
