import { useState } from 'react';

type Player = { name: string; id: number };

const initialPlayers = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

export const Players = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [newName, setNewName] = useState<string>('');
  const [error, setError] = useState<string>('');

  function removePlayer(id: number) {
    setPlayers((p) => p.filter((x) => x.id !== id));
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = newName.trim();
          if (!name) return;
          // prevent duplicates (case-insensitive)
          const exists = players.some((p) => p.name.trim().toLowerCase() === name.toLowerCase());
          if (exists) {
            setError('A player with that name already exists.');
            return;
          }
          const nextId = players.length ? Math.max(...players.map((p) => p.id)) + 1 : 1;
          setPlayers((p) => [...p, { id: nextId, name }]);
          setNewName('');
          setError('');
        }}
        style={{ display: 'flex', gap: 8, marginBottom: 12, maxWidth: 420 }}
      >
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add player name"
          aria-label="Player name"
          style={{ flex: 1, padding: '8px 10px', borderRadius: 8 }}
        />
        <button type="submit" style={{ padding: '8px 12px', borderRadius: 8 }}>
          Add
        </button>
      </form>
      {error && <div style={{ color: '#e11', marginBottom: 12 }}>{error}</div>}

      <ul>
        {players.map((pl) => (
          <li key={pl.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>{pl.name}</span>
            <button
              onClick={() => removePlayer(pl.id)}
              style={{
                marginLeft: 'auto',
                padding: '6px 8px',
                borderRadius: 6,
              }}
              aria-label={`Delete ${pl.name}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
