'use client';

import { Players } from './Players';
import SidePanel from '../../ds/SidePanel/SidePanel';
import { FormProvider, useForm } from 'react-hook-form';
import Courts from './Courts';
import Button from '@/ds/Button';
import { ConfigForm } from './types';
import { usePickleballContext } from './PickleballContext';
import { DEFAULT_COURT_COUNT, DEFAULT_GAME_TYPE } from './constants';
import { GameType } from './GameType';

type Props = {
  open: boolean;
  onClose: () => void;
};

const PLAYERS = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

export default function ConfigPanel({ open, onClose }: Props) {
  const { updateConfig } = usePickleballContext();

  const form = useForm<ConfigForm>({
    defaultValues: {
      players: PLAYERS,
      courts: DEFAULT_COURT_COUNT,
      gameType: DEFAULT_GAME_TYPE,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updateConfig(data);
    onClose();
  });

  return (
    <FormProvider {...form}>
      <SidePanel open={open} onClose={onClose} title="Config">
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <section>
            <GameType />
          </section>

          <section>
            <Courts />
          </section>

          <section>
            <h3 style={{ marginTop: 0 }}>Players</h3>
            <Players />
          </section>

          <Button full type="submit">
            Save
          </Button>
        </form>
      </SidePanel>
    </FormProvider>
  );
}
