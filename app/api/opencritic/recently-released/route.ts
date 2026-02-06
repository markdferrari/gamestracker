import { getRecentlyReleased } from '@/lib/opencritic';

export const revalidate = 86400;


export async function GET() {
  try {
    const games = await getRecentlyReleased(6);
    return new Response(JSON.stringify({ games }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch trending games:', error);
    return new Response(JSON.stringify({ games: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
