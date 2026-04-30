import { factories } from '@strapi/strapi';
import Stripe = require('stripe');
import { getStripe } from '../../../lib/stripe';
import { toMinorUnits } from '../../../lib/money';
import {
  shippingFieldsFromSession,
  statusForEvent,
} from '../../../lib/stripe-events';

type LineInput = {
  productDocumentId: string;
  quantity: number;
};

type CreateWithSessionInput = {
  requestId: string;
  lines: LineInput[];
};

type Currency = 'USD' | 'EUR' | 'ILS';

type CreateWithSessionResult = {
  orderId: string;
  clientSecret: string;
  amountTotal: number;
  currency: Currency;
};

type LineItemSnapshot = {
  productDocumentId: string;
  title: string;
  brand: string | null;
  unitPrice: number;
  currency: Currency;
  quantity: number;
  imageUrl: string | null;
};

function getWebUrl(): string {
  const url = process.env.WEB_PUBLIC_URL;
  if (!url) throw new Error('WEB_PUBLIC_URL is not set');
  return url.replace(/\/$/, '');
}

function buildStripeLineItems(items: LineItemSnapshot[]) {
  return items.map((item) => ({
    price_data: {
      currency: item.currency.toLowerCase(),
      product_data: {
        name: item.title,
        ...(item.brand ? { description: item.brand } : {}),
        ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
      },
      unit_amount: item.unitPrice,
    },
    quantity: item.quantity,
  }));
}

type SessionCreateParams = Parameters<
  Stripe.Stripe['checkout']['sessions']['create']
>[0];

function buildSessionParams(args: {
  orderId: string;
  requestId: string;
  items: LineItemSnapshot[];
}): SessionCreateParams {
  const { orderId, requestId, items } = args;
  const webUrl = getWebUrl();
  return {
    ui_mode: 'embedded_page',
    mode: 'payment',
    line_items: buildStripeLineItems(items),
    return_url: `${webUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'GB', 'IL', 'DE', 'FR', 'ES', 'IT', 'NL'],
    },
    metadata: { orderId, requestId },
    payment_intent_data: { metadata: { orderId } },
  };
}

export default factories.createCoreService('api::order.order', () => ({
  async createWithSession({
    requestId,
    lines,
  }: CreateWithSessionInput): Promise<CreateWithSessionResult> {
    if (lines.length === 0) throw new Error('empty_cart');

    const existing = await strapi
      .documents('api::order.order')
      .findFirst({
        filters: { requestId } as never,
        populate: ['lineItems'],
      });

    if (existing) {
      if (existing.status !== 'pending') {
        throw new Error('order_not_pending');
      }

      let sessionId = existing.stripeCheckoutSessionId as string | null;
      let clientSecret: string | null = null;

      if (sessionId) {
        const session = await getStripe().checkout.sessions.retrieve(sessionId);
        clientSecret = session.client_secret;
      }

      if (!clientSecret) {
        const session = await getStripe().checkout.sessions.create(
          buildSessionParams({
            orderId: existing.documentId,
            requestId,
            items: (existing as unknown as { lineItems: LineItemSnapshot[] })
              .lineItems,
          }),
          { idempotencyKey: requestId }
        );
        sessionId = session.id;
        clientSecret = session.client_secret;
        await strapi.documents('api::order.order').update({
          documentId: existing.documentId,
          data: { stripeCheckoutSessionId: sessionId } as never,
        });
      }

      if (!clientSecret) throw new Error('checkout_failed');

      return {
        orderId: existing.documentId,
        clientSecret,
        amountTotal: existing.amountTotal as number,
        currency: existing.currency as Currency,
      };
    }

    const productIds = lines.map((l) => l.productDocumentId);
    const products = await strapi
      .documents('api::product.product')
      .findMany({
        filters: { documentId: { $in: productIds } } as never,
        fields: ['documentId', 'title', 'price', 'currency'],
        populate: { brand: { fields: ['name'] }, images: true },
        status: 'published',
      });

    const productById = new Map(
      (products as Array<Record<string, unknown>>).map((p) => [
        p.documentId as string,
        p,
      ])
    );

    const lineItems: LineItemSnapshot[] = [];
    let amountSubtotal = 0;
    let currency: Currency | null = null;

    for (const line of lines) {
      const product = productById.get(line.productDocumentId);
      if (!product) throw new Error('product_not_found');

      const productCurrency = product.currency as Currency;
      if (currency === null) currency = productCurrency;
      else if (currency !== productCurrency) throw new Error('mixed_currency');

      const unitPrice = toMinorUnits(product.price as number | string);
      amountSubtotal += unitPrice * line.quantity;

      const images = product.images as Array<{ url?: string }> | undefined;
      const brand = product.brand as { name?: string } | undefined;

      lineItems.push({
        productDocumentId: product.documentId as string,
        title: product.title as string,
        brand: brand?.name ?? null,
        unitPrice,
        currency: productCurrency,
        quantity: line.quantity,
        imageUrl: images?.[0]?.url ?? null,
      });
    }

    if (currency === null) throw new Error('empty_cart');
    const amountTotal = amountSubtotal;

    const order = await strapi.documents('api::order.order').create({
      data: {
        status: 'pending',
        requestId,
        currency,
        amountSubtotal,
        amountTotal,
        lineItems,
      } as never,
    });

    const session = await getStripe().checkout.sessions.create(
      buildSessionParams({
        orderId: order.documentId,
        requestId,
        items: lineItems,
      }),
      { idempotencyKey: requestId }
    );

    await strapi.documents('api::order.order').update({
      documentId: order.documentId,
      data: { stripeCheckoutSessionId: session.id } as never,
    });

    if (!session.client_secret) throw new Error('checkout_failed');

    return {
      orderId: order.documentId,
      clientSecret: session.client_secret,
      amountTotal,
      currency,
    };
  },

  async applyStripeEvent(event: {
    type: string;
    data: { object: Record<string, unknown> };
  }): Promise<void> {
    const newStatus = statusForEvent(event.type);
    if (!newStatus) {
      strapi.log.debug(`stripe webhook: ignoring event ${event.type}`);
      return;
    }

    const session = event.data.object;
    const metadata = session.metadata as { orderId?: string } | null | undefined;
    const orderId = metadata?.orderId;
    if (!orderId) {
      strapi.log.warn(
        `stripe webhook: ${event.type} missing metadata.orderId (session ${session.id})`
      );
      return;
    }

    const order = await strapi
      .documents('api::order.order')
      .findOne({ documentId: orderId });

    if (!order) {
      strapi.log.warn(
        `stripe webhook: order ${orderId} not found for ${event.type}`
      );
      return;
    }

    if (order.status === newStatus) return;

    const data: Record<string, unknown> = { status: newStatus };

    if (newStatus === 'paid') {
      data.paidAt = new Date().toISOString();

      const customer = session.customer_details as
        | { email?: string }
        | null
        | undefined;
      if (customer?.email && !order.email) {
        data.email = customer.email;
      }

      const paymentIntent = session.payment_intent;
      if (typeof paymentIntent === 'string' && !order.stripePaymentIntentId) {
        data.stripePaymentIntentId = paymentIntent;
      }

      Object.assign(data, shippingFieldsFromSession(session));
    }

    await strapi.documents('api::order.order').update({
      documentId: order.documentId,
      data: data as never,
    });
  },
}));
