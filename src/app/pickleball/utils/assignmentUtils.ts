import { CourtAssignments, PlayerAssignment } from '../types';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateCourtCapacity(courts: number, gameType: 'singles' | 'doubles'): number {
  const playersPerCourt = gameType === 'singles' ? 2 : 4;
  return courts * playersPerCourt;
}

export function assignPlayersRandomly(
  players: string[],
  courts: number,
  gameType: 'singles' | 'doubles',
): CourtAssignments {
  const assignments: CourtAssignments = {};
  const shuffledPlayers = shuffleArray(players);
  const playersPerCourt = gameType === 'singles' ? 2 : 4;

  let playerIndex = 0;

  for (let courtId = 1; courtId <= courts; courtId++) {
    const courtAssignments: PlayerAssignment[] = [];

    for (let position = 0; position < playersPerCourt; position++) {
      if (playerIndex >= shuffledPlayers.length) {
        break;
      }

      courtAssignments.push({
        courtId,
        playerName: shuffledPlayers[playerIndex],
        position,
      });

      playerIndex++;
    }

    if (courtAssignments.length > 0) {
      assignments[courtId] = courtAssignments;
    }
  }

  return assignments;
}

export function validateRandomAssignment(
  players: string[],
  assignments: CourtAssignments,
): boolean {
  const assignedPlayers = new Set<string>();
  const assignedPositions = new Set<string>();

  Object.entries(assignments).forEach(([courtId, courtAssignments]) => {
    courtAssignments.forEach(({ playerName, position }) => {
      assignedPlayers.add(playerName);
      assignedPositions.add(`${courtId}-${position}`);
    });
  });

  const hasDuplicatePlayers = assignedPlayers.size !== Object.values(assignments).flat().length;

  const hasDuplicatePositions = assignedPositions.size !== Object.values(assignments).flat().length;

  return !hasDuplicatePlayers && !hasDuplicatePositions;
}
