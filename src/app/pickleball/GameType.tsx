'use client';

import { useController, useFormContext } from 'react-hook-form';
import { GameConfig } from './types';
import { Box, Heading, Flex } from '@/ds';

export const GameType = () => {
  const { control } = useFormContext<GameConfig>();
  const {
    field: { onChange, value },
  } = useController({
    control,
    name: 'gameType',
  });

  return (
    <Flex direction="column" gap={1}>
      <Heading as="h4">Game Type</Heading>
      <Flex direction="row" gap={[0.5, 1]}>
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
            checked={value === 'singles'}
            onChange={() => onChange('singles')}
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
            checked={value === 'doubles'}
            onChange={() => onChange('doubles')}
          />
          Doubles
        </Box>
      </Flex>
    </Flex>
  );
};
