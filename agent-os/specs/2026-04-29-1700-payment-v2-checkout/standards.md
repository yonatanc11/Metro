# Standards for Stripe Elements Checkout

The following standards apply to this work.

---

## javascript/strapi-fetch

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

### Rules

- `strapiFetch<T>` is the only file that knows about `STRAPI_URL` and the
  `{ data, meta }` envelope. Callers see `T` directly.
- HTTP failure throws. Missing record returns `null` (caller decides
  whether to `notFound()`).
- Pass query params as a string built with `URLSearchParams`:
  `strapiFetch<Product[]>(\`/api/products?${params.toString()}\`)`.
- Per content type, one file under `apps/web/src/lib/cms/<type>.ts`,
  exporting `getXBySlug` / `getXForY` functions.

### Application to checkout

`getOrder(orderId)` uses `strapiFetch<Order>`. The custom `POST /api/checkout/start` does **not** return the standard `{data}` envelope (it returns `{orderId, clientSecret, amountTotal, currency}`), so it gets a sibling helper `checkoutPost<T>` in `apps/web/src/lib/checkout/api.ts` that knows the bare-JSON shape but still centralizes `STRAPI_URL`.

---

## javascript/component-variants

# Component Variants

Use a flat `Record<Variant, string>` lookup table for variant/size/tone
classes. No `cva`, `tv`, or `clsx`.

```tsx
type Variant = 'primary' | 'secondary';

const base = 'inline-flex items-center justify-center rounded-lg …';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-container',
  secondary: 'border border-outline-variant/30 …',
};

export function Button({ variant = 'primary', className = '', ...props }) {
  return <a {...props} className={`${base} ${variants[variant]} ${className}`} />;
}
```

### Rules

- Class assembly is always `${base} ${variants[v]} ${className}` — user
  `className` appended last so callers can extend.
- Default the variant in the destructure (`variant = 'primary'`).
- If variants drift apart conceptually, split into separate primitives
  rather than expanding the table indefinitely.
- Never add `clsx`/`cva`/`tailwind-merge` to handle this — the explicit
  template-literal order is the contract.

### Application to checkout

`SectionPanel` (numbered checkout panel) and any tonal Pay-button states use this pattern. No new utility libs.

---

## css/design-tokens

# Design Tokens

All design tokens live in `apps/web/src/app/global.css` `@theme`.
No `tailwind.config.js` — Tailwind v4 picks them up from `@theme`.

### Naming

Material-3-style pairs: every surface/role color has an `on-*` partner.

```
--color-primary / --color-on-primary / --color-primary-container
--color-surface-container-lowest … --color-surface-container-highest
--color-outline / --color-outline-variant
```

Use them via Tailwind utilities: `bg-primary`, `text-on-surface`,
`border-outline-variant/30`.

### Rules

- Need a new token? Add it to `@theme` — don't inline it.
- Arbitrary Tailwind values (`text-[#abc]`, `bg-[rgb(...)]`) only for true
  one-offs (a unique shadow on one card). Recurring values become tokens.
- Fonts use semantic tokens: `font-headline`, `font-body`, `font-label`.
- Radii: `rounded-lg` (0.25rem) for buttons/cards, `rounded-xl` (0.5rem) for
  hero/feature cards, `rounded-full` for chips/pills.

### Application to checkout

`stripeAppearance.ts` reads token values once at module init and passes them to Stripe Elements `appearance.variables`/`rules`. If a token isn't yet declared (e.g., a checkout-specific shadow), promote it to `@theme` rather than inlining a hex.

---

## css/icons

# Icons

Icons are inline SVG components colocated under
`apps/web/src/components/ui/icons/`. No icon libraries (lucide, heroicons,
etc.) — paths come from Stitch mocks and we keep them exact.

### Stroke (default)

Use the shared `strokeIconProps` and `currentColor`:

```tsx
import { strokeIconProps } from './iconDefaults';

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg {...strokeIconProps} className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
```

### Filled (exception)

Use `fill="currentColor"` (or `fill-current` class) only when the glyph
requires it — arrows, solid badges, glyphs traced as filled paths.

```tsx
export function ArrowRightIcon({ className = 'h-4 w-4' }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`${className} fill-current`}>
      <path d="…" />
    </svg>
  );
}
```

### Rules

- Always color via `currentColor` so icons inherit `text-*` from the parent.
- `aria-hidden="true"` unless the icon is the only label (then add an
  accessible name on the parent).
- Default size via `className` (`h-4 w-4`); never hardcode width/height
  attributes on the `<svg>`.
- Re-export every icon from `icons/index.ts`.

### Application to checkout

The mock uses Material Symbols (`material-symbols-outlined` font) for `arrow_back`, `arrow_forward`, `lock`, `verified_user`, `shield`, `expand_more`, `info`, `credit_card`. Implementation maps these to:

- `arrow_back` → new `ArrowLeftIcon` (stroke)
- `arrow_forward` → existing `ArrowRightIcon`
- `lock` → existing `LockIcon`
- `verified_user` → new `VerifiedIcon` (shield-with-check)
- `shield` → new `ShieldIcon`
- `expand_more`, `info`, `credit_card` — owned by Stripe Elements, not us

---

## backend/cms-page-composition (NOT APPLIED — documented exception)

# CMS Page Composition

Pages are composed in Strapi via a dynamic zone, not in code. The web app
is a thin shell over `<SectionRenderer>`; section markup lives in
`apps/web/src/components/sections/*` and `apps/cms/src/components/sections/*`.

### Why it doesn't apply here

`/checkout` is transactional chrome, not editorial content. Editors should not be reordering the Contact / Shipping / Payment sections. The page mounts hand-authored panels in fixed order with no `pageSections` dynamiczone. This is the same exception already in use for `/cart`.

If marketing copy on checkout (e.g., trust statements, promo callouts) needs CMS control later, add a small singleton like `checkout-content` with named string fields — not a dynamiczone.
