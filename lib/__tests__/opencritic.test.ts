import { getReviewedThisWeek } from '../opencritic';

describe('getReviewedThisWeek', () => {
  const originalFetch = globalThis.fetch;
  const originalRapidApiKey = process.env.RAPID_API_KEY;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.RAPID_API_KEY = originalRapidApiKey;
    jest.restoreAllMocks();
  });

  it('should fetch and return reviewed games with correct structure', async () => {
    process.env.RAPID_API_KEY = 'test-rapid-api-key';

    const mockResponse = [
      {
        id: 1,
        name: 'Test Game 1',
        images: {
          box: { og: 'https://example.com/image1.jpg' },
        },
        tier: 'Mighty',
        topCriticScore: 85,
        numReviews: 42,
        percentRecommended: 90,
        releaseDate: '2026-01-15',
      },
      {
        id: 2,
        name: 'Test Game 2',
        images: {
          banner: { og: 'https://example.com/image2.jpg' },
        },
        tier: 'Strong',
        topCriticScore: 75,
        numReviews: 28,
        percentRecommended: 80,
        releaseDate: '2026-02-01',
      },
    ];

    const fetchMock = jest.fn<
      Promise<Response>,
      [RequestInfo | URL, RequestInit | undefined]
    >().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response);

    globalThis.fetch = fetchMock;

    const result = await getReviewedThisWeek();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://opencritic-api.p.rapidapi.com/game/reviewed-this-week',
      {
        headers: {
          'X-RapidAPI-Key': 'test-rapid-api-key',
          'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com',
        },
      }
    );

    expect(result).toEqual(mockResponse);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Test Game 1');
    expect(result[0].topCriticScore).toBe(85);
  });

  it('should handle games with missing optional fields', async () => {
    process.env.RAPID_API_KEY = 'test-rapid-api-key';

    const mockResponse = [
      {
        id: 3,
        name: 'Minimal Game',
        images: {},
        numReviews: 5,
      },
    ];

    const fetchMock = jest.fn<
      Promise<Response>,
      [RequestInfo | URL, RequestInit | undefined]
    >().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response);

    globalThis.fetch = fetchMock;

    const result = await getReviewedThisWeek();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Minimal Game');
    expect(result[0].tier).toBeUndefined();
    expect(result[0].topCriticScore).toBeUndefined();
  });

  it('should throw an error if RAPID_API_KEY is not set', async () => {
    delete process.env.RAPID_API_KEY;

    await expect(getReviewedThisWeek()).rejects.toThrow(
      'RAPID_API_KEY environment variable is required'
    );
  });

  it('should throw an error if API request fails', async () => {
    process.env.RAPID_API_KEY = 'test-rapid-api-key';

    const fetchMock = jest.fn<
      Promise<Response>,
      [RequestInfo | URL, RequestInit | undefined]
    >().mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    globalThis.fetch = fetchMock;

    await expect(getReviewedThisWeek()).rejects.toThrow(
      'OpenCritic API request failed: 500 Internal Server Error'
    );
  });

  it('should throw an error if network request fails', async () => {
    process.env.RAPID_API_KEY = 'test-rapid-api-key';

    const fetchMock = jest.fn<
      Promise<Response>,
      [RequestInfo | URL, RequestInit | undefined]
    >().mockRejectedValueOnce(new Error('Network error'));

    globalThis.fetch = fetchMock;

    await expect(getReviewedThisWeek()).rejects.toThrow('Network error');
  });

  it('should accept optional limit parameter', async () => {
    process.env.RAPID_API_KEY = 'test-rapid-api-key';

    const mockResponse = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Game ${i + 1}`,
      images: {},
      numReviews: 10,
    }));

    const fetchMock = jest.fn<
      Promise<Response>,
      [RequestInfo | URL, RequestInit | undefined]
    >().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    } as Response);

    globalThis.fetch = fetchMock;

    const result = await getReviewedThisWeek(10);

    expect(result).toHaveLength(10);
    expect(result[0].name).toBe('Game 1');
    expect(result[9].name).toBe('Game 10');
  });
});
