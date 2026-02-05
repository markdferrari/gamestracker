import { formatReleaseDate, getGameById, getRecentlyReleasedGames, getUpcomingPSGames } from '../igdb';

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

describe('getUpcomingPSGames', () => {
  const originalFetch = globalThis.fetch;
  const originalClientId = process.env.IGDB_CLIENT_ID;
  const originalClientSecret = process.env.IGDB_CLIENT_SECRET;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.IGDB_CLIENT_ID = originalClientId;
    process.env.IGDB_CLIENT_SECRET = originalClientSecret;
    jest.restoreAllMocks();
  });

  it('groups release dates by game and sorts by earliest platform date', async () => {
    process.env.IGDB_CLIENT_ID = 'test-client';
    process.env.IGDB_CLIENT_SECRET = 'test-secret';

    const now = 1760000000;
    jest.spyOn(Date, 'now').mockReturnValue(now * 1000);

    const fetchMock = jest.fn<
      Promise<Response>,
      [RequestInfo | URL, RequestInit | undefined]
    >();

    const tokenResponse = {
      ok: true,
      statusText: 'OK',
      json: async () => ({ access_token: 'token', expires_in: 3600 }),
    } as unknown as Response;

    const gameA = {
      id: 1,
      name: 'Game A',
      summary: 'A',
      game_status: 5,
      cover: { url: '//cover-a.jpg' },
      first_release_date: now + 5000,
      platforms: [{ id: 167, name: 'PlayStation 5' }],
      screenshots: [{ url: '//shot-a.jpg' }],
    };

    const gameB = {
      id: 2,
      name: 'Game B',
      summary: 'B',
      game_status: 5,
      cover: { url: '//cover-b.jpg' },
      first_release_date: now + 6000,
      platforms: [{ id: 167, name: 'PlayStation 5' }],
      screenshots: [{ url: '//shot-b.jpg' }],
    };

    const releaseDatesResponse = {
      ok: true,
      statusText: 'OK',
      json: async () => [
        {
          id: 10,
          date: now + 1000,
          human: 'March 1, 2026',
          date_format: 0,
          status: 1,
          platform: { id: 167, name: 'PlayStation 5' },
          game: gameA,
        },
        {
          id: 11,
          date: now + 2000,
          human: 'March 5, 2026',
          date_format: 0,
          status: 1,
          platform: { id: 167, name: 'PlayStation 5' },
          game: gameA,
        },
        {
          id: 12,
          date: now + 1500,
          human: 'TBD',
          date_format: 0,
          status: 1,
          platform: { id: 167, name: 'PlayStation 5' },
          game: {
            id: 3,
            name: 'Game TBD',
            summary: 'C',
            game_status: 5,
            cover: { url: '//cover-c.jpg' },
            first_release_date: now + 7000,
            platforms: [{ id: 167, name: 'PlayStation 5' }],
            screenshots: [{ url: '//shot-c.jpg' }],
          },
        },
        {
          id: 13,
          date: now + 1200,
          human: 'April 1, 2026',
          date_format: 0,
          status: 1,
          platform: { id: 167, name: 'PlayStation 5' },
          game: gameB,
        },
      ],
    } as unknown as Response;

    fetchMock
      .mockResolvedValueOnce(tokenResponse)
      .mockResolvedValueOnce(releaseDatesResponse);
    globalThis.fetch = fetchMock;

    const games = await getUpcomingPSGames(167);

    expect(games).toHaveLength(2);
    expect(games[0].id).toBe(1);
    expect(games[1].id).toBe(2);
    expect(games[0].release_dates).toHaveLength(2);
    expect(games[0].release_dates?.[0].date).toBe(now + 1000);
    expect(games[0].release_dates?.[1].date).toBe(now + 2000);

    const igdbCall = fetchMock.mock.calls[1][0].toString();
    expect(igdbCall).toContain('/release_dates');
  });
});

