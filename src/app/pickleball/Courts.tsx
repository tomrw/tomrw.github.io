import Dropdown from '@/ds/dropdown/Dropdown';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { ConfigForm } from './ConfigPanel';

const OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1).map((n) => ({
  value: n,
  label: n.toString(),
}));

export default function Courts() {
  const { control } = useFormContext<ConfigForm>();
  const courts = useWatch({ control, name: 'courts' });
  const {
    field: { onChange },
  } = useController<ConfigForm>({ control, name: 'courts' });

  return <Dropdown options={OPTIONS} label="Number of courts" value={courts} onChange={onChange} />;
}
