import Image from 'next/image';
import type { HeroSection } from '@/lib/cms/types';

export function Hero({ section }: { section: HeroSection }) {
  const hasCta = Boolean(section.ctaLabel && section.ctaHref);

  return (
    <section className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden">
      <Image
        src={section.backgroundImage.url}
        alt={section.backgroundImage.alternativeText ?? ''}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-black/40" />
      <div className="flex flex-col items-center gap-4 px-6 text-center text-white">
        <h1 className="text-4xl font-bold md:text-6xl">{section.heading}</h1>
        {section.subheading && (
          <p className="max-w-2xl text-lg md:text-xl">{section.subheading}</p>
        )}
        {hasCta && (
          <a
            href={section.ctaHref as string}
            className="mt-4 inline-flex items-center rounded-md bg-white px-6 py-3 font-medium text-black transition hover:bg-neutral-200"
          >
            {section.ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
