# Strapi Fetch

All Strapi requests go through `strapiFetch<T>` in
`apps/web/src/lib/cms/fetch.ts`. Never call `fetch(...)` against the
Strapi URL directly from a feature file.

```ts
export async function strapiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${env.STRAPI_URL}${path}`;
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Strapi fetch failed: …`);
  const json = (await res.json()) as StrapiResponse<T>;
  return json.data;
}
```

## Rules

- `strapiFetch<T>` is the only file that knows about `STRAPI_URL` and the
  `{ data, meta }` envelope. Callers see `T` directly.
- HTTP failure throws. Missing record returns `null` (caller decides
  whether to `notFound()`).
- Pass query params as a string built with `URLSearchParams`:
  `strapiFetch<Product[]>(\`/api/products?${params.toString()}\`)`.
- Per content type, one file under `apps/web/src/lib/cms/<type>.ts`,
  exporting `getXBySlug` / `getXForY` functions.

## Known inconsistency

`apps/web/src/lib/cms/category.ts` currently builds the URL inline and
calls `fetch` directly — refactor to use `strapiFetch` next time it's
touched.
