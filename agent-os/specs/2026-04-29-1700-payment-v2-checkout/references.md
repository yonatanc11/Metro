# References for Stripe Elements Checkout

## Similar implementations

### Cart state (mirror its shape, read from it on /checkout)

- **Location:** `apps/web/src/lib/cart/`
  - `CartProvider.tsx` — React Context + `useSyncExternalStore` over a `CartStore`. Exposes `useCart()` returning `{ lines, subtotal, currency, addLine, removeLine, updateQuantity, clear, hydrated }` (verify exact shape during Task 5/6).
  - `LocalStorageCartStore.ts` — persists under key `metro:cart:v1`, version 1.
  - `types.ts` — `CartLine`, `CartLineSnapshot`, `CartState`. The checkout payload to Strapi is just `{ productDocumentId, quantity }[]` — the snapshot is purely UI; Strapi re-prices.
- **Relevance:** `OrderSummary` reads directly from `useCart()`. `CheckoutView` calls `clear()` only via the success page's `<ClearCartOnMount/>`.
- **Key patterns to borrow:**
  - SSR-safe hydration guard (`hydrated` flag) — `OrderSummary` must render a placeholder until hydrated, otherwise SSR + localStorage diverge.
  - Empty-cart UX: cart page shows an empty state; `/checkout` redirects to `/cart` instead.

### Cart summary visual language (mirror it)

- **Location:** `apps/web/src/app/cart/_components/CartSummary.tsx`
- **Relevance:** The right-rail order summary on `/checkout` follows the same panel/typography/total-color rules but adds the line-item list, x{qty} corner badges, trust-row, and `USD` prefix on total.
- **Key patterns to borrow:** sticky positioning, gradient Pay button styling (which we reuse), `formatPrice` import path, `font-headline tracking-tight` for headings.

### Mobile checkout bar (also needs the swap)

- **Location:** `apps/web/src/app/cart/_components/MobileCheckoutBar.tsx`
- **Relevance:** Currently has a disabled checkout button that mirrors `CartSummary`. Same wire-up required in Task 8.

### Strapi fetch helper (extend the pattern)

- **Location:** `apps/web/src/lib/cms/fetch.ts:4-19`
- **Relevance:** All web→Strapi reads on the checkout flow (`getOrder`) use this helper. The custom `POST /api/checkout/start` returns a non-envelope shape, so we add a sibling `checkoutPost<T>` in `apps/web/src/lib/checkout/api.ts` that still centralizes `STRAPI_URL` rather than scattering `env.STRAPI_URL` reads.

### Strapi content-type conventions (mirror for `Order`)

- **Location:** `apps/cms/src/api/product/`
  - `content-types/product/schema.json` — shape and field-type idioms (enum, decimal, media, component refs)
  - `controllers/product.ts`, `services/product.ts`, `routes/product.ts` — file layout for the new `order` and `checkout` APIs
- **Relevance:** New `Order` collection type follows the same file structure. `checkout` is a custom (non-resource) API — same folder layout but with a custom-routes file instead of core router.

### Strapi components (mirror for `checkout.line-item`)

- **Location:** `apps/cms/src/components/shared/spec.json` (or any existing component schema)
- **Relevance:** Confirm component schema shape (`collectionName`, `info`, `attributes`) before authoring `checkout.line-item.json`.

### Existing icons (extend, don't replace)

- **Location:** `apps/web/src/components/ui/icons/`
  - `LockIcon.tsx`, `ArrowRightIcon.tsx`, `iconDefaults.ts` (`strokeIconProps`)
  - `index.ts` re-exports everything
- **Relevance:** Reuse `LockIcon`, `ArrowRightIcon`. Add `ArrowLeftIcon`, `ShieldIcon`, `VerifiedIcon` following the same conventions.

### Existing UI primitives

- **Location:** `apps/web/src/components/ui/`
  - `Button.tsx` — anchor-based primary/secondary; not used directly for the Pay button (which is a `<button type="submit" form="checkout-form">` with the gradient styling lifted from `CartSummary`).
- **Relevance:** Match button typography/elevation in the gradient Pay button without forking `Button.tsx`.

## Visual reference

- `visuals/checkout.html` — Stitch mock pasted verbatim by the user on 2026-04-29. The implementation mirrors layout and panel/input styling but adapts where Stripe Elements own the inputs (see `plan.md` "Mock-vs-plan adaptations" table).
