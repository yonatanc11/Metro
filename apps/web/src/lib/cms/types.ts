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

export type Brand = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
};

export type Currency = 'USD' | 'EUR' | 'ILS';

export type BadgeTone = 'new' | 'sale' | 'feature';

export type Product = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  price: number;
  currency: Currency;
  rating: number | null;
  reviewCount: number | null;
  badgeLabel: string | null;
  badgeTone: BadgeTone | null;
  images: StrapiMedia[];
  brand: Brand | null;
};

export type Category = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  heroImage: StrapiMedia | null;
  products?: Product[];
  pageSections?: Section[];
};

export type CategoryCardSize = 'large' | 'standard' | 'wide';

export type FeaturedCategoryCard = {
  id: number;
  size: CategoryCardSize;
  eyebrow: string | null;
  ctaLabel: string | null;
  category: Category | null;
};

export type FeaturedCategoriesSection = {
  __component: 'sections.featured-categories';
  id: number;
  heading: string;
  subheading: string | null;
  viewAllLabel: string | null;
  viewAllHref: string | null;
  cards: FeaturedCategoryCard[];
};

export type Section = HeroSection | FeaturedCategoriesSection;

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

export type NavigationLink = {
  __component: 'navigation.link';
  id: number;
  label: string;
  kind: 'category' | 'external';
  category: Pick<Category, 'id' | 'name' | 'slug'> | null;
  url: string | null;
};

export type Navigation = {
  id: number;
  documentId: string;
  items: NavigationLink[];
};

export type Footer = {
  id: number;
  documentId: string;
  links: NavigationLink[];
  copyright: string | null;
};
