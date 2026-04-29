# Design Tokens

All design tokens live in `apps/web/src/app/global.css` `@theme`.
No `tailwind.config.js` — Tailwind v4 picks them up from `@theme`.

## Naming

Material-3-style pairs: every surface/role color has an `on-*` partner.

```
--color-primary / --color-on-primary / --color-primary-container
--color-surface-container-lowest … --color-surface-container-highest
--color-outline / --color-outline-variant
```

Use them via Tailwind utilities: `bg-primary`, `text-on-surface`,
`border-outline-variant/30`.

## Rules

- Need a new token? Add it to `@theme` — don't inline it.
- Arbitrary Tailwind values (`text-[#abc]`, `bg-[rgb(...)]`) only for true
  one-offs (a unique shadow on one card). Recurring values become tokens.
- Fonts use semantic tokens: `font-headline`, `font-body`, `font-label`.
- Radii: `rounded-lg` (0.25rem) for buttons/cards, `rounded-xl` (0.5rem) for
  hero/feature cards, `rounded-full` for chips/pills.
