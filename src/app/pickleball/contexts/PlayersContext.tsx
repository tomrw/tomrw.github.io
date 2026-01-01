'use client';

import React, { PropsWithChildren, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const DEFAULT_PLAYERS = ['Alice', 'Bob', 'Charlie', 'Diana'];

const PLAYERS_STORAGE_KEY = 'pickleball-players';

type PlayersContext = {
  players: string[];
  updatePlayers: (players: string[]) => void;
  addPlayer: (name: string) => { success: boolean; error?: string };
  removePlayer: (name: string) => void;
};

const PlayersContext = React.createContext<PlayersContext>({
  players: DEFAULT_PLAYERS,
  updatePlayers: () => {},
  addPlayer: () => ({ success: false }),
  removePlayer: () => {},
});

export default function PlayersProvider({ children }: PropsWithChildren) {
  const [players, updatePlayers] = useLocalStorage(PLAYERS_STORAGE_KEY, DEFAULT_PLAYERS);

  const isDuplicateName = useCallback(
    (name: string): boolean => {
      return players.some((p) => p.trim().toLowerCase() === name.trim().toLowerCase());
    },
    [players],
  );

  const addPlayer = useCallback(
    (name: string): { success: boolean; error?: string } => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return { success: false, error: 'Player name cannot be empty' };
      }
      if (isDuplicateName(trimmedName)) {
        return { success: false, error: 'A player with that name already exists.' };
      }
      updatePlayers([...players, trimmedName]);
      return { success: true };
    },
    [players, updatePlayers],
  );

  const removePlayer = useCallback(
    (name: string) => {
      updatePlayers(players.filter((p) => p !== name));
    },
    [players, updatePlayers],
  );

  return (
    <PlayersContext.Provider
      value={{
        players,
        updatePlayers,
        addPlayer,
        removePlayer,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
}

export const usePlayersContext = () => {
  return React.useContext(PlayersContext);
};
