'use client';

import { useState } from 'react';
import CourtCanvas from './CourtCanvas';
import ConfigPanel, { ConfigForm } from './ConfigPanel';

export default function PickleballClient() {
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [courts, setCourts] = useState(2);

  const handleUpdateConfig = (data: ConfigForm) => {
    setCourts(data.courts);
    setPanelOpen(false);
  };

  return (
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
        <button onClick={() => setPanelOpen(true)} style={{ padding: '8px 12px', borderRadius: 8 }}>
          Open Config
        </button>
      </div>
      <CourtCanvas courts={courts} width={820} height={480} />
      <ConfigPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onUpdateConfig={handleUpdateConfig}
      />
    </main>
  );
}
