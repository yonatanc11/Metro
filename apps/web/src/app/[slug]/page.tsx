import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/cms/category';
import { getNavigation, resolveLinkHref } from '@/lib/cms/navigation';
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionRenderer } from '@/components/sections/SectionRenderer';

type Params = { slug: string };

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [category, nav] = await Promise.all([
    getCategoryBySlug(slug),
    getNavigation(),
  ]);

  if (!category) notFound();

  const products = category.products ?? [];
  const pageSections = category.pageSections ?? [];
  const categoryLinks = (nav?.items ?? []).filter(
    (item) => item.kind === 'category' && item.category
  );

  return (
    <>
      {pageSections.length > 0 && <SectionRenderer sections={pageSections} />}
      <main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 pb-16 pt-8 md:flex-row md:px-8 md:pt-12">
      <aside className="w-full flex-shrink-0 md:w-64">
        <div className="space-y-3">
          <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface">
            Category
          </h3>
          <ul className="flex flex-row gap-4 overflow-x-auto md:flex-col md:gap-2">
            {categoryLinks.map((link) => {
              const isActive = link.category?.slug === slug;
              return (
                <li key={link.id}>
                  <a
                    href={resolveLinkHref(link)}
                    className={`inline-block whitespace-nowrap font-label text-sm transition-colors ${
                      isActive
                        ? 'text-on-surface'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <div className="flex-grow">
        <div className="mb-6 flex items-end justify-between border-b border-surface-container-highest pb-4">
          <h1 className="font-headline text-4xl font-bold uppercase tracking-tighter text-on-surface md:text-5xl">
            {category.name}
          </h1>
          <span className="font-label text-sm text-on-surface-variant">
            {products.length} {products.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        {products.length === 0 ? (
          <p className="font-body text-sm text-on-surface-variant">
            No products in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 lg:gap-8">
            {products.map((product) => {
              const firstImage = product.images[0];
              return (
                <ProductCard
                  key={product.id}
                  href={`/${slug}/${product.slug}`}
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
