export type StrapiResponse<T> = {
  data: T;
  meta: Record<string, unknown>;
};

export type StrapiMedia = {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
};

export type StrapiTextNode = {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

export type StrapiBlockNode = {
  type: 'paragraph' | 'heading' | 'list' | 'list-item' | 'quote' | 'code';
  level?: number;
  children: StrapiTextNode[];
};

export type HeroSection = {
  __component: 'sections.hero';
  id: number;
  eyebrow: string | null;
  headingRich: StrapiBlockNode[];
  subheading: string | null;
  backgroundImage: StrapiMedia;
  ctaLabel: string | null;
  ctaHref: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaHref: string | null;
};

export type Section = HeroSection;

export type Seo = {
  id: number;
  metaTitle: string | null;
  metaDescription: string | null;
  shareImage: StrapiMedia | null;
};

export type Homepage = {
  id: number;
  documentId: string;
  sections: Section[];
  seo: Seo | null;
};
