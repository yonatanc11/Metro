'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { PriceBounds } from '@/lib/cms/product';

type Props = {
  bounds: PriceBounds;
};

const CURRENCY_SYMBOL: Record<PriceBounds['currency'], string> = {
  USD: '$',
  EUR: '€',
  ILS: '₪',
};

export function PriceRangeFilter({ bounds }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlMin = parseNum(searchParams.get('min'));
  const urlMax = parseNum(searchParams.get('max'));

  const [localMin, setLocalMin] = useState(urlMin ?? bounds.min);
  const [localMax, setLocalMax] = useState(urlMax ?? bounds.max);

  useEffect(() => {
    setLocalMin(urlMin ?? bounds.min);
    setLocalMax(urlMax ?? bounds.max);
  }, [urlMin, urlMax, bounds.min, bounds.max]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function commit(min: number, max: number) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (min > bounds.min) params.set('min', String(min));
      else params.delete('min');
      if (max < bounds.max) params.set('max', String(max));
      else params.delete('max');
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `?${qs}` : '?', { scroll: false });
      });
    }, 350);
  }

  function changeMin(raw: number) {
    const clamped = Math.min(Math.max(raw, bounds.min), localMax);
    setLocalMin(clamped);
    commit(clamped, localMax);
  }
  function changeMax(raw: number) {
    const clamped = Math.max(Math.min(raw, bounds.max), localMin);
    setLocalMax(clamped);
    commit(localMin, clamped);
  }

  const span = bounds.max - bounds.min;
  if (span <= 0) return null;

  const minPct = ((localMin - bounds.min) / span) * 100;
  const maxPct = ((localMax - bounds.min) / span) * 100;
  const symbol = CURRENCY_SYMBOL[bounds.currency];

  const thumbClasses =
    '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary';

  return (
    <div className="space-y-4">
      <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface">
        Price
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
          aria-label="Minimum price"
          className={`pointer-events-none absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent ${thumbClasses}`}
        />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          value={localMax}
          onChange={(e) => changeMax(Number(e.target.value))}
          aria-label="Maximum price"
          className={`pointer-events-none absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent ${thumbClasses}`}
        />
      </div>

      <div className="flex items-center gap-2">
        <NumberInput
          value={localMin}
          symbol={symbol}
          onCommit={changeMin}
          ariaLabel="Minimum price"
        />
        <span className="font-label text-sm text-on-surface-variant">–</span>
        <NumberInput
          value={localMax}
          symbol={symbol}
          onCommit={changeMax}
          ariaLabel="Maximum price"
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

function parseNum(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
