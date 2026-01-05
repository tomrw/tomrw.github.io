import { Dropdown } from '@/ds';
import { useController, useFormContext } from 'react-hook-form';
import { GameConfig } from './types';

const OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1).map((n) => ({
  value: n,
  label: n.toString(),
}));

export default function Courts() {
  const { control } = useFormContext<GameConfig>();
  const {
    field: { onChange, value },
  } = useController({ control, name: 'courts' });

  return <Dropdown options={OPTIONS} label="Number of courts" value={value} onChange={onChange} />;
}
