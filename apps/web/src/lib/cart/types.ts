import type { Currency } from '@/lib/cms/types';

export type CartLineSnapshot = {
  title: string;
  brandName: string | null;
  price: number;
  currency: Currency;
  imageUrl: string;
  imageAlt: string | null;
};

export type CartLine = {
  lineId: string;
  productDocumentId: string;
  categorySlug: string;
  productSlug: string;
  quantity: number;
  addedAt: number;
  snapshot: CartLineSnapshot;
};

export type CartState = {
  version: 1;
  lines: CartLine[];
};

export type AddLineInput = {
  productDocumentId: string;
  categorySlug: string;
  productSlug: string;
  quantity?: number;
  snapshot: CartLineSnapshot;
};

export const EMPTY_CART_STATE: CartState = { version: 1, lines: [] };

export interface CartStore {
  read(): CartState;
  write(next: CartState): void;
  subscribe(listener: () => void): () => void;
  hydrate(): void;
}
