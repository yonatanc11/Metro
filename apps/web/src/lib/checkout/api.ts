import type {
  CheckoutErrorCode,
  RedactedOrder,
  StartCheckoutBody,
  StartCheckoutResponse,
} from './types';

export class CheckoutError extends Error {
  constructor(public code: CheckoutErrorCode | string, public status: number) {
    super(code);
    this.name = 'CheckoutError';
  }
}

function errorCodeFrom(data: unknown): string {
  if (
    data &&
    typeof data === 'object' &&
    'error' in data &&
    typeof (data as { error: unknown }).error === 'string'
  ) {
    return (data as { error: string }).error;
  }
  return 'checkout_failed';
}

export async function startCheckout(
  body: StartCheckoutBody
): Promise<StartCheckoutResponse> {
  const res = await fetch('/api/checkout/start', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new CheckoutError(errorCodeFrom(data), res.status);
  return data as StartCheckoutResponse;
}

export async function getOrder(orderId: string): Promise<RedactedOrder> {
  const res = await fetch(
    `/api/checkout/order/${encodeURIComponent(orderId)}`,
    { cache: 'no-store' }
  );
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new CheckoutError(errorCodeFrom(data), res.status);
  return data as RedactedOrder;
}

export async function getOrderBySession(
  sessionId: string
): Promise<RedactedOrder> {
  const res = await fetch(
    `/api/checkout/order-by-session/${encodeURIComponent(sessionId)}`,
    { cache: 'no-store' }
  );
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new CheckoutError(errorCodeFrom(data), res.status);
  return data as RedactedOrder;
}
