# Strapi Blocks Rendering

Strapi blocks-field content (`StrapiBlockNode[]`) is only rendered through
one of these primitives. Never `dangerouslySetInnerHTML`, never a markdown
renderer, never inline mapping in a section component.

## RichText — body copy

For paragraph-style content (descriptions, article bodies, list copy).
Handles `paragraph`, `heading`, `list`, `quote`, `code`, plus inline marks
(bold, italic, underline, strikethrough, code).

```tsx
<RichText blocks={section.body} />
```

## RichHeading — display headlines

For hero / section display headlines where editors emphasize words by
bolding them in the CMS. **Bold inline runs render as `text-primary`** —
that's the whole point of the primitive.

```tsx
<h1 className="font-headline text-5xl uppercase">
  <RichHeading blocks={hero.headline} />
</h1>
```

The wrapping element controls size/weight/tracking; `RichHeading` only
emits accent spans.

## Rules

- Any new blocks-field usage picks one of these two primitives.
- If a genuinely new rendering shape appears (e.g. inline blocks inside a
  card label), add a third primitive next to these — don't inline a custom
  walker in the section.
- Don't reach into `block.children[0].text` to extract plain text from a
  blocks field; if you need a string, model it as a string in Strapi.
