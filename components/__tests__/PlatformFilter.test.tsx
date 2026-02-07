import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlatformFilter } from '../PlatformFilter';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockStudios = [
  { id: 101, name: 'Studio Alpha' },
  { id: 202, name: 'Studio Beta' },
];

describe('PlatformFilter', () => {
  const mockPush = jest.fn();
  const mockFetch = jest.fn();
  const originalFetch = (global as unknown as { fetch?: typeof fetch }).fetch;
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockStudios,
    });
    (global as unknown as { fetch?: jest.Mock }).fetch = mockFetch;
  });

  afterAll(() => {
    (global as unknown as { fetch?: jest.Mock }).fetch = originalFetch;
  });

  it('renders all platform buttons', () => {
    render(<PlatformFilter />);

    expect(screen.getByText('PlayStation')).toBeInTheDocument();
    expect(screen.getByText('Xbox')).toBeInTheDocument();
    expect(screen.getByText('Nintendo')).toBeInTheDocument();
    expect(screen.getByText('PC')).toBeInTheDocument();
  });

  it('highlights the default platform', () => {
    render(<PlatformFilter />);

    expect(screen.getByText('PlayStation')).toHaveClass('bg-sky-500');
  });

  it('highlights platform from existing search params', () => {
    mockSearchParams = new URLSearchParams('platform=pc');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(<PlatformFilter />);

    expect(screen.getByText('PC')).toHaveClass('bg-sky-500');
  });

  it('navigates when a platform button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlatformFilter />);

    const pcButton = screen.getByText('PC');
    await user.click(pcButton);

    expect(mockPush).toHaveBeenCalledWith('/?platform=pc');
  });

  it('preserves other search params when changing platform', async () => {
    mockSearchParams = new URLSearchParams('platform=1&sort=date');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

    const user = userEvent.setup();
    render(<PlatformFilter />);

    const xboxButton = screen.getByText('Xbox');
    await user.click(xboxButton);

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('platform=2'));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('sort=date'));
  });

  it('loads studios and renders the dropdown', async () => {
    render(<PlatformFilter />);

    const studioSelect = await screen.findByLabelText('Studio');
    expect(studioSelect).toBeInTheDocument();
    expect(await screen.findByText('Studio Alpha')).toBeInTheDocument();
  });

  it('updates search params when selecting a studio', async () => {
    const user = userEvent.setup();
    render(<PlatformFilter />);

    const studioSelect = await screen.findByLabelText('Studio');
    await user.selectOptions(studioSelect, '202');

    expect(mockPush).toHaveBeenCalledWith('/?studio=202');
  });
});
