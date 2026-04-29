import Link from 'next/link';
import { getFooter } from '@/lib/cms/footer';
import { resolveLinkHref } from '@/lib/cms/links';
import { strings } from '@/strings';

export async function SiteFooter() {
  const footer = await getFooter();
  const links = footer?.links ?? [];
  const copyright = footer?.copyright;

  if (links.length === 0 && !copyright) return null;

  return (
    <footer className="hidden w-full border-t border-outline-variant/30 bg-surface-container-lowest py-16 md:block">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-between gap-8 px-12 md:flex-row">
        <Link
          href="/"
          className="font-headline text-lg font-bold italic tracking-tighter text-on-background"
        >
          {strings.brand.wordmark}
        </Link>

        {links.length > 0 && (
          <nav className="flex flex-wrap justify-center gap-8 font-headline text-[10px] uppercase tracking-[0.2em]">
            {links.map((link) => (
              <Link
                key={link.id}
                href={resolveLinkHref(link)}
                className="text-on-background/40 opacity-80 transition-all hover:text-primary-container hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {copyright && (
          <div className="font-headline text-[10px] uppercase tracking-[0.2em] text-on-background/40">
            {copyright}
          </div>
        )}
      </div>
    </footer>
  );
}
