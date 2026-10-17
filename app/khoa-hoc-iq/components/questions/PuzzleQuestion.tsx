'use client';

import { useMemo, useState } from 'react';
import type { PuzzleQuestion as PuzzleQ } from '../../lib/types';
import { playSfx } from '../../lib/sound';
import { shuffledIndexes, type QuestionProps } from './shared';

const ALLOWED_MISTAKES = 3;

/** Ghép tranh: chọn mảnh (chạm hoặc kéo) rồi thả vào đúng ô trên khung. */
export default function PuzzleQuestion({ q, done, onChange }: QuestionProps<PuzzleQ>) {
  const n = q.size ?? 3;
  const total = n * n;
  const tray = useMemo(() => shuffledIndexes(total, q.id), [total, q.id]);
  const [placed, setPlaced] = useState<boolean[]>(() => Array(total).fill(false));
  const [selected, setSelected] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState<number | null>(null);
  const [ratio, setRatio] = useState(4 / 3);

  const pieceStyle = (piece: number) => ({
    backgroundImage: `url(${q.image})`,
    backgroundSize: `${n * 100}% ${n * 100}%`,
    backgroundPosition: `${((piece % n) / (n - 1)) * 100}% ${(Math.floor(piece / n) / (n - 1)) * 100}%`,
  });

  const drop = (slot: number, piece: number | null) => {
    if (done || piece === null || placed[slot]) return;
    if (piece === slot) {
      playSfx('match');
      const next = placed.map((p, i) => (i === slot ? true : p));
      setPlaced(next);
      setSelected(null);
      if (next.every(Boolean)) onChange({ complete: true, correct: mistakes <= ALLOWED_MISTAKES, auto: true });
    } else {
      playSfx('miss');
      setMistakes(mistakes + 1);
      setShake(slot);
      setTimeout(() => setShake(null), 450);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Đọc tỉ lệ ảnh để khung ghép không bị méo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={q.image} alt="" className="hidden" onLoad={(e) => setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight || 4 / 3)} />
      <p className="text-center text-sm font-semibold text-sky-700">
        Chạm một mảnh rồi chạm vào ô đúng trên khung · Sai: {mistakes}
      </p>
      <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start md:justify-center">
        <div
          className="grid w-full max-w-md overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-lg"
          style={{ gridTemplateColumns: `repeat(${n}, 1fr)`, aspectRatio: ratio }}
        >
          {Array.from({ length: total }, (_, slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => drop(slot, selected)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                // Chỉ nhận mảnh ghép của chính câu này (kéo nhầm chữ / ảnh khác vào thì bỏ qua).
                const data = e.dataTransfer.getData('text/plain');
                const piece = /^\d+$/.test(data) ? Number(data) : -1;
                if (piece >= 0 && piece < total) drop(slot, piece);
              }}
              className={`border border-dashed border-slate-300 ${shake === slot ? 'khv-shake bg-rose-100' : ''}`}
              style={placed[slot] || done ? pieceStyle(slot) : undefined}
              aria-label={placed[slot] ? `Ô ${slot + 1}: đã ghép` : `Ô ${slot + 1}: trống`}
            />
          ))}
        </div>
        <div className="grid w-full max-w-md grid-cols-5 gap-2 md:w-56 md:grid-cols-3">
          {tray.map((piece, trayPos) =>
            placed[piece] ? (
              <div key={piece} className="rounded-lg bg-slate-100" style={{ aspectRatio: ratio }} />
            ) : (
              <button
                key={piece}
                type="button"
                draggable={!done}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', String(piece));
                  setSelected(piece);
                }}
                onClick={() => {
                  if (done) return;
                  playSfx('tap');
                  setSelected(selected === piece ? null : piece);
                }}
                className={`rounded-lg border-2 shadow transition ${selected === piece ? 'scale-105 border-sky-500 ring-4 ring-sky-300' : 'border-white'}`}
                style={{ ...pieceStyle(piece), aspectRatio: ratio }}
                aria-label={`Mảnh ghép thứ ${trayPos + 1} trong khay`}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}
