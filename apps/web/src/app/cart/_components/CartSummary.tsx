'use client';

import { LockIcon } from '@/components/ui/icons';
import type { Currency } from '@/lib/cms/types';
import { formatPrice } from './formatPrice';

type Props = {
  subtotal: number;
  currency: Currency;
};

export function CartSummary({ subtotal, currency }: Props) {
  return (
    <div className="sticky top-32 rounded-lg border border-outline-variant/10 bg-surface-container-highest/80 p-8 shadow-ambient backdrop-blur-md">
      <h2 className="mb-6 font-headline text-2xl font-bold uppercase tracking-tight text-on-surface">
        Order Summary
      </h2>

      <div className="mb-6 flex flex-col gap-4 border-b border-surface-variant pb-6 font-body text-sm text-on-surface-variant">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-on-surface">
            {formatPrice(subtotal, currency)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span className="text-tertiary">Calculated next</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Tax</span>
          <span className="text-tertiary">Calculated next</span>
        </div>
      </div>

      <div className="mb-8 flex items-end justify-between">
        <span className="font-headline text-lg font-bold text-on-surface">
          Total
        </span>
        <span className="font-headline text-3xl font-black tracking-tighter text-primary">
          {formatPrice(subtotal, currency)}
        </span>
      </div>

      <button
        type="button"
        disabled
        className="w-full rounded-lg bg-linear-to-r from-primary to-primary-container px-6 py-4 font-headline text-lg font-bold uppercase tracking-widest text-on-primary transition-all duration-300 hover:from-primary-container hover:to-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Proceed to Checkout
      </button>

      <p className="mt-4 flex items-center justify-center gap-2 text-center font-label text-xs text-on-surface-variant">
        <LockIcon className="h-3.5 w-3.5" />
        Secure Encrypted Checkout
      </p>
    </div>
  );
}
