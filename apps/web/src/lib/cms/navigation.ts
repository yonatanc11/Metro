import { strapiFetch } from './fetch';
import type { Navigation } from './types';

export async function getNavigation(): Promise<Navigation | null> {
  return strapiFetch<Navigation | null>('/api/navigation');
}
