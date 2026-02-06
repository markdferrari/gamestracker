import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { LatestReviewsSection } from '../LatestReviewsSection';
import * as opencriticLib from '../../lib/opencritic';

jest.mock('../../lib/opencritic');

describe('LatestReviewsSection', () => {
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
    jest.clearAllMocks();
  });

  it('should render section title', async () => {
    jest.spyOn(opencriticLib, 'getReviewedThisWeek').mockResolvedValue(mockReviews);

    render(await LatestReviewsSection());

    expect(screen.getByText('Latest Reviews')).toBeInTheDocument();
  });

  it('should render reviews from OpenCritic API', async () => {
    jest.spyOn(opencriticLib, 'getReviewedThisWeek').mockResolvedValue(mockReviews);

    render(await LatestReviewsSection());

    await waitFor(() => {
      expect(screen.getAllByText('Game One').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Game Two').length).toBeGreaterThan(0);
    });
  });

  it('should call getReviewedThisWeek with limit of 10', async () => {
    const mockGetReviewed = jest
      .spyOn(opencriticLib, 'getReviewedThisWeek')
      .mockResolvedValue(mockReviews);

    render(await LatestReviewsSection());

    expect(mockGetReviewed).toHaveBeenCalledWith(10);
  });

  it('should render ReviewCarousel with review cards', async () => {
    jest.spyOn(opencriticLib, 'getReviewedThisWeek').mockResolvedValue(mockReviews);

    const { container } = render(await LatestReviewsSection());

    await waitFor(() => {
      const carousel = container.querySelector('.hide-scrollbar');
      expect(carousel).toBeInTheDocument();
    });
  });

  it('should handle empty reviews gracefully', async () => {
    jest.spyOn(opencriticLib, 'getReviewedThisWeek').mockResolvedValue([]);

    render(await LatestReviewsSection());

    expect(screen.getByText('Latest Reviews')).toBeInTheDocument();
    expect(screen.queryByText('Game One')).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    jest.spyOn(opencriticLib, 'getReviewedThisWeek').mockRejectedValue(new Error('API Error'));

    render(await LatestReviewsSection());

    // Should still render the section title
    expect(screen.getByText('Latest Reviews')).toBeInTheDocument();
    // Should not show any games
    expect(screen.queryByText('Game One')).not.toBeInTheDocument();
  });
});
