import { render, screen, waitFor } from '@testing-library/react';
import { LatestReviewsSection } from '../LatestReviewsSection';

jest.mock('next/headers', () => ({
  headers: async () =>
    new Headers({ host: 'localhost:3000', 'x-forwarded-proto': 'http' }),
}));

describe('LatestReviewsSection', () => {
  const originalFetch = globalThis.fetch;

  const mockReviews = [
    {
      id: 1,
      name: 'Game One',
      images: {
        box: { og: 'https://example.com/game1.jpg' },
      },
      tier: 'Mighty',
      topCriticScore: 90,
      numReviews: 50,
      percentRecommended: 95,
    },
    {
      id: 2,
      name: 'Game Two',
      images: {
        box: { og: 'https://example.com/game2.jpg' },
      },
      tier: 'Strong',
      topCriticScore: 80,
      numReviews: 30,
      percentRecommended: 85,
    },
  ];

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('should render section title', async () => {
    globalThis.fetch = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit | undefined]>()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockReviews,
      } as Response);

    render(await LatestReviewsSection());

    expect(screen.getByText('Latest Reviews')).toBeInTheDocument();
  });

  it('should render reviews from OpenCritic API', async () => {
    globalThis.fetch = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit | undefined]>()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockReviews,
      } as Response);

    render(await LatestReviewsSection());

    await waitFor(() => {
      expect(screen.getAllByText('Game One').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Game Two').length).toBeGreaterThan(0);
    });
  });

  it('should call the internal API with limit=10', async () => {
    const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit | undefined]>()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockReviews,
      } as Response);

    globalThis.fetch = fetchMock;

    render(await LatestReviewsSection());

    const requestUrl = fetchMock.mock.calls[0]?.[0]?.toString() ?? '';
    expect(requestUrl).toContain('/api/opencritic/reviewed-this-week');
    expect(requestUrl).toContain('limit=10');
  });

  it('should render ReviewCarousel with review cards', async () => {
    globalThis.fetch = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit | undefined]>()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockReviews,
      } as Response);

    const { container } = render(await LatestReviewsSection());

    await waitFor(() => {
      const carousel = container.querySelector('.hide-scrollbar');
      expect(carousel).toBeInTheDocument();
    });
  });

  it('should handle empty reviews gracefully', async () => {
    globalThis.fetch = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit | undefined]>()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [],
      } as Response);

    render(await LatestReviewsSection());

    expect(screen.getByText('Latest Reviews')).toBeInTheDocument();
    expect(screen.queryByText('Game One')).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    globalThis.fetch = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit | undefined]>()
      .mockRejectedValueOnce(new Error('API Error'));

    render(await LatestReviewsSection());

    // Should still render the section title
    expect(screen.getByText('Latest Reviews')).toBeInTheDocument();
    // Should not show any games
    expect(screen.queryByText('Game One')).not.toBeInTheDocument();
  });
});
