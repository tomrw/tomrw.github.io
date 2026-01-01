'use client';

import { useState } from 'react';
import { usePlayersContext } from '../../contexts/PlayersContext';
import { usePickleballContext } from '../../PickleballContext';
import SidePanel from '../../../../ds/SidePanel/SidePanel';
import Button from '@/ds/Button';
import Flex from '@/ds/Flex';
import Input from '@/ds/Input';
import Box from '@/ds/Box';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PlayersPanel({ open, onClose }: Props) {
  const [newName, setNewName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { players, addPlayer, removePlayer } = usePlayersContext();
  const { clearPlayerAssignments } = usePickleballContext();

  const handleAddPlayer = () => {
    const result = addPlayer(newName);
    if (result.success) {
      setNewName('');
      setError('');
    } else {
      setError(result.error || 'Failed to add player');
    }
  };

  const handleRemovePlayer = (playerName: string) => {
    clearPlayerAssignments(playerName);
    removePlayer(playerName);
  };

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Players"
      sx={{
        width: ['100%', 400, 480, 560],
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Flex justifyContent="space-between" gap={1} sx={{ mb: 1 }}>
          <Input
            value={newName}
            onChange={setNewName}
            inputProps={{
              'aria-label': 'Player name',
              onKeyDown: (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPlayer();
                }
              },
              placeholder: 'Enter player name',
            }}
          />
          <Button type="button" onClick={handleAddPlayer}>
            Add
          </Button>
        </Flex>

        {error && <Box sx={{ color: '#e11', mb: 1 }}>{error}</Box>}

        <Flex as="ul" direction="column" gap={1}>
          {players.map((playerName) => (
            <Flex as="li" key={playerName} justifyContent="space-between" sx={{ gap: 1 }}>
              <span>{playerName}</span>
              <Button
                type="button"
                onClick={() => handleRemovePlayer(playerName)}
                aria-label={`Delete ${playerName}`}
              >
                x
              </Button>
            </Flex>
          ))}
        </Flex>
      </Box>
    </SidePanel>
  );
}
