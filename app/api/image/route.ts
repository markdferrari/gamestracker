const CACHE_SECONDS = 60 * 60 * 24;
const ALLOWED_HOSTS = new Set(["images.igdb.com"]);

function buildCacheControlHeader() {
  return `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing url", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(target.hostname)) {
    return new Response("Invalid host", { status: 400 });
  }

  const upstream = await fetch(target.toString());

  if (!upstream.ok) {
    return new Response("Upstream error", { status: upstream.status });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }
  headers.set("cache-control", buildCacheControlHeader());

  return new Response(upstream.body ?? (await upstream.arrayBuffer()), {
    status: 200,
    headers,
  });
}
