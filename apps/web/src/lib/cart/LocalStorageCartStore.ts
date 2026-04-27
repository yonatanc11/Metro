import { EMPTY_CART_STATE, type CartState, type CartStore } from './types';

function isCartState(value: unknown): value is CartState {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<CartState>;
  return v.version === 1 && Array.isArray(v.lines);
}

export class LocalStorageCartStore implements CartStore {
  private listeners = new Set<() => void>();
  private cache: CartState = EMPTY_CART_STATE;

  constructor(private readonly storageKey: string) {}

  hydrate(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isCartState(parsed)) this.cache = parsed;
      }
    } catch {
      // Corrupt entry — fall back to empty.
    }
    this.emit();
  }

  read(): CartState {
    return this.cache;
  }

  write(next: CartState): void {
    this.cache = next;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(this.storageKey, JSON.stringify(next));
      } catch {
        // Quota or private-mode failure — keep in-memory cache.
      }
    }
    this.emit();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    this.listeners.forEach((l) => l());
  }
}
