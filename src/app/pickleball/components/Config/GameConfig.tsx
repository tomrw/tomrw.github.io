import { Button, Flex } from '@/ds';
import AssignmentsPanel from './AssignmentsPanel';
import PlayersPanel from './PlayersPanel';
import { useState } from 'react';
import ConfigPanel from './ConfigPanel';

type PanelType = 'config' | 'assignments' | 'players';

const GameConfig = () => {
  const [activePanel, setActivePanel] = useState<PanelType | null>(null);

  const openPanel = (panel: PanelType) => {
    setActivePanel(panel);
  };

  const closePanel = () => {
    setActivePanel(null);
  };

  return (
    <>
      <Flex gap={1} alignItems="center">
        <Button
          onClick={() => openPanel('config')}
          sx={{
            bg: activePanel === 'config' ? '#007acc' : '#fff',
            color: activePanel === 'config' ? '#fff' : '#333',
            border: activePanel === 'config' ? '1px solid #007acc' : '1px solid #ccc',
          }}
        >
          Session Config
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
        <Button
          onClick={() => openPanel('players')}
          sx={{
            bg: activePanel === 'players' ? '#007acc' : '#fff',
            color: activePanel === 'players' ? '#fff' : '#333',
            border: activePanel === 'players' ? '1px solid #007acc' : '1px solid #ccc',
          }}
        >
          Players
        </Button>
      </Flex>
      <ConfigPanel open={activePanel === 'config'} onClose={closePanel} />
      <AssignmentsPanel open={activePanel === 'assignments'} onClose={closePanel} />
      <PlayersPanel open={activePanel === 'players'} onClose={closePanel} />
    </>
  );
};

export default GameConfig;
