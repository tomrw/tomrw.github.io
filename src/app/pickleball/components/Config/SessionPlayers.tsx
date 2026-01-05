'use client';

import { useState, useMemo } from 'react';
import { usePlayersContext } from '../../contexts/PlayersContext';
import Flex from '@/ds/Flex';
import Input from '@/ds/Input';
import Button from '@/ds/Button';
import Text from '@/ds/Text';
import Heading from '@/ds/Heading/Heading';
import { useFormContext, useWatch } from 'react-hook-form';
import { GameConfig } from '../../types';

type SessionPlayersProps = {
  onPlayersChange: (players: string[]) => void;
};

export default function SessionPlayers({ onPlayersChange }: SessionPlayersProps) {
  const { control } = useFormContext<GameConfig>();
  const selectedPlayers = useWatch({ control, name: 'sessionPlayers' });
  const { players: availablePlayers } = usePlayersContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlayers = useMemo(() => {
    if (!searchQuery) return availablePlayers;
    return availablePlayers.filter((player) =>
      player.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [availablePlayers, searchQuery]);

  const isPlayerSelected = (playerName: string) => selectedPlayers.includes(playerName);

  const togglePlayer = (playerName: string) => {
    if (isPlayerSelected(playerName)) {
      onPlayersChange(selectedPlayers.filter((p) => p !== playerName));
    } else {
      onPlayersChange([...selectedPlayers, playerName]);
    }
  };

  const selectAll = () => {
    onPlayersChange(filteredPlayers);
  };

  const clearAll = () => {
    onPlayersChange([]);
  };

  const removePlayer = (playerName: string) => {
    onPlayersChange(selectedPlayers.filter((p) => p !== playerName));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const exactMatch = availablePlayers.find(
        (player) => player.toLowerCase() === searchQuery.toLowerCase(),
      );

      if (exactMatch) {
        togglePlayer(exactMatch);
        setSearchQuery('');
      } else if (filteredPlayers.length === 1 && searchQuery.trim()) {
        const singleResult = filteredPlayers[0];
        togglePlayer(singleResult);
        setSearchQuery('');
      }
    }
  };

  return (
    <Flex direction="column" gap={1}>
      <Heading as="h4">Session Players</Heading>
      <Text variant="sm" color="secondary">
        Select players who will participate in this session
      </Text>

      <Input
        value={searchQuery}
        onChange={setSearchQuery}
        inputProps={{
          placeholder: 'Search players...',
          type: 'search',
          onKeyDown: handleSearchKeyDown,
        }}
      />

      {filteredPlayers.length === 0 ? (
        <Text variant="sm" color="muted">
          {searchQuery ? 'No players found' : 'No available players'}
        </Text>
      ) : (
        <Flex as="ul" direction="column" sx={{ maxHeight: '200px', overflowY: 'auto' }}>
          {filteredPlayers.map((player) => (
            <Flex
              as="li"
              key={player}
              justifyContent="space-between"
              alignItems="center"
              sx={{ py: 1 }}
            >
              <Flex alignItems="center" gap={2}>
                <input
                  type="checkbox"
                  checked={isPlayerSelected(player)}
                  onChange={() => togglePlayer(player)}
                  style={{ cursor: 'pointer' }}
                />
                <Text>{player}</Text>
              </Flex>
              {isPlayerSelected(player) && (
                <Button
                  onClick={() => removePlayer(player)}
                  aria-label={`Remove ${player} from session`}
                  sx={{ px: 1, py: 0.5, fontSize: '12px', mr: 2 }}
                >
                  x
                </Button>
              )}
            </Flex>
          ))}
        </Flex>
      )}

      <Flex
        justifyContent="space-between"
        alignItems="center"
        sx={{ pt: 1, borderTop: '1px solid #e5e7eb' }}
      >
        <Text variant="sm" weight="medium">
          {selectedPlayers.length} player{selectedPlayers.length !== 1 ? 's' : ''} selected
        </Text>
        <Flex gap={1}>
          <Button
            type="button"
            onClick={selectAll}
            disabled={
              filteredPlayers.length === 0 || selectedPlayers.length === filteredPlayers.length
            }
          >
            Select All
          </Button>
          <Button type="button" onClick={clearAll} disabled={selectedPlayers.length === 0}>
            Clear All
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
