const STRAPI_URL = process.env.STRAPI_URL;

if (!STRAPI_URL) {
  throw new Error(
    'STRAPI_URL is not set. Add it to apps/web/.env.local (e.g. STRAPI_URL=http://localhost:1337)'
  );
}

export const env = {
  STRAPI_URL,
} as const;
