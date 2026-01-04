'use client';

import SidePanel from '@/ds/SidePanel';
import { FormProvider, useForm } from 'react-hook-form';
import Courts from '../../Courts';
import Button from '@/ds/Button';
import { GameConfig } from '../../types';
import { usePickleballContext } from '../../PickleballContext';
import { DEFAULT_GAME_CONFIG } from '../../constants';
import { GameType } from '../../GameType';
import Box from '@/ds/Box';
import GameLength from './GameLength';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ConfigPanel({ open, onClose }: Props) {
  const { updateConfig } = usePickleballContext();

  const form = useForm<GameConfig>({
    defaultValues: DEFAULT_GAME_CONFIG,
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log('ConfigPanel submitting data:', data);
    updateConfig(data);
    onClose();
  });

  return (
    <FormProvider {...form}>
      <SidePanel open={open} onClose={onClose} title="Config">
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
            <GameLength />
          </section>

          <section>
            <Courts />
          </section>

          <Button full type="submit">
            Save
          </Button>
        </Box>
      </SidePanel>
    </FormProvider>
  );
}
