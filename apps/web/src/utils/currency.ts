import type { Currency } from '@/lib/cms/types';

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  ILS: '₪',
};

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOL[currency];
}
