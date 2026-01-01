'use client';

import { useState } from 'react';

import { usePickleballContext } from '../../PickleballContext';
import SidePanel from '../../../../ds/SidePanel/SidePanel';
import Button from '@/ds/Button';
import Flex from '@/ds/Flex';
import Box from '@/ds/Box';
import { usePlayersContext } from '../../contexts/PlayersContext';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AssignmentsPanel({ open, onClose }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string>('');

  const {
    courts,
    gameType,
    assignments,
    assignPlayerToCourt,
    removePlayerFromCourt,
    clearAllAssignments,
    getUnassignedPlayers,
  } = usePickleballContext();
  const { players } = usePlayersContext();
  const unassignedPlayers = getUnassignedPlayers(players);

  const handlePlayerSelect = (playerName: string) => {
    setSelectedPlayer(playerName === selectedPlayer ? null : playerName);
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

  const getPlayerAtPosition = (courtId: number, position: number) => {
    const courtAssignments = assignments[courtId] || [];
    const assignment = courtAssignments.find((a) => a.position === position);
    return assignment ? assignment.playerName : null;
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
    <SidePanel
      open={open}
      onClose={onClose}
      title="Assignments"
      sx={{
        width: ['100%', 400, 480, 560],
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          height: '100%',
          maxHeight: 'calc(100vh - 40px)', // Account for panel padding
        }}
      >
        {/* Status */}
        <Box sx={{ fontSize: '14px', color: '#666' }}>
          {assignedCount} of {totalPositions} positions assigned • {unassignedCount} players
          unassigned
        </Box>

        {/* Unassigned Players */}
        <Box>
          <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Unassigned Players</h4>
          {unassignedPlayers.length === 0 ? (
            <Box sx={{ color: '#666', fontSize: '14px' }}>All players assigned</Box>
          ) : (
            <Flex as="ul" direction="column" gap={1} sx={{ m: 0, p: 0, listStyle: 'none' }}>
              {unassignedPlayers.map((playerName) => (
                <Flex
                  as="li"
                  key={playerName}
                  sx={{
                    p: 1,
                    border: selectedPlayer === playerName ? '2px solid #007acc' : '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    bg: selectedPlayer === playerName ? '#f0f8ff' : 'transparent',
                    '&:hover': {
                      bg: selectedPlayer === playerName ? '#f0f8ff' : '#f5f5f5',
                    },
                  }}
                  onClick={() => handlePlayerSelect(playerName)}
                >
                  {playerName}
                </Flex>
              ))}
            </Flex>
          )}
        </Box>

        {/* Courts Grid */}
        <Box>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
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
      </Box>
    </SidePanel>
  );
}
