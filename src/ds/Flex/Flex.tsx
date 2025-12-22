import React from 'react';

type FlexProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  gap?: React.CSSProperties['gap'];
  justifyContent?: React.CSSProperties['justifyContent'];
  alignItems?: React.CSSProperties['alignItems'];
  direction?: React.CSSProperties['flexDirection'];
  wrap?: React.CSSProperties['flexWrap'];
  inline?: boolean;
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
      style,
      className = '',
      children,
      ...rest
    },
    ref,
  ) => {
    const display = inline ? 'inline-flex' : 'flex';

    const combinedStyle: React.CSSProperties = {
      display,
      gap,
      justifyContent,
      alignItems,
      flexDirection: direction,
      flexWrap: wrap,
      ...style,
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
