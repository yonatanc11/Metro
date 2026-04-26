import { CategoryCard } from '@/components/ui/CategoryCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { FeaturedCategoriesSection } from '@/lib/cms/types';

export function FeaturedCategories({
  section,
}: {
  section: FeaturedCategoriesSection;
}) {
  return (
    <section className="bg-surface-container-low px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-screen-2xl">
        <SectionHeader
          heading={section.heading}
          subheading={section.subheading}
          viewAll={section.viewAll}
        />
        <div className="grid grid-cols-1 gap-4 md:auto-rows-[300px] md:grid-cols-12 md:gap-6">
          {section.cards.map((card) => {
            const category = card.category;
            if (!category) return null;
            const image = category.heroImage
              ? {
                  url: category.heroImage.url,
                  alt: category.heroImage.alternativeText ?? category.name,
                }
              : null;
            return (
              <CategoryCard
                key={card.id}
                href={`/${category.slug}`}
                image={image}
                title={category.name}
                description={category.description}
                eyebrow={card.eyebrow}
                ctaLabel={card.ctaLabel}
                size={card.size}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
