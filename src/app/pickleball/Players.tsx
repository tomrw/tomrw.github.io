import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ConfigForm } from './types';
import Button from '@/ds/Button';
import Flex from '@/ds/Flex';
import Box from '@/ds/Box';

export const Players = () => {
  const [newName, setNewName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { control } = useFormContext<ConfigForm>();
  const { fields, remove, append } = useFieldArray({ control, name: 'players' });

  const onAddPlayer = () => {
    const name = newName.trim();
    if (!name) return;
    // prevent duplicates (case-insensitive)
    const exists = fields.some((p) => p.name.trim().toLowerCase() === name.toLowerCase());
    if (exists) {
      setError('A player with that name already exists.');
      return;
    }
    const nextId = fields.length ? Math.max(...fields.map((p) => p.id)) + 1 : 1;
    append({ id: nextId, name });
    setNewName('');
    setError('');
  };

  return (
    <>
      <Flex justifyContent="space-between" sx={{ gap: ['8px', '10px'] }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddPlayer();
            }
          }}
          placeholder="Add player name"
          aria-label="Player name"
          style={{ flex: 1, padding: '8px 10px', borderRadius: 8 }}
        />
        <Button type="button" onClick={onAddPlayer}>
          Add
        </Button>
      </Flex>
      {error && <div style={{ color: '#e11', marginBottom: 12 }}>{error}</div>}

      <Box
        as="ul"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: ['6px', '8px'],
          marginBlockEnd: 10,
        }}
      >
        {fields.map((pl) => (
          <Flex as="li" key={pl.id} justifyContent="space-between" sx={{ gap: ['8px', '10px'] }}>
            <span>{pl.name}</span>
            <Button type="button" onClick={() => remove(pl.id)} aria-label={`Delete ${pl.name}`}>
              x
            </Button>
          </Flex>
        ))}
      </Box>
    </>
  );
};
