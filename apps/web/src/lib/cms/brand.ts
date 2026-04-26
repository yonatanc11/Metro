import { strapiFetch } from './fetch';
import type { Brand } from './types';

export async function getBrandsForCategory(
  categorySlug: string
): Promise<Brand[]> {
  const params = new URLSearchParams();
  params.set('filters[products][category][slug][$eq]', categorySlug);
  params.set('pagination[pageSize]', '100');
  params.set('sort[0]', 'name:asc');

  return strapiFetch<Brand[]>(`/api/brands?${params.toString()}`);
}
