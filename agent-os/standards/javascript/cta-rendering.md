# CTA Rendering

`navigation.link` (NavigationLink) can be partially filled by editors:
label without target, target without label, kind=external without url. CTAs
must render only when both a resolved href and a label are present.

## Pattern

```tsx
import { resolveCtaHref } from '@/lib/cms/links';

const primaryHref = resolveCtaHref(section.cta);
const hasPrimary = Boolean(primaryHref && section.cta?.label);

{hasPrimary && (
  <Button variant="primary" href={primaryHref as string}>
    {section.cta?.label}
  </Button>
)}
```

## Rules

- Always go through `resolveCtaHref` — never read `link.url` /
  `link.category.slug` directly. The resolver knows about `kind`,
  category-vs-external, and inert links.
- Always guard with `Boolean(href && link?.label)` before rendering.
- A NavigationLink with only a label or only a target renders nothing.
  This is intentional — don't add fallback labels in code.
- The same rule applies to `viewAll` links, footer links, and nav menu
  items — anything backed by `navigation.link`.
