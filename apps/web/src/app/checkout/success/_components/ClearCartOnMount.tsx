'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/cart/CartProvider';

export function ClearCartOnMount() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
