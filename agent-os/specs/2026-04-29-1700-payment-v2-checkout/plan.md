# Stripe Elements Checkout — `/checkout` Page (v2)

## Context

The web app has a working guest cart (localStorage, [CartProvider.tsx](apps/web/src/lib/cart/CartProvider.tsx)) but no way to pay. The cart page's checkout button is disabled at [CartSummary.tsx:48](apps/web/src/app/cart/_components/CartSummary.tsx#L48). Stripe deps were just installed at root ([commit e98cbc3](apps/web/../package.json)) and `STRIPE_SECRET_KEY` is already in `apps/cms/.env`. We need a single-page Stripe Elements checkout for guest buyers, with the Strapi side owning the secret key, the `Order` lifecycle, and the webhook.

**Outcome:** A guest can click "Checkout" from the cart, land on `/checkout`, enter email, fill the Stripe Address Element, pay with the Stripe Payment Element, and land on `/checkout/success?orderId=...` with a confirmed Order in Strapi (status `paid`, marked by webhook).

## Decisions

- **Strapi owns Stripe.** Web POSTs cart + email to Strapi; Strapi creates `Order(pending)` + PaymentIntent + returns `{orderId, clientSecret}`. Webhook (Strapi) flips status to `paid`/`failed`.
- **Order before payment.** Order row is created in `pending` state before client-side confirmation. Webhook is the source of truth for `paid`.
- **Re-price on the server.** Strapi re-fetches each product by `documentId` and recomputes `amountTotal`. The client price snapshot is never trusted.
- **Single-page UI.** One `/checkout` route — cart summary + email + AddressElement + PaymentElement + Pay button. No multi-step wizard.
- **Guest-only.** No accounts. Email is the only buyer identifier. No `Cart` content-type — cart stays client-side; only `Order` is persisted.
- **Currency.** Products use `ILS|USD|EUR` (all 2-decimal). Strapi converts `price * 100` to Stripe minor units. Mixed-currency carts are rejected.
- **Checkout is not CMS-driven.** Transactional UI; lives outside `SectionRenderer` (per the editorial-vs-chrome split in memory).
- **Transactional layout.** `/checkout` and `/checkout/success` use a dedicated layout that hides `<SiteHeader>` and renders a slim "Back to Shop + METRO mark" header (mock, lines 25–32). Footer stays.

## Visual reference (Stitch mock)

The user pasted a Stitch HTML mock for `/checkout`. The implementation mirrors its structure but adapts where Stripe Elements own the inputs:

- **Page header**: slim transactional bar — `<a> ← Back to Shop` (left), `METRO` italic mark (center), spacer (right). Replaces the global `<SiteHeader/>` on this route.
- **Layout**: `max-w-7xl`, `flex flex-col lg:flex-row`, `gap-12 lg:gap-24`, form column `flex-1 max-w-3xl`, summary column `lg:w-[420px] sticky top-32`.
- **Page title**: `font-headline text-4xl md:text-5xl font-bold tracking-tighter` — copy: "SECURE CHECKOUT".
- **Sections** are numbered (`1. CONTACT INFO`, `2. SHIPPING DETAILS`, `3. PAYMENT`), each in `bg-surface-container-low p-6 sm:p-8 rounded-DEFAULT` panel.
- **Inputs** (when we render them ourselves — e.g., email): `bg-surface-container-highest border border-outline-variant/20 rounded-DEFAULT px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary`. Labels: `text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2 group-focus-within:text-primary`.
- **Order summary** (right column, glass panel):
  - Heading "ORDER SUMMARY" with bottom border
  - Item rows: `w-20 h-24` image with corner `x{qty}` badge, title (uppercase), variant subline, price in primary tone
  - Totals block: Subtotal / Shipping / Taxes / **Total** with `USD` prefix and `font-headline text-3xl font-black text-primary`
  - Trust-indicator icon row (lock, verified, shield) below the desktop Pay button
