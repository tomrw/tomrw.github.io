import React from 'react';
import { SxProp, useTransformSx } from '../sx';

type FlexProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  gap?: number;
  justifyContent?: React.CSSProperties['justifyContent'];
  alignItems?: React.CSSProperties['alignItems'];
  direction?: React.CSSProperties['flexDirection'];
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
    });

    const combinedStyle: React.CSSProperties = {
      display,
      justifyContent,
      alignItems,
      flexDirection: direction,
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
