"use client";
import React, { useState } from 'react';

export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = React.useCallback((value: T | ((val: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? (value as (val: T) => T)(prev) : value;
      try { window.localStorage.setItem(key, JSON.stringify(nextValue)); } catch {}
      return nextValue;
    });
  }, [key]);
  return [storedValue, setValue];
}