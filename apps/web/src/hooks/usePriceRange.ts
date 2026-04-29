'use client';

import { useEffect, useRef, useState } from 'react';
import type { PriceBounds } from '@/lib/cms/product';
import { useSearchParamCommit } from '@/hooks/useSearchParamCommit';
import { clamp, parseNum, percentage } from '@/utils/number';

const COMMIT_DEBOUNCE_MS = 350;
const MIN_PARAM = 'min';
const MAX_PARAM = 'max';

export type UsePriceRangeResult = {
  localMin: number;
  localMax: number;
  minPct: number;
  maxPct: number;
  span: number;
  changeMin: (raw: number) => void;
  changeMax: (raw: number) => void;
};

export function usePriceRange(bounds: PriceBounds): UsePriceRangeResult {
  const { searchParams, commit } = useSearchParamCommit();

  const urlMin = parseNum(searchParams.get(MIN_PARAM));
  const urlMax = parseNum(searchParams.get(MAX_PARAM));

  const [localMin, setLocalMin] = useState(urlMin ?? bounds.min);
  const [localMax, setLocalMax] = useState(urlMax ?? bounds.max);

  useEffect(() => {
    setLocalMin(urlMin ?? bounds.min);
    setLocalMax(urlMax ?? bounds.max);
  }, [urlMin, urlMax, bounds.min, bounds.max]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function commitDebounced(min: number, max: number) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      commit((params) => {
        if (min > bounds.min) params.set(MIN_PARAM, String(min));
        else params.delete(MIN_PARAM);
        if (max < bounds.max) params.set(MAX_PARAM, String(max));
        else params.delete(MAX_PARAM);
      });
    }, COMMIT_DEBOUNCE_MS);
  }

  function changeMin(raw: number) {
    const clamped = clamp(raw, bounds.min, localMax);
    setLocalMin(clamped);
    commitDebounced(clamped, localMax);
  }

  function changeMax(raw: number) {
    const clamped = clamp(raw, localMin, bounds.max);
    setLocalMax(clamped);
    commitDebounced(localMin, clamped);
  }

  const span = bounds.max - bounds.min;
  const minPct = percentage(localMin - bounds.min, span);
  const maxPct = percentage(localMax - bounds.min, span);

  return { localMin, localMax, minPct, maxPct, span, changeMin, changeMax };
}
