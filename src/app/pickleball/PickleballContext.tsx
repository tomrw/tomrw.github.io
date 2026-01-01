'use client';

import React, { useCallback, useState } from 'react';
import {
  ConfigForm,
  GameType,
  CourtAssignments,
  PlayerAssignment,
  AssignmentValidation,
} from './types';
import { DEFAULT_COURT_COUNT, DEFAULT_GAME_TYPE } from './constants';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Props = {
  children: React.ReactNode;
};

type PickleballContext = {
  courts: number;
  gameType: GameType;
  assignments: CourtAssignments;
  updateConfig: (data: ConfigForm) => void;
  assignPlayerToCourt: (
    courtId: number,
    playerName: string,
    position: number,
  ) => AssignmentValidation;
  removePlayerFromCourt: (courtId: number, position: number) => void;
  clearAllAssignments: () => void;
  clearPlayerAssignments: (playerName: string) => void;
  getPlayerAssignments: (playerName: string) => PlayerAssignment[];
  getUnassignedPlayers: (allPlayers: ConfigForm['players']) => ConfigForm['players'];
};

const PickleballContext = React.createContext<PickleballContext>({
  courts: DEFAULT_COURT_COUNT,
  gameType: DEFAULT_GAME_TYPE,
  assignments: {},
  updateConfig: () => {},
  assignPlayerToCourt: () => ({ isValid: false, error: 'Not implemented' }),
  removePlayerFromCourt: () => {},
  clearAllAssignments: () => {},
  clearPlayerAssignments: () => {},
  getPlayerAssignments: () => [],
  getUnassignedPlayers: () => [],
});

export default function PickleballContextProvider({ children }: Props) {
  const [courts, setCourts] = useState(DEFAULT_COURT_COUNT);
  const [gameType, setGameType] = useState<GameType>(DEFAULT_GAME_TYPE);
  const [assignments, setAssignments] = useLocalStorage<CourtAssignments>(
    'pickleball-assignments',
    {},
  );

  const updateConfig = useCallback(
    (data: ConfigForm) => {
      // Clear assignments if game type changed
      if (data.gameType !== gameType) {
        setAssignments({});
      }
      setCourts(data.courts);
      setGameType(data.gameType);
    },
    [gameType, setAssignments],
  );

  const assignPlayerToCourt = useCallback(
    (courtId: number, playerName: string, position: number): AssignmentValidation => {
      // Validate court exists
      if (courtId < 1 || courtId > courts) {
        return { isValid: false, error: 'Invalid court number' };
      }

      // Validate position based on game type
      const maxPosition = gameType === 'singles' ? 1 : 3;
      if (position < 0 || position > maxPosition) {
        return { isValid: false, error: `Invalid position for ${gameType}` };
      }

      // Check if player is already assigned elsewhere
      const existingAssignment = Object.values(assignments)
        .flat()
        .find((player) => player.playerName === playerName);
      if (existingAssignment) {
        return { isValid: false, error: 'Player is already assigned to another position' };
      }

      // Check if position is already taken on this court
      const courtAssignments = assignments[courtId] || [];
      const positionTaken = courtAssignments.some((a) => a.position === position);
      if (positionTaken) {
        return { isValid: false, error: 'Position is already taken' };
      }

      // Assign player
      setAssignments((prev) => {
        const newAssignments = { ...prev };
        if (!newAssignments[courtId]) {
          newAssignments[courtId] = [];
        }
        newAssignments[courtId] = [...newAssignments[courtId], { courtId, playerName, position }];
        return newAssignments;
      });

      return { isValid: true };
    },
    [courts, gameType, assignments, setAssignments],
  );

  const removePlayerFromCourt = useCallback(
    (courtId: number, position: number) => {
      setAssignments((prev) => {
        const newAssignments = { ...prev };
        if (newAssignments[courtId]) {
          newAssignments[courtId] = newAssignments[courtId].filter((a) => a.position !== position);
          if (newAssignments[courtId].length === 0) {
            delete newAssignments[courtId];
          }
        }
        return newAssignments;
      });
    },
    [setAssignments],
  );

  const clearAllAssignments = useCallback(() => {
    setAssignments({});
  }, [setAssignments]);

  const clearPlayerAssignments = useCallback(
    (playerName: string) => {
      setAssignments((prev) => {
        const newAssignments: CourtAssignments = {};
        Object.entries(prev).forEach(([courtId, courtAssignments]) => {
          const filteredAssignments = courtAssignments.filter((a) => a.playerName !== playerName);
          if (filteredAssignments.length > 0) {
            newAssignments[parseInt(courtId)] = filteredAssignments;
          }
        });
        return newAssignments;
      });
    },
    [setAssignments],
  );

  const getPlayerAssignments = useCallback(
    (playerName: string): PlayerAssignment[] => {
      return Object.values(assignments)
        .flat()
        .filter((a) => a.playerName === playerName);
    },
    [assignments],
  );

  const getUnassignedPlayers = useCallback(
    (allPlayers: ConfigForm['players']): ConfigForm['players'] => {
      const assignedPlayerNames = new Set(
        Object.values(assignments)
          .flat()
          .map((a) => a.playerName),
      );
      return allPlayers.filter((playerName) => !assignedPlayerNames.has(playerName));
    },
    [assignments],
  );

  return (
    <PickleballContext.Provider
      value={{
        courts,
        gameType,
        assignments,
        updateConfig,
        assignPlayerToCourt,
        removePlayerFromCourt,
        clearAllAssignments,
        clearPlayerAssignments,
        getPlayerAssignments,
        getUnassignedPlayers,
      }}
    >
      {children}
    </PickleballContext.Provider>
  );
}

export const usePickleballContext = () => {
  return React.useContext(PickleballContext);
};
