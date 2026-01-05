'use client';

import { SidePanel, Flex } from '@/ds';
import { FormProvider, useForm } from 'react-hook-form';
import Courts from '../../Courts';
import { GameConfig } from '../../types';
import { usePickleballContext } from '../../PickleballContext';
import { DEFAULT_GAME_CONFIG } from '../../constants';
import { GameType } from '../../GameType';
import GameLength from './GameLength';
import SessionPlayers from './SessionPlayers';
import { ReactNode } from 'react';
import CreateSession from './CreateSession';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ConfigPanel({ open, onClose }: Props) {
  const { updateConfig, gameConfig } = usePickleballContext();

  const form = useForm<GameConfig>({
    defaultValues: DEFAULT_GAME_CONFIG,
    values: gameConfig,
  });

  const onSubmit = form.handleSubmit((data) => {
    updateConfig(data);
    onClose();
  });

  return (
    <FormProvider {...form}>
      <SidePanel open={open} onClose={onClose} title="Session Management">
        <Flex direction="column" gap={2} as="form" onSubmit={onSubmit}>
          <WithSections>
            <GameType />
            <GameLength />
            <Courts />
            <SessionPlayers
              onPlayersChange={(players) => form.setValue('sessionPlayers', players)}
            />
          </WithSections>
          <CreateSession />
        </Flex>
      </SidePanel>
    </FormProvider>
  );
}

const WithSections = ({ children }: { children: ReactNode[] }) => (
  <>
    {children.map((child, index) => (
      <section key={index}>{child}</section>
    ))}
  </>
);
