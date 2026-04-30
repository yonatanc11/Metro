'use client';

import Link from 'next/link';
import { BagIcon } from '@/components/ui/icons';
import { useCart } from '@/lib/cart/CartProvider';
import { strings } from '@/strings';
import { routes } from '@/utils/routes';

export function CartHeaderLink() {
  const { itemCount } = useCart();
  const itemWord = (
    itemCount === 1 ? strings.cart.itemSingular : strings.cart.itemPlural
  ).toLowerCase();
  const label =
    itemCount === 0
      ? `${strings.header.cart}, ${strings.header.cartEmpty}`
      : `${strings.header.cart}, ${itemCount} ${itemWord}`;

  return (
    <Link
      href={routes.cart}
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
