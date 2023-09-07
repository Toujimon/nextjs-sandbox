import { useState, useEffect } from "react";

export function getSingularTimeout() {
  let timeout = null;
  let callback = null;

  const clear = (runPrevCallback = false) => {
    if (timeout !== null) {
      clearTimeout(timeout);

      if (runPrevCallback) {
        callback?.();
      }
    }
    timeout = null;
    callback = null;
  };

  const set = (newCallback, interval, runPrevCallback = false) => {
    clear(runPrevCallback);
    callback = newCallback;

    timeout = window.setTimeout(() => {
      callback = null;
      timeout = null;
      newCallback();
    }, interval);
  };

  return { set, clear };
}

/**
 * Hook to make use of
 */
function useSingularTimeout() {
  const [setAndClear] = useState(() => {
    const singularTimeout = getSingularTimeout();
    return [singularTimeout.set, singularTimeout.clear];
  });

  // Ensures the timeout is cleared when the component using it unmounts
  useEffect(
    () => () => {
      const [, clear] = setAndClear;
      clear();
    },
    []
  );

  return setAndClear;
}

export { useSingularTimeout };
