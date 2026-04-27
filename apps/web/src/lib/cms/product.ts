import { strapiFetch } from './fetch';
import type { Currency, Product } from './types';

export type ProductFilters = {
  categorySlug: string;
  brandSlugs?: string[];
  minPrice?: number;
  maxPrice?: number;
};

export async function getProductsByCategorySlug(
  filters: ProductFilters
): Promise<Product[]> {
  const params = new URLSearchParams();
  params.set('filters[category][slug][$eq]', filters.categorySlug);
  filters.brandSlugs?.forEach((slug, i) => {
    params.set(`filters[brand][slug][$in][${i}]`, slug);
  });
  if (filters.minPrice !== undefined) {
    params.set('filters[price][$gte]', String(filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    params.set('filters[price][$lte]', String(filters.maxPrice));
  }
  params.set('populate[images]', 'true');
  params.set('populate[brand]', 'true');
  params.set('pagination[pageSize]', '100');
  params.set('sort[0]', 'title:asc');

  return strapiFetch<Product[]>(`/api/products?${params.toString()}`);
}

export async function getProductBySlug(
  categorySlug: string,
  productSlug: string
): Promise<Product | null> {
  const params = new URLSearchParams();
  params.set('filters[slug][$eq]', productSlug);
  params.set('filters[category][slug][$eq]', categorySlug);
  params.set('pagination[pageSize]', '1');

  const products = await strapiFetch<Product[]>(
    `/api/products?${params.toString()}`
  );
  return products[0] ?? null;
}

export type PriceBounds = {
  min: number;
  max: number;
  currency: Currency;
};

export async function getPriceRangeForCategory(
  categorySlug: string
): Promise<PriceBounds | null> {
  const buildParams = (sort: string) => {
    const p = new URLSearchParams();
    p.set('filters[category][slug][$eq]', categorySlug);
    p.set('fields[0]', 'price');
    p.set('fields[1]', 'currency');
    p.set('pagination[pageSize]', '1');
    p.set('sort[0]', sort);
    return p;
  };

  type PriceRow = { price: number; currency: Currency };

  const [low, high] = await Promise.all([
    strapiFetch<PriceRow[]>(
      `/api/products?${buildParams('price:asc').toString()}`
    ),
    strapiFetch<PriceRow[]>(
      `/api/products?${buildParams('price:desc').toString()}`
    ),
  ]);

  const lowest = low[0];
  const highest = high[0];
  if (!lowest || !highest) return null;

  return {
    min: Math.floor(lowest.price),
    max: Math.ceil(highest.price),
    currency: lowest.currency,
  };
}
