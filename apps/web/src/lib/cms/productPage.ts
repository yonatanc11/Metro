import { strapiFetch } from './fetch';
import type { ProductPage } from './types';

export async function getProductPage(): Promise<ProductPage | null> {
  return strapiFetch<ProductPage | null>('/api/product-page');
}
