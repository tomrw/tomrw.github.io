import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ConfigForm } from './types';
import { usePickleballContext } from './PickleballContext';
import Button from '@/ds/Button';
import Flex from '@/ds/Flex';
import Input from '@/ds/Input';
import Box from '@/ds/Box';

export const Players = () => {
  const [newName, setNewName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { control } = useFormContext<ConfigForm>();
  const { fields, remove, append } = useFieldArray({ control, name: 'players' });
  const { clearPlayerAssignments } = usePickleballContext();

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

  const onRemovePlayer = (playerId: number) => {
    clearPlayerAssignments(playerId);
    remove(playerId);
  };

  return (
    <>
      <h3>Players</h3>
      <Flex justifyContent="space-between" gap={1} sx={{ mb: 1 }}>
        <Input
          value={newName}
          onChange={setNewName}
          inputProps={{
            'aria-label': 'Player name',
            onKeyDown: (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddPlayer();
              }
            },
            placeholder: 'Enter player name',
          }}
        />
        <Button type="button" onClick={onAddPlayer}>
          Add
        </Button>
      </Flex>
      {error && <Box sx={{ color: '#e11', mb: 1 }}>{error}</Box>}

      <Flex as="ul" direction="column" gap={1}>
        {fields.map((pl) => (
          <Flex as="li" key={pl.id} justifyContent="space-between" sx={{ gap: 1 }}>
            <span>{pl.name}</span>
            <Button
              type="button"
              onClick={() => onRemovePlayer(pl.id)}
              aria-label={`Delete ${pl.name}`}
            >
              x
            </Button>
          </Flex>
        ))}
      </Flex>
    </>
  );
};
