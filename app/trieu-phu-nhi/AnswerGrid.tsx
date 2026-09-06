'use client';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export type AnswerState = {
  /** Đáp án bé vừa chọn nhưng CHƯA xác nhận — tô cam như trong chương trình. */
  pending?: number | null;
  picked: number | null;
  correctIndex: number | null;
  removed: number[];
  votes: number[] | null;
  locked: boolean;
};

/**
 * Bốn đáp án A/B/C/D.
 * Sau khi chấm: đáp án đúng xanh, đáp án bé chọn sai đỏ — bé thấy ngay mình
 * lệch ở đâu. Đáp án bị "Gợi ý" loại thì mờ đi chứ không biến mất, để bố cục
 * không nhảy và bé vẫn hiểu chuyện gì vừa xảy ra.
 */
export default function AnswerGrid({
  options,
  state,
  onPick,
}: {
  options: string[];
  state: AnswerState;
  onPick: (i: number) => void;
}) {
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {options.map((text, i) => {
        const removed = state.removed.includes(i);
        const isRight = state.correctIndex === i;
        const isWrongPick = state.picked === i && state.correctIndex != null && state.correctIndex !== i;

        let bg = 'linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.06))';
        let ring = 'rgba(255,255,255,.22)';
        let text2 = 'text-white';
        if (isRight) { bg = 'linear-gradient(180deg,#4ade80,#16a34a)'; ring = '#16a34a'; text2 = 'text-white'; }
        else if (isWrongPick) { bg = 'linear-gradient(180deg,#fb7185,#e11d48)'; ring = '#e11d48'; }
        else if (state.pending === i || (state.picked === i && state.correctIndex == null)) {
          bg = 'linear-gradient(180deg,#FFE27A,#F5A623)'; ring = '#F5A623'; text2 = 'text-[#5a2d00]';
        }

        return (
          <li key={i}>
            <button
              onClick={() => onPick(i)}
              disabled={state.locked || removed}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold transition disabled:cursor-default ${text2} ${
                removed ? 'opacity-25' : 'hover:-translate-y-0.5'
              }`}
              style={{ background: bg, boxShadow: `inset 0 0 0 2px ${ring}` }}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#061238]/70 text-sm font-black text-[#FFD54A]">
                {LETTERS[i]}
              </span>
              <span className="min-w-0 flex-1">{removed ? '—' : text}</span>
              {state.votes && !removed && (
                <span className="shrink-0 rounded-full bg-[#061238]/60 px-2 py-0.5 text-xs font-black text-white/90">
                  {state.votes[i]}%
                </span>
              )}
              {isRight && <span aria-hidden>✓</span>}
              {isWrongPick && <span aria-hidden>✗</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
