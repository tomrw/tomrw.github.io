'use client';

import { useEffect } from 'react';
import { Players } from './Players';
import SidePanel from '../../ds/SidePanel/SidePanel';
import { FormProvider, useForm } from 'react-hook-form';
import Courts from './Courts';
import Button from '@/ds/Button';
import { ConfigForm } from './types';
import { usePickleballContext } from './PickleballContext';
import { DEFAULT_COURT_COUNT, DEFAULT_GAME_TYPE } from './constants';
import { GameType } from './GameType';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Props = {
  open: boolean;
  onClose: () => void;
};

const DEFAULT_PLAYERS = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

const PLAYERS_STORAGE_KEY = 'pickleball-players';

export default function ConfigPanel({ open, onClose }: Props) {
  const { updateConfig } = usePickleballContext();
  const [players, updatePlayers] = useLocalStorage(PLAYERS_STORAGE_KEY, DEFAULT_PLAYERS);

  const form = useForm<ConfigForm>({
    defaultValues: {
      players: players,
      courts: DEFAULT_COURT_COUNT,
      gameType: DEFAULT_GAME_TYPE,
    },
  });

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (name === 'players') {
        const currentPlayers = form.getValues().players;
        updatePlayers(currentPlayers);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updatePlayers]);

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
