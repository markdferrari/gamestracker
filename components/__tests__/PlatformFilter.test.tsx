import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlatformFilter } from '../PlatformFilter';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('PlatformFilter', () => {
  const mockPush = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('should render all platform options', () => {
    render(<PlatformFilter />);
    
    expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
    expect(screen.getByText('PC')).toBeInTheDocument();
    expect(screen.getByText('Xbox Series S/X')).toBeInTheDocument();
    expect(screen.getByText('Nintendo Switch 2')).toBeInTheDocument();
  });

  it('should highlight PS5 as default platform', () => {
    render(<PlatformFilter />);
    
    const ps5Button = screen.getByText('PlayStation 5');
    expect(ps5Button).toHaveClass('bg-sky-500');
  });

  it('should highlight selected platform from search params', () => {
    const searchParamsWithPC = new URLSearchParams('platform=6');
    (useSearchParams as jest.Mock).mockReturnValue(searchParamsWithPC);
    
    render(<PlatformFilter />);
    
    const pcButton = screen.getByText('PC');
    expect(pcButton).toHaveClass('bg-sky-500');
  });

  it('should navigate when platform is clicked', async () => {
    const user = userEvent.setup();
    render(<PlatformFilter />);
    
    const pcButton = screen.getByText('PC');
    await user.click(pcButton);
    
    expect(mockPush).toHaveBeenCalledWith('/?platform=6');
  });

  it('should preserve existing search params when changing platform', async () => {
    const searchParamsWithExtra = new URLSearchParams('platform=167&sort=date');
    (useSearchParams as jest.Mock).mockReturnValue(searchParamsWithExtra);
    
    const user = userEvent.setup();
    render(<PlatformFilter />);
    
    const xboxButton = screen.getByText('Xbox Series S/X');
    await user.click(xboxButton);
    
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('platform=169'));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('sort=date'));
  });
});
