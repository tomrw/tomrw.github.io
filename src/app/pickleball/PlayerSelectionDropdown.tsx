'use client';

import { useEffect, useRef, useState } from 'react';
import { ConfigForm } from './types';
import { usePickleballContext } from './PickleballContext';
import Box from '@/ds/Box';
import Button from '@/ds/Button';
import Flex from '@/ds/Flex';

type Props = {
  isOpen: boolean;
  position: { courtId: number; position: number } | null;
  onClose: () => void;
  players: ConfigForm['players'];
  onSelectPlayer: (playerId: number) => void;
  onRemovePlayer: (courtId: number, position: number) => void;
};

export default function PlayerSelectionDropdown({
  isOpen,
  position,
  onClose,
  players,
  onSelectPlayer,
  onRemovePlayer,
}: Props) {
  // Call all hooks at the top
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { assignments, getUnassignedPlayers } = usePickleballContext();

  const shouldRender = isOpen && position;
  const unassignedPlayers = getUnassignedPlayers(players);

  // Check if position is currently occupied
  const currentAssignment = position
    ? assignments[position.courtId]?.find((a) => a.position === position.position)
    : null;

  const handleSelectPlayer = (playerId: number) => {
    onSelectPlayer(playerId);
    onClose();
  };

  const handleRemovePlayer = () => {
    if (position) {
      onRemovePlayer(position.courtId, position.position);
    }
    onClose();
  };

  // Position dropdown near clicked court position
  useEffect(() => {
    if (shouldRender) {
      const updatePosition = () => {
        if (dropdownRef.current) {
          const rect = dropdownRef.current.getBoundingClientRect();
          const viewportWidth = window.innerWidth;

          let x = 0;
          let y = 0;

          // Position dropdown near court position (adjust for viewport)
          if (viewportWidth > 768) {
            // Desktop: position to the right
            x = Math.min(window.innerWidth - rect.width - 20, 850);
            y = Math.max(20, window.scrollY + 200);
          } else {
            // Mobile: center on screen
            x = (viewportWidth - rect.width) / 2;
            y = Math.max(20, window.scrollY + 100);
          }

          setDropdownPosition({ x, y });
        }
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [shouldRender]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (shouldRender) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [shouldRender, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        left: dropdownPosition.x,
        top: dropdownPosition.y,
        zIndex: 1000,
        minWidth: 280,
        maxWidth: '90vw',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        maxHeight: '60vh',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Flex justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <h3 style={{ margin: 0, fontSize: '16px' }}>
            {currentAssignment ? 'Replace Player' : 'Assign Player'}
          </h3>
          <Button
            type="button"
            onClick={onClose}
            sx={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              fontSize: 18,
              padding: '4px',
              minWidth: 'auto',
            }}
          >
            ×
          </Button>
        </Flex>

        {currentAssignment && (
          <Box sx={{ mb: 2, p: 2, bg: '#f8f9fa', borderRadius: '4px' }}>
            <Box sx={{ fontSize: '14px', color: '#666', mb: 1 }}>Current Player:</Box>
            <Box sx={{ fontSize: '16px', fontWeight: 'bold' }}>
              {players.find((p) => p.id === currentAssignment.playerId)?.name}
            </Box>
          </Box>
        )}

        {currentAssignment && (
          <Button
            type="button"
            onClick={handleRemovePlayer}
            sx={{
              width: '100%',
              bg: '#dc3545',
              color: '#fff',
              border: '1px solid #dc3545',
              mb: 2,
              padding: '12px',
            }}
          >
            Remove Player
          </Button>
        )}

        {unassignedPlayers.length === 0 ? (
          <Box sx={{ color: '#666', textAlign: 'center', py: 2 }}>
            {currentAssignment ? 'No players available for replacement' : 'No unassigned players'}
          </Box>
        ) : (
          <Box>
            <Box sx={{ fontSize: '14px', color: '#666', mb: 2 }}>
              {currentAssignment ? 'Replace with:' : 'Assign player:'}
            </Box>
            <Flex direction="column" gap={1}>
              {unassignedPlayers.map((player) => (
                <Button
                  key={player.id}
                  type="button"
                  onClick={() => handleSelectPlayer(player.id)}
                  sx={{
                    width: '100%',
                    textAlign: 'left',
                    bg: '#fff',
                    color: '#333',
                    border: '1px solid #ddd',
                    padding: '12px',
                    minHeight: '44px', // Mobile-friendly touch target
                    justifyContent: 'flex-start',
                    '&:hover': {
                      bg: '#f0f8ff',
                      borderColor: '#007acc',
                    },
                  }}
                >
                  {player.name}
                </Button>
              ))}
            </Flex>
          </Box>
        )}
      </Box>
    </div>
  );
}
