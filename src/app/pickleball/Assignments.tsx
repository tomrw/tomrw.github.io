'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ConfigForm } from './types';
import { usePickleballContext } from './PickleballContext';
import Button from '@/ds/Button';
import Flex from '@/ds/Flex';
import Box from '@/ds/Box';

export const Assignments = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [assignmentError, setAssignmentError] = useState<string>('');

  const { control } = useFormContext<ConfigForm>();
  const {
    courts,
    gameType,
    assignments,
    assignPlayerToCourt,
    removePlayerFromCourt,
    clearAllAssignments,
    getUnassignedPlayers,
  } = usePickleballContext();

  // Get players from form state
  const players = (control._defaultValues?.players || []).filter(
    (p): p is { id: number; name: string } =>
      p !== undefined && p.id !== undefined && p.name !== undefined,
  );
  const unassignedPlayers = getUnassignedPlayers(players);

  const handlePlayerSelect = (playerId: number) => {
    setSelectedPlayer(playerId === selectedPlayer ? null : playerId);
    setAssignmentError('');
  };

  const handlePositionClick = (courtId: number, position: number) => {
    if (!selectedPlayer) {
      setAssignmentError('Please select a player first');
      return;
    }

    const result = assignPlayerToCourt(courtId, selectedPlayer, position);
    if (result.isValid) {
      setSelectedPlayer(null);
      setAssignmentError('');
    } else {
      setAssignmentError(result.error || 'Assignment failed');
    }
  };

  const handleRemoveAssignment = (courtId: number, position: number) => {
    removePlayerFromCourt(courtId, position);
    setAssignmentError('');
  };

  const getPlayerName = (playerId: number) => {
    const player = players.find((p) => p.id === playerId);
    return player?.name || `Player ${playerId}`;
  };

  const getPlayerAtPosition = (courtId: number, position: number) => {
    const courtAssignments = assignments[courtId] || [];
    const assignment = courtAssignments.find((a) => a.position === position);
    return assignment ? getPlayerName(assignment.playerId) : null;
  };

  const getPositionLabel = (position: number) => {
    if (gameType === 'singles') {
      return position === 0 ? 'Left' : 'Right';
    } else {
      const labels = ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right'];
      return labels[position];
    }
  };

  const maxPositions = gameType === 'singles' ? 2 : 4;
  const totalPositions = courts * maxPositions;
  const assignedCount = Object.values(assignments).flat().length;
  const unassignedCount = unassignedPlayers.length;

  return (
    <>
      <h3>Player Assignments</h3>

      {/* Status */}
      <Box sx={{ mb: 2, fontSize: '14px', color: '#666' }}>
        {assignedCount} of {totalPositions} positions assigned • {unassignedCount} players
        unassigned
      </Box>

      {/* Unassigned Players */}
      <Box sx={{ mb: 3 }}>
        <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Unassigned Players</h4>
        {unassignedPlayers.length === 0 ? (
          <Box sx={{ color: '#666', fontSize: '14px' }}>All players assigned</Box>
        ) : (
          <Flex as="ul" direction="column" gap={1} sx={{ m: 0, p: 0, listStyle: 'none' }}>
            {unassignedPlayers.map((player) => (
              <Flex
                as="li"
                key={player.id}
                sx={{
                  p: 1,
                  border: selectedPlayer === player.id ? '2px solid #007acc' : '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  bg: selectedPlayer === player.id ? '#f0f8ff' : 'transparent',
                  '&:hover': {
                    bg: selectedPlayer === player.id ? '#f0f8ff' : '#f5f5f5',
                  },
                }}
                onClick={() => handlePlayerSelect(player.id)}
              >
                {player.name}
              </Flex>
            ))}
          </Flex>
        )}
      </Box>

      {/* Courts Grid */}
      <Box sx={{ mb: 3 }}>
        <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Court Positions</h4>
        <Flex direction="column" gap={2}>
          {Array.from({ length: courts }, (_, i) => i + 1).map((courtId) => (
            <Box key={courtId} sx={{ p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
              <Box sx={{ fontWeight: 'bold', mb: 1 }}>Court {courtId}</Box>
              <Flex direction="column" gap={1}>
                {Array.from({ length: maxPositions }, (_, i) => i).map((position) => {
                  const assignedPlayer = getPlayerAtPosition(courtId, position);
                  return (
                    <Flex
                      key={position}
                      sx={{
                        p: 1,
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        cursor: selectedPlayer ? 'pointer' : 'default',
                        bg: assignedPlayer ? '#e8f5e8' : '#f9f9f9',
                        '&:hover':
                          selectedPlayer && !assignedPlayer
                            ? {
                                bg: '#f0f0f0',
                              }
                            : {},
                      }}
                      justifyContent="space-between"
                      onClick={() => !assignedPlayer && handlePositionClick(courtId, position)}
                    >
                      <Box>
                        <Box sx={{ fontSize: '12px', color: '#666' }}>
                          {getPositionLabel(position)}
                        </Box>
                        <Box sx={{ fontSize: '14px' }}>
                          {assignedPlayer || (
                            <Box sx={{ color: '#999', fontStyle: 'italic' }}>
                              {selectedPlayer ? 'Click to assign' : 'Empty'}
                            </Box>
                          )}
                        </Box>
                      </Box>
                      {assignedPlayer && (
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAssignment(courtId, position);
                          }}
                          aria-label={`Remove assignment from ${getPositionLabel(position)}`}
                          sx={{
                            fontSize: '12px',
                            padding: '2px 6px',
                            minWidth: '20px',
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </Button>
                      )}
                    </Flex>
                  );
                })}
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Controls */}
      <Flex direction="column" gap={2}>
        {assignmentError && <Box sx={{ color: '#e11', fontSize: '14px' }}>{assignmentError}</Box>}

        <Flex gap={2}>
          <Button
            type="button"
            onClick={clearAllAssignments}
            disabled={assignedCount === 0}
            sx={{
              bg: assignedCount === 0 ? '#f5f5f5' : '#fff',
              color: assignedCount === 0 ? '#999' : '#333',
              border: '1px solid #ccc',
            }}
          >
            Clear All Assignments
          </Button>

          {selectedPlayer && (
            <Button
              type="button"
              onClick={() => {
                setSelectedPlayer(null);
                setAssignmentError('');
              }}
              sx={{
                bg: '#f8f9fa',
                color: '#666',
                border: '1px solid #ddd',
              }}
            >
              Cancel Selection
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  );
};
