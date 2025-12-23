import React from 'react';
import { SxProp, transformSx } from '../sx';
import { useWindowSize } from '../../hooks/useWindowSize';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  full?: boolean;
  sx?: SxProp;
};

const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ full = false, className = '', sx, children, ...rest }, ref) => {
    const mergedClass = `${className} tw-button ${full ? 'tw-button--full' : ''}`.trim();
    const { breakpoint } = useWindowSize();
    const sxStyle = sx ? transformSx(sx, breakpoint) : {};

    return (
      <button ref={ref} className={mergedClass} style={sxStyle} {...rest}>
        {children}
        <style jsx>{`
          .tw-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.5rem 0.75rem;
            font-size: 0.95rem;
            line-height: 1;
            border-radius: 8px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            background: linear-gradient(180deg, #ffffff, #f7f7f8);
            color: #111827;
            cursor: pointer;
            transition:
              transform 120ms ease,
              box-shadow 120ms ease,
              opacity 120ms ease;
          }

          .tw-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
          }

          .tw-button:active {
            transform: translateY(0);
            opacity: 0.95;
          }

          .tw-button:focus {
            outline: 3px solid rgba(59, 130, 246, 0.18);
            outline-offset: 2px;
          }

          .tw-button--full {
            width: 100%;
          }

          @media (prefers-reduced-motion: reduce) {
            .tw-button {
              transition: none;
            }
          }
        `}</style>
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
