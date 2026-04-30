import type { Currency } from '@/lib/cms/types';

export type CheckoutLineInput = {
  productDocumentId: string;
  quantity: number;
};

export type StartCheckoutBody = {
  requestId: string;
  lines: CheckoutLineInput[];
};

export type StartCheckoutResponse = {
  orderId: string;
  clientSecret: string;
  amountTotal: number;
  currency: Currency;
};

export type CheckoutErrorCode =
  | 'invalid_body'
  | 'product_not_found'
  | 'mixed_currency'
  | 'empty_cart'
  | 'order_not_pending'
  | 'checkout_failed'
  | 'invalid_id'
  | 'not_found';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export type OrderLineItem = {
  productDocumentId: string;
  title: string;
  brand: string | null;
  unitPrice: number;
  currency: Currency;
  quantity: number;
  imageUrl: string | null;
};

export type OrderShipping = {
  name: string;
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  postal: string | null;
  country: string | null;
};

export type RedactedOrder = {
  orderId: string;
  status: OrderStatus;
  email: string;
  currency: Currency;
  amountSubtotal: number;
  amountTotal: number;
  lineItems: OrderLineItem[];
  paidAt: string | null;
  shipping: OrderShipping | null;
};
