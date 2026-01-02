'use client';

import { CSSProperties, useEffect, useRef } from 'react';
import FocusLock from 'react-focus-lock';
import { SxProp, useTransformSx } from '../sx';
import Button from '../Button';
import Box from '../Box';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  duration?: number; // animation duration in ms
  easing?: string;
  sx?: SxProp;
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
  overflowY: 'auto',
};

export default function SidePanel({
  open,
  onClose,
  children,
  title,
  duration = 300,
  easing = 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  sx,
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
    background: open ? 'rgba(0,0,0,0.32)' : 'rgba(0,0,0,0)',
    pointerEvents: open ? 'auto' : 'none',
    transition: `background ${duration}ms ${easing}, pointer-events ${duration}ms ${easing}`,
  };

  const sxStyle = useTransformSx({ ...sx, width: ['100%', 400, 480, 560] });

  const panelStyle: CSSProperties = {
    ...panelStyleBase,
    transform: open ? 'translateX(0)' : 'translateX(100%)',
    boxShadow: open ? '-24px 0 40px rgba(0,0,0,0.6)' : 'none',
    transition: `transform ${duration}ms ${easing}, box-shadow ${duration}ms ${easing}`,
    ...sxStyle,
  };

  return (
    <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal={open}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        {open && (
          <FocusLock returnFocus>
            <div ref={panelRef} tabIndex={-1}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <h2 id="sidepanel-title" style={{ margin: 0 }}>
                  {title ?? ''}
                </h2>
                <Button
                  onClick={onClose}
                  aria-label="Close panel"
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 18 }}
                >
                  ✕
                </Button>
              </div>

              <Box sx={{ mt: 3 }}>{children}</Box>
            </div>
          </FocusLock>
        )}
      </div>
    </div>
  );
}
