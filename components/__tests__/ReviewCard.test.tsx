import { render, screen } from '@testing-library/react';
import type React from 'react';
import { ReviewCard } from '../ReviewCard';
import type { OpenCriticReview } from '@/lib/opencritic';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & { src: string },
  ) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { src, alt, ...rest } = props;
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

describe('ReviewCard', () => {
  const mockReview: OpenCriticReview = {
    id: 12345,
    name: 'Test Game',
    images: {
      box: { sm: 'https://example.com/image.jpg', og: 'https://example.com/image-og.jpg' },
    },
    tier: 'Mighty',
    topCriticScore: 85,
    numReviews: 42,
    percentRecommended: 90,
    releaseDate: '2026-01-15',
  };

  it('should render game title', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText('Test Game')).toBeInTheDocument();
  });

  it('should render review score', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('should render number of reviews', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText(/42 reviews/i)).toBeInTheDocument();
  });

  it('should render tier badge', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText('Mighty')).toBeInTheDocument();
  });

  it('should render cover image when box image is available', () => {
    render(<ReviewCard review={mockReview} />);
    const image = screen.getByAltText('Test Game cover');
    expect(image).toHaveAttribute('src', '/api/image?url=https%3A%2F%2Fexample.com%2Fimage.jpg');
  });

  it('should use banner image when box image is not available', () => {
    const reviewWithBanner = {
      ...mockReview,
      images: {
        banner: { sm: 'https://example.com/banner.jpg' },
      },
    };
    render(<ReviewCard review={reviewWithBanner} />);
    const image = screen.getByAltText('Test Game cover');
    expect(image).toHaveAttribute('src', '/api/image?url=https%3A%2F%2Fexample.com%2Fbanner.jpg');
  });

  it('should render placeholder when no images are available', () => {
    const reviewNoImage = {
      ...mockReview,
      images: {},
    };
    render(<ReviewCard review={reviewNoImage} />);
    expect(screen.getByLabelText(/no image/i)).toBeInTheDocument();
  });

  it('should not render tier badge when tier is not available', () => {
    const reviewNoTier = {
      ...mockReview,
      tier: undefined,
    };
    render(<ReviewCard review={reviewNoTier} />);
    expect(screen.queryByText('Mighty')).not.toBeInTheDocument();
  });

  it('should not render score when topCriticScore is not available', () => {
    const reviewNoScore = {
      ...mockReview,
      topCriticScore: undefined,
    };
    render(<ReviewCard review={reviewNoScore} />);
    expect(screen.queryByText('85')).not.toBeInTheDocument();
  });

  it('should render percent recommended when available', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText(/90% recommended/i)).toBeInTheDocument();
  });

  it('should create link to OpenCritic page', () => {
    render(<ReviewCard review={mockReview} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://opencritic.com/game/12345/test-game');
  });

  it('should handle games with spaces in name for link', () => {
    const reviewWithSpaces = {
      ...mockReview,
      name: 'Game With Multiple Spaces',
    };
    render(<ReviewCard review={reviewWithSpaces} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://opencritic.com/game/12345/game-with-multiple-spaces');
  });
});
