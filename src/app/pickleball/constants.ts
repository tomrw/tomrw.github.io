import { GameConfig, GameLength } from './types';

const DEFAULT_COURT_COUNT = 2;
const DEFAULT_GAME_TYPE = 'doubles';
const DEFAULT_GAME_LENGTH: GameLength = {
  minutes: 15,
  seconds: 0,
};

export const DEFAULT_GAME_CONFIG: GameConfig = {
  courts: DEFAULT_COURT_COUNT,
  gameType: DEFAULT_GAME_TYPE,
  gameLength: DEFAULT_GAME_LENGTH,
};
