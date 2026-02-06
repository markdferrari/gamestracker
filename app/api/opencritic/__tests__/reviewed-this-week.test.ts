import { GET, revalidate } from '@/app/api/opencritic/reviewed-this-week/route';
import * as opencriticLib from '@/lib/opencritic';

type Review = Parameters<(typeof opencriticLib)['getReviewedThisWeek']>[0];

jest.mock('@/lib/opencritic', () => ({
  getReviewedThisWeek: jest.fn(),
}));

describe('GET /api/opencritic/reviewed-this-week', () => {
  const mockReviews: opencriticLib.OpenCriticReview[] = [
    {
      id: 1,
      name: 'Test Game',
      images: { box: { og: '' } },
      numReviews: 1,
      tier: 'Strong',
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns cached reviews', async () => {
    (opencriticLib.getReviewedThisWeek as jest.Mock).mockResolvedValue(mockReviews);

    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ reviews: mockReviews });
    expect(opencriticLib.getReviewedThisWeek).toHaveBeenCalledWith(10);
  });

  it('never caches errors (returns 500)', async () => {
    (opencriticLib.getReviewedThisWeek as jest.Mock).mockRejectedValue(new Error('boom'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ reviews: [] });
  });

  it('exports the expected TTL', () => {
    expect(revalidate).toBe(86400);
  });
});
