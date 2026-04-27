'use client';

import Link from 'next/link';
import { BagIcon } from '@/components/ui/icons';
import { useCart } from '@/lib/cart/CartProvider';

export function CartHeaderLink() {
  const { itemCount } = useCart();
  const label =
    itemCount === 0
      ? 'Cart, empty'
      : `Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;

  return (
    <Link
      href="/cart"
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:text-on-background active:scale-95"
    >
      <BagIcon className="h-5 w-5" />
      {itemCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 font-label text-[10px] font-bold leading-none text-on-primary"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
