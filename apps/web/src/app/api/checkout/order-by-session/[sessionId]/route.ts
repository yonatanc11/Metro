import { env } from '@/env';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const upstream = await fetch(
    `${env.STRAPI_URL}/api/checkout/order-by-session/${encodeURIComponent(sessionId)}`,
    { cache: 'no-store' }
  );
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { 'content-type': 'application/json' },
  });
}
