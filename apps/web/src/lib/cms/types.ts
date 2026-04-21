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

export type HeroSection = {
  __component: 'sections.hero';
  id: number;
  heading: string;
  subheading: string | null;
  backgroundImage: StrapiMedia;
  ctaLabel: string | null;
  ctaHref: string | null;
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
