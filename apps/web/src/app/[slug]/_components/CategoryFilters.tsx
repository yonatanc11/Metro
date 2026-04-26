'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import type { Brand } from '@/lib/cms/types';
import type { PriceBounds } from '@/lib/cms/product';
import { PriceRangeFilter } from './PriceRangeFilter';

type Props = {
  brands: Brand[];
  priceBounds: PriceBounds | null;
};

export function CategoryFilters({ brands, priceBounds }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selected = new Set(parseCsv(searchParams.get('brand')));

  function toggleBrand(slug: string) {
    const next = new Set(selected);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);

    const params = new URLSearchParams(searchParams.toString());
    if (next.size > 0) {
      params.set('brand', Array.from(next).join(','));
    } else {
      params.delete('brand');
    }
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `?${qs}` : '?', { scroll: false });
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface">
          Brand
        </h3>
        {brands.length === 0 ? (
          <p className="font-label text-sm text-on-surface-variant">
            No brands available.
          </p>
        ) : (
          <div className="space-y-2">
            {brands.map((brand) => {
              const isChecked = selected.has(brand.slug);
              return (
                <label
                  key={brand.id}
                  className="group flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleBrand(brand.slug)}
                    disabled={isPending}
                    className="h-4 w-4 rounded border border-outline-variant bg-surface-container-highest accent-primary transition-colors group-hover:border-primary"
                  />
                  <span className="font-label text-sm text-on-surface-variant transition-colors group-hover:text-on-surface">
                    {brand.name}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {priceBounds && <PriceRangeFilter bounds={priceBounds} />}
    </div>
  );
}

function parseCsv(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
