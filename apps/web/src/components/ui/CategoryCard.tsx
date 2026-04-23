import Image from 'next/image';
import { ArrowOutwardIcon } from '@/components/ui/icons';
import type { CategoryCardSize } from '@/lib/cms/types';

type Props = {
  href: string;
  image: { url: string; alt: string } | null;
  title: string;
  description?: string | null;
  eyebrow?: string | null;
  ctaLabel?: string | null;
  size: CategoryCardSize;
};

const sizeClasses: Record<CategoryCardSize, string> = {
  large: 'h-80 md:col-span-8 md:row-span-2 md:h-auto',
  standard: 'h-64 md:col-span-4 md:row-span-1 md:h-auto',
  wide: 'h-64 md:col-span-12 md:row-span-1 md:h-auto',
};

const titleClasses: Record<CategoryCardSize, string> = {
  large: 'text-2xl md:text-3xl',
  standard: 'text-xl',
  wide: 'text-2xl md:text-3xl',
};

const paddingClasses: Record<CategoryCardSize, string> = {
  large: 'p-6 md:p-8',
  standard: 'p-6',
  wide: 'p-6 md:p-8',
};

const imageSizes: Record<CategoryCardSize, string> = {
  large: '(min-width: 768px) 66vw, 100vw',
  standard: '(min-width: 768px) 33vw, 100vw',
  wide: '100vw',
};

export function CategoryCard({
  href,
  image,
  title,
  description,
  eyebrow,
  ctaLabel,
  size,
}: Props) {
  const showDescription = size !== 'standard' && Boolean(description);
  const hasCta = Boolean(ctaLabel);

  return (
    <a
      href={href}
      className={`group relative block overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-low shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.45)] ${sizeClasses[size]}`}
    >
      {image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes={imageSizes[size]}
            className="object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
        </div>
      )}
      <div
        className={`absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 ${paddingClasses[size]}`}
      >
        <div className="max-w-md">
          {eyebrow && (
            <span className="mb-1 block font-label text-xs font-bold uppercase tracking-widest text-tertiary">
              {eyebrow}
            </span>
          )}
          <h3
            className={`font-headline font-bold uppercase tracking-tight text-on-surface ${titleClasses[size]}`}
          >
            {title}
          </h3>
          {showDescription && (
            <p className="mt-2 hidden font-body text-sm text-on-surface-variant md:block">
              {description}
            </p>
          )}
          {hasCta && (
            <span className="mt-5 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 font-headline text-sm font-bold uppercase tracking-wider text-on-primary transition-colors group-hover:bg-primary-container md:mt-6 md:px-6 md:py-3">
              {ctaLabel}
            </span>
          )}
        </div>
        {!hasCta && (
          <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-surface-variant/80 text-on-surface backdrop-blur-md transition-colors group-hover:bg-primary group-hover:text-on-primary ${
              size === 'standard' ? 'h-10 w-10' : 'h-12 w-12'
            }`}
          >
            <ArrowOutwardIcon
              className={size === 'standard' ? 'h-4 w-4' : 'h-5 w-5'}
            />
          </div>
        )}
      </div>
    </a>
  );
}
