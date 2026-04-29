'use client';

import { useEffect, useState } from 'react';
import type { PriceBounds } from '@/lib/cms/product';
import { usePriceRange } from '@/hooks/usePriceRange';
import { getCurrencySymbol } from '@/utils/currency';
import { strings } from '@/strings';

type Props = {
  bounds: PriceBounds;
};

const thumbClasses =
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary';

export function PriceRangeFilter({ bounds }: Props) {
  const { localMin, localMax, minPct, maxPct, span, changeMin, changeMax } =
    usePriceRange(bounds);

  if (span <= 0) return null;

  const symbol = getCurrencySymbol(bounds.currency);

  return (
    <div className="space-y-4">
      <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface">
        {strings.filters.price.title}
      </h3>

      <div className="relative h-6">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-surface-container-highest" />
        <div
          className="pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          value={localMin}
          onChange={(e) => changeMin(Number(e.target.value))}
          aria-label={strings.filters.price.minLabel}
          className={`pointer-events-none absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent ${thumbClasses}`}
        />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          value={localMax}
          onChange={(e) => changeMax(Number(e.target.value))}
          aria-label={strings.filters.price.maxLabel}
          className={`pointer-events-none absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent ${thumbClasses}`}
        />
      </div>

      <div className="flex items-center gap-2">
        <NumberInput
          value={localMin}
          symbol={symbol}
          onCommit={changeMin}
          ariaLabel={strings.filters.price.minLabel}
        />
        <span className="font-label text-sm text-on-surface-variant">–</span>
        <NumberInput
          value={localMax}
          symbol={symbol}
          onCommit={changeMax}
          ariaLabel={strings.filters.price.maxLabel}
        />
      </div>
    </div>
  );
}

type NumberInputProps = {
  value: number;
  symbol: string;
  onCommit: (n: number) => void;
  ariaLabel: string;
};

function NumberInput({ value, symbol, onCommit, ariaLabel }: NumberInputProps) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  function commit() {
    const n = Number(draft);
    if (!Number.isFinite(n)) {
      setDraft(String(value));
      return;
    }
    onCommit(n);
  }

  return (
    <label className="relative block flex-1">
      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 font-label text-sm text-on-surface-variant">
        {symbol}
      </span>
      <input
        type="number"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        aria-label={ariaLabel}
        className="w-full rounded border border-outline-variant bg-surface-container-highest py-1 pl-5 pr-2 font-label text-sm text-on-surface focus:border-primary focus:outline-none"
      />
    </label>
  );
}
