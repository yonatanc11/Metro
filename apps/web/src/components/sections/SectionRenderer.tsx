import type { Section } from '@/lib/cms/types';
import { Hero } from './Hero';

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        switch (section.__component) {
          case 'sections.hero':
            return <Hero key={section.id} section={section} />;
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
