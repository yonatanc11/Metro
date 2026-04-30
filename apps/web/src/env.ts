const STRAPI_URL_RAW = process.env.STRAPI_URL;

const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error(
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Add it to apps/web/.env.local (pk_test_... from the Stripe dashboard)'
  );
}

export const env = {
  get STRAPI_URL(): string {
    if (!STRAPI_URL_RAW) {
      throw new Error(
        'STRAPI_URL is not set. Add it to apps/web/.env.local (e.g. STRAPI_URL=http://localhost:1337)'
      );
    }
    return STRAPI_URL_RAW;
  },
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
};
