import { strapiFetch } from './fetch';
import type { Footer } from './types';

export async function getFooter(): Promise<Footer | null> {
  return strapiFetch<Footer | null>('/api/footer');
}
