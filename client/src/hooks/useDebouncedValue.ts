// hooks/useDebouncedValue.ts
import { useState, useEffect } from "react";

export const useDebouncedValue = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler); // cleanup on value change
  }, [value, delay]);

  return debouncedValue;
};
