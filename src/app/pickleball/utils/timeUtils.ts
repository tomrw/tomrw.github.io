import { GameLength } from '../types';

export function parseGameLength(timeString: string): GameLength | null {
  // Remove any whitespace and validate format
  const trimmedString = timeString.trim();

  // Match MM:SS format - allow 1-2 digits for minutes, 1-2 digits for seconds
  // Require exactly one colon separating minutes and seconds
  const match = trimmedString.match(/^(\d{1,2}):(\d{1,2})$/);
  if (!match) return null;

  const minutes = parseInt(match[1], 10);
  let seconds = parseInt(match[2], 10);

  // Handle case where seconds part is missing (like "5:")
  if (isNaN(seconds)) {
    seconds = 0;
  }

  // Validate range - minutes and seconds must be non-negative
  if (minutes < 0 || seconds < 0 || minutes > 23 || seconds > 59) {
    return null;
  }

  // Ensure minimum is 1 second
  if (minutes === 0 && seconds === 0) {
    seconds = 1;
  }

  return { minutes, seconds };
}

// Utility functions for react-time-picker integration
export function gameLengthToDate(gameLength: GameLength): Date {
  const date = new Date();
  date.setHours(gameLength.minutes, gameLength.seconds, 0, 0);
  return date;
}
