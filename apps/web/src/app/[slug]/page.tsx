import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/cms/category';
import { getBrandsForCategory } from '@/lib/cms/brand';
import {
  getPriceRangeForCategory,
  getProductsByCategorySlug,
} from '@/lib/cms/product';
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { strings } from '@/strings';
import { parseNum } from '@/utils/number';
import { pluralize } from '@/utils/pluralize';
import { productHref } from '@/utils/routes';
import { parseCsv } from '@/utils/string';
import { CategoryFilters } from './_components/CategoryFilters';

type Params = { slug: string };
type SearchParams = { brand?: string; min?: string; max?: string };

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const brandSlugs = parseCsv(sp.brand);
  const minPrice = parseNum(sp.min);
  const maxPrice = parseNum(sp.max);

  const [category, brands, priceBounds, products] = await Promise.all([
    getCategoryBySlug(slug),
    getBrandsForCategory(slug),
    getPriceRangeForCategory(slug),
    getProductsByCategorySlug({
      categorySlug: slug,
      brandSlugs,
      minPrice,
      maxPrice,
    }),
  ]);

  if (!category) notFound();

  const pageSections = category.pageSections ?? [];
  const hasActiveFilters =
    brandSlugs.length > 0 || minPrice !== undefined || maxPrice !== undefined;
  const resultsLabel = pluralize(
    products.length,
    strings.category.results.singular,
    strings.category.results.plural
  );

  return (
    <>
      {pageSections.length > 0 && <SectionRenderer sections={pageSections} />}
      <main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 pb-16 pt-8 md:flex-row md:px-8 md:pt-12">
        <aside className="w-full shrink-0 md:w-64">
          <CategoryFilters brands={brands} priceBounds={priceBounds} />
        </aside>

        <div className="grow">
          <div className="mb-6 flex items-end justify-between border-b border-surface-container-highest pb-4">
            <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter text-on-surface md:text-5xl">
              {category.name}
            </h1>
            <span className="font-label text-sm text-on-surface-variant">
              {products.length} {resultsLabel}
            </span>
          </div>

          {products.length === 0 ? (
            <p className="font-body text-sm text-on-surface-variant">
              {hasActiveFilters
                ? strings.category.empty.filtered
                : strings.category.empty.unfiltered}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
              {products.map((product) => {
                const firstImage = product.images[0];
                return (
                  <ProductCard
                    key={product.id}
                    href={productHref(slug, product.slug)}
                    image={
                      firstImage
                        ? {
                            url: firstImage.url,
                            alt: firstImage.alternativeText ?? product.title,
                          }
                        : null
                    }
                    title={product.title}
                    shortDescription={product.shortDescription}
                    price={product.price}
                    currency={product.currency}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    badge={
                      product.badgeLabel && product.badgeTone
                        ? {
                            label: product.badgeLabel,
                            tone: product.badgeTone,
                          }
                        : null
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
