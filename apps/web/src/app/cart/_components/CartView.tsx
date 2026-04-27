'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart/CartProvider';
import type { Currency } from '@/lib/cms/types';

const localeByCurrency: Record<Currency, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  ILS: 'he-IL',
};

function formatPrice(amount: number, currency: Currency) {
  return new Intl.NumberFormat(localeByCurrency[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function CartView() {
  const { state, itemCount, subtotal, removeLine, setQuantity } = useCart();

  if (state.lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter text-on-surface lg:text-5xl">
          Your cart is empty
        </h1>
        <p className="font-body text-on-surface-variant">
          Browse the catalog to start your loadout.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-primary px-6 py-3 font-headline text-sm font-bold uppercase tracking-widest text-on-primary shadow-primary-glow transition-colors hover:bg-primary-container"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const currency = state.lines[0].snapshot.currency;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-baseline justify-between border-b border-surface-variant pb-4">
        <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter text-on-surface lg:text-5xl">
          Your cart
        </h1>
        <span className="font-label text-sm text-on-surface-variant">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      <ul className="flex flex-col gap-4">
        {state.lines.map((line) => (
          <li
            key={line.lineId}
            className="flex gap-4 rounded-lg bg-surface-container-low p-4"
          >
            <Link
              href={`/${line.categorySlug}/${line.productSlug}`}
              className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-surface-container-lowest"
            >
              <Image
                src={line.snapshot.imageUrl}
                alt={line.snapshot.imageAlt ?? line.snapshot.title}
                fill
                sizes="96px"
                className="object-cover"
              />
            </Link>

            <div className="flex flex-grow flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/${line.categorySlug}/${line.productSlug}`}
                    className="font-headline text-base font-bold tracking-tight text-on-surface hover:text-primary lg:text-lg"
                  >
                    {line.snapshot.title}
                  </Link>
                  {line.snapshot.brandName && (
                    <p className="mt-1 font-body text-sm text-on-surface-variant">
                      {line.snapshot.brandName}
                    </p>
                  )}
                </div>
                <span className="font-headline text-base font-bold text-primary lg:text-lg">
                  {formatPrice(
                    line.snapshot.price * line.quantity,
                    line.snapshot.currency
                  )}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center rounded border border-outline-variant/20 bg-surface-container-highest">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                    className="px-3 py-1 font-label text-sm text-on-surface-variant hover:text-primary"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-label text-sm text-on-surface">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                    className="px-3 py-1 font-label text-sm text-on-surface-variant hover:text-primary"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.lineId)}
                  className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-on-surface"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-surface-variant pt-6">
        <span className="font-headline text-lg font-bold uppercase tracking-tight text-on-surface">
          Subtotal
        </span>
        <span className="font-headline text-2xl font-black tracking-tighter text-primary">
          {formatPrice(subtotal, currency)}
        </span>
      </div>
    </div>
  );
}
