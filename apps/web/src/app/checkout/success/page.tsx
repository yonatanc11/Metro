import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { env } from '@/env';
import { strings } from '@/strings';
import { formatPrice } from '@/utils/price';
import type { RedactedOrder } from '@/lib/checkout/types';
import { ClearCartOnMount } from './_components/ClearCartOnMount';
import { PendingPoll } from './_components/PendingPoll';

export const metadata: Metadata = {
  title: strings.checkout.success.metaTitle,
};

const SESSION_ID_RE = /^cs_(test|live)_[A-Za-z0-9]+$/;

async function fetchOrder(sessionId: string): Promise<RedactedOrder | null> {
  const res = await fetch(
    `${env.STRAPI_URL}/api/checkout/order-by-session/${encodeURIComponent(sessionId)}`,
    { cache: 'no-store' }
  );
  if (!res.ok) return null;
  return (await res.json()) as RedactedOrder;
}

const TITLE_FOR_STATUS: Record<RedactedOrder['status'], string> = {
  paid: strings.checkout.success.titlePaid,
  pending: strings.checkout.success.titlePending,
  failed: strings.checkout.success.titleFailed,
  cancelled: strings.checkout.success.titleCancelled,
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id || !SESSION_ID_RE.test(session_id)) notFound();

  const order = await fetchOrder(session_id);
  if (!order) notFound();

  const isPending = order.status === 'pending';

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-32 sm:px-8">
      <ClearCartOnMount />
      {isPending && <PendingPoll sessionId={session_id} />}

      <header className="mb-10 flex flex-col gap-3 text-center sm:text-left">
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
          {strings.checkout.success.orderLabel} #{order.orderId}
        </p>
        <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter md:text-5xl">
          {TITLE_FOR_STATUS[order.status]}
        </h1>
        {isPending && (
          <p className="font-body text-sm text-on-surface-variant">
            {strings.checkout.success.processingNote}
          </p>
        )}
        {order.email && !isPending && (
          <p className="font-body text-sm text-on-surface-variant">
            {strings.checkout.success.confirmationSentTo}{' '}
            <span className="text-on-background">{order.email}</span>
          </p>
        )}
      </header>

      <section className="rounded-DEFAULT bg-surface-container-low p-6 shadow-ambient sm:p-8">
        <h2 className="mb-6 font-label text-xs uppercase tracking-widest text-on-surface-variant">
          {strings.checkout.success.summaryTitle}
        </h2>

        <ul className="mb-6 space-y-4">
          {order.lineItems.map((item, idx) => (
            <li
              key={`${item.productDocumentId}-${idx}`}
              className="flex items-center gap-4"
            >
              {item.imageUrl && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-DEFAULT bg-surface-container-highest">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute right-1 top-1 rounded-full bg-background/80 px-2 py-0.5 font-label text-[10px] tracking-widest text-on-background">
                    x{item.quantity}
                  </span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-headline text-sm font-bold uppercase tracking-tight">
                  {item.title}
                </p>
                {item.brand && (
                  <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                    {item.brand}
                  </p>
                )}
              </div>
              <div className="font-headline text-base font-bold text-primary">
                {formatPrice(item.unitPrice * item.quantity, item.currency)}
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-end justify-between border-t border-outline-variant/20 pt-6">
          <span className="font-headline text-lg font-bold uppercase tracking-tight">
            {strings.checkout.success.total}
          </span>
          <span className="font-headline text-3xl font-black tracking-tighter text-primary">
            {formatPrice(order.amountTotal, order.currency)}
          </span>
        </div>

        {order.shipping && (
          <div className="mt-8 border-t border-outline-variant/20 pt-6">
            <p className="mb-2 font-label text-xs uppercase tracking-widest text-on-surface-variant">
              {strings.checkout.success.shippingTo}
            </p>
            <address className="not-italic font-body text-sm">
              <div className="font-bold">{order.shipping.name}</div>
              {order.shipping.line1 && <div>{order.shipping.line1}</div>}
              {order.shipping.line2 && <div>{order.shipping.line2}</div>}
              <div>
                {[
                  order.shipping.city,
                  order.shipping.state,
                  order.shipping.postal,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </div>
              {order.shipping.country && <div>{order.shipping.country}</div>}
            </address>
          </div>
        )}
      </section>

      <div className="mt-10 flex justify-center sm:justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-DEFAULT bg-primary px-6 py-3 font-headline text-sm font-bold uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container"
        >
          {strings.checkout.success.continueShopping}
        </Link>
      </div>
    </main>
  );
}