describe('getRecentlyReleasedGames', () => {
  const originalFetch = globalThis.fetch;
  const originalClientId = process.env.IGDB_CLIENT_ID;
  const originalClientSecret = process.env.IGDB_CLIENT_SECRET;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.IGDB_CLIENT_ID = originalClientId;
    process.env.IGDB_CLIENT_SECRET = originalClientSecret;
    jest.restoreAllMocks();
  });

  it('groups release dates by game and sorts by most recent platform date', async () => {
    process.env.IGDB_CLIENT_ID = 'test-client';
    process.env.IGDB_CLIENT_SECRET = 'test-secret';

    const now = 1760000000;
    jest.spyOn(Date, 'now').mockReturnValue(now * 1000);

    const fetchMock = jest.fn<
      Promise<Response>,
      [RequestInfo | URL, RequestInit | undefined]
    >();

    const tokenResponse = {
      ok: true,
      statusText: 'OK',
      json: async () => ({ access_token: 'token', expires_in: 3600 }),
    } as unknown as Response;

    const gameA = {
      id: 10,
      name: 'Game A',
      summary: 'A',
      game_status: 0,
      cover: { url: '//cover-a.jpg' },
      first_release_date: now - 5000,
      platforms: [{ id: 167, name: 'PlayStation 5' }],
      screenshots: [{ url: '//shot-a.jpg' }],
    };

    const gameB = {
      id: 11,
      name: 'Game B',
      summary: 'B',
      game_status: 0,
      cover: { url: '//cover-b.jpg' },
      first_release_date: now - 6000,
      platforms: [{ id: 167, name: 'PlayStation 5' }],
      screenshots: [{ url: '//shot-b.jpg' }],
    };

    const releaseDatesResponse = {
      ok: true,
      statusText: 'OK',
      json: async () => [
        {
          id: 20,
          date: now - 1000,
          human: 'January 20, 2026',
          date_format: 0,
          status: 1,
          platform: { id: 167, name: 'PlayStation 5' },
          game: gameA,
        },
        {
          id: 21,
          date: now - 2000,
          human: 'January 10, 2026',
          date_format: 0,
          status: 1,
          platform: { id: 167, name: 'PlayStation 5' },
          game: gameA,
        },
        {
          id: 22,
          date: now - 1500,
          human: 'January 15, 2026',
          date_format: 0,
          status: 1,
          platform: { id: 167, name: 'PlayStation 5' },
          game: gameB,
        },
      ],
    } as unknown as Response;

    fetchMock
      .mockResolvedValueOnce(tokenResponse)
      .mockResolvedValueOnce(releaseDatesResponse);
    globalThis.fetch = fetchMock;

    const games = await getRecentlyReleasedGames(167);

    expect(games).toHaveLength(2);
    expect(games[0].id).toBe(10);
    expect(games[1].id).toBe(11);
    expect(games[0].release_dates).toHaveLength(2);
    expect(games[0].release_dates?.[0].date).toBe(now - 1000);

    const igdbCall = fetchMock.mock.calls[1][0].toString();
    expect(igdbCall).toContain('/release_dates');
  });
});

describe('getGameById', () => {
  const originalFetch = globalThis.fetch;
  const originalClientId = process.env.IGDB_CLIENT_ID;
  const originalClientSecret = process.env.IGDB_CLIENT_SECRET;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.IGDB_CLIENT_ID = originalClientId;
    process.env.IGDB_CLIENT_SECRET = originalClientSecret;
    jest.restoreAllMocks();
  });

  it('sorts release dates by most recent and removes TBD', async () => {
    process.env.IGDB_CLIENT_ID = 'test-client';
    process.env.IGDB_CLIENT_SECRET = 'test-secret';

    const fetchMock = jest.fn<
      Promise<Response>,
      [RequestInfo | URL, RequestInit | undefined]
    >();

    const tokenResponse = {
      ok: true,
      statusText: 'OK',
      json: async () => ({ access_token: 'token', expires_in: 3600 }),
    } as unknown as Response;

    const gameResponse = {
      ok: true,
      statusText: 'OK',
      json: async () => [
        {
          id: 14593,
          name: 'Test Game',
          release_dates: [
            {
              human: 'February 5, 2026',
              date: 1764979200,
              date_format: 0,
              platform: { id: 167, name: 'PlayStation 5' },
            },
            {
              human: 'January 1, 2018',
              date: 1514764800,
              date_format: 0,
              platform: { id: 48, name: 'PlayStation 4' },
            },
            {
              human: 'TBD',
              date: 1893456000,
              date_format: 7,
              platform: { id: 167, name: 'PlayStation 5' },
            },
          ],
        },
      ],
    } as unknown as Response;

    fetchMock
      .mockResolvedValueOnce(tokenResponse)
      .mockResolvedValueOnce(gameResponse);
    globalThis.fetch = fetchMock;

    const game = await getGameById(14593);

    expect(game).not.toBeNull();
    expect(game?.release_dates).toHaveLength(2);
    expect(game?.release_dates?.[0].date).toBe(1764979200);
    expect(game?.release_dates?.[1].date).toBe(1514764800);
  });
});
