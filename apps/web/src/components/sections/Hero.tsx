import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import type {
  HeroSection,
  StrapiBlockNode,
  StrapiTextNode,
} from '@/lib/cms/types';

function HeadingText({ node }: { node: StrapiTextNode }) {
  if (node.bold) return <span className="text-primary">{node.text}</span>;
  return <>{node.text}</>;
}

function RichHeading({ blocks }: { blocks: StrapiBlockNode[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <span key={i} className="block">
          {block.children.map((child, j) => (
            <HeadingText key={j} node={child} />
          ))}
        </span>
      ))}
    </>
  );
}

export function Hero({ section }: { section: HeroSection }) {
  const hasPrimary = Boolean(section.ctaLabel && section.ctaHref);
  const hasSecondary = Boolean(
    section.secondaryCtaLabel && section.secondaryCtaHref,
  );

  return (
    <section className="relative flex min-h-187.75 items-end overflow-hidden bg-surface-container-lowest pb-20 md:min-h-230.25 md:items-center md:pb-24">
      <div className="absolute inset-0 z-0">
        <Image
          src={section.backgroundImage.url}
          alt={section.backgroundImage.alternativeText ?? ''}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 mix-blend-luminosity md:mix-blend-normal"
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent md:via-surface-container-lowest/80" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-6 md:flex-row md:items-center md:px-8 md:pt-20">
        <div className="flex w-full flex-col items-start gap-6 md:w-1/2">
          {section.eyebrow && <Chip>{section.eyebrow}</Chip>}
          <h1 className="font-headline text-5xl font-black uppercase leading-none tracking-tighter text-on-surface md:text-7xl md:leading-[0.9]">
            <RichHeading blocks={section.headingRich} />
          </h1>
          {section.subheading && (
            <p className="max-w-md font-body text-base text-on-surface-variant md:mt-4 md:text-lg">
              {section.subheading}
            </p>
          )}
          {(hasPrimary || hasSecondary) && (
            <div className="mt-4 flex w-full flex-col gap-4 sm:w-auto sm:flex-row md:mt-8">
              {hasPrimary && (
                <Button variant="primary" href={section.ctaHref as string}>
                  {section.ctaLabel}
                </Button>
              )}
              {hasSecondary && (
                <Button
                  variant="secondary"
                  href={section.secondaryCtaHref as string}
                >
                  {section.secondaryCtaLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
