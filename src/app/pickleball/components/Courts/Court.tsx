import React, { useMemo } from 'react';
import { GameType, PlayerAssignment, ConfigForm } from '../../types';
import Box from '@/ds/Box/Box';
import Heading from '@/ds/Heading';

type CourtProps = {
  courtId: number;
  gameType: GameType;
  assignments: PlayerAssignment[];
  players: ConfigForm['players'];
  onPositionClick: (courtId: number, position: number) => void;
  // onPositionHover: (courtId: number, position: number | null) => void;
  // isHovered?: boolean;
  // hoveredPosition?: number | null;
};

export default function Court({
  courtId,
  gameType,
  assignments,
  players,
  onPositionClick,
}: CourtProps) {
  // Helper function to get player name by ID
  const getPlayerName = (playerId: number) => {
    const player = players.find((p) => p.id === playerId);
    return player?.name || `Player ${playerId}`;
  };

  // Calculate position layout based on game type
  const positionLayout = useMemo(() => {
    if (gameType === 'singles') {
      return [
        { left: '25%', top: '50%', transform: 'translate(-50%, -50%)' }, // Position 1 (left)
        { left: '75%', top: '50%', transform: 'translate(-50%, -50%)' }, // Position 2 (right)
      ];
    } else {
      return [
        { left: '25%', top: '25%', transform: 'translate(-50%, -50%)' }, // Position 1 (top-left)
        { left: '75%', top: '25%', transform: 'translate(-50%, -50%)' }, // Position 2 (top-right)
        { left: '25%', top: '75%', transform: 'translate(-50%, -50%)' }, // Position 3 (bottom-left)
        { left: '75%', top: '75%', transform: 'translate(-50%, -50%)' }, // Position 4 (bottom-right)
      ];
    }
  }, [gameType]);

  const maxPosition = gameType === 'singles' ? 1 : 3;

  return (
    <Box>
      <Box>
        <Heading as="h4" sx={{ mb: 1 }}>
          Court {courtId}
        </Heading>
      </Box>
      <Box
        sx={{
          position: 'relative',
          bg: '#015281',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 1,
          minHeight: '200px',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {/* Net Line */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            bg: 'rgba(255,255,255,0.7)',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        />

        {/* Non-Volley Zones (NVZ) */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '24%',
            bg: 'rgba(220, 38, 38, 0.22)',
            border: '1px solid rgba(220, 38, 38, 0.22)',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        />

        {/* Player Positions */}
        {positionLayout.slice(0, maxPosition + 1).map((layout, position) => {
          const assignment = assignments.find((a) => a.position === position);
          const playerName = assignment
            ? getPlayerName(assignment.playerId)
            : `Position ${position + 1}`;

          return (
            <Box
              key={position}
              sx={{
                position: 'absolute',
                ...layout,
                zIndex: 3,
                minWidth: '60px',
                minHeight: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 120ms ease',
                padding: '4px 8px',
              }}
              onClick={() => onPositionClick(courtId, position)}
              role="button"
              tabIndex={0}
              aria-label={`${playerName} - Click to ${assignment ? 'reassign' : 'assign'} player`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPositionClick(courtId, position);
                }
              }}
            >
              <Box
                sx={{
                  color: 'rgba(255,255,255,0.95)',
                  fontSize: '12px',
                  textAlign: 'center',
                  fontWeight: assignment ? 'bold' : 'normal',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '120px',
                }}
              >
                {playerName}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
