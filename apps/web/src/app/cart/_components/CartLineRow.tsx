'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MinusIcon, PlusIcon, TrashIcon } from '@/components/ui/icons';
import type { CartLine } from '@/lib/cart/types';
import { formatPrice } from './formatPrice';

type Props = {
  line: CartLine;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartLineRow({ line, onIncrease, onDecrease, onRemove }: Props) {
  const href = `/${line.categorySlug}/${line.productSlug}`;
  const unitPrice = formatPrice(line.snapshot.price, line.snapshot.currency);

  return (
    <article className="group relative flex flex-col gap-6 rounded-lg bg-surface-container-low p-4 transition-colors duration-300 hover:bg-surface-container-high sm:flex-row">
      <Link
        href={href}
        className="relative h-32 w-full shrink-0 overflow-hidden rounded border border-outline-variant/20 bg-surface-container-lowest sm:w-32"
      >
        <Image
          src={line.snapshot.imageUrl}
          alt={line.snapshot.imageAlt ?? line.snapshot.title}
          fill
          sizes="(min-width: 640px) 128px, 100vw"
          className="object-cover opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:mix-blend-normal"
        />
      </Link>

      <div className="flex grow flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={href}
              className="font-headline text-xl font-bold tracking-tight text-on-surface transition-colors hover:text-primary"
            >
              {line.snapshot.title}
            </Link>
            {line.snapshot.brandName && (
              <p className="mt-1 font-body text-sm text-on-surface-variant">
                {line.snapshot.brandName}
              </p>
            )}
          </div>
          <span className="font-headline text-lg font-bold text-primary">
            {unitPrice}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center rounded border border-outline-variant/20 bg-surface-container-highest">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={onDecrease}
              className="px-3 py-1 text-on-surface-variant transition-colors hover:text-primary focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="w-8 px-3 text-center font-label text-sm text-on-surface">
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={onIncrease}
              className="px-3 py-1 text-on-surface-variant transition-colors hover:text-primary focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            aria-label="Remove item"
            onClick={onRemove}
            className="flex items-center gap-1 font-label text-xs uppercase tracking-wider text-on-surface-variant transition-colors hover:text-error focus:outline-none"
          >
            <TrashIcon className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
