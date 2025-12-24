'use client';

import { useMemo } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

type CSSValue = string | number;
interface CSSObject {
  [key: string]: CSSValue | CSSObject;
}
type SxValue = CSSValue | CSSObject | null | (string | number | null)[];
type SxProp = Record<string, SxValue>;

type ProcessedValue = CSSValue | CSSObject | null | { [key: string]: ProcessedValue };

const breakpoints = [640, 768, 1024, 1280, 1536]; // sm, md, lg, xl, 2xl

const shorthandMap: Record<string, string | string[]> = {
  // Spacing
  p: 'padding',
  pt: 'paddingBlockStart',
  pb: 'paddingBlockEnd',
  pl: 'paddingInlineStart',
  pr: 'paddingInlineEnd',
  px: ['paddingInlineStart', 'paddingInlineEnd'],
  py: ['paddingBlockStart', 'paddingBlockEnd'],
  m: 'margin',
  mt: 'marginBlockStart',
  mb: 'marginBlockEnd',
  ml: 'marginInlineStart',
  mr: 'marginInlineEnd',
  mx: ['marginInlineStart', 'marginInlineEnd'],
  my: ['marginBlockStart', 'marginBlockEnd'],

  // Colors
  bg: 'backgroundColor',
};

function toRem(value: number): string {
  return `${value * 0.5}rem`; // 1 unit = 0.5rem = 8px
}

function toPx(value: number): string {
  return `${value}px`;
}

function processValue(value: SxValue): ProcessedValue {
  if (value === null || value === undefined) return null;

  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value <= 32 ? toRem(value) : toPx(value);
  if (typeof value === 'object' && !Array.isArray(value)) return value;

  // Handle responsive arrays
  if (Array.isArray(value)) {
    const result: { [key: string]: ProcessedValue } = {};

    // Base value (mobile-first)
    if (value[0] !== null && value[0] !== undefined) {
      const processedVal = processValue(value[0] as SxValue);
      if (processedVal !== null) {
        if (typeof processedVal === 'object') {
          Object.assign(result, processedVal);
        } else {
          // For simple values, return the base value directly
          return processedVal;
        }
      }
    }

    // Media queries for remaining values
    for (let i = 1; i < value.length && i < breakpoints.length; i++) {
      if (value[i] !== null && value[i] !== undefined) {
        const processedVal = processValue(value[i] as SxValue);
        if (processedVal !== null) {
          const mediaQuery = `@media (min-width: ${breakpoints[i]}px)`;
          result[mediaQuery] = processedVal;
        }
      }
    }

    return result;
  }

  return value;
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

function transformSx(sx: SxProp, currentBreakpoint: Breakpoint = 'md'): { [key: string]: unknown } {
  const styles: { [key: string]: unknown } = {};

  Object.entries(sx).forEach(([key, value]) => {
    const cssProperty = shorthandMap[key];

    // Simple responsive logic - return first valid value
    let resolvedValue: SxValue = value;
    if (Array.isArray(value) && value.length > 0) {
      const breakpointIndex = {
        sm: 0,
        md: 1,
        lg: 2,
        xl: 3,
        '2xl': 4,
      }[currentBreakpoint];

      if (breakpointIndex !== undefined && breakpointIndex < value.length) {
        resolvedValue = value[breakpointIndex];
      }
    }

    const processedValue = processValue(resolvedValue);

    if (cssProperty) {
      if (Array.isArray(cssProperty)) {
        // Handle shorthands that map to multiple properties
        cssProperty.forEach((prop) => {
          styles[prop] = processedValue;
        });
      } else {
        styles[cssProperty] = processedValue;
      }
    } else {
      // Pass through unknown properties as-is
      styles[key] = processedValue;
    }
  });

  return styles;
}

export function useTransformSx(sx?: SxProp) {
  const { breakpoint } = useWindowSize();
  return useMemo(() => (sx ? transformSx(sx, breakpoint) : {}), [sx, breakpoint]);
}

export type { SxProp };
