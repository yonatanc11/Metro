import { strapiFetch } from './fetch';
import type { Homepage } from './types';

export async function getHomepage(): Promise<Homepage | null> {
  return strapiFetch<Homepage | null>('/api/homepage');
}
