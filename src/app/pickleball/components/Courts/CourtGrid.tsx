import { useState, useCallback } from 'react';
import { usePickleballContext } from '../../PickleballContext';
import Box from '@/ds/Box/Box';
import Court from './Court';
import PlayerSelectionDropdown from './PlayerSelectionDropdown';

export default function CourtGrid() {
  const { courts, gameType, assignments, assignPlayerToCourt, removePlayerFromCourt } =
    usePickleballContext();

  const [dropdownState, setDropdownState] = useState<{
    courtId: number;
    position: number;
  } | null>(null);

  // Handle player selection
  const handleSelectPlayer = useCallback(
    (playerName: string) => {
      if (dropdownState) {
        const result = assignPlayerToCourt(
          dropdownState.courtId,
          playerName,
          dropdownState.position,
        );

        if (!result.isValid) {
          alert(result.error || 'Assignment failed');
        }
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

  // Close dropdown
  const closeDropdown = () => {
    setDropdownState(null);
  };

  // Handle position click
  const handlePositionClick = (courtId: number, position: number) => {
    setDropdownState({
      courtId,
      position,
    });
  };

  // Calculate grid layout
  const cols = Math.ceil(Math.sqrt(courts));

  return (
    <Box sx={{ mt: 6, position: 'relative' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
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
