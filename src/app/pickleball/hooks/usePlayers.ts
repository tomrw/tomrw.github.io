import { useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const DEFAULT_PLAYERS = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

const PLAYERS_STORAGE_KEY = 'pickleball-players';

type Player = { id: number; name: string };

const hasValidId = (player: Player): boolean => {
  return typeof player.id === 'number' && !isNaN(player.id) && player.id > 0;
};

const getExistingIds = (players: Player[]): Set<number> => {
  return new Set(players.filter(hasValidId).map((p) => p.id));
};

const generateNextId = (existingIds: Set<number>): number => {
  if (existingIds.size === 0) return 1;

  const maxId = Math.max(...existingIds);
  return maxId + 1;
};

const validateAndFixPlayerIds = (players: Player[]): Player[] => {
  if (!Array.isArray(players)) {
    return DEFAULT_PLAYERS;
  }

  const existingIds = getExistingIds(players);
  const fixedPlayers = players.map((player) => {
    if (!hasValidId(player)) {
      const newId = generateNextId(existingIds);
      existingIds.add(newId);
      return { ...player, id: newId };
    }
    return player;
  });

  return fixedPlayers;
};

export const usePlayers = () => {
  const [rawPlayers, updatePlayers] = useLocalStorage(PLAYERS_STORAGE_KEY, DEFAULT_PLAYERS);

  const players = useMemo(() => {
    return validateAndFixPlayerIds(rawPlayers);
  }, [rawPlayers]);

  return {
    players,
    updatePlayers,
  };
};
