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
    
    expect(screen.getByText('PlayStation')).toBeInTheDocument();
    expect(screen.getByText('Xbox')).toBeInTheDocument();
    expect(screen.getByText('Nintendo')).toBeInTheDocument();
    expect(screen.getByText('PC')).toBeInTheDocument();
  });

  it('should highlight PlayStation as default platform', () => {
    render(<PlatformFilter />);
    
    const playstationButton = screen.getByText('PlayStation');
    expect(playstationButton).toHaveClass('bg-sky-500');
  });

  it('should highlight selected platform from search params', () => {
    const searchParamsWithPC = new URLSearchParams('platform=pc');
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
    
    expect(mockPush).toHaveBeenCalledWith('/?platform=pc');
  });

  it('should preserve existing search params when changing platform', async () => {
    const searchParamsWithExtra = new URLSearchParams('platform=1&sort=date');
    (useSearchParams as jest.Mock).mockReturnValue(searchParamsWithExtra);
    
    const user = userEvent.setup();
    render(<PlatformFilter />);
    
    const xboxButton = screen.getByText('Xbox');
    await user.click(xboxButton);
    
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('platform=2'));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('sort=date'));
  });
});
