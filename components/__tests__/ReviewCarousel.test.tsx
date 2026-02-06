import { render, screen } from '@testing-library/react';
import { ReviewCarousel } from '../ReviewCarousel';
import type { OpenCriticReview } from '@/lib/opencritic';

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

describe('ReviewCarousel', () => {
  const mockReviews: OpenCriticReview[] = [
    {
      id: 1,
      name: 'Game One',
      images: {
        box: { sm: 'https://example.com/game1.jpg' },
      },
      tier: 'Mighty',
      topCriticScore: 87.6,
      numReviews: 50,
    },
    {
      id: 2,
      name: 'Game Two',
      images: {
        box: { sm: 'https://example.com/game2.jpg' },
      },
      tier: 'Strong',
      topCriticScore: 75.3,
      numReviews: 30,
    },
  ];

  it('should render review items', () => {
    render(<ReviewCarousel reviews={mockReviews} />);
    expect(screen.getAllByText('Game One').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Game Two').length).toBeGreaterThan(0);
  });

  it('should round scores to nearest whole number', () => {
    render(<ReviewCarousel reviews={mockReviews} />);
    expect(screen.getAllByText('88').length).toBeGreaterThan(0); // 87.6 rounds to 88
    expect(screen.getAllByText('75').length).toBeGreaterThan(0); // 75.3 rounds to 75
  });

  it('should display tier badges', () => {
    render(<ReviewCarousel reviews={mockReviews} />);
    expect(screen.getAllByText('Mighty').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Strong').length).toBeGreaterThan(0);
  });

  it('should handle empty reviews array', () => {
    const { container } = render(<ReviewCarousel reviews={[]} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('should link to OpenCritic page', () => {
    render(<ReviewCarousel reviews={mockReviews} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', 'https://opencritic.com/game/1/game-one');
  });

  it('should render cover images', () => {
    render(<ReviewCarousel reviews={mockReviews} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });
});
