export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export function statusForEvent(eventType: string): OrderStatus | null {
  if (eventType === 'payment_intent.succeeded') return 'paid';
  if (eventType === 'payment_intent.payment_failed') return 'failed';
  if (eventType === 'payment_intent.canceled') return 'cancelled';
  return null;
}

type StripeShipping = {
  name?: string | null;
  address?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
};

export function shippingFieldsFromIntent(
  intent: Record<string, unknown>
): Record<string, unknown> {
  const shipping = intent.shipping as StripeShipping | null | undefined;
  if (!shipping) return {};
  const address = shipping.address ?? {};
  return {
    shippingName: shipping.name ?? null,
    shippingLine1: address.line1 ?? null,
    shippingLine2: address.line2 ?? null,
    shippingCity: address.city ?? null,
    shippingState: address.state ?? null,
    shippingPostal: address.postal_code ?? null,
    shippingCountry: address.country ?? null,
  };
}
