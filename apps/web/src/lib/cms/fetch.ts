import { env } from '@/env';
import type { StrapiResponse } from './types';

export async function strapiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${env.STRAPI_URL}${path}`;
  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error(
      `Strapi fetch failed: ${res.status} ${res.statusText} at ${path}`
    );
  }

  const json = (await res.json()) as StrapiResponse<T>;
  return json.data;
}
