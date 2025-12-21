'use client';

import { useState } from 'react';
import CourtCanvas from './CourtCanvas';
import ConfigPanel from './ConfigPanel';
import PickleballContextProvider from './PickleballContext';
import Button from '@/ds/Button';
import { ConfigForm } from './types';

export default function PickleballClient() {
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [courts, setCourts] = useState(2);

  const handleUpdateConfig = (data: ConfigForm) => {
    setCourts(data.courts);
    setPanelOpen(false);
  };

  return (
    <PickleballContextProvider>
      <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
        <h1>Pickleball</h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <div />
          <Button onClick={() => setPanelOpen(true)}>Open Config</Button>
        </div>
        <CourtCanvas width={820} height={480} />
        <ConfigPanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          onUpdateConfig={handleUpdateConfig}
        />
      </main>
    </PickleballContextProvider>
  );
}
