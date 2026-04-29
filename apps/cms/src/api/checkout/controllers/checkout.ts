import type { Context } from 'koa';
import { getStripe } from '../../../lib/stripe';
import { maskEmail } from '../../../lib/email';

const UNPARSED_BODY = Symbol.for('unparsedBody');

type StartLineInput = {
  productDocumentId: string;
  quantity: number;
};

type StartBody = {
  requestId: string;
  email: string;
  lines: StartLineInput[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_FOR_CHECKOUT_ERROR: Record<string, number> = {
  empty_cart: 400,
  product_not_found: 400,
  mixed_currency: 400,
  order_not_pending: 409,
};

function parseStartBody(raw: unknown): StartBody | null {
  if (!raw || typeof raw !== 'object') return null;
  const body = raw as Record<string, unknown>;

  const requestId = body.requestId;
  if (typeof requestId !== 'string' || requestId.length < 8 || requestId.length > 128) {
    return null;
  }

  const email = body.email;
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) return null;

  const lines = body.lines;
  if (!Array.isArray(lines) || lines.length === 0) return null;

  const parsed: StartLineInput[] = [];
  for (const raw of lines) {
    if (!raw || typeof raw !== 'object') return null;
    const line = raw as Record<string, unknown>;
    const productDocumentId = line.productDocumentId;
    const quantity = line.quantity;
    if (typeof productDocumentId !== 'string' || productDocumentId.length === 0) return null;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) return null;
    parsed.push({ productDocumentId, quantity });
  }

  return { requestId, email, lines: parsed };
}

export default {
  async start(ctx: Context) {
    const body = parseStartBody(ctx.request.body);
    if (!body) {
      ctx.status = 400;
      ctx.body = { error: 'invalid_body' };
      return;
    }

    try {
      const result = await strapi
        .service('api::order.order')
        .createWithIntent(body);
      ctx.body = result;
    } catch (err: unknown) {
      const code = err instanceof Error ? err.message : '';
      const status = STATUS_FOR_CHECKOUT_ERROR[code];
      if (status) {
        ctx.status = status;
        ctx.body = { error: code };
        return;
      }
      strapi.log.error('checkout.start failed', err);
      ctx.status = 500;
      ctx.body = { error: 'checkout_failed' };
    }
  },

  async webhook(ctx: Context) {
    const sig = ctx.request.header['stripe-signature'];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (typeof sig !== 'string' || !secret) {
      ctx.status = 400;
      ctx.body = { error: 'missing_signature' };
      return;
    }

    const body = ctx.request.body as Record<string | symbol, unknown> | undefined;
    const rawBody = body?.[UNPARSED_BODY];
    if (typeof rawBody !== 'string') {
      ctx.status = 400;
      ctx.body = { error: 'missing_raw_body' };
      return;
    }

    const stripe = getStripe();
    let event: ReturnType<typeof stripe.webhooks.constructEvent>;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, secret);
    } catch (err) {
      strapi.log.warn('stripe webhook signature verification failed', err);
      ctx.status = 400;
      ctx.body = { error: 'invalid_signature' };
      return;
    }

    try {
      await strapi.service('api::order.order').applyStripeEvent(event);
      ctx.status = 200;
      ctx.body = { received: true };
    } catch (err) {
      strapi.log.error('stripe webhook handler failed', err);
      ctx.status = 500;
      ctx.body = { error: 'handler_failed' };
    }
  },

  async getOrder(ctx: Context) {
    const documentId = ctx.params.documentId;
    if (typeof documentId !== 'string' || documentId.length === 0) {
      ctx.status = 400;
      ctx.body = { error: 'invalid_id' };
      return;
    }

    const order = (await strapi
      .documents('api::order.order')
      .findOne({ documentId, populate: ['lineItems'] })) as
      | (Record<string, unknown> & { documentId: string })
      | null;

    if (!order) {
      ctx.status = 404;
      ctx.body = { error: 'not_found' };
      return;
    }

    ctx.body = {
      orderId: order.documentId,
      status: order.status,
      email: maskEmail(order.email as string),
      currency: order.currency,
      amountSubtotal: order.amountSubtotal,
      amountTotal: order.amountTotal,
      lineItems: ((order.lineItems as Array<Record<string, unknown>>) ?? []).map(
        (item) => ({
          productDocumentId: item.productDocumentId,
          title: item.title,
          brand: item.brand ?? null,
          unitPrice: item.unitPrice,
          currency: item.currency,
          quantity: item.quantity,
          imageUrl: item.imageUrl ?? null,
        })
      ),
      paidAt: order.paidAt ?? null,
      shipping: order.shippingName
        ? {
            name: order.shippingName,
            line1: order.shippingLine1 ?? null,
            line2: order.shippingLine2 ?? null,
            city: order.shippingCity ?? null,
            state: order.shippingState ?? null,
            postal: order.shippingPostal ?? null,
            country: order.shippingCountry ?? null,
          }
        : null,
    };
  },
};
