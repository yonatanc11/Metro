import Link from 'next/link';
import { getNavigation, resolveLinkHref } from '@/lib/cms/navigation';

function IconButton({
  'aria-label': ariaLabel,
  children,
  className = '',
}: {
  'aria-label': string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={className} aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={className} aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={className} aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  );
}

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
