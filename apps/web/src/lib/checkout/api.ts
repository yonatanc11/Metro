import { env } from '@/env';
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

export async function startCheckout(
  body: StartCheckoutBody
): Promise<StartCheckoutResponse> {
  const res = await fetch(`${env.STRAPI_URL}/api/checkout/start`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const code =
      data &&
      typeof data === 'object' &&
      'error' in data &&
      typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : 'checkout_failed';
    throw new CheckoutError(code, res.status);
  }

  return data as StartCheckoutResponse;
}

export async function getOrder(orderId: string): Promise<RedactedOrder> {
  const res = await fetch(
    `${env.STRAPI_URL}/api/checkout/order/${encodeURIComponent(orderId)}`,
    { cache: 'no-store' }
  );

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const code =
      data &&
      typeof data === 'object' &&
      'error' in data &&
      typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : 'checkout_failed';
    throw new CheckoutError(code, res.status);
  }

  return data as RedactedOrder;
}
