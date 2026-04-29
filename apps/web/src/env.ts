const STRAPI_URL = process.env.STRAPI_URL;

if (!STRAPI_URL) {
  throw new Error(
    'STRAPI_URL is not set. Add it to apps/web/.env.local (e.g. STRAPI_URL=http://localhost:1337)'
  );
}

const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error(
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Add it to apps/web/.env.local (pk_test_... from the Stripe dashboard)'
  );
}

export const env = {
  STRAPI_URL,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
} as const;
