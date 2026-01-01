export type GameType = 'singles' | 'doubles';

export type ConfigForm = {
  courts: number;
  gameType: GameType;
};

export type PlayerAssignment = {
  courtId: number;
  playerName: string;
  position: number; // 0-3 for doubles, 0-1 for singles
};

export type CourtAssignments = {
  [courtId: number]: PlayerAssignment[];
};

export type AssignmentValidation = {
  isValid: boolean;
  error?: string;
};
