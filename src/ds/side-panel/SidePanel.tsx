'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';

type Props = {
  open: boolean;
  onClose: () => void;
  width?: number;
  title: string;
  duration?: number; // animation duration in ms
  easing?: string;
};

const overlayBase: CSSProperties = {
  position: 'fixed',
  inset: 0,
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

export default function SidePanel({
  open,
  onClose,
  width = 360,
  children,
  title,
  duration = 300,
  easing = 'cubic-bezier(0.2, 0.8, 0.2, 1)',
}: React.PropsWithChildren<Props>) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // lock scroll while open
  useEffect(() => {
    if (open) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
    return;
  }, [open]);

  // Escape key to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const overlayStyle: CSSProperties = {
    ...overlayBase,
    background: 'rgba(0,0,0,0.32)',
    transition: `background ${duration}ms ${easing}`,
  };

  const panelStyle: CSSProperties = {
    ...panelStyleBase,
    width,
    transform: 'translateX(0)',
    transition: `transform ${duration}ms ${easing}`,
  };

  return (
    <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true">
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <FocusLock returnFocus>
          <div ref={panelRef} tabIndex={-1}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 id="sidepanel-title" style={{ margin: 0 }}>
                {title ?? ''}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close panel"
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 12 }}>{children}</div>
          </div>
        </FocusLock>
      </div>
    </div>
  );
}
