'use client';

import { CSSProperties } from 'react';
import 'react-sliding-side-panel/lib/index.css';
import { Players } from './Players';

type Props = {
  open: boolean;
  onClose: () => void;
  courts: number;
  setCourts: (n: number) => void;
};

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.3)',
  display: 'flex',
  justifyContent: 'flex-end',
  zIndex: 60,
};

const panelStyleBase: CSSProperties = {
  width: 360,
  maxWidth: '100%',
  height: '100%',
  background: '#0b0b0b',
  color: '#fff',
  padding: 20,
  boxShadow: '-24px 0 40px rgba(0,0,0,0.6)',
  overflowY: 'auto',
};

export default function ConfigPanel({ open, onClose, courts, setCourts }: Props) {
  if (!open) return null;

  return (
    <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true">
      <div
        style={{
          ...panelStyleBase,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Config</h2>
          <button
            onClick={onClose}
            aria-label="Close config"
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 18 }}
          >
            ✕
          </button>
        </div>

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
      </div>
    </div>
  );
}
