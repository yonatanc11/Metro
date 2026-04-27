import type { Section } from '@/lib/cms/types';
import { FeaturedCategories } from './FeaturedCategories';
import { Hero } from './Hero';
import { RichContent } from './RichContent';

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        switch (section.__component) {
          case 'sections.hero':
            return <Hero key={section.id} section={section} />;
          case 'sections.featured-categories':
            return <FeaturedCategories key={section.id} section={section} />;
          case 'sections.rich-content':
            return <RichContent key={section.id} section={section} />;
          default: {
            const _exhaustive: never = section;
            void _exhaustive;
            return null;
          }
        }
      })}
    </>
  );
}
