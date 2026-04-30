import { env } from '@/env';

export async function POST(req: Request) {
  const body = await req.text();
  const upstream = await fetch(`${env.STRAPI_URL}/api/checkout/start`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { 'content-type': 'application/json' },
  });
}
