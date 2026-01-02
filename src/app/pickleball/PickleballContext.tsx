'use client';

import React, { useCallback, useState } from 'react';
import { GameConfig, CourtAssignments, PlayerAssignment } from './types';
import { DEFAULT_GAME_CONFIG } from './constants';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { assignPlayersRandomly } from './utils/assignmentUtils';

type Props = {
  children: React.ReactNode;
};

type PickleballContext = {
  gameConfig: GameConfig;
  assignments: CourtAssignments;
  updateConfig: (data: GameConfig) => void;
  assignPlayerToCourt: (courtId: number, playerName: string, position: number) => void;
  removePlayerFromCourt: (courtId: number, position: number) => void;
  clearAllAssignments: () => void;
  clearPlayerAssignments: (playerName: string) => void;
  getPlayerAssignments: (playerName: string) => PlayerAssignment[];
  getUnassignedPlayers: (players: string[]) => string[];
  randomizeAllAssignments: (players: string[]) => void;
};

const PickleballContext = React.createContext<PickleballContext>({
  gameConfig: DEFAULT_GAME_CONFIG,
  assignments: {},
  updateConfig: () => {},
  assignPlayerToCourt: () => ({ isValid: false, error: 'Not implemented' }),
  removePlayerFromCourt: () => {},
  clearAllAssignments: () => {},
  clearPlayerAssignments: () => {},
  getPlayerAssignments: () => [],
  getUnassignedPlayers: () => [],
  randomizeAllAssignments: () => {},
});

export default function PickleballContextProvider({ children }: Props) {
  const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);
  const [assignments, setAssignments] = useLocalStorage<CourtAssignments>(
    'pickleball-assignments',
    {},
  );

  const updateConfig = useCallback(
    (data: GameConfig) => {
      if (data.gameType !== gameConfig.gameType) {
        setAssignments({});
      }
      setGameConfig(data);
    },
    [gameConfig.gameType, setAssignments],
  );

  const assignPlayerToCourt = useCallback(
    (courtId: number, playerName: string, position: number) => {
      const existingAssignment = Object.values(assignments)
        .flat()
        .find((player) => player.playerName === playerName);

      setAssignments((prev) => {
        const newAssignments = { ...prev };

        if (existingAssignment) {
          newAssignments[existingAssignment.courtId] = newAssignments[
            existingAssignment.courtId
          ].filter((a) => a.position !== existingAssignment.position);
          if (newAssignments[existingAssignment.courtId].length === 0) {
            delete newAssignments[existingAssignment.courtId];
          }
        }

        if (!newAssignments[courtId]) {
          newAssignments[courtId] = [];
        }
        newAssignments[courtId] = [...newAssignments[courtId], { courtId, playerName, position }];
        return newAssignments;
      });

      return { isValid: true };
    },
    [assignments, setAssignments],
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
    (allPlayers: string[]): string[] => {
      const assignedPlayerNames = new Set(
        Object.values(assignments)
          .flat()
          .map((a) => a.playerName),
      );
      return allPlayers.filter((playerName) => !assignedPlayerNames.has(playerName));
    },
    [assignments],
  );

  const randomizeAllAssignments = useCallback(
    (players: string[]) => {
      const newAssignments = assignPlayersRandomly(players, gameConfig.courts, gameConfig.gameType);
      setAssignments(newAssignments);
    },
    [gameConfig, setAssignments],
  );

  return (
    <PickleballContext.Provider
      value={{
        gameConfig,
        assignments,
        updateConfig,
        assignPlayerToCourt,
        removePlayerFromCourt,
        clearAllAssignments,
        clearPlayerAssignments,
        getPlayerAssignments,
        getUnassignedPlayers,
        randomizeAllAssignments,
      }}
    >
      {children}
    </PickleballContext.Provider>
  );
}

export const usePickleballContext = () => {
  return React.useContext(PickleballContext);
};
