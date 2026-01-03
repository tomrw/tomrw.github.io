import { useState, useCallback } from 'react';
import { usePickleballContext } from '../../PickleballContext';
import Box from '@/ds/Box/Box';
import Court from './Court';
import PlayerSelectionDropdown from './PlayerSelectionDropdown';

export default function CourtGrid() {
  const {
    gameConfig: { courts, gameType },
    assignments,
    assignPlayerToCourt,
    removePlayerFromCourt,
  } = usePickleballContext();

  const [dropdownState, setDropdownState] = useState<{
    courtId: number;
    position: number;
  } | null>(null);

  // Handle player selection
  const handleSelectPlayer = useCallback(
    (playerName: string) => {
      if (dropdownState) {
        assignPlayerToCourt(dropdownState.courtId, playerName, dropdownState.position);
      }
    },
    [dropdownState, assignPlayerToCourt],
  );

  // Handle player removal
  const handleRemovePlayer = useCallback(
    (courtId: number, position: number) => {
      removePlayerFromCourt(courtId, position);
    },
    [removePlayerFromCourt],
  );

  const closeDropdown = () => {
    setDropdownState(null);
  };

  const handlePositionClick = (courtId: number, position: number) => {
    setDropdownState({
      courtId,
      position,
    });
  };

  const cols = Math.ceil(Math.sqrt(courts));

  return (
    <Box sx={{ mt: 6 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: ['repeat(1, 1fr)', `repeat(${cols}, 1fr)`],
          gap: 3,
          padding: 3,
          bg: '#f8f9fa',
          borderRadius: '8px',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: courts }, (_, i) => {
          const courtId = i + 1;
          const courtAssignments = assignments[courtId] || [];

          return (
            <Court
              key={courtId}
              courtId={courtId}
              gameType={gameType}
              assignments={courtAssignments}
              onPositionClick={(position) => handlePositionClick(courtId, position)}
            />
          );
        })}
      </Box>

      {dropdownState && (
        <PlayerSelectionDropdown
          position={{ courtId: dropdownState.courtId, position: dropdownState.position }}
          onClose={closeDropdown}
          onSelectPlayer={handleSelectPlayer}
          onRemovePlayer={handleRemovePlayer}
        />
      )}
    </Box>
  );
}
