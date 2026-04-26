import { env } from '@/env';
import type { Category, StrapiResponse } from './types';

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const url = `${env.STRAPI_URL}/api/categories?filters[slug][$eq]=${encodeURIComponent(slug)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Strapi fetch failed: ${res.status} ${res.statusText} at ${url}`
    );
  }
  const json = (await res.json()) as StrapiResponse<Category[]>;
  return json.data[0] ?? null;
}
