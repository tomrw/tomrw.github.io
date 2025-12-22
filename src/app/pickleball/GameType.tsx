'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { ConfigForm } from './types';

export const GameType = () => {
  const { control } = useFormContext<ConfigForm>();

  return (
    <Controller
      name="gameType"
      control={control}
      render={({ field }) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label style={{ fontWeight: 500, minWidth: 80 }}>Game Type:</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <input
                type="radio"
                value="singles"
                checked={field.value === 'singles'}
                onChange={() => field.onChange('singles')}
              />
              Singles
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <input
                type="radio"
                value="doubles"
                checked={field.value === 'doubles'}
                onChange={() => field.onChange('doubles')}
              />
              Doubles
            </label>
          </div>
        </div>
      )}
    />
  );
};
