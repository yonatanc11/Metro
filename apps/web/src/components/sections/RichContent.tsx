import { RichText } from '@/components/ui/RichText';
import type { RichContentSection } from '@/lib/cms/types';

export function RichContent({ section }: { section: RichContentSection }) {
  return (
    <section className="bg-surface px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-screen-md">
        {section.heading && (
          <h2 className="mb-8 font-headline text-3xl font-bold uppercase tracking-tighter text-on-surface md:text-4xl">
            {section.heading}
          </h2>
        )}
        <div className="font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
          <RichText blocks={section.body} />
        </div>
      </div>
    </section>
  );
}
