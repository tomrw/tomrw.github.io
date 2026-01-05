import { GameConfig } from './types';

export const DEFAULT_GAME_CONFIG: GameConfig = {
  courts: 2,
  gameType: 'doubles',
  gameLength: {
    minutes: 15,
    seconds: 0,
  },
  sessionPlayers: [],
};
