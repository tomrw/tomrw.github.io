'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameLength } from '../types';
import Button from '@/ds/Button';
import Flex from '@/ds/Flex';
import Box from '@/ds/Box';
import Heading from '@/ds/Heading';
import { usePickleballContext } from '../PickleballContext';

type TimerState = 'idle' | 'running' | 'paused' | 'completed';

interface CountdownTimerProps {
  onComplete?: () => void;
}

export default function CountdownTimer({ onComplete }: CountdownTimerProps) {
  const { gameConfig } = usePickleballContext();
  const [timeLeft, setTimeLeft] = useState<GameLength>(gameConfig.gameLength);
  const [state, setState] = useState<TimerState>('idle');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(gameConfig.gameLength);
    setState('idle');
  }, [gameConfig.gameLength]);

  const totalSeconds = useCallback((time: GameLength): number => {
    return time.minutes * 60 + time.seconds;
  }, []);

  const formatTime = useCallback(
    (time: GameLength): string => {
      const minutes = Math.floor(totalSeconds(time) / 60);
      const seconds = totalSeconds(time) % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    [totalSeconds],
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state === 'running') {
      interval = setInterval(() => {
        setTimeLeft((currentTime) => {
          const currentTotalSeconds = totalSeconds(currentTime);

          if (currentTotalSeconds <= 1) {
            setState('completed');
            onComplete?.();
            return { minutes: 0, seconds: 0 };
          }

          const newTotalSeconds = currentTotalSeconds - 1;
          return {
            minutes: Math.floor(newTotalSeconds / 60),
            seconds: newTotalSeconds % 60,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state, totalSeconds, onComplete]);

  const handleStart = () => {
    if (state === 'idle' || state === 'completed') {
      setTimeLeft(gameConfig.gameLength);
    }
    setState('running');
  };

  const handlePause = () => {
    setState('paused');
  };

  const handleResume = () => {
    setState('running');
  };

  const handleReset = () => {
    setTimeLeft(gameConfig.gameLength);
    setState('idle');
  };

  const isTimeCritical = totalSeconds(timeLeft) <= 60 && state === 'running';

  return (
    <Flex direction="column" alignItems="center" gap={3}>
      <Heading as="h3" sx={{ textAlign: 'center' }}>
        Game Timer
      </Heading>

      <Box
        sx={{
          fontSize: '4rem',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          textAlign: 'center',
          color: isTimeCritical ? '#dc2626' : '#000000',
          backgroundColor: isTimeCritical ? '#fef2f2' : '#f9fafb',
          padding: '2rem',
          borderRadius: 1,
          border: `2px solid ${isTimeCritical ? '#ef4444' : '#e5e7eb'}`,
          minWidth: '200px',
        }}
      >
        {formatTime(timeLeft)}
      </Box>

      <Flex gap={2}>
        {(state === 'idle' || state === 'completed') && (
          <Button onClick={handleStart}>{state === 'completed' ? 'Restart' : 'Start'}</Button>
        )}

        {state === 'running' && <Button onClick={handlePause}>Pause</Button>}

        {state === 'paused' && (
          <>
            <Button onClick={handleResume}>Resume</Button>
            <Button onClick={handleReset}>Reset</Button>
          </>
        )}
      </Flex>

      {state === 'completed' && (
        <Box
          sx={{
            textAlign: 'center',
            color: '#059669',
            fontWeight: '600',
            fontSize: '1.1rem',
          }}
        >
          Game Complete! 🎉
        </Box>
      )}
    </Flex>
  );
}
