'use client';

import { useState, useEffect } from 'react';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [breakpoint, setBreakpoint] = useState<Breakpoint>('md');
  const [breakpointId, setBreakpointId] = useState(1); // md = 1

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Update breakpoint based on width
      const width = window.innerWidth;
      let newBreakpoint: Breakpoint;
      let newId: number;

      if (width >= breakpoints['2xl']) {
        newBreakpoint = '2xl';
        newId = 4;
      } else if (width >= breakpoints.xl) {
        newBreakpoint = 'xl';
        newId = 3;
      } else if (width >= breakpoints.lg) {
        newBreakpoint = 'lg';
        newId = 2;
      } else if (width >= breakpoints.md) {
        newBreakpoint = 'md';
        newId = 1;
      } else if (width >= breakpoints.sm) {
        newBreakpoint = 'sm';
        newId = 0;
      } else {
        newBreakpoint = 'sm';
        newId = 0;
      }

      setBreakpoint(newBreakpoint);
      setBreakpointId(newId);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { windowSize, breakpoint, breakpointId };
}
