import { render, screen } from '@testing-library/react';
import { TrendingCarousel } from '../TrendingCarousel';
import type { TrendingGame } from '@/lib/opencritic';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => {
    const { src, alt, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...rest} />;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('TrendingCarousel', () => {
  const mockGames: TrendingGame[] = [
    {
      id: 1,
      name: 'Game One',
      images: {
        box: { sm: 'https://example.com/game1.jpg' },
      },
      platforms: [{ id: 167, name: 'PlayStation 5' }],
      releaseDate: '2026-02-06',
      topCriticScore: 82.4,
      numReviews: 35,
      percentRecommended: 85,
      igdbCoverUrl: '//images.igdb.com/igdb/image/upload/t_cover_big/cover1.jpg',
    },
    {
      id: 2,
      name: 'Game Two',
      images: {
        box: { sm: 'https://example.com/game2.jpg' },
      },
      platforms: [{ id: 6, name: 'PC' }],
      releaseDate: '2026-02-05',
      topCriticScore: 78.1,
      numReviews: 22,
      percentRecommended: 75,
      igdbCoverUrl: '//images.igdb.com/igdb/image/upload/t_cover_big/cover2.jpg',
    },
  ];

  it('should render game titles', () => {
    render(<TrendingCarousel games={mockGames} />);
    expect(screen.getAllByText('Game One').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Game Two').length).toBeGreaterThan(0);
  });

  it('should round scores to nearest whole number', () => {
    render(<TrendingCarousel games={mockGames} />);
    expect(screen.getAllByText('82').length).toBeGreaterThan(0); // 82.4 rounds to 82
    expect(screen.getAllByText('78').length).toBeGreaterThan(0); // 78.1 rounds to 78
  });

  it('should display platform badges', () => {
    render(<TrendingCarousel games={mockGames} />);
    expect(screen.getAllByText('PlayStation 5').length).toBeGreaterThan(0);
    expect(screen.getAllByText('PC').length).toBeGreaterThan(0);
  });

  it('should handle empty games array', () => {
    const { container } = render(<TrendingCarousel games={[]} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('should link to OpenCritic page', () => {
    render(<TrendingCarousel games={mockGames} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', 'https://opencritic.com/game/1/game-one');
  });

  it('should render cover images', () => {
    render(<TrendingCarousel games={mockGames} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    // Should use IGDB cover URL first
    expect(images[0]).toHaveAttribute('src', '//images.igdb.com/igdb/image/upload/t_cover_big/cover1.jpg');
  });

  it('should show score on hover', () => {
    render(<TrendingCarousel games={mockGames} />);
    // Score should be present in the DOM (in hover state)
    expect(screen.getAllByText('82').length).toBeGreaterThan(0);
    expect(screen.getAllByText('78').length).toBeGreaterThan(0);
  });

  it('should format release dates', () => {
    render(<TrendingCarousel games={mockGames} />);
    // Check that dates are formatted (month and day)
    expect(screen.getAllByText(/Feb/i).length).toBeGreaterThan(0);
  });
});
