import React from 'react'

type FlexProps = React.HTMLAttributes<HTMLDivElement> & {
  gap?: React.CSSProperties['gap']
  justifyContent?: React.CSSProperties['justifyContent']
  alignItems?: React.CSSProperties['alignItems']
  direction?: React.CSSProperties['flexDirection']
  wrap?: React.CSSProperties['flexWrap']
  inline?: boolean
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ gap, justifyContent, alignItems, direction = 'row', wrap = 'nowrap', inline = false, style, className = '', children, ...rest }, ref) => {
    const display = inline ? 'inline-flex' : 'flex'

    const combinedStyle: React.CSSProperties = {
      display,
      gap,
      justifyContent,
      alignItems,
      flexDirection: direction,
      flexWrap: wrap,
      ...style,
    }

    return (
      <div ref={ref} style={combinedStyle} className={className} {...rest}>
        {children}
      </div>
    )
  }
)

Flex.displayName = 'Flex'

export default Flex
