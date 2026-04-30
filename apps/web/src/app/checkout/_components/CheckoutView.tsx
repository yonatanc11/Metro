'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { useCart } from '@/lib/cart/CartProvider';
import { startCheckout, CheckoutError } from '@/lib/checkout/api';
import { getStripe } from '@/lib/stripe/client';
import { LockIcon } from '@/components/ui/icons';
import { strings } from '@/strings';
import { routes } from '@/utils/routes';

export function CheckoutView() {
  const router = useRouter();
  const { state } = useCart();
  const [hydrated, setHydrated] = useState(false);
  const [requestId] = useState(() => crypto.randomUUID());
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (state.lines.length === 0) {
      router.replace(routes.cart);
      return;
    }
    if (clientSecret || error) return;

    let cancelled = false;
    startCheckout({
      requestId,
      lines: state.lines.map((l) => ({
        productDocumentId: l.productDocumentId,
        quantity: l.quantity,
      })),
    })
      .then((res) => {
        if (cancelled) return;
        setClientSecret(res.clientSecret);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const code =
          err instanceof CheckoutError ? err.code : 'checkout_failed';
        setError(
          code === 'empty_cart'
            ? strings.checkout.errorEmptyCart
            : strings.checkout.errorGeneric
        );
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, state.lines, clientSecret, error, requestId, router]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-32 sm:px-8">
      <header className="mb-10 flex flex-col gap-3 text-center sm:text-left">
        <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter md:text-5xl">
          {strings.checkout.pageTitle}
        </h1>
        <p className="flex items-center justify-center gap-2 font-label text-xs uppercase tracking-widest text-on-surface-variant sm:justify-start">
          <LockIcon className="h-3.5 w-3.5" />
          {strings.cart.summary.secureNote}
        </p>
      </header>

      <section className="rounded-DEFAULT bg-surface-container-low p-4 shadow-ambient sm:p-8">
        {error && (
          <p className="rounded-DEFAULT bg-error-container/30 p-4 font-label text-sm text-error">
            {error}
          </p>
        )}

        {!error && !clientSecret && (
          <div className="flex min-h-96 items-center justify-center">
            <p className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
              {strings.checkout.initializing}
            </p>
          </div>
        )}

        {clientSecret && (
          <EmbeddedCheckoutProvider
            stripe={getStripe()}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </section>
    </main>
  );
}
