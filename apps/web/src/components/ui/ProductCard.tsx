import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@/components/ui/icons';
import type { BadgeTone, Currency } from '@/lib/cms/types';

type Props = {
  href: string;
  image: { url: string; alt: string } | null;
  title: string;
  shortDescription: string | null;
  price: number;
  currency: Currency;
  rating: number | null;
  reviewCount: number | null;
  badge: { label: string; tone: BadgeTone } | null;
};

const badgeTones: Record<BadgeTone, string> = {
  new: 'bg-primary-container text-on-primary-container',
  sale: 'bg-tertiary-container text-on-tertiary-container',
  feature: 'bg-secondary-container text-on-secondary-container',
};

const localeByCurrency: Record<Currency, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  ILS: 'he-IL',
};

function formatPrice(amount: number, currency: Currency) {
  return new Intl.NumberFormat(localeByCurrency[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function ProductCard({
  href,
  image,
  title,
  shortDescription,
  price,
  currency,
  rating,
  reviewCount,
  badge,
}: Props) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg bg-surface-container-low transition-all duration-300 hover:bg-surface-container-high hover:shadow-ambient"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-container-lowest">
        {image && (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
            className="object-cover opacity-80 mix-blend-luminosity transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:mix-blend-normal"
          />
        )}
        {badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2 py-1 font-headline text-[10px] font-bold uppercase tracking-wider ${badgeTones[badge.tone]}`}
          >
            {badge.label}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4 md:p-6">
        {rating !== null && (
          <div className="flex items-center gap-1 text-tertiary">
            <StarIcon className="h-3.5 w-3.5" />
            <span className="font-label text-xs text-on-surface-variant">
              {rating.toFixed(1)}
              {reviewCount !== null && ` (${reviewCount})`}
            </span>
          </div>
        )}
        <h3 className="truncate font-headline text-lg font-bold uppercase tracking-tight text-on-surface md:text-xl">
          {title}
        </h3>
        {shortDescription && (
          <p className="line-clamp-2 hidden font-body text-sm text-on-surface-variant md:block">
            {shortDescription}
          </p>
        )}
        <span className="mt-1 font-headline text-base font-bold text-primary md:text-lg">
          {formatPrice(price, currency)}
        </span>
      </div>
    </Link>
  );
}
