import Stripe = require('stripe');

let client: Stripe.Stripe | null = null;

export function getStripe(): Stripe.Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  client = new Stripe(key);
  return client;
}
