import { useEffect, useState } from 'react';
import { deepEqual } from '@/utils/functions';

const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

type BreakpointName = keyof typeof BREAKPOINTS;

const isBreakpointActive = (breakpointName: BreakpointName, width: number) => width >= BREAKPOINTS[breakpointName];

const calculateBreakpoints = <T extends BreakpointName>(width: number, keys: T[]) =>
  keys.reduce((breakpoints, breakpointName) => ({ ...breakpoints, [breakpointName]: isBreakpointActive(breakpointName, width) }), {} as Record<T, boolean>);

/*
    Usage:

    you can choose which breakpoints you want to use.

    const { xs } = useLayout('xs');

    const { xs, sm, md, lg, xl, xxl } = useLayout('xs', 'sm', 'md', 'lg', 'xl', 'xxl');

    or

    const layout = useLayout('xs', 'sm', 'md', 'lg', 'xl', 'xxl');

    then,

    layout.xs, layout.sm, layout.md, layout.lg, layout.xl, layout.xxl

    if a breakpoint is matched, the corresponding value will be true, else false

    so if current width is less than 992px, the 'lg' value will be false, but the other breakpoints before it is true

*/

export const useLayout = <T extends BreakpointName>(...breakpointNames: [T, ...T[]]) => {
  const [breakpointObject, setBreakpointObject] = useState<Record<T, boolean>>(calculateBreakpoints(document.body.clientWidth, breakpointNames));

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const newBreakpoints = calculateBreakpoints(entry.target.clientWidth, breakpointNames);
        setBreakpointObject((previousBreakpoints) => (deepEqual(newBreakpoints, previousBreakpoints) ? previousBreakpoints : newBreakpoints));
      });
    });

    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return breakpointObject;
};
