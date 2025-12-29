import React from 'react';
import { SxProp, useTransformSx } from '../sx';

type HeadingProps = React.PropsWithChildren<{
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  sx?: SxProp;
}> &
  Omit<React.HTMLAttributes<HTMLHeadingElement>, 'as'>;

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Component = 'h2', className = '', sx, children, ...rest }, ref) => {
    const sxStyle = useTransformSx(sx);

    return (
      <Component ref={ref} className={className} style={sxStyle} {...rest}>
        {children}
      </Component>
    );
  },
);

Heading.displayName = 'Heading';

export default Heading;
