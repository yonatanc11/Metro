'use client';

import Link from 'next/link';
import { LockIcon } from '@/components/ui/icons';
import type { Currency } from '@/lib/cms/types';
import { strings } from '@/strings';
import { formatPrice } from '@/utils/price';
import { routes } from '@/utils/routes';

type Props = {
  subtotal: number;
  currency: Currency;
};

export function CartSummary({ subtotal, currency }: Props) {
  return (
    <div className="sticky top-32 rounded-lg border border-outline-variant/10 bg-surface-container-highest/80 p-8 shadow-ambient backdrop-blur-md">
      <h2 className="mb-6 font-headline text-2xl font-bold uppercase tracking-tight text-on-surface">
        {strings.cart.summary.title}
      </h2>

      <div className="mb-6 flex flex-col gap-4 border-b border-surface-variant pb-6 font-body text-sm text-on-surface-variant">
        <div className="flex items-center justify-between">
          <span>{strings.cart.summary.subtotal}</span>
          <span className="font-medium text-on-surface">
            {formatPrice(subtotal, currency)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>{strings.cart.summary.shipping}</span>
          <span className="text-tertiary">{strings.cart.summary.calculatedNext}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{strings.cart.summary.tax}</span>
          <span className="text-tertiary">{strings.cart.summary.calculatedNext}</span>
        </div>
      </div>

      <div className="mb-8 flex items-end justify-between">
        <span className="font-headline text-lg font-bold text-on-surface">
          {strings.cart.summary.total}
        </span>
        <span className="font-headline text-3xl font-black tracking-tighter text-primary">
          {formatPrice(subtotal, currency)}
        </span>
      </div>

      <Link
        href={routes.checkout}
        className="block w-full rounded-lg bg-linear-to-r from-primary to-primary-container px-6 py-4 text-center font-headline text-lg font-bold uppercase tracking-widest text-on-primary transition-all duration-300 hover:from-primary-container hover:to-primary active:scale-[0.98]"
      >
        {strings.cart.summary.checkout}
      </Link>

      <p className="mt-4 flex items-center justify-center gap-2 text-center font-label text-xs text-on-surface-variant">
        <LockIcon className="h-3.5 w-3.5" />
        {strings.cart.summary.secureNote}
      </p>
    </div>
  );
}
