import React from 'react';
import { SxProp, useTransformSx } from '../sx';
import Box from '../Box';

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  sx?: SxProp;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, inputProps, sx, ...rest }, ref) => {
    const sxStyle = useTransformSx(sx);

    return (
      <Box sx={{ borderRadius: 1, width: '100%' }} {...rest}>
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 'inherit',
            padding: '0.5rem 0.625rem',
            ...sxStyle,
            borderRadius: '0.5rem',
          }}
          {...inputProps}
        />
      </Box>
    );
  },
);

Input.displayName = 'Input';

export default Input;
