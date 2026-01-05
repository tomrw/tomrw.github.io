'use client';

import SidePanel from '@/ds/SidePanel';
import { FormProvider, useForm } from 'react-hook-form';
import Courts from '../../Courts';
import Button from '@/ds/Button';
import { GameConfig } from '../../types';
import { usePickleballContext } from '../../PickleballContext';
import { DEFAULT_GAME_CONFIG } from '../../constants';
import { GameType } from '../../GameType';
import GameLength from './GameLength';
import Flex from '@/ds/Flex';

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
    updateConfig(data);
    onClose();
  });

  return (
    <FormProvider {...form}>
      <SidePanel open={open} onClose={onClose} title="Session Management">
        <Flex direction="column" gap={2} as="form" onSubmit={onSubmit}>
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
            Start New Session
          </Button>
        </Flex>
      </SidePanel>
    </FormProvider>
  );
}
