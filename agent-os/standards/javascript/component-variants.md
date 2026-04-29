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

## Rules

- Class assembly is always `${base} ${variants[v]} ${className}` — user
  `className` appended last so callers can extend.
- Default the variant in the destructure (`variant = 'primary'`).
- If variants drift apart conceptually, split into separate primitives
  rather than expanding the table indefinitely.
- Never add `clsx`/`cva`/`tailwind-merge` to handle this — the explicit
  template-literal order is the contract.
