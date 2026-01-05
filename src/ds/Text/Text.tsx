import React from 'react';
import { SxProp, useTransformSx } from '../sx';
import styles from './Text.module.css';

type TextProps = React.PropsWithChildren<{
  as?: 'span' | 'p';
  variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'error';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  sx?: SxProp;
}> &
  Omit<React.HTMLAttributes<HTMLElement>, 'as' | 'color'>;

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      as: Component = 'span',
      className = '',
      variant = 'md',
      color,
      weight = 'normal',
      sx,
      children,
      ...rest
    },
    ref,
  ) => {
    const sxStyle = useTransformSx(sx);

    const classes = [
      styles.text,
      styles[variant],
      styles[weight],
      color && styles[color],
      Component === 'span' && styles.span,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const ReactComponent = Component as React.ElementType;

    return (
      <ReactComponent ref={ref} className={classes} style={sxStyle} {...rest}>
        {children}
      </ReactComponent>
    );
  },
);

Text.displayName = 'Text';

export default Text;
