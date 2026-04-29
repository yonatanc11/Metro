'use client';

import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { env } from '@/env';

let promise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!promise) {
    promise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return promise;
}
