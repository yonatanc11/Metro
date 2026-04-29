'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconButton } from '@/components/ui/IconButton';
import { CloseIcon, MenuIcon } from '@/components/ui/icons';
import { resolveLinkHref } from '@/lib/cms/links';
import type { NavigationLink } from '@/lib/cms/types';
import { strings } from '@/strings';

type Props = { links: NavigationLink[] };

export function MobileNav({ links }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <IconButton
        aria-label={open ? strings.header.closeMenu : strings.header.openMenu}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((o) => !o)}
        className="text-on-background/60 hover:text-on-background md:hidden"
      >
        {open ? (
          <CloseIcon className="h-6 w-6" />
        ) : (
          <MenuIcon className="h-6 w-6" />
        )}
      </IconButton>

      {open && links.length > 0 && (
        <div
          id="mobile-nav-panel"
          className="absolute -inset-x-6 top-full bg-surface/95 shadow-ambient backdrop-blur-md md:hidden"
        >
          <nav className="flex flex-col px-8">
            {links.map((link) => (
              <Link
                key={link.id}
                href={resolveLinkHref(link)}
                onClick={() => setOpen(false)}
                className="border-b border-outline-variant/30 py-4 font-headline text-base font-bold uppercase tracking-tighter text-on-background/80 transition-colors last:border-b-0 hover:text-on-background"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
