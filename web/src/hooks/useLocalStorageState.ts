'use client';

import { useEffect, useRef, useState } from 'react';

interface UseLocalStorageStateOptions {
  /** Set false for read-only usage that should never write back. */
  persist?: boolean;
}

export function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T),
  { persist = true }: UseLocalStorageStateOptions = {},
) {
  const [value, setValue] = useState<T>(initialValue);
  const hasHydrated = useRef(false);

  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        setValue(JSON.parse(raw));
      } catch {
        // ignore corrupt stored data
      }
    }
    hasHydrated.current = true;
  }, [key]);

  useEffect(() => {
    if (!persist || !hasHydrated.current) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, persist]);

  return [value, setValue] as const;
}

export default useLocalStorageState;
