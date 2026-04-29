'use client';

import { useSearchParamCommit } from '@/hooks/useSearchParamCommit';
import { parseCsv } from '@/utils/string';

const BRAND_PARAM = 'brand';

export type UseBrandFilterResult = {
  selected: Set<string>;
  toggleBrand: (slug: string) => void;
  isPending: boolean;
};

export function useBrandFilter(): UseBrandFilterResult {
  const { searchParams, commit, isPending } = useSearchParamCommit();

  const selected = new Set(parseCsv(searchParams.get(BRAND_PARAM)));

  function toggleBrand(slug: string) {
    const next = new Set(selected);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);

    commit((params) => {
      if (next.size > 0) {
        params.set(BRAND_PARAM, Array.from(next).join(','));
      } else {
        params.delete(BRAND_PARAM);
      }
    });
  }

  return { selected, toggleBrand, isPending };
}
