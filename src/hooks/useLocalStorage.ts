'use client';

import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      const value = item ? JSON.parse(item) : defaultValue;
      // eslint-disable-next-line
      setState(value);
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      setState(defaultValue);
    }
  }, [defaultValue, key]);

  const setLocalStorageState = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const newValue = value instanceof Function ? value(state) : value;
        setState(newValue);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, state],
  );

  return [state, setLocalStorageState];
}
