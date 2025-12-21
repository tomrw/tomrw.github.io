'use client';

import { useEffect, useRef } from 'react';
import { usePickleballContext } from './PickleballContext';

type Props = {
  width?: number;
  height?: number;
};

export default function CourtCanvas({ width = 800, height = 600 }: Props) {
  const { courts } = usePickleballContext();
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
      ctx.fillStyle = '#015281';
      ctx.fillRect(x, y, cellW, cellH);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.strokeRect(x + 0.5, y + 0.5, cellW - 1, cellH - 1);

      // Court label
      ctx.fillStyle = '#fff';
      ctx.fillText(`Court ${i + 1}`, x + 8, y + 20);

      // draw four player names centered in each quarter of the court
      ctx.save();
      ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial";
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const quarters = [
        { cx: x + cellW * 0.25, cy: y + cellH * 0.25 }, // top-left
        { cx: x + cellW * 0.75, cy: y + cellH * 0.25 }, // top-right
        { cx: x + cellW * 0.25, cy: y + cellH * 0.75 }, // bottom-left
        { cx: x + cellW * 0.75, cy: y + cellH * 0.75 }, // bottom-right
      ];

      quarters.forEach((q, idx) => {
        ctx.fillText(`Player ${idx + 1}`, q.cx, q.cy);
      });
      ctx.restore();

      // draw non-volley zones (NVZ) adjacent to the net for this court
      const netX = x + cellW / 2;
      // NVZ width: use a fraction of court width, capped for small courts
      const nvzWidth = Math.min(cellW * 0.12, 48);
      const nvzInset = 6; // inset from top/bottom to avoid touching border

      ctx.save();
      // left NVZ (red)
      ctx.fillStyle = 'rgba(220, 38, 38, 0.22)';
      ctx.fillRect(netX - nvzWidth, y + nvzInset, nvzWidth, cellH - nvzInset * 2);
      // ctx.strokeStyle = 'rgba(220, 38, 38, 0.22)';
      ctx.strokeRect(
        netX - nvzWidth + 0.5,
        y + nvzInset + 0.5,
        nvzWidth - 1,
        cellH - nvzInset * 2 - 1,
      );

      // right NVZ
      ctx.fillStyle = 'rgba(220, 38, 38, 0.22)';
      ctx.fillRect(netX, y + nvzInset, nvzWidth, cellH - nvzInset * 2);
      // ctx.strokeStyle = 'rgba(220, 38, 38, 0.22)';
      ctx.strokeRect(netX + 0.5, y + nvzInset + 0.5, nvzWidth - 1, cellH - nvzInset * 2 - 1);

      // draw net for this court: vertical dashed line down the center of the court cell
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 2;
      ctx.moveTo(netX, y + nvzInset);
      ctx.lineTo(netX, y + cellH - nvzInset);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

  }, [courts, width, height]);

  return (
    <div style={{ marginTop: 24 }}>
      <canvas ref={ref} role="img" aria-label={`Court layout with ${courts} courts`} />
    </div>
  );
}
