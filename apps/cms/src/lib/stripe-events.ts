export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export function statusForEvent(eventType: string): OrderStatus | null {
  if (eventType === 'checkout.session.completed') return 'paid';
  if (eventType === 'checkout.session.async_payment_succeeded') return 'paid';
  if (eventType === 'checkout.session.async_payment_failed') return 'failed';
  if (eventType === 'checkout.session.expired') return 'cancelled';
  return null;
}

type StripeShippingDetails = {
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

export function shippingFieldsFromSession(
  session: Record<string, unknown>
): Record<string, unknown> {
  const shipping = session.shipping_details as
    | StripeShippingDetails
    | null
    | undefined;
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
