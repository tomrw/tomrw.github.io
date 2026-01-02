'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { GameConfig } from './types';
import Box from '@/ds/Box';

export const GameType = () => {
  const { control } = useFormContext<GameConfig>();

  return (
    <Controller
      name="gameType"
      control={control}
      render={({ field }) => (
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
          }}
        >
          <Box sx={{ fontWeight: 500, minWidth: [0, 80] }} as="label">
            Game Type:
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: [0.5, 1],
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
              }}
              as="label"
            >
              <input
                type="radio"
                value="singles"
                checked={field.value === 'singles'}
                onChange={() => field.onChange('singles')}
              />
              Singles
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
              }}
              as="label"
            >
              <input
                type="radio"
                value="doubles"
                checked={field.value === 'doubles'}
                onChange={() => field.onChange('doubles')}
              />
              Doubles
            </Box>
          </Box>
        </Box>
      )}
    />
  );
};
