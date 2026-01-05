import React from 'react';
import { SxProp, useTransformSx } from '../sx';
import styles from './Button.module.css';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  full?: boolean;
  sx?: SxProp;
  disabled?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ full = false, className = '', sx, children, disabled, ...rest }, ref) => {
    const sxStyle = useTransformSx(sx);

    const classes = [styles.button, full && styles.full, disabled && styles.disabled, className]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={classes} style={sxStyle} disabled={disabled} {...rest}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
