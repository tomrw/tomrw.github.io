'use client';

import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ConfigForm } from './types';

type Props = {
  width?: number;
  height?: number;
};

export default function CourtCanvas({ width = 800, height = 600 }: Props) {
  const { control } = useFormContext<ConfigForm>();
  const courts = useWatch({ control, name: 'courts' });
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Layout grid
    const cols = Math.ceil(Math.sqrt(courts));
    const rows = Math.ceil(courts / cols);
    const padding = 12;
    const gap = 12;
    const cellW = (width - padding * 2 - gap * (cols - 1)) / cols;
    const cellH = (height - padding * 2 - gap * (rows - 1)) / rows;

    ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial";
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1;

    for (let i = 0; i < courts; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = padding + col * (cellW + gap);
      const y = padding + row * (cellH + gap);

      // Court rectangle
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(x, y, cellW, cellH);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.strokeRect(x + 0.5, y + 0.5, cellW - 1, cellH - 1);

      // Court label
      ctx.fillStyle = '#fff';
      ctx.fillText(`Court ${i + 1}`, x + 8, y + 20);

      // draw four player name placeholders at the corners
      const nameBoxW = Math.min(120, cellW / 2 - 16);
      const nameBoxH = 20;

      const positions = [
        // top-left
        { nx: x + 8, ny: y + 28 },
        // top-right
        { nx: x + cellW - nameBoxW - 8, ny: y + 28 },
        // bottom-left
        { nx: x + 8, ny: y + cellH - nameBoxH - 8 },
        // bottom-right
        { nx: x + cellW - nameBoxW - 8, ny: y + cellH - nameBoxH - 8 },
      ];

      ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial";
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      positions.forEach((pos, idx) => {
        // placeholder box
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fillRect(pos.nx, pos.ny, nameBoxW, nameBoxH);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.strokeRect(pos.nx + 0.5, pos.ny + 0.5, nameBoxW - 1, nameBoxH - 1);

        // placeholder name
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillText(`Player ${idx + 1}`, pos.nx + 6, pos.ny + 14);
      });
    }
  }, [courts, width, height]);

  return (
    <div style={{ marginTop: 24 }}>
      <canvas ref={ref} role="img" aria-label={`Court layout with ${courts} courts`} />
    </div>
  );
}
