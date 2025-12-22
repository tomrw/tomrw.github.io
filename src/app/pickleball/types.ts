export type GameType = 'singles' | 'doubles';

export type ConfigForm = {
  players: { id: number; name: string }[];
  courts: number;
  gameType: GameType;
};
