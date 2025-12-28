'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { usePickleballContext } from './PickleballContext';
import { ConfigForm } from './types';
import Box from '@/ds/Box/Box';
import PlayerSelectionDropdown from './PlayerSelectionDropdown';

type Props = {
  width?: number;
  height?: number;
  players: ConfigForm['players'];
};

export default function CourtCanvas({ width = 800, height = 600, players }: Props) {
  const { courts, gameType, assignments, assignPlayerToCourt, removePlayerFromCourt } =
    usePickleballContext();
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [dropdownState, setDropdownState] = useState<{
    isOpen: boolean;
    position: { courtId: number; position: number } | null;
  }>({
    isOpen: false,
    position: null,
  });

  const [hoveredPosition, setHoveredPosition] = useState<{
    courtId: number;
    position: number;
  } | null>(null);

  // Helper function to get player name by ID
  const getPlayerName = useCallback(
    (playerId: number) => {
      const player = players.find((p) => p.id === playerId);
      return player?.name || `Player ${playerId}`;
    },
    [players],
  );

  // Detect which court position was clicked
  const detectCourtPosition = useCallback(
    (mouseX: number, mouseY: number) => {
      const canvas = ref.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const canvasX = (mouseX - rect.left) * scaleX;
      const canvasY = (mouseY - rect.top) * scaleY;

      // Layout grid
      const cols = Math.ceil(Math.sqrt(courts));
      const rows = Math.ceil(courts / cols);
      const padding = 12;
      const gap = 12;
      const cellW = (width - padding * 2 - gap * (cols - 1)) / cols;
      const cellH = (height - padding * 2 - gap * (rows - 1)) / rows;

      // Find which court was clicked
      const courtCol = Math.floor((canvasX / scaleX - padding) / (cellW + gap));
      const courtRow = Math.floor((canvasY / scaleY - padding) / (cellH + gap));

      if (courtCol < 0 || courtCol >= cols || courtRow < 0 || courtRow >= rows) {
        return null;
      }

      const courtId = courtRow * cols + courtCol + 1;
      if (courtId > courts) return null;

      // Find which position within court
      const courtX = padding + courtCol * (cellW + gap);
      const courtY = padding + courtRow * (cellH + gap);
      const relX = (canvasX / scaleX - courtX) / cellW;
      const relY = (canvasY / scaleY - courtY) / cellH;

      // Check position boundaries with mobile-friendly tap zones
      const touchMultiplier = window.innerWidth <= 768 ? 1.5 : 1.0;
      const threshold = 0.4 * touchMultiplier; // Larger hit zones for mobile

      if (gameType === 'singles') {
        // Left vs Right positions
        if (relX < 0.5 - threshold || relX > 0.5 + threshold) return null;
        return { courtId, position: relX < 0.5 ? 0 : 1 };
      } else {
        // Doubles - 4 quadrants
        if (relY < 0.5 - threshold || relY > 0.5 + threshold) return null;
        if (relX < 0.5 - threshold || relX > 0.5 + threshold) return null;

        if (relX < 0.5 && relY < 0.5) return { courtId, position: 0 }; // top-left
        if (relX > 0.5 && relY < 0.5) return { courtId, position: 1 }; // top-right
        if (relX < 0.5 && relY > 0.5) return { courtId, position: 2 }; // bottom-left
        if (relX > 0.5 && relY > 0.5) return { courtId, position: 3 }; // bottom-right
      }

      return null;
    },
    [courts, width, height, gameType],
  );

  // Handle canvas click
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const courtPosition = detectCourtPosition(mouseX, mouseY);

      if (courtPosition) {
        setDropdownState({
          isOpen: true,
          position: courtPosition,
        });
      }
    },
    [detectCourtPosition],
  );

  // Handle player selection
  const handleSelectPlayer = useCallback(
    (playerId: number) => {
      if (dropdownState.position) {
        const result = assignPlayerToCourt(
          dropdownState.position.courtId,
          playerId,
          dropdownState.position.position,
        );

        if (!result.isValid) {
          alert(result.error || 'Assignment failed');
        }
      }
    },
    [dropdownState.position, assignPlayerToCourt],
  );

  // Handle player removal
  const handleRemovePlayer = useCallback(
    (courtId: number, position: number) => {
      removePlayerFromCourt(courtId, position);
    },
    [removePlayerFromCourt],
  );

  // Close dropdown
  const closeDropdown = useCallback(() => {
    setDropdownState({ isOpen: false, position: null });
  }, []);

  // Handle mouse move for hover effects
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const courtPosition = detectCourtPosition(mouseX, mouseY);

      setHoveredPosition(courtPosition);
    },
    [detectCourtPosition],
  );

  // Handle mouse leave to clear hover
  const handleMouseLeave = useCallback(() => {
    setHoveredPosition(null);
  }, []);

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

    ctx.font = '14px system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial';
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

      // draw player names based on game type and assignments
      ctx.save();
      ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Get assignments for this court
      const courtAssignments = assignments[i + 1] || [];

      if (gameType === 'doubles') {
        // Four players in each quarter
        const quarters = [
          { cx: x + cellW * 0.25, cy: y + cellH * 0.25 }, // top-left
          { cx: x + cellW * 0.75, cy: y + cellH * 0.25 }, // top-right
          { cx: x + cellW * 0.25, cy: y + cellH * 0.75 }, // bottom-left
          { cx: x + cellW * 0.75, cy: y + cellH * 0.75 }, // bottom-right
        ];

        quarters.forEach((q, idx) => {
          const assignment = courtAssignments.find((a) => a.position === idx);
          const isHovered = hoveredPosition?.courtId === i + 1 && hoveredPosition?.position === idx;

          // Draw hover effect
          if (isHovered) {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 122, 204, 0.1)';
            ctx.fillRect(q.cx - 30, q.cy - 15, 60, 30);
            ctx.restore();
          }

          if (assignment) {
            ctx.fillText(getPlayerName(assignment.playerId), q.cx, q.cy);
          } else {
            ctx.fillText(`Position ${idx + 1}`, q.cx, q.cy);
          }
        });
      } else {
        // Two players - one on each side
        const positions = [
          { cx: x + cellW * 0.25, cy: y + cellH * 0.5 }, // left side
          { cx: x + cellW * 0.75, cy: y + cellH * 0.5 }, // right side
        ];

        positions.forEach((q, idx) => {
          const assignment = courtAssignments.find((a) => a.position === idx);
          const isHovered = hoveredPosition?.courtId === i + 1 && hoveredPosition?.position === idx;

          // Draw hover effect
          if (isHovered) {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 122, 204, 0.1)';
            ctx.fillRect(q.cx - 30, q.cy - 15, 60, 30);
            ctx.restore();
          }

          if (assignment) {
            ctx.fillText(getPlayerName(assignment.playerId), q.cx, q.cy);
          } else {
            ctx.fillText(`Position ${idx + 1}`, q.cx, q.cy);
          }
        });
      }
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
  }, [courts, gameType, assignments, players, width, height, getPlayerName, hoveredPosition]);

  return (
    <Box sx={{ mt: 6, position: 'relative' }}>
      <canvas
        ref={ref}
        role="img"
        aria-label={`Court layout with ${courts} courts for ${gameType}`}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: dropdownState.isOpen ? 'default' : hoveredPosition ? 'pointer' : 'default',
          maxWidth: '100%',
          height: 'auto',
        }}
      />
      <PlayerSelectionDropdown
        isOpen={dropdownState.isOpen}
        position={dropdownState.position}
        onClose={closeDropdown}
        players={players}
        onSelectPlayer={handleSelectPlayer}
        onRemovePlayer={handleRemovePlayer}
      />
    </Box>
  );
}
