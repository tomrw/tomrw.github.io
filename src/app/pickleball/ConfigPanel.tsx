'use client';

import { Players } from './Players';
import SidePanel from '../../ds/side-panel/SidePanel';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import Courts from './Courts';
import Button from '@/ds/Button';

type Props = {
  open: boolean;
  onClose: () => void;
  onUpdateConfig: (data: ConfigForm) => void;
};

export type ConfigForm = {
  players: { id: number; name: string }[];
  courts: number;
};

export default function ConfigPanel({ open, onClose, onUpdateConfig }: Props) {
  const form = useForm<ConfigForm>({
    defaultValues: {
      players: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
      courts: 6,
    },
  });

  return (
    <SidePanel open={open} onClose={onClose} title="Config">
      <FormProvider {...form}>
        <FormContent onUpdateConfig={onUpdateConfig} />
      </FormProvider>
    </SidePanel>
  );
}

const FormContent = ({ onUpdateConfig }: { onUpdateConfig: (data: ConfigForm) => void }) => {
  const form = useFormContext<ConfigForm>();
  const onSubmit = form.handleSubmit((data) => {
    onUpdateConfig(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <section style={{ marginTop: 18 }}>
        <Courts />
      </section>

      <section style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>Players</h3>
        <Players />
      </section>

      <Button full type="submit">
        Save
      </Button>
    </form>
  );
};
