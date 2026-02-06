import { render, screen, waitFor } from '@testing-library/react';
import { TrendingSection } from '../TrendingSection';
import * as opencriticLib from '@/lib/opencritic';

jest.mock('@/lib/opencritic', () => ({
  getRecentlyReleased: jest.fn(),
}));

const mockGames = [
  {
    id: 1,
    name: 'Game One',
    images: {
      box: { sm: 'https://example.com/game1.jpg' },
    },
    platforms: [{ id: 167, name: 'PlayStation 5' }],
    releaseDate: '2026-02-06',
    topCriticScore: 82,
    numReviews: 35,
    percentRecommended: 85,
  },
  {
    id: 2,
    name: 'Game Two',
    images: {
      box: { sm: 'https://example.com/game2.jpg' },
    },
    platforms: [{ id: 6, name: 'PC' }],
    releaseDate: '2026-02-05',
    topCriticScore: 78,
    numReviews: 22,
    percentRecommended: 75,
  },
];

describe('TrendingSection', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render trending games from API', async () => {
    jest.spyOn(opencriticLib, 'getRecentlyReleased').mockResolvedValue(mockGames);

    render(await TrendingSection());

    await waitFor(() => {
      expect(screen.getAllByText('Game One').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Game Two').length).toBeGreaterThan(0);
    });
  });

  it('should render TrendingCarousel with games', async () => {
    jest.spyOn(opencriticLib, 'getRecentlyReleased').mockResolvedValue(mockGames);

    const { container } = render(await TrendingSection());

    await waitFor(() => {
      const carousel = container.querySelector('.hide-scrollbar');
      expect(carousel).toBeInTheDocument();
    });
  });

  it('should fetch with limit of 10', async () => {
    jest.spyOn(opencriticLib, 'getRecentlyReleased').mockResolvedValue(mockGames);

    render(await TrendingSection());

    expect(opencriticLib.getRecentlyReleased).toHaveBeenCalledWith(10);
  });

  it('should render Trending header', async () => {
    jest.spyOn(opencriticLib, 'getRecentlyReleased').mockResolvedValue(mockGames);

    render(await TrendingSection());

    expect(screen.getByText('Trending')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    jest.spyOn(opencriticLib, 'getRecentlyReleased').mockRejectedValue(new Error('API Error'));

    render(await TrendingSection());

    // Should still render the section title
    expect(screen.getByText('Trending')).toBeInTheDocument();
    // Should show empty state
    expect(screen.getByText('No games available')).toBeInTheDocument();
  });
});
