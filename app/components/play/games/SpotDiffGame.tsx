'use client';

import { useState } from 'react';
import type { SpotDiffData } from '../../../lib/play-api';

type Props = { data: SpotDiffData; onCorrect: () => void; onWrong: () => void };

export default function SpotDiffGame({ data, onCorrect, onWrong }: Props) {
  const [found, setFound] = useState<{ row: number; col: number }[]>([]);
  const [wrong, setWrong] = useState<{ row: number; col: number } | null>(null);

  const isDiff = (r: number, c: number) =>
    data.differences.some((d) => d.row === r && d.col === c);

  const isFound = (r: number, c: number) =>
    found.some((f) => f.row === r && f.col === c);

  const tap = (imageIdx: number, r: number, c: number) => {
    if (isDiff(r, c) && !isFound(r, c)) {
      const newFound = [...found, { row: r, col: c }];
      setFound(newFound);
      if (newFound.length >= data.totalDiff) setTimeout(onCorrect, 700);
    } else if (!isDiff(r, c)) {
      setWrong({ row: r, col: c });
      setTimeout(() => { setWrong(null); onWrong(); }, 600);
    }
  };

  const gs = data.gridSize;
  const cellSize = gs === 3 ? 'h-20 w-20 text-4xl' : 'h-16 w-16 text-3xl';

  const renderGrid = (grid: string[][], imageIdx: number) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gs}, 1fr)`, gap: 6 }}>
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const diff = isDiff(r, c) && imageIdx === 1;
          const foundIt = isFound(r, c) && imageIdx === 1;
          const wrongTap = wrong?.row === r && wrong?.col === c;
          return (
            <button key={`${r}-${c}`}
              onClick={() => tap(imageIdx, r, c)}
              className={`${cellSize} flex items-center justify-center rounded-xl transition-all ${
                foundIt ? 'bg-emerald-100 ring-2 ring-emerald-400 scale-105'
                : wrongTap ? 'bg-red-100 ring-2 ring-red-400'
                : 'bg-white ring-1 ring-slate-200 hover:bg-amber-50'
              }`}>
              {cell}
            </button>
          );
        })
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-bold text-slate-600">
        Tìm {data.totalDiff} điểm khác nhau giữa 2 hình! ({found.length}/{data.totalDiff})
      </p>
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="rounded-2xl bg-white p-3 shadow-md ring-1 ring-slate-200">
          <p className="mb-2 text-center text-xs font-bold text-slate-500">Hình A</p>
          {renderGrid(data.imageA, 0)}
        </div>
        <div className="rounded-2xl bg-white p-3 shadow-md ring-1 ring-slate-200">
          <p className="mb-2 text-center text-xs font-bold text-slate-500">Hình B — Bấm vào điểm khác</p>
          {renderGrid(data.imageB, 1)}
        </div>
      </div>
      {found.length >= data.totalDiff && (
        <div className="rounded-2xl bg-emerald-100 px-8 py-3 text-lg font-black text-emerald-700">
          🎉 Tìm ra rồi!
        </div>
      )}
    </div>
  );
}