- **Pay button**: full-width gradient/shadow primary, label "Complete Order" + arrow icon. Shown under the summary on desktop, inside the form on mobile.

### Mock-vs-plan adaptations

| Mock element | Plan |
|---|---|
| Hand-built address fields (firstName/lastName/line1/apt/city/zip/country/phone) | Replaced by Stripe `<AddressElement mode="shipping">` styled via `appearance` to match the input look |
| Hand-built card fields (number/expiry/cvc/name) + Credit Card / PayPal radio | Replaced by Stripe `<PaymentElement>` (`automatic_payment_methods.enabled=true`); PayPal etc. surface automatically if enabled in Stripe dashboard |
| Material Symbols (`material-symbols-outlined`) | Inline SVG via existing `apps/web/src/components/ui/icons/*` per `css/icons` standard. Reuse `LockIcon`, `ArrowRightIcon`. Add new: `ArrowLeftIcon`, `ShieldIcon`, `VerifiedIcon` (or just keep Lock + Shield for the trust row) |
| "Log in" link in Contact panel | Omitted (guest-only scope) |
| Newsletter opt-in checkbox | Omitted (no newsletter system in v2) |
| Promo code input + Apply | Omitted (no discount engine in v2). Reserve a stable DOM slot above totals so we can drop it back in later without re-styling. |
| Hardcoded `$634.00` / `$15.00` shipping / `$44.38` tax / USD | Subtotal = sum of cart lines; **Shipping = 0, Tax = 0** in v2 (still rendered as rows, with values). Currency comes from cart lines. |
| Country select + Phone | Owned by Stripe `<AddressElement>` |

## Critical files

### New — Strapi (`apps/cms/`)

- `src/api/order/content-types/order/schema.json` — `Order` collection type
- `src/components/checkout/line-item.json` — `checkout.line-item` component (productDocumentId, title, brand, unitPrice, currency, quantity, imageUrl)
- `src/components/checkout/shipping-address.json` — captured from Stripe webhook (`shipping` on PaymentIntent)
- `src/api/order/controllers/order.ts` — extends core controller
- `src/api/order/services/order.ts` — extends core service; adds `repriceLines(lines)` and `createWithIntent({email, lines})`
- `src/api/order/routes/order.ts` — core routes (admin-only by default)
- `src/api/checkout/routes/checkout.ts` — public custom routes
- `src/api/checkout/controllers/checkout.ts`
  - `POST /api/checkout/start` → `{orderId, clientSecret, amountTotal, currency}`
  - `POST /api/checkout/webhook` → Stripe webhook handler (raw body, signature verified)
- `src/lib/stripe.ts` — single Stripe client instance (`new Stripe(env.STRIPE_SECRET_KEY)`)
- `config/middlewares.ts` — add raw-body parsing for the webhook path only (Strapi default body-parser strips signatures otherwise)
- `.env` (not committed) — add `STRIPE_WEBHOOK_SECRET`, confirm `STRIPE_SECRET_KEY`

### New — Web (`apps/web/`)

