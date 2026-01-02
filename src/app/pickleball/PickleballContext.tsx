'use client';

import React, { useCallback, useState } from 'react';
import { ConfigForm, GameType, CourtAssignments, PlayerAssignment } from './types';
import { DEFAULT_COURT_COUNT, DEFAULT_GAME_TYPE } from './constants';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { assignPlayersRandomly } from './utils/assignmentUtils';

type Props = {
  children: React.ReactNode;
};

type PickleballContext = {
  courts: number;
  gameType: GameType;
  assignments: CourtAssignments;
  updateConfig: (data: ConfigForm) => void;
  assignPlayerToCourt: (courtId: number, playerName: string, position: number) => void;
  removePlayerFromCourt: (courtId: number, position: number) => void;
  clearAllAssignments: () => void;
  clearPlayerAssignments: (playerName: string) => void;
  getPlayerAssignments: (playerName: string) => PlayerAssignment[];
  getUnassignedPlayers: (players: string[]) => string[];
  randomizeAllAssignments: (players: string[]) => void;
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
  randomizeAllAssignments: () => {},
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
      if (data.gameType !== gameType) {
        setAssignments({});
      }
      setCourts(data.courts);
      setGameType(data.gameType);
    },
    [gameType, setAssignments],
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
      const newAssignments = assignPlayersRandomly(players, courts, gameType);
      setAssignments(newAssignments);
    },
    [courts, gameType, setAssignments],
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
