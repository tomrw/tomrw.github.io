'use client';

import { Players } from './Players';
import SidePanel from '../../ds/side-panel/SidePanel';

type Props = {
  open: boolean;
  onClose: () => void;
  courts: number;
  setCourts: (n: number) => void;
};

export default function ConfigPanel({ open, onClose, courts, setCourts }: Props) {
  if (!open) return null;

  return (
    <SidePanel open={open} onClose={onClose} width={360} title="Config">
      <section style={{ marginTop: 18 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600 }}>Number of courts</span>
          <select
            value={courts}
            onChange={(e) => setCourts(Number(e.target.value))}
            aria-label="Number of courts"
            style={{ padding: '8px 10px', borderRadius: 8, width: '100%' }}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>Players</h3>
        <Players />
      </section>
    </SidePanel>
  );
}
