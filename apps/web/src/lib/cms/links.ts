import type { NavigationLink } from './types';

export function resolveLinkHref(link: NavigationLink): string {
  if (link.category) return `/${link.category.slug}`;
  if (link.url) return link.url;
  return '#';
}
