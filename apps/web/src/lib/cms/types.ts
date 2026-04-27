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
  cta: NavigationLink | null;
  secondaryCta: NavigationLink | null;
};

export type Brand = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
};

export type Currency = 'USD' | 'EUR' | 'ILS';

export type BadgeTone = 'new' | 'sale' | 'feature';

export type ProductSpec = {
  id: number;
  label: string;
  value: string;
};

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
  description?: StrapiBlockNode[] | null;
  specs?: ProductSpec[];
  category?: Pick<Category, 'id' | 'name' | 'slug'> | null;
  ctaLabel?: string | null;
  shippingNote?: string | null;
  pageSections?: ProductSection[];
};

export type ProductPage = {
  id: number;
  documentId: string;
  ctaLabel: string;
  shippingNote: string | null;
  sections: ProductSection[];
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
  viewAll: NavigationLink | null;
  cards: FeaturedCategoryCard[];
};

export type RichContentSection = {
  __component: 'sections.rich-content';
  id: number;
  heading: string | null;
  body: StrapiBlockNode[];
};

export type Section =
  | HeroSection
  | FeaturedCategoriesSection
  | RichContentSection;

export type ProductSection = RichContentSection;

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
