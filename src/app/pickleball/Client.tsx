'use client';

import { useState } from 'react';
import CourtCanvas from './CourtCanvas';
import ConfigPanel from './ConfigPanel';
import PickleballContextProvider from './PickleballContext';
import Button from '@/ds/Button';
import Flex from '@/ds/Flex';

export default function PickleballClient() {
  const [panelOpen, setPanelOpen] = useState<boolean>(false);

  return (
    <PickleballContextProvider>
      <Flex justifyContent="space-between">
        <h1>Pickleball</h1>
        <Button onClick={() => setPanelOpen(true)}>Open Config</Button>
      </Flex>
      <CourtCanvas width={820} height={480} />
      <ConfigPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </PickleballContextProvider>
  );
}
