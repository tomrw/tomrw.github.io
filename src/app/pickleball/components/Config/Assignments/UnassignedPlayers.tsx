import { usePlayersContext } from '@/app/pickleball/contexts/PlayersContext';
import { usePickleballContext } from '@/app/pickleball/PickleballContext';
import Box from '@/ds/Box';
import Flex from '@/ds/Flex/Flex';
import Heading from '@/ds/Heading';
import { useState } from 'react';

export const UnassignedPlayers = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const { courts, gameType, assignments, getUnassignedPlayers } = usePickleballContext();
  const { players } = usePlayersContext();
  const unassignedPlayers = getUnassignedPlayers(players);

  const maxPositions = gameType === 'singles' ? 2 : 4;
  const totalPositions = courts * maxPositions;
  const assignedCount = Object.values(assignments).flat().length;
  const unassignedCount = unassignedPlayers.length;

  const handlePlayerSelect = (playerName: string) => {
    setSelectedPlayer(playerName === selectedPlayer ? null : playerName);
  };

  return (
    <>
      <Box>
        {assignedCount} of {totalPositions} positions assigned • {unassignedCount} players
        unassigned
      </Box>

      <Heading as="h4">Unassigned Players</Heading>

      {unassignedPlayers.length === 0 ? (
        <Box sx={{ color: '#666', fontSize: '14px' }}>All players assigned</Box>
      ) : (
        <Flex as="ul" direction="column" gap={1}>
          {unassignedPlayers.map((playerName) => (
            <Box
              as="li"
              key={playerName}
              sx={{
                p: 1,
                border: selectedPlayer === playerName ? '2px solid #007acc' : '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                bg: selectedPlayer === playerName ? '#f0f8ff' : 'transparent',
                color: selectedPlayer === playerName ? '#000' : 'inherit',
              }}
              onClick={() => handlePlayerSelect(playerName)}
            >
              {playerName}
            </Box>
          ))}
        </Flex>
      )}
    </>
  );
};
