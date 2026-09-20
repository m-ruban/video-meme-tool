import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [visibleToast, setVisibleToast] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(() => {
    setVisibleToast(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setVisibleToast(false);
    }, 6000);
  }, []);

  return {
    visibleToast,
    showToast,
  };
}
