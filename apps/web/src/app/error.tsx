'use client';

import { useEffect } from 'react';
import { strings } from '@/strings';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold">{strings.error.title}</h1>
        <p className="mt-2 text-neutral-600">{error.message}</p>
        <button
          onClick={reset}
          className="mt-4 inline-flex items-center rounded-md bg-black px-4 py-2 text-white transition hover:bg-neutral-800"
        >
          {strings.error.retry}
        </button>
      </div>
    </main>
  );
}
