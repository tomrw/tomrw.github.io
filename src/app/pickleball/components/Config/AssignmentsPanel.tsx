'use client';

import { Box, Button, SidePanel, Text } from '@/ds';
import Heading from '@/ds/Heading/Heading';
import { usePickleballContext } from '../../PickleballContext';
import { usePlayersContext } from '../../contexts/PlayersContext';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AssignmentsPanel({ open, onClose }: Props) {
  const {
    gameConfig,
    assignments,
    clearAllAssignments,
    randomizeAllAssignments,
    randomizeSessionAssignments,
  } = usePickleballContext();
  const { players } = usePlayersContext();

  const handleRandomizeAssignments = () => {
    if (gameConfig.sessionPlayers.length > 0) {
      randomizeSessionAssignments();
    } else {
      randomizeAllAssignments(players);
    }
  };

  const assignedCount = Object.values(assignments).flat().length;
  const sessionPlayerCount = gameConfig.sessionPlayers.length;
  const hasSessionPlayers = sessionPlayerCount > 0;

  return (
    <SidePanel open={open} onClose={onClose} title="Court Assignments">
      {hasSessionPlayers && (
        <Box as="section" sx={{ mb: 2, p: 2, bg: '#f0f9ff', borderRadius: 1, color: '#666' }}>
          <Heading as="h4">Session Players</Heading>
          <Text as="p">
            {sessionPlayerCount} player{sessionPlayerCount !== 1 ? 's' : ''} selected for this
            session
          </Text>
          <Text as="p">Only session players will be available for court assignment</Text>
        </Box>
      )}

      <Box as="section" sx={{ mb: 2 }}>
        <Heading as="h4">Randomise</Heading>
        <Box as="p">Randomly assign {hasSessionPlayers ? 'session' : 'all'} players to courts</Box>
        <Button
          type="button"
          onClick={handleRandomizeAssignments}
          disabled={hasSessionPlayers ? sessionPlayerCount === 0 : players.length === 0}
        >
          Randomize {hasSessionPlayers ? 'Session' : 'All'} Players
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
