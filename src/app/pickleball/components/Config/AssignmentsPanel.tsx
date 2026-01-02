'use client';

import { usePickleballContext } from '../../PickleballContext';
import Button from '@/ds/Button';
import Box from '@/ds/Box';
import { usePlayersContext } from '../../contexts/PlayersContext';
import Heading from '@/ds/Heading/Heading';
import SidePanel from '@/ds/SidePanel';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AssignmentsPanel({ open, onClose }: Props) {
  const { assignments, clearAllAssignments, randomizeAllAssignments } = usePickleballContext();
  const { players } = usePlayersContext();

  const handleRandomizeAssignments = () => {
    randomizeAllAssignments(players);
  };

  const assignedCount = Object.values(assignments).flat().length;

  return (
    <SidePanel open={open} onClose={onClose} title="Court Assignments">
      <Box as="section" sx={{ mb: 2 }}>
        <Heading as="h4">Randomise</Heading>
        <Box as="p">Randomly assign players to courts</Box>
        <Button type="button" onClick={handleRandomizeAssignments} disabled={players.length === 0}>
          Randomize Players
        </Button>
      </Box>

      <Box as="section" sx={{ mb: 2 }}>
        <Heading as="h4">Reset</Heading>
        <Box as="p">Clear all courts</Box>
        <Button type="button" onClick={clearAllAssignments} disabled={assignedCount === 0}>
          Reset all courts
        </Button>
      </Box>
    </SidePanel>
  );
}
