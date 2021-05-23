import { useEffect, useRef } from "react";

/**
 * Hook to make use of timers based on keys, so they can
 * be declaratively activated or cleared.
 * @param key string
 * @param onTimeout () => void
 * @param interval number (default: 0)
 */
function useTimer(key, onTimeout, interval) {
  const timeoutState = useRef(null);

  useEffect(() => {
    if (key != null) {
      timeoutState.current = setTimeout(() => {
        timeoutState.current = null;
        onTimeout();
      }, interval);
    }
    return () => {
      if (timeoutState.current) {
        clearTimeout(timeoutState.current);
        timeoutState.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

export { useTimer };
