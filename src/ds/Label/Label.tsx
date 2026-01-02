import React from 'react';
import { SxProp, useTransformSx } from '../sx';

type LabelProps = {
  children: React.ReactNode;
  sx?: SxProp;
};

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ children, sx, ...rest }, ref) => {
  const sxStyle = useTransformSx(sx);
  return (
    <label ref={ref} style={{ fontWeight: 600, ...sxStyle }} {...rest}>
      {children}
    </label>
  );
});

Label.displayName = 'Label';

export default Label;