- `src/app/checkout/layout.tsx` — wraps `/checkout` and `/checkout/success`; renders the slim transactional header (Back-to-Shop link + METRO mark) instead of `<SiteHeader/>`. Keeps `<SiteFooter/>`. The root layout already mounts `CartProvider` + `ToastProvider`, so this layout adds nothing else.
- `src/app/checkout/_components/CheckoutHeader.tsx` — the slim header used by the layout
- `src/app/checkout/page.tsx` — page shell (server component); renders `<CheckoutView/>`
- `src/app/checkout/_components/CheckoutView.tsx` — `'use client'`; orchestrates lifecycle (cart guard, `startCheckout` call, holds `clientSecret`)
- `src/app/checkout/_components/ContactPanel.tsx` — section 1: numbered heading + email input panel
- `src/app/checkout/_components/CheckoutForm.tsx` — `'use client'`; renders `<Elements options={{clientSecret, appearance}}>` wrapping section 2 (`AddressElement`) and section 3 (`PaymentElement`) + Pay button; handles `confirmPayment`
- `src/app/checkout/_components/OrderSummary.tsx` — sticky right-rail; reads `useCart()` lines, renders item rows with `x{qty}` corner badges, totals block, trust-indicator row, desktop Pay button
- `src/app/checkout/_components/SectionPanel.tsx` — small wrapper: numbered uppercase heading + `bg-surface-container-low rounded-DEFAULT` panel; reused by all three sections
- `src/app/checkout/_components/stripeAppearance.ts` — token map: feeds `appearance.variables` + `appearance.rules` to Elements so Address/PaymentElement match the panel/input styling
- `src/app/checkout/success/page.tsx` — server component; reads `orderId` from `searchParams`; fetches via `getOrder`; renders confirmation
- `src/app/checkout/success/_components/ClearCartOnMount.tsx` — `'use client'`; calls `useCart().clear()` once
- `src/app/checkout/success/_components/PendingPoll.tsx` — `'use client'`; polls `getOrder` every 2s up to ~20s while `status==='pending'`
- `src/lib/checkout/api.ts` — `startCheckout({email, lines})` (custom POST helper, not `strapiFetch` because the response isn't `{data:...}`) and `getOrder(orderId)` via `strapiFetch`
- `src/lib/checkout/types.ts` — `StartCheckoutResponse`, `Order` types
- `src/lib/stripe/client.ts` — singleton `loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)`
- `src/components/ui/icons/ArrowLeftIcon.tsx`, `src/components/ui/icons/ShieldIcon.tsx`, `src/components/ui/icons/VerifiedIcon.tsx` — new inline-SVG icons (per `css/icons`); add to `icons/index.ts`

### Modified

- `apps/web/src/app/cart/_components/CartSummary.tsx:46-52` — replace the disabled `<button>` with a `<Link href="/checkout">` styled identically; disable only when cart is empty
- `apps/web/src/app/cart/_components/MobileCheckoutBar.tsx` — same swap
- `apps/web/src/strings.ts` — add `strings.checkout.*` keys (page title, email label, pay button, error states, success copy)
- `apps/web/src/env.ts` — add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `apps/cms/config/middlewares.ts` — raw-body for `/api/checkout/webhook`

## Reuse — existing utilities

- [`useCart()` and `CartLine` type](apps/web/src/lib/cart/CartProvider.tsx) — read cart lines for summary + payload to Strapi
- [`strapiFetch<T>`](apps/web/src/lib/cms/fetch.ts) — all web→Strapi calls (matches `javascript/strapi-fetch` standard)
- [`formatPrice`](apps/web/src/utils/price.ts) — already used in CartSummary
- [Button primitive](apps/web/src/components/ui/Button.tsx) — Pay button styling
- [Design tokens in `global.css`](apps/web/src/app/global.css) — colors, fonts, shadows; PaymentElement `appearance` config maps tokens → Stripe theme

## Implementation tasks

### Task 1 — Save spec documentation

Create `agent-os/specs/2026-04-29-1700-payment-v2-checkout/` with:

- `plan.md` — copy of this file
- `shape.md` — scope/decisions/context from this conversation
- `standards.md` — full content of relevant standards (see "Standards" below)
- `references.md` — pointers to cart code (`apps/web/src/lib/cart/`, `apps/web/src/app/cart/`, `strapiFetch`)
- `visuals/checkout.html` — the Stitch HTML mock the user pasted, saved verbatim for reference

### Task 2 — Strapi: `Order` content-type + checkout component

1. Create `checkout.line-item` component (productDocumentId: string, title: string, brand: string|null, unitPrice: decimal, currency: enum, quantity: integer, imageUrl: string).
2. Create `Order` collection type:
   - `status`: enum `pending|paid|failed|cancelled`, default `pending`
   - `email`: email, required
   - `currency`: enum `USD|EUR|ILS`, required
   - `amountSubtotal`: integer (minor units)
   - `amountTotal`: integer (minor units)
   - `lineItems`: repeatable component `checkout.line-item`
   - `stripePaymentIntentId`: string, unique
   - `shippingName`, `shippingLine1`, `shippingLine2`, `shippingCity`, `shippingState`, `shippingPostal`, `shippingCountry`: string (filled by webhook)
   - `paidAt`: datetime
3. Restrict default `find/findOne/create/update/delete` to admin only (`config.policies` / route `auth: { scope: [...] }`); the public route is the custom one in Task 3.

### Task 3 — Strapi: `/api/checkout/start` endpoint

1. `src/lib/stripe.ts` exports a single Stripe client.
2. `src/api/checkout/routes/checkout.ts` — public route `POST /api/checkout/start`.
3. Controller validates body shape: `{ email: string, lines: [{ productDocumentId, quantity }] }`. Return 400 on missing/invalid.
4. Service `createWithIntent`:
   - Fetch each product by `documentId`; reject if missing or unpublished
   - Reject mixed currencies
   - Compute `amountSubtotal = sum(unitPrice * quantity)` in minor units; `amountTotal = subtotal` (shipping/tax = 0 for v2)
   - Create `Order(pending)` with `lineItems` snapshot
   - Create PaymentIntent: `amount=amountTotal, currency, automatic_payment_methods.enabled=true, metadata.orderId=<documentId>, receipt_email=<email>`
   - Update Order with `stripePaymentIntentId`
   - Return `{ orderId, clientSecret, amountTotal, currency }`

### Task 4 — Strapi: webhook endpoint

1. `POST /api/checkout/webhook` — public, raw body parsing.
2. Configure body-parser middleware to skip JSON parsing on this exact path (Strapi convention: per-route `config.middlewares: ['global::raw-body']` or use `koa-body` skip).
3. Verify signature with `STRIPE_WEBHOOK_SECRET`.
4. Handle:
   - `payment_intent.succeeded` → load Order by `stripePaymentIntentId`, set `status=paid`, `paidAt=now`, copy `shipping.*` fields
   - `payment_intent.payment_failed` → `status=failed`
   - `payment_intent.canceled` → `status=cancelled`
5. Return 200 always (Stripe retries on non-2xx). Log unknown events.

### Task 5 — Web: Stripe singleton + env

1. `apps/web/src/lib/stripe/client.ts` — `getStripe()` memoizes `loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)`.
2. Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `apps/web/src/env.ts` (validated).
3. `apps/web/src/lib/checkout/api.ts`:
   - `startCheckout(body)` → `POST ${STRAPI_URL}/api/checkout/start` via `fetch` (not `strapiFetch`, since the response is not the standard `{data}` envelope — it's our custom shape). Add a sibling helper `checkoutPost<T>` for clarity.
   - `getOrder(orderId)` → `strapiFetch<Order>(/api/orders/${orderId})` (read-only public view, or restrict and proxy through a custom `GET /api/checkout/order/:id`).
   - **Decision needed during Task 5:** keep `Order` find restricted (admin-only) and add a public `GET /api/checkout/order/:id` that returns a redacted view (no Stripe IDs). Recommended.

### Task 6 — Web: `/checkout` page

1. **Transactional layout** at `app/checkout/layout.tsx` renders `<CheckoutHeader/>` + `{children}`. Header markup mirrors the mock's lines 25–32 (sticky, `bg-background/90 backdrop-blur-xl`, three-column flex). Uses `ArrowLeftIcon` + the `METRO` italic mark.
2. `app/checkout/page.tsx` — server component, renders `<CheckoutView/>`.
3. `CheckoutView` (`'use client'`):
   - Read `lines` + `subtotal` from `useCart()`. If `lines.length === 0`, `router.replace('/cart')`.
   - Render the page title (`SECURE CHECKOUT`) + two-column flex layout matching the mock.
   - Holds `{clientSecret, orderId}` state. Start a single call to `startCheckout({email, lines})` once email passes validation (debounced) — show inline "Initializing payment…" while pending.
   - Re-call `startCheckout` (cancel previous) if `lines` change while on the page (qty edit on cart could happen elsewhere).
4. `ContactPanel` (section 1):
   - Heading `1. CONTACT INFO` + omitted "Log in" link slot
   - Email input styled to match mock (`bg-surface-container-highest border outline-variant/20 rounded-DEFAULT`, label uppercase tracking-widest, focus ring primary)
   - Validates email shape locally before triggering `startCheckout`
5. `CheckoutForm` (sections 2 + 3, inside the `<Elements>` provider):
   - Section 2 panel wraps `<AddressElement options={{ mode: 'shipping' }} />`
   - Section 3 panel wraps a "All transactions are secure and encrypted." subline + `<PaymentElement />`
   - Mobile-only `Complete Order` button at form bottom (mock lines 173–177)
   - Submit handler: `stripe.confirmPayment({ elements, confirmParams: { return_url: \`${origin}/checkout/success?orderId=${orderId}\`, receipt_email: email }, redirect: 'if_required' })`
   - On `paymentIntent.status === 'succeeded'` without redirect, `router.push('/checkout/success?orderId=...')`
   - Inline error rendering for Stripe errors (use `error` token color)
6. `OrderSummary` (right rail):
   - Glass panel `bg-surface-container-low/80 backdrop-blur-xl p-8 rounded-DEFAULT`
   - Items list from `useCart().lines` (image + `x{qty}` badge + uppercase title + variant subline placeholder + `formatPrice` in `text-primary`)
   - Promo-code DOM slot reserved as a comment for future
   - Totals: Subtotal (cart sum), Shipping `formatPrice(0, currency)`, Taxes `formatPrice(0, currency)`, **Total** with `USD/EUR/ILS` currency code prefix and `font-headline text-3xl font-black text-primary`
   - Desktop-only `Complete Order` button (sticky-friendly; calls form submit via `formId` ref or form-association attr)
   - Trust-indicator row: `LockIcon`, `VerifiedIcon`, `ShieldIcon` at `text-on-surface-variant/70`
7. `stripeAppearance.ts` — exports an `Appearance` object built from CSS-token reads (or hard-mapped values pulled from `global.css`):
   - `theme: 'flat'` base
   - `variables`: `colorPrimary: '#ffb692'`, `colorBackground: '#353534'` (matches `surface-container-highest`), `colorText: '#e5e2e1'`, `colorTextSecondary: '#e2bfb0'`, `colorDanger: '#ffb4ab'`, `fontFamily: 'Inter, sans-serif'`, `borderRadius: '0.125rem'` (Tailwind `rounded-DEFAULT`), `spacingUnit: '4px'`
   - `rules`: `.Input` → border `1px solid rgba(89,65,54,0.2)` (outline-variant/20), focus → primary border + ring; `.Label` → uppercase tracking, `text-on-surface-variant`
8. Add `strings.checkout.*` keys: `pageTitle`, `backToShop`, `sectionContact`, `sectionShipping`, `sectionPayment`, `emailLabel`, `emailPlaceholder`, `securePaymentNote`, `payButton`, `summaryTitle`, `subtotal`, `shipping`, `taxes`, `total`, `trustNote`, `errorGeneric`, `errorMixedCurrency`, `errorEmptyCart`, `initializing`.

### Task 7 — Web: `/checkout/success`

1. Server component reads `orderId` from `searchParams`, calls `getOrder`.
2. Renders order summary (line items, totals, masked email, "we sent confirmation to ...").
3. Tiny client component on mount calls `useCart().clear()`.
4. If order is still `pending` (webhook race), show "Processing..." with a polling client component that refetches every 2s up to ~20s, then surfaces a "We're confirming — check your email" fallback.

### Task 8 — Wire cart → checkout

1. Replace disabled button in [CartSummary.tsx:46-52](apps/web/src/app/cart/_components/CartSummary.tsx#L46-L52) with a `<Link href="/checkout">`; keep the same gradient styling. Disable when `lines.length === 0` (render as a non-link span with disabled styles).
2. Same swap in `MobileCheckoutBar.tsx`.

## Standards applied

(Read at plan time; included in `standards.md` for the spec.)

- **`javascript/strapi-fetch`** — web→Strapi reads use `strapiFetch<T>`; the custom checkout POST gets a sibling helper because the response shape isn't the standard `{data}` envelope.
- **`javascript/component-variants`** — any tone/variant in checkout form components uses `Record<Variant, string>` lookup tables (no `cva`/`clsx`).
- **`css/design-tokens`** — Stripe `appearance` is built from `global.css` `@theme` tokens; no hardcoded colors.
- **`css/icons`** — any icons in checkout (lock, success check) use the inline-SVG `strokeIconProps` pattern.
- **`backend/cms-page-composition`** — explicitly *does not apply*; `/checkout` is transactional chrome, documented as the exception.

## Standards *not* applied (and why)

- `javascript/section-renderer`, `javascript/cta-rendering`, `javascript/strapi-blocks` — checkout has no editorial content or dynamic-zone sections.

## Verification

End-to-end test (run by user; per `feedback_execution`, Claude does not run dev servers):

1. **Strapi up** — `nx run cms:develop`. Verify the new `Order` content-type is visible in admin.
2. **Strapi unit test** — POST `http://localhost:1337/api/checkout/start` from a REST client with `{email, lines}` for two products. Expect 200 + `clientSecret` shape. Verify a `pending` Order appears in admin with line snapshot + `stripePaymentIntentId`.
3. **Mixed currency rejection** — send lines from products of different currencies; expect 400.
4. **Web** — `nx run web:dev`, add 1–2 products to cart, click Checkout from `/cart`, land on `/checkout`. Cart sidebar matches.
5. **Stripe test card** — `4242 4242 4242 4242` any future expiry, any CVC, any zip. AddressElement + PaymentElement render; submit succeeds; redirect to `/checkout/success?orderId=...`.
6. **Webhook (local)** — `stripe listen --forward-to localhost:1337/api/checkout/webhook`, run the same flow. Verify Order flips to `paid`, `paidAt` set, shipping fields filled.
7. **Failure card** — `4000 0000 0000 0002`. Expect inline error on the form; Order remains `pending` until webhook timeout (or `payment_intent.payment_failed` flips to `failed`).
8. **Success page** — clears cart (cart icon shows 0); shows order details; refreshing keeps state (read from Strapi).
9. **Empty cart guard** — visit `/checkout` directly with empty cart → redirects to `/cart`.

## Open items to resolve mid-build

- **Order read access:** Public `GET /api/orders/:id` is risky (PII). Plan: keep `find/findOne` admin-restricted, add a redacted `GET /api/checkout/order/:id` public route that returns only `{status, lineItems, amountTotal, currency, email (masked)}`.
- **Per-route raw body parsing in Strapi:** Strapi v5 default body parser consumes the stream. We'll add a custom middleware that registers before the parser and skips parsing for `/api/checkout/webhook`. Alternative if that proves fiddly: a tiny standalone Koa route registered via a Strapi plugin lifecycle.
- **Footer on /checkout:** Mock keeps the existing site footer; current `RootLayout` already renders `<SiteFooter/>`, so the new `app/checkout/layout.tsx` only overrides the header. Confirm the design intent during build (kill the footer if mock review says transactional pages should be chromeless).
- **Desktop Pay button form association:** The Pay button lives in the right rail but submits the left-rail form. Use HTML's native `form="checkout-form"` attribute (not lifted state or refs) to keep the two columns independent.
