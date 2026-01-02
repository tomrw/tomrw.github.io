import {
  shuffleArray,
  calculateCourtCapacity,
  assignPlayersRandomly,
  validateRandomAssignment,
} from '../assignmentUtils';

describe('assignmentUtils', () => {
  describe('shuffleArray', () => {
    it('should return array with same length', () => {
      const input = ['a', 'b', 'c', 'd'];
      const result = shuffleArray(input);
      expect(result).toHaveLength(input.length);
    });

    it('should contain all original elements', () => {
      const input = ['Alice', 'Bob', 'Charlie'];
      const result = shuffleArray(input);
      expect(result.sort()).toEqual(input.sort());
    });

    it('should produce different results on multiple runs', () => {
      const input = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const results = new Set();

      for (let i = 0; i < 10; i++) {
        const result = shuffleArray(input);
        results.add(result.join(','));
      }

      expect(results.size).toBeGreaterThan(1);
    });

    it('should handle empty array', () => {
      const result = shuffleArray([]);
      expect(result).toEqual([]);
    });

    it('should handle single element array', () => {
      const result = shuffleArray(['single']);
      expect(result).toEqual(['single']);
    });
  });

  describe('calculateCourtCapacity', () => {
    it('should calculate correct capacity for singles', () => {
      expect(calculateCourtCapacity(3, 'singles')).toBe(6);
      expect(calculateCourtCapacity(1, 'singles')).toBe(2);
      expect(calculateCourtCapacity(10, 'singles')).toBe(20);
    });

    it('should calculate correct capacity for doubles', () => {
      expect(calculateCourtCapacity(2, 'doubles')).toBe(8);
      expect(calculateCourtCapacity(1, 'doubles')).toBe(4);
      expect(calculateCourtCapacity(5, 'doubles')).toBe(20);
    });
  });

  describe('assignPlayersRandomly', () => {
    it('should assign all players when capacity matches', () => {
      const players = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const assignments = assignPlayersRandomly(players, 2, 'singles');

      expect(Object.keys(assignments)).toHaveLength(2);
      expect(Object.values(assignments).flat()).toHaveLength(4);

      const assignedPlayers = Object.values(assignments)
        .flat()
        .map((a) => a.playerName);
      expect(assignedPlayers.sort()).toEqual(players.sort());
    });

    it('should leave players unassigned when exceeding capacity', () => {
      const players = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
      const assignments = assignPlayersRandomly(players, 1, 'doubles');

      expect(Object.values(assignments).flat()).toHaveLength(4);

      const assignedPlayers = Object.values(assignments)
        .flat()
        .map((a) => a.playerName);
      expect(assignedPlayers).not.toContain(expect.arrayContaining(players));
      expect(players.length).toBeGreaterThan(4);
    });

    it('should fill courts in sequential order', () => {
      const players = ['A', 'B', 'C', 'D', 'E', 'F'];
      const assignments = assignPlayersRandomly(players, 3, 'singles');

      expect(Object.keys(assignments).map(Number).sort()).toEqual([1, 2, 3]);
      expect(assignments[1]).toHaveLength(2);
      expect(assignments[2]).toHaveLength(2);
      expect(assignments[3]).toHaveLength(2);
    });

    it('should handle singles game type correctly', () => {
      const players = ['Alice', 'Bob'];
      const assignments = assignPlayersRandomly(players, 1, 'singles');

      expect(assignments[1]).toHaveLength(2);
      expect(assignments[1].map((a) => a.position).sort()).toEqual([0, 1]);
    });

    it('should handle doubles game type correctly', () => {
      const players = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const assignments = assignPlayersRandomly(players, 1, 'doubles');

      expect(assignments[1]).toHaveLength(4);
      expect(assignments[1].map((a) => a.position).sort()).toEqual([0, 1, 2, 3]);
    });

    it('should handle empty players array', () => {
      const assignments = assignPlayersRandomly([], 3, 'doubles');
      expect(Object.keys(assignments)).toHaveLength(0);
    });

    it('should handle insufficient players for all courts', () => {
      const players = ['Alice', 'Bob'];
      const assignments = assignPlayersRandomly(players, 3, 'doubles');

      expect(Object.keys(assignments)).toHaveLength(1);
      expect(assignments[1]).toHaveLength(2);
      expect(assignments[2]).toBeUndefined();
      expect(assignments[3]).toBeUndefined();
    });

    it('should assign positions in order within each court', () => {
      const players = ['A', 'B', 'C', 'D'];
      const assignments = assignPlayersRandomly(players, 1, 'doubles');

      const positions = assignments[1].map((a) => a.position).sort();
      expect(positions).toEqual([0, 1, 2, 3]);
    });
  });

  describe('validateRandomAssignment', () => {
    it('should validate correct assignment', () => {
      const players = ['Alice', 'Bob', 'Charlie', 'Diana'];
      const assignments = assignPlayersRandomly(players, 2, 'singles');

      expect(validateRandomAssignment(players, assignments)).toBe(true);
    });

    it('should detect duplicate players', () => {
      const assignments = {
        1: [
          { courtId: 1, playerName: 'Alice', position: 0 },
          { courtId: 1, playerName: 'Bob', position: 1 },
        ],
        2: [
          { courtId: 2, playerName: 'Alice', position: 0 },
          { courtId: 2, playerName: 'Charlie', position: 1 },
        ],
      };

      expect(validateRandomAssignment(['Alice', 'Bob', 'Charlie'], assignments)).toBe(false);
    });

    it('should detect duplicate positions', () => {
      const assignments = {
        1: [
          { courtId: 1, playerName: 'Alice', position: 0 },
          { courtId: 1, playerName: 'Bob', position: 0 },
        ],
      };

      expect(validateRandomAssignment(['Alice', 'Bob'], assignments)).toBe(false);
    });

    it('should validate empty assignments', () => {
      expect(validateRandomAssignment([], {})).toBe(true);
      expect(validateRandomAssignment(['Alice', 'Bob'], {})).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should maintain assignment integrity across multiple randomizations', () => {
      const players = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];

      for (let i = 0; i < 5; i++) {
        const assignments = assignPlayersRandomly(players, 3, 'singles');

        expect(validateRandomAssignment(players, assignments)).toBe(true);
        expect(Object.values(assignments).flat()).toHaveLength(Math.min(6, players.length));
      }
    });

    it('should handle edge case with exact capacity', () => {
      const players = ['A', 'B', 'C', 'D'];
      const assignments = assignPlayersRandomly(players, 1, 'doubles');

      expect(Object.values(assignments).flat()).toHaveLength(4);
      expect(validateRandomAssignment(players, assignments)).toBe(true);
    });

    it('should handle edge case with one player', () => {
      const players = ['Alice'];
      const assignments = assignPlayersRandomly(players, 1, 'doubles');

      expect(Object.values(assignments).flat()).toHaveLength(1);
      expect(assignments[1][0].playerName).toBe('Alice');
      expect(assignments[1][0].position).toBe(0);
    });
  });
});
