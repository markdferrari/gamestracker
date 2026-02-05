import { formatReleaseDate } from '../igdb';

describe('formatReleaseDate', () => {
  it('should format Unix timestamp to human-readable date', () => {
    // January 15, 2025 at 00:00:00 UTC = 1736899200
    const timestamp = 1736899200;
    const result = formatReleaseDate(timestamp);
    expect(result).toBe('January 15, 2025');
  });

  it('should handle different months', () => {
    // December 25, 2025 at 00:00:00 UTC = 1766793600
    const timestamp = 1766793600;
    const result = formatReleaseDate(timestamp);
    expect(result).toBe('December 25, 2025');
  });

  it('should format dates correctly across years', () => {
    // March 1, 2026 at 00:00:00 UTC = 1772524800
    const timestamp = 1772524800;
    const result = formatReleaseDate(timestamp);
    expect(result).toBe('March 1, 2026');
  });
});
