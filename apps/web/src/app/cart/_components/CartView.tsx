'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart/CartProvider';
import { strings } from '@/strings';
import { pluralize } from '@/utils/pluralize';
import { routes } from '@/utils/routes';
import { CartLineRow } from './CartLineRow';
import { CartSummary } from './CartSummary';
import { MobileCheckoutBar } from './MobileCheckoutBar';

export function CartView() {
  const { state, itemCount, subtotal, removeLine, setQuantity } = useCart();

  if (state.lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter text-on-surface lg:text-5xl">
          {strings.cart.empty.title}
        </h1>
        <p className="font-body text-on-surface-variant">
          {strings.cart.empty.subtitle}
        </p>
        <Link
          href={routes.home}
          className="rounded-lg bg-primary px-6 py-3 font-headline text-sm font-bold uppercase tracking-widest text-on-primary shadow-primary-glow transition-colors hover:bg-primary-container"
        >
          {strings.cart.empty.cta}
        </Link>
      </div>
    );
  }

  const currency = state.lines[0].snapshot.currency;
  const itemLabel = pluralize(
    itemCount,
    strings.cart.itemSingular,
    strings.cart.itemPlural
  );

  return (
    <>
      <div className="flex flex-col gap-12 pb-40 lg:flex-row lg:pb-0">
        <section className="flex grow flex-col gap-8">
          <div className="flex items-baseline justify-between border-b border-surface-variant pb-4">
            <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter text-on-surface md:text-5xl">
              {strings.cart.title}
            </h1>
            <span className="font-label text-sm text-on-surface-variant">
              {itemCount} {itemLabel}
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {state.lines.map((line) => (
              <CartLineRow
                key={line.lineId}
                line={line}
                onIncrease={() => setQuantity(line.lineId, line.quantity + 1)}
                onDecrease={() => setQuantity(line.lineId, line.quantity - 1)}
                onRemove={() => removeLine(line.lineId)}
              />
            ))}
          </div>
        </section>

        <aside className="hidden w-full shrink-0 lg:block lg:w-100">
          <CartSummary subtotal={subtotal} currency={currency} />
        </aside>
      </div>

      <MobileCheckoutBar subtotal={subtotal} currency={currency} />
    </>
  );
}
