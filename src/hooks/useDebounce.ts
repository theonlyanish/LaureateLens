import { useState, useEffect } from 'react';

// Custom hook to debounce any value with a specified delay
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timer to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Clean up the timer if the value changes before the delay has passed  
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}