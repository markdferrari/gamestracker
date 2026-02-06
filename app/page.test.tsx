import { render, screen, within } from '@testing-library/react';
import type React from 'react';
import Home from './page';

jest.mock('@/lib/igdb', () => ({
  getUpcomingPSGames: jest.fn().mockResolvedValue([]),
  getRecentlyReleasedGames: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/components/GameCard', () => ({
  GameCard: () => <div>GameCard</div>,
}));

jest.mock('@/components/PlatformFilter', () => ({
  PlatformFilter: () => <div>PlatformFilter</div>,
}));

jest.mock('@/components/ViewToggle', () => ({
  ViewToggle: () => <div>ViewToggle</div>,
}));

jest.mock('@/components/LatestReviewsSection', () => ({
  LatestReviewsSection: () => <div>LatestReviewsSection</div>,
}));

jest.mock('@/components/TrendingSection', () => ({
  TrendingSection: () => <div>TrendingSection</div>,
}));

describe('Home page', () => {
  it('renders a stacked mobile carousel container', async () => {
    const ui = await Home({
      searchParams: Promise.resolve({ platform: '1', view: 'upcoming' }),
    });

    render(ui);

    const mobileCarousels = screen.getByTestId('mobile-carousels');
    expect(mobileCarousels).toBeInTheDocument();

    const mobile = within(mobileCarousels);
    expect(mobile.getByText('LatestReviewsSection')).toBeInTheDocument();
    // TrendingSection is disabled to reduce OpenCritic API 429 errors
    // expect(mobile.getByText('TrendingSection')).toBeInTheDocument();
  });
});
