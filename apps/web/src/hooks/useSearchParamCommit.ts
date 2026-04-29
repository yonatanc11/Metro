'use client';

import { useTransition } from 'react';
import {
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from 'next/navigation';

export type UseSearchParamCommitResult = {
  searchParams: ReadonlyURLSearchParams;
  commit: (mutate: (params: URLSearchParams) => void) => void;
  isPending: boolean;
};

export function useSearchParamCommit(): UseSearchParamCommitResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function commit(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `?${qs}` : '?', { scroll: false });
    });
  }

  return { searchParams, commit, isPending };
}
