'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderBySession } from '@/lib/checkout/api';

const INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 10;

export function PendingPoll({ sessionId }: { sessionId: string }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const tick = async () => {
      if (cancelled) return;
      attempts += 1;
      try {
        const order = await getOrderBySession(sessionId);
        if (cancelled) return;
        if (order.status !== 'pending') {
          router.refresh();
          return;
        }
      } catch {
        // swallow — try again next tick
      }
      if (attempts >= MAX_ATTEMPTS || cancelled) return;
      setTimeout(tick, INTERVAL_MS);
    };

    const id = setTimeout(tick, INTERVAL_MS);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [sessionId, router]);

  return null;
}
