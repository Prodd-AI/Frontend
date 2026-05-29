import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates after the input stops
 * changing for `delay` ms. Useful for search inputs so we don't filter / refetch
 * on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
