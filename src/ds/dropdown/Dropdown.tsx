import { useId } from 'react';
import { SxProp, useTransformSx } from '../sx';
import Flex from '../Flex';
import Label from '../Label';

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
  const sxStyle = useTransformSx({
    width: '100%',
    padding: 1,
    ...sx,
  });

  return (
    <Flex direction="column" gap={1}>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} style={sxStyle}>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </Flex>
  );
}
