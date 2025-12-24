'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { ConfigForm } from './types';
import Box from '@/ds/Box';

export const GameType = () => {
  const { control } = useFormContext<ConfigForm>();

  return (
    <Controller
      name="gameType"
      control={control}
      render={({ field }) => (
        <Box
          sx={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <Box sx={{ fontWeight: 500, minWidth: [0, 80] }} as="label">
            Game Type:
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: ['4px', '8px'],
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
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
                gap: '4px',
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
