export type GameType = 'singles' | 'doubles';

export type GameLength = {
  minutes: number;
  seconds: number;
};

export type GameConfig = {
  courts: number;
  gameType: GameType;
  gameLength: GameLength;
  sessionPlayers: string[];
};

export type PlayerAssignment = {
  courtId: number;
  playerName: string;
  position: number; // 0-3 for doubles, 0-1 for singles
};

export type CourtAssignments = {
  [courtId: number]: PlayerAssignment[];
};
