import { notFound } from 'next/navigation';
import { ProductHero } from '@/components/sections/ProductHero';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { getProductBySlug } from '@/lib/cms/product';
import { getProductPage } from '@/lib/cms/productPage';
import { strings } from '@/strings';

type Params = { slug: string; productSlug: string };

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, productSlug } = await params;
  const [product, productPage] = await Promise.all([
    getProductBySlug(slug, productSlug),
    getProductPage(),
  ]);

  if (!product) notFound();

  const ctaLabel =
    product.ctaLabel ?? productPage?.ctaLabel ?? strings.product.fallbackCta;
  const shippingNote =
    product.shippingNote ?? productPage?.shippingNote ?? null;
  const sections = [
    ...(productPage?.sections ?? []),
    ...(product.pageSections ?? []),
  ];

  return (
    <>
      <ProductHero
        product={product}
        ctaLabel={ctaLabel}
        shippingNote={shippingNote}
      />
      {sections.length > 0 && <SectionRenderer sections={sections} />}
    </>
  );
}
