'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { LocalStorageCartStore } from './LocalStorageCartStore';
import {
  EMPTY_CART_STATE,
  type AddLineInput,
  type CartLine,
  type CartState,
} from './types';

const STORAGE_KEY = 'metro:cart:v1';

type CartContextValue = {
  state: CartState;
  itemCount: number;
  subtotal: number;
  addLine: (input: AddLineInput) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function newLineId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `line_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const store = useMemo(() => new LocalStorageCartStore(STORAGE_KEY), []);

  useEffect(() => {
    store.hydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) store.hydrate();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [store]);

  const state = useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.read(),
    () => EMPTY_CART_STATE
  );

  const addLine = useCallback(
    (input: AddLineInput) => {
      const current = store.read();
      const qty = input.quantity ?? 1;
      const existing = current.lines.find(
        (l) => l.productDocumentId === input.productDocumentId
      );
      const lines: CartLine[] = existing
        ? current.lines.map((l) =>
            l.lineId === existing.lineId
              ? { ...l, quantity: l.quantity + qty, snapshot: input.snapshot }
              : l
          )
        : [
            ...current.lines,
            {
              lineId: newLineId(),
              productDocumentId: input.productDocumentId,
              categorySlug: input.categorySlug,
              productSlug: input.productSlug,
              quantity: qty,
              addedAt: Date.now(),
              snapshot: input.snapshot,
            },
          ];
      store.write({ version: 1, lines });
    },
    [store]
  );

  const removeLine = useCallback(
    (lineId: string) => {
      const current = store.read();
      store.write({
        version: 1,
        lines: current.lines.filter((l) => l.lineId !== lineId),
      });
    },
    [store]
  );

  const setQuantity = useCallback(
    (lineId: string, quantity: number) => {
      const current = store.read();
      if (quantity <= 0) {
        store.write({
          version: 1,
          lines: current.lines.filter((l) => l.lineId !== lineId),
        });
        return;
      }
      store.write({
        version: 1,
        lines: current.lines.map((l) =>
          l.lineId === lineId ? { ...l, quantity } : l
        ),
      });
    },
    [store]
  );

  const clear = useCallback(() => {
    store.write({ version: 1, lines: [] });
  }, [store]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = state.lines.reduce(
      (sum, l) => sum + l.snapshot.price * l.quantity,
      0
    );
    return { state, itemCount, subtotal, addLine, removeLine, setQuantity, clear };
  }, [state, addLine, removeLine, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
