# CMS Page Composition

Pages are composed in Strapi via a dynamic zone, not in code. The web app
is a thin shell over `<SectionRenderer>`; section markup lives in
`apps/web/src/components/sections/*` and `apps/cms/src/components/sections/*`.

## When to use a `pageSections` dynamiczone

Use a dynamiczone when the section list will actually vary per record —
editors need to add/remove/reorder. If a page type has a fixed schema (one
hero, one body, fixed CTA), model the fields directly.

## Allowed components

Default to **open**: any `sections.*` component is permitted. Narrow the
allowlist on a content type only when there's a clear editorial reason
(e.g. product pages today only allow `sections.rich-content` because hero
fields live on the product itself).

## Schema shape

```json
{
  "sections": {
    "type": "dynamiczone",
    "components": ["sections.hero", "sections.featured-categories"]
  }
}
```

- The attribute is named `sections` (singletons like Homepage) or
  `pageSections` (collection types like Product/Category).
- Pair with a `shared.seo` component on every routed page type.
- New section component? Add it under `apps/cms/src/components/sections/`,
  then add a matching renderer under
  `apps/web/src/components/sections/` and register it in `SectionRenderer`.
