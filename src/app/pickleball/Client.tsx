'use client';

import { useState } from 'react';
import ConfigPanel from './ConfigPanel';
import AssignmentsPanel from './AssignmentsPanel';
import PickleballContextProvider from './PickleballContext';
import Button from '@/ds/Button';
import Flex from '@/ds/Flex';
import { ConfigForm } from './types';
import Heading from '@/ds/Heading';
import CourtGrid from './components/Courts/CourtGrid';

const DEFAULT_PLAYERS = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

type PanelType = 'config' | 'assignments' | null;

export default function PickleballClient() {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [players, setPlayers] = useState<ConfigForm['players']>(DEFAULT_PLAYERS);

  const openPanel = (panel: PanelType) => {
    setActivePanel(panel);
  };

  const closePanel = () => {
    setActivePanel(null);
  };

  return (
    <PickleballContextProvider>
      <Flex justifyContent="space-between" sx={{ mb: 4 }}>
        <Heading as="h1">Pickleball</Heading>
        <Flex gap={2}>
          <Button
            onClick={() => openPanel('config')}
            sx={{
              bg: activePanel === 'config' ? '#007acc' : '#fff',
              color: activePanel === 'config' ? '#fff' : '#333',
              border: activePanel === 'config' ? '1px solid #007acc' : '1px solid #ccc',
            }}
          >
            Config
          </Button>
          <Button
            onClick={() => openPanel('assignments')}
            sx={{
              bg: activePanel === 'assignments' ? '#007acc' : '#fff',
              color: activePanel === 'assignments' ? '#fff' : '#333',
              border: activePanel === 'assignments' ? '1px solid #007acc' : '1px solid #ccc',
            }}
          >
            Assignments
          </Button>
        </Flex>
      </Flex>
      <CourtGrid players={players} />
      <ConfigPanel
        open={activePanel === 'config'}
        onClose={closePanel}
        onPlayersChange={setPlayers}
      />
      <AssignmentsPanel
        open={activePanel === 'assignments'}
        onClose={closePanel}
        players={players}
      />
    </PickleballContextProvider>
  );
}
