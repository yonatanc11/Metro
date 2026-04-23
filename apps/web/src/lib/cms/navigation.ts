import { strapiFetch } from './fetch';
import type { Navigation, NavigationLink } from './types';

export async function getNavigation(): Promise<Navigation | null> {
  return strapiFetch<Navigation | null>('/api/navigation');
}

export function resolveLinkHref(link: NavigationLink): string {
  if (link.category) return `/${link.category.slug}`;
  if (link.url) return link.url;
  return '#';
}
