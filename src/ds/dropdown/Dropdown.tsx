import { useId } from 'react';
import { SxProp, useTransformSx } from '../sx';
import Box from '../Box';

type Value = string | number;
type Props = {
  label: string;
  options: { value: Value; label: string }[];
  onChange: (value: Value) => void;
  value: Value;
  sx?: SxProp;
};

export default function Dropdown({ label, options, onChange, value, sx }: Props) {
  const id = useId();
  const sxStyle = useTransformSx(sx);

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label htmlFor={id} style={{ fontWeight: 600 }}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Number of courts"
        style={{ width: '100%', ...sxStyle }}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
