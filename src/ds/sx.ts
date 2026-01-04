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

// Map of properties to process
const shorthandMap: Record<string, string | string[]> = {
  // Spacing
  p: 'padding',
  padding: 'padding',
  pt: 'paddingBlockStart',
  pb: 'paddingBlockEnd',
  pl: 'paddingInlineStart',
  pr: 'paddingInlineEnd',
  px: ['paddingInlineStart', 'paddingInlineEnd'],
  py: ['paddingBlockStart', 'paddingBlockEnd'],
  m: 'margin',
  margin: 'margin',
  mt: 'marginBlockStart',
  mb: 'marginBlockEnd',
  ml: 'marginInlineStart',
  mr: 'marginInlineEnd',
  mx: ['marginInlineStart', 'marginInlineEnd'],
  my: ['marginBlockStart', 'marginBlockEnd'],

  // Colors
  bg: 'backgroundColor',

  // Flex
  gap: 'gap',

  // Border
  borderRadius: 'borderRadius',
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

function transformSx(sx: SxProp, currentBreakpointId: number = 1): { [key: string]: unknown } {
  const styles: { [key: string]: unknown } = {};

  Object.entries(sx).forEach(([key, value]) => {
    const cssProperty = shorthandMap[key];
    const isShorthandProperty = cssProperty !== undefined;

    let resolvedValue: SxValue = value;

    if (!isShorthandProperty && !Array.isArray(value)) {
      // For non-shorthand properties, pass through responsive arrays as-is
      styles[key] = value as ProcessedValue;
      return;
    }

    // Only apply breakpoint resolution to shorthand properties (p, m, px, py, bg, etc.)
    if (Array.isArray(value) && value.length > 0) {
      // Use the breakpointId directly instead of mapping
      const resolvedIndex = Math.min(currentBreakpointId, value.length - 1);
      resolvedValue = value[resolvedIndex];
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
      // Pass through unknown properties as-is (including responsive arrays)
      styles[key] = processedValue;
    }
  });

  return styles;
}

export function useTransformSx(sx?: SxProp) {
  const { breakpointId } = useWindowSize();
  return useMemo(() => (sx ? transformSx(sx, breakpointId) : {}), [sx, breakpointId]);
}

export { transformSx };
export type { SxProp };
