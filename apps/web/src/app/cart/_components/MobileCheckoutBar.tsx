'use client';

import type { Currency } from '@/lib/cms/types';
import { strings } from '@/strings';
import { formatPrice } from '@/utils/price';

type Props = {
  subtotal: number;
  currency: Currency;
};

export function MobileCheckoutBar({ subtotal, currency }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-variant bg-surface/90 p-4 backdrop-blur-md lg:hidden">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-label text-sm uppercase tracking-wider text-on-surface-variant">
          {strings.cart.mobileBar.total}
        </span>
        <span className="font-headline text-2xl font-bold text-primary">
          {formatPrice(subtotal, currency)}
        </span>
      </div>
      <button
        type="button"
        disabled
        className="w-full rounded-lg bg-primary px-6 py-4 font-headline text-base font-bold uppercase tracking-widest text-on-primary shadow-primary-glow transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {strings.cart.mobileBar.checkout}
      </button>
    </div>
  );
}
