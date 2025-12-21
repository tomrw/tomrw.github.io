import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ConfigForm } from './ConfigPanel';
import Button from '@/ds/Button';

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
      <Button type="button" onClick={onAddPlayer} style={{ padding: '8px 12px', borderRadius: 8 }}>
        Add
      </Button>
      {error && <div style={{ color: '#e11', marginBottom: 12 }}>{error}</div>}

      <ul>
        {fields.map((pl) => (
          <li key={pl.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>{pl.name}</span>
            <Button
              type="button"
              onClick={() => remove(pl.id)}
              aria-label={`Delete ${pl.name}`}
              className="players-delete"
              style={{
                marginLeft: 'auto',
                padding: '6px 8px',
                borderRadius: 6,
              }}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};
