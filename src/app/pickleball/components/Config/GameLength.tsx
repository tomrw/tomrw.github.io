'use client';

import { useController, useFormContext, useWatch } from 'react-hook-form';
import TimePicker from 'react-time-picker';
import { GameConfig } from '../../types';
import { gameLengthToDate, parseGameLength } from '../../utils/timeUtils';
import 'react-time-picker/dist/TimePicker.css';
import { Label, Flex } from '@/ds';

import styles from './GameLength.module.css';

export default function GameLength() {
  const { control } = useFormContext<GameConfig>();
  const gameLength = useWatch({ control, name: 'gameLength' });
  const {
    field: { onChange },
  } = useController<GameConfig>({
    control,
    name: 'gameLength',
  });

  return (
    <Flex direction="column" gap={1}>
      <Label htmlFor="game-length">Game Length</Label>
      <TimePicker
        id="game-length"
        className={styles.gameLengthPicker}
        value={gameLengthToDate(gameLength)}
        onChange={(date) => {
          onChange(date ? parseGameLength(date) : null);
        }}
        minTime={'00:01:00'}
        maxTime={'23:59:00'}
        format="HH:mm"
        clearIcon={null}
        clockIcon={null}
        shouldOpenClock={() => false}
      />
    </Flex>
  );
}
