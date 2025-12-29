'use client';

import { useEffect } from 'react';
import { Players } from '../../Players';
import SidePanel from '../../../../ds/SidePanel/SidePanel';
import { FormProvider, useForm } from 'react-hook-form';
import Courts from '../../Courts';
import Button from '@/ds/Button';
import { ConfigForm } from '../../types';
import { usePickleballContext } from '../../PickleballContext';
import { DEFAULT_COURT_COUNT, DEFAULT_GAME_TYPE } from '../../constants';
import { GameType } from '../../GameType';
import Box from '@/ds/Box';
import { usePlayers } from '../../hooks/usePlayers';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ConfigPanel({ open, onClose }: Props) {
  const { updateConfig } = usePickleballContext();
  const { players, updatePlayers } = usePlayers();

  const form = useForm<ConfigForm>({
    defaultValues: {
      players: players,
      courts: DEFAULT_COURT_COUNT,
      gameType: DEFAULT_GAME_TYPE,
    },
  });
  const { subscribe } = form;

  useEffect(() => {
    return subscribe({
      formState: { values: true },
      callback: (data) => {
        if (data.name === 'players') {
          updatePlayers(data.values.players);
        }
      },
    });
  }, [subscribe, updatePlayers]);

  const onSubmit = form.handleSubmit((data) => {
    updateConfig(data);
    onClose();
  });

  return (
    <FormProvider {...form}>
      <SidePanel
        open={open}
        onClose={onClose}
        title="Config"
        sx={{
          width: ['100%', 400, 480, 560],
        }}
      >
        <Box
          as="form"
          onSubmit={onSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <section>
            <GameType />
          </section>

          <section>
            <Courts />
          </section>

          <section>
            <Players />
          </section>

          <Button full type="submit">
            Save
          </Button>
        </Box>
      </SidePanel>
    </FormProvider>
  );
}
