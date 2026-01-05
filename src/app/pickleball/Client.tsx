'use client';

import PickleballContextProvider from './PickleballContext';
import PlayersProvider from './contexts/PlayersContext';
import { Flex, Heading } from '@/ds';
import CourtGrid from './components/Courts/CourtGrid';
import GameConfig from './components/Config/GameConfig';
import CountdownTimer from './components/CountdownTimer';

export default function PickleballClient() {
  return (
    <PlayersProvider>
      <PickleballContextProvider>
        <Flex justifyContent="space-between" direction={['column', 'row']}>
          <Heading as="h1">Pickleball</Heading>
          <GameConfig />
        </Flex>
        <CourtGrid timer={<CountdownTimer />} />
      </PickleballContextProvider>
    </PlayersProvider>
  );
}
