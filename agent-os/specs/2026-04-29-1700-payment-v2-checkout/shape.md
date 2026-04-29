# Stripe Elements Checkout — Shaping Notes

## Scope

Single-page Stripe Elements checkout for guest buyers. New `/checkout` route in `apps/web` + new `Order` content-type, custom `/api/checkout/start` route, and Stripe webhook in `apps/cms`. The cart's disabled "Checkout" button becomes a working entry point.

End state: a guest with a non-empty localStorage cart can enter email, fill the Stripe `<AddressElement>`, pay via `<PaymentElement>`, and land on `/checkout/success?orderId=...` with a `paid` Order persisted in Strapi (status flipped by the webhook).

## Decisions

- **Strapi owns Stripe.** The secret key already lives in `apps/cms/.env`; web only ever sees the publishable key + `clientSecret`.
- **Order before payment.** Strapi creates `Order(pending)` + PaymentIntent in one server call. Webhook is the source of truth for the `paid` flip.
- **Re-price server-side.** Client-supplied prices are never trusted; Strapi re-fetches each product by `documentId` and recomputes totals.
- **Single-page UI.** No multi-step wizard. Numbered sections (Contact / Shipping / Payment) on one page, mirroring the Stitch mock.
- **Guest-only.** Email is the only buyer identifier. No `Cart` content-type — cart stays in localStorage.
- **Stripe owns address + payment-method UI.** The mock's hand-built fields (firstName/lastName/line1/etc., card number/expiry/cvc) are replaced by `<AddressElement mode="shipping">` and `<PaymentElement>`, styled via Stripe `appearance` to match the mock's input/panel look.
- **Mixed-currency carts rejected.** Products carry `USD|EUR|ILS`; one currency per checkout.
- **Shipping = 0, Tax = 0 in v2.** Rendered as totals rows but always zero. Promo code, newsletter opt-in, and "Log in" link from the mock are deferred.
- **Transactional layout.** `/checkout` and `/checkout/success` use a slim header (Back-to-Shop + METRO mark) instead of `<SiteHeader/>`. Footer stays.
- **Checkout is not CMS-driven** (the editorial-vs-chrome split). Documented exception to the `cms-page-composition` standard.

## Context

- **Visuals:** Stitch HTML mock at `visuals/checkout.html` (pasted by user 2026-04-29). Mock-vs-implementation differences captured in `plan.md` under "Visual reference".
- **References:**
  - `apps/web/src/lib/cart/CartProvider.tsx` + `LocalStorageCartStore.ts` — cart state shape and `useCart()` API
  - `apps/web/src/app/cart/_components/CartSummary.tsx` — visual language to mirror in `OrderSummary`
  - `apps/web/src/lib/cms/fetch.ts` — `strapiFetch<T>` pattern (the read path; writes get a sibling helper because the response envelope differs)
- **Product alignment:** Roadmap (`reference_roadmap`) places payment as a post-cart step in the 10-phase plan; Strapi catalog already lives on Strapi Cloud and exposes `currency` on every product, so the foundation is ready.

## Standards Applied

- `javascript/strapi-fetch` — web→Strapi reads use `strapiFetch<T>`; the custom checkout POST gets a sibling `checkoutPost<T>` because the response isn't `{data:...}`.
- `javascript/component-variants` — any tone/variant in checkout components uses flat `Record<Variant,string>` lookup tables.
- `css/design-tokens` — Stripe `appearance` is built from `global.css` `@theme` tokens; no hardcoded hex outside that map.
- `css/icons` — all icons in checkout (lock, shield, verified, arrows) are inline SVGs in `apps/web/src/components/ui/icons/*` per `strokeIconProps`/`fill-current` conventions. No Material Symbols (despite the mock).
- `backend/cms-page-composition` — explicitly *does not apply*. Checkout is transactional chrome; no `<SectionRenderer>`, no dynamiczone. Documented exception.

## Standards not applicable

- `javascript/section-renderer`, `javascript/cta-rendering`, `javascript/strapi-blocks` — no editorial content on the checkout route.
