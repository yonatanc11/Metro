'use client';

import Image from 'next/image';
import { Fragment, useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { RichText } from '@/components/ui/RichText';
import { ChevronRightIcon, TruckIcon } from '@/components/ui/icons';
import type { Currency, Product } from '@/lib/cms/types';

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

type Props = {
  product: Product;
  ctaLabel: string;
  shippingNote: string | null;
};

export function ProductHero({ product, ctaLabel, shippingNote }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = product.images;
  const main = images[selectedIndex] ?? images[0] ?? null;
  const price = formatPrice(product.price, product.currency);
  const breadcrumbs = [
    product.category?.name?.toUpperCase(),
    product.brand?.name?.toUpperCase(),
  ].filter(Boolean) as string[];

  return (
    <section className="bg-surface-container-lowest">
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 lg:grid-cols-2 lg:gap-16">
        <div className="relative flex flex-col items-center justify-center bg-surface-container-low">
          <div className="relative aspect-square w-full overflow-hidden lg:aspect-[4/5]">
            {main && (
              <Image
                src={main.url}
                alt={main.alternativeText ?? product.title}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain opacity-90 mix-blend-luminosity lg:mix-blend-normal lg:opacity-100"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-surface-container-lowest to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-surface-container-lowest via-transparent to-transparent lg:hidden" />

            <div className="absolute inset-x-6 bottom-6 z-10 flex flex-col items-start gap-3 lg:hidden">
              {product.badgeLabel && <Chip>{product.badgeLabel}</Chip>}
              <h1 className="font-headline text-4xl font-black uppercase leading-none tracking-tighter text-on-surface">
                {product.title}
              </h1>
              <p className="font-body text-lg font-medium text-primary">
                {price}
              </p>
            </div>
          </div>

          {images.length > 1 && (
            <div className="absolute inset-x-8 bottom-8 z-20 hidden snap-x gap-4 overflow-x-auto pb-2 lg:flex">
              {images.map((img, i) => {
                const active = i === selectedIndex;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={active}
                    className={`relative h-24 w-24 flex-shrink-0 snap-center overflow-hidden rounded-lg bg-surface shadow-ambient transition-opacity ${
                      active
                        ? 'opacity-100 outline outline-1 outline-primary'
                        : 'opacity-50 outline outline-1 outline-outline-variant/40 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alternativeText ?? `${product.title} ${i + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col px-6 py-10 lg:justify-center lg:px-16 lg:py-16">
          {breadcrumbs.length > 0 && (
            <div className="mb-6 hidden items-center gap-2 font-label text-xs uppercase tracking-widest text-on-surface-variant lg:mb-8 lg:flex">
              {breadcrumbs.map((label, i) => (
                <Fragment key={label}>
                  {i > 0 && <ChevronRightIcon className="h-3 w-3" />}
                  <span>{label}</span>
                </Fragment>
              ))}
            </div>
          )}

          <h1 className="mb-4 hidden font-headline text-5xl font-bold uppercase leading-none tracking-tighter text-on-surface lg:block lg:text-7xl">
            {product.title}
          </h1>
          <p className="mb-8 hidden font-body text-xl font-medium text-primary lg:block">
            {price}
          </p>

          {product.specs && product.specs.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2 lg:mb-12">
              {product.specs.map((spec) => (
                <Chip key={spec.id}>{spec.value}</Chip>
              ))}
            </div>
          )}

          {product.description && product.description.length > 0 && (
            <div className="mb-8 font-body text-base leading-relaxed text-on-surface-variant lg:mb-12 lg:text-lg">
              <RichText blocks={product.description} />
            </div>
          )}

          <button
            type="button"
            className="w-full rounded-lg bg-primary py-5 font-headline text-base font-bold uppercase tracking-widest text-on-primary shadow-primary-glow transition-colors hover:bg-primary-container active:scale-[0.99] lg:py-6 lg:text-lg"
          >
            {ctaLabel}
          </button>

          {shippingNote && (
            <div className="mt-6 flex items-center justify-center gap-2 font-label text-[11px] uppercase tracking-widest text-on-surface-variant">
              <TruckIcon className="h-4 w-4" />
              <span>{shippingNote}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
