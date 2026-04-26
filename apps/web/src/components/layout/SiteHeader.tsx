import Link from 'next/link';
import { IconButton } from '@/components/ui/IconButton';
import {
  BagIcon,
  MenuIcon,
  PersonIcon,
  SearchIcon,
} from '@/components/ui/icons';
import { getNavigation, resolveLinkHref } from '@/lib/cms/navigation';

export async function SiteHeader() {
  const nav = await getNavigation();
  const links = nav?.items ?? [];

  return (
    <header className="sticky top-0 z-50 bg-surface/70 shadow-ambient backdrop-blur-md">
      <div className="relative mx-auto flex w-full max-w-screen-2xl items-center justify-between px-6 py-4 md:px-8">
        <div className="flex items-center">
          <IconButton
            aria-label="Open menu"
            className="text-on-background/60 hover:text-on-background md:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </IconButton>
          <Link
            href="/"
            className="hidden font-headline text-2xl font-black italic tracking-tighter text-on-background md:block"
          >
            METRO
          </Link>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-headline text-2xl font-bold uppercase tracking-tighter text-primary-container md:hidden"
        >
          METRO
        </Link>

        {links.length > 0 && (
          <nav className="hidden items-center gap-8 font-headline text-sm font-bold uppercase tracking-tighter md:flex">
            {links.map((link) => (
              <Link
                key={link.id}
                href={resolveLinkHref(link)}
                className="text-on-background/60 transition-colors duration-200 hover:text-on-background active:scale-95"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 text-on-background/60 md:gap-4 md:text-primary-container">
          <IconButton aria-label="Search" className="hover:text-on-background">
            <SearchIcon className="h-5 w-5" />
          </IconButton>
          <IconButton aria-label="Cart" className="hover:text-on-background">
            <BagIcon className="h-5 w-5" />
          </IconButton>
          <IconButton aria-label="Account" className="hover:text-on-background">
            <PersonIcon className="h-5 w-5" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
