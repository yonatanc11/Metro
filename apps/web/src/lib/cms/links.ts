import type { NavigationLink } from './types';

export function resolveCtaHref(link: NavigationLink | null): string | null {
  if (!link) return null;
  if (link.category) return `/${link.category.slug}`;
  if (link.url) return link.url;
  return null;
}

export function resolveLinkHref(link: NavigationLink): string {
  return resolveCtaHref(link) ?? '#';
}
