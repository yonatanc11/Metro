# Section Renderer

Dynamiczone sections from Strapi are rendered by a single component:
`apps/web/src/components/sections/SectionRenderer.tsx`. Pages never
iterate over `sections` themselves — they pass the array to `SectionRenderer`.

## Renderer shape

```tsx
export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        switch (section.__component) {
          case 'sections.hero':
            return <Hero key={section.id} section={section} />;
          case 'sections.featured-categories':
            return <FeaturedCategories key={section.id} section={section} />;
          case 'sections.rich-content':
            return <RichContent key={section.id} section={section} />;
          default: {
            const _exhaustive: never = section;
            void _exhaustive;
            return null;
          }
        }
      })}
    </>
  );
}
```

The `_exhaustive: never` line is load-bearing: TypeScript errors here when
a new section type is added to the union but not to the switch.

## Section component contract

Every section under `components/sections/` follows the same shape:

```tsx
export function Hero({ section }: { section: HeroSection }) { … }
```

- Single prop named `section`, typed to the specific section's TS type.
- Pure render — no `fetch`, no Strapi calls, no React state for data.
  Pages do the fetching and pass the section in.
- File name is PascalCase of the component name
  (`sections.featured-categories` → `FeaturedCategories.tsx`).

## Adding a new section

1. Add the Strapi component under `apps/cms/src/components/sections/`.
2. Add the TS type to `@/lib/cms/types` and include it in the `Section`
   union.
3. Add the renderer file under `apps/web/src/components/sections/`.
4. Add a `case` in `SectionRenderer` — the never check enforces this.
