import Button from '@/ds/Button';
import Flex from '@/ds/Flex';
import AssignmentsPanel from './AssignmentsPanel';
import { useState } from 'react';
import ConfigPanel from './ConfigPanel';

type PanelType = 'config' | 'assignments';

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
      <ConfigPanel open={activePanel === 'config'} onClose={closePanel} />
      <AssignmentsPanel open={activePanel === 'assignments'} onClose={closePanel} />
    </>
  );
};

export default GameConfig;
