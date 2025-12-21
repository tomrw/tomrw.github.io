'use client';

import { Players } from './Players';
import SidePanel from '../../ds/SidePanel/SidePanel';
import { useFormContext } from 'react-hook-form';
import Courts from './Courts';
import Button from '@/ds/Button';
import { ConfigForm } from './types';

type Props = {
  open: boolean;
  onClose: () => void;
  onUpdateConfig: (data: ConfigForm) => void;
};

export default function ConfigPanel({ open, onClose, onUpdateConfig }: Props) {
  const form = useFormContext<ConfigForm>();
  const onSubmit = form.handleSubmit((data) => {
    onUpdateConfig(data);
  });

  return (
    <SidePanel open={open} onClose={onClose} title="Config">
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
    </SidePanel>
  );
}
