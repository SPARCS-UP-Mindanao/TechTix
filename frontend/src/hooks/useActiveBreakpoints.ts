import { useEffect, useState } from 'react';

export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1200,
  '2xl': 1400
} as const;

type BreakpointName = keyof typeof BREAKPOINTS;
type Breakpoint = BreakpointName | number;

const resolveBreakpointValue = (bp: Breakpoint): number => (typeof bp === 'number' ? bp : BREAKPOINTS[bp]);

export function useActiveBreakpoints<T extends Breakpoint[]>(...breakpoints: [...T]): boolean[] {
  const [states, setStates] = useState(() =>
    breakpoints.map((bp) => {
      if (typeof window === 'undefined') return false;
      return window.innerWidth >= resolveBreakpointValue(bp);
    })
  );

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const newStates = breakpoints.map((bp) => width >= resolveBreakpointValue(bp));
      setStates((prev) => (newStates.every((v, i) => v === prev[i]) ? prev : newStates));
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(document.body);

    return () => observer.disconnect();
  }, [breakpoints]);

  return states;
}
