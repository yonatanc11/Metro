import { factories } from '@strapi/strapi';
import { getStripe } from '../../../lib/stripe';
import { toMinorUnits } from '../../../lib/money';
import {
  shippingFieldsFromIntent,
  statusForEvent,
} from '../../../lib/stripe-events';

type LineInput = {
  productDocumentId: string;
  quantity: number;
};

type CreateWithIntentInput = {
  requestId: string;
  email: string;
  lines: LineInput[];
};

type Currency = 'USD' | 'EUR' | 'ILS';

type CreateWithIntentResult = {
  orderId: string;
  clientSecret: string;
  amountTotal: number;
  currency: Currency;
};

function createCheckoutIntent(args: {
  orderId: string;
  amount: number;
  currency: Currency;
  email: string;
}) {
  const { orderId, amount, currency, email } = args;
  return getStripe().paymentIntents.create(
    {
      amount,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      metadata: { orderId },
    },
    { idempotencyKey: orderId }
  );
}

export default factories.createCoreService('api::order.order', () => ({
  async createWithIntent({
    requestId,
    email,
    lines,
  }: CreateWithIntentInput): Promise<CreateWithIntentResult> {
    if (lines.length === 0) throw new Error('empty_cart');

    const existing = await strapi
      .documents('api::order.order')
      .findFirst({ filters: { requestId } as never });

    if (existing) {
      if (existing.status !== 'pending') {
        throw new Error('order_not_pending');
      }

      let intentId = existing.stripePaymentIntentId as string | null;
      let clientSecret: string | null = null;

      if (intentId) {
        const intent = await getStripe().paymentIntents.retrieve(intentId);
        clientSecret = intent.client_secret;
      } else {
        const intent = await createCheckoutIntent({
          orderId: existing.documentId,
          amount: existing.amountTotal as number,
          currency: existing.currency as Currency,
          email,
        });
        intentId = intent.id;
        clientSecret = intent.client_secret;
        await strapi.documents('api::order.order').update({
          documentId: existing.documentId,
          data: { stripePaymentIntentId: intentId } as never,
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

    const lineItems: Array<Record<string, unknown>> = [];
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
        productDocumentId: product.documentId,
        title: product.title,
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
        email,
        currency,
        amountSubtotal,
        amountTotal,
        lineItems,
      } as never,
    });

    const intent = await createCheckoutIntent({
      orderId: order.documentId,
      amount: amountTotal,
      currency,
      email,
    });

    await strapi.documents('api::order.order').update({
      documentId: order.documentId,
      data: { stripePaymentIntentId: intent.id } as never,
    });

    if (!intent.client_secret) throw new Error('checkout_failed');

    return {
      orderId: order.documentId,
      clientSecret: intent.client_secret,
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

    const intent = event.data.object;
    const intentId = intent.id as string | undefined;
    if (!intentId) return;

    const order = await strapi
      .documents('api::order.order')
      .findFirst({ filters: { stripePaymentIntentId: intentId } as never });

    if (!order) {
      strapi.log.warn(
        `stripe webhook: no order matches paymentIntent ${intentId}`
      );
      return;
    }

    if (order.status === newStatus) return;

    const data: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'paid') {
      data.paidAt = new Date().toISOString();
      Object.assign(data, shippingFieldsFromIntent(intent));
    }

    await strapi.documents('api::order.order').update({
      documentId: order.documentId,
      data: data as never,
    });
  },
}));
