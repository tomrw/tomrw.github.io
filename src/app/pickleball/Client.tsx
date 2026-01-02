'use client';

import PickleballContextProvider from './PickleballContext';
import PlayersProvider from './contexts/PlayersContext';
import Flex from '@/ds/Flex';
import Heading from '@/ds/Heading';
import CourtGrid from './components/Courts/CourtGrid';
import GameConfig from './components/Config/GameConfig';

export default function PickleballClient() {
  return (
    <PlayersProvider>
      <PickleballContextProvider>
        <Flex justifyContent="space-between">
          <Heading as="h1">Pickleball</Heading>
          <GameConfig />
        </Flex>
        <CourtGrid />
      </PickleballContextProvider>
    </PlayersProvider>
  );
}
