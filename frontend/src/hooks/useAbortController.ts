import { useRef, useEffect } from 'react';

export const useAbortController = () => {
  const abortController = useRef(new AbortController());

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!e.defaultPrevented) {
        abortController.current.abort();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      abortController.current.abort();
    };
  }, []);

  return abortController.current;
};
