import React from 'react';
import { SxProp, useTransformSx } from '../sx';

type OptionalArray<T> = T | Exclude<T, null | undefined>[];

type FlexProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  gap?: OptionalArray<number>;
  justifyContent?: React.CSSProperties['justifyContent'];
  alignItems?: React.CSSProperties['alignItems'];
  direction?: OptionalArray<React.CSSProperties['flexDirection']>;
  wrap?: React.CSSProperties['flexWrap'];
  inline?: boolean;
  sx?: SxProp;
};

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      as: Component = 'div',
      gap,
      justifyContent,
      alignItems,
      direction = 'row',
      wrap = 'nowrap',
      inline = false,
      className = '',
      children,
      sx,
      ...rest
    },
    ref,
  ) => {
    const display = inline ? 'inline-flex' : 'flex';
    const sxStyle = useTransformSx({
      ...sx,
      gap: gap ?? 0,
      flexDirection: direction,
    });

    const combinedStyle: React.CSSProperties = {
      display,
      justifyContent,
      alignItems,
      flexWrap: wrap,
      ...sxStyle,
    };

    return (
      <Component ref={ref} style={combinedStyle} className={className} {...rest}>
        {children}
      </Component>
    );
  },
);

Flex.displayName = 'Flex';

export default Flex;
