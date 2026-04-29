# Icons

Icons are inline SVG components colocated under
`apps/web/src/components/ui/icons/`. No icon libraries (lucide, heroicons,
etc.) — paths come from Stitch mocks and we keep them exact.

## Stroke (default)

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

## Filled (exception)

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

## Rules

- Always color via `currentColor` so icons inherit `text-*` from the parent.
- `aria-hidden="true"` unless the icon is the only label (then add an
  accessible name on the parent).
- Default size via `className` (`h-4 w-4`); never hardcode width/height
  attributes on the `<svg>`.
- Re-export every icon from `icons/index.ts`.
