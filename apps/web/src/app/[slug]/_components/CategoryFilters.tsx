'use client';

import type { Brand } from '@/lib/cms/types';
import type { PriceBounds } from '@/lib/cms/product';
import { useBrandFilter } from '@/hooks/useBrandFilter';
import { strings } from '@/strings';
import { PriceRangeFilter } from './PriceRangeFilter';

type Props = {
  brands: Brand[];
  priceBounds: PriceBounds | null;
};

export function CategoryFilters({ brands, priceBounds }: Props) {
  const { selected, toggleBrand, isPending } = useBrandFilter();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface">
          {strings.filters.brand.title}
        </h3>
        {brands.length === 0 ? (
          <p className="font-label text-sm text-on-surface-variant">
            {strings.filters.brand.empty}
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
