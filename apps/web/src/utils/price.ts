import type { Currency } from '@/lib/cms/types';

const localeByCurrency: Record<Currency, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  ILS: 'he-IL',
};

export function formatPrice(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(localeByCurrency[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
