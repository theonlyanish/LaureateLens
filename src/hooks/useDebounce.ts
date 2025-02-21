import { useState, useEffect } from 'react';

// Custom hook to debounce any value with a specified delay
export function useDebounce<T>(value: T, delay: number = 300): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timer to update the debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
    };
  }, [value, delay]);

  return debouncedValue;
} 