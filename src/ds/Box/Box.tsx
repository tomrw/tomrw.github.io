import React from 'react';
import { SxProp, useTransformSx } from '../sx';

type BoxProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  sx?: SxProp;
};

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ as: Component = 'div', className = '', sx, children, ...rest }, ref) => {
    const sxStyle = useTransformSx(sx);

    return (
      <Component ref={ref} className={className} style={sxStyle} {...rest}>
        {children}
      </Component>
    );
  },
);

Box.displayName = 'Box';

export default Box;
