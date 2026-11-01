/* eslint-disable @next/next/no-img-element -- ảnh minh họa tĩnh trong phiếu in */
// Bản IN của một câu hỏi (phiếu bài tập PDF): mỗi dạng tương tác đổi sang cách làm trên giấy —
// khoanh tròn, viết đáp số, nối bằng bút, đánh số thứ tự. Bản đáp án hiện thêm đáp án + lời giải.
import type { Question, Tile } from '../../lib/types';
import { withClocks } from '../Clock';
import { MoneyRow } from '../Money';
import Visual from '../Visual';
import { seededShuffle } from '../questions/shared';

const LETTERS = 'ABCDEFGHIJ';

/** Đổi lời đề của bản trên máy (chạm, kéo, lật) sang cách làm trên giấy. */
export function printPrompt(text: string): string {
  return text
    .replace(/Lật từng ô để xem ([^,]+), rồi (?:chạm vào|chạm) /g, 'Nối mỗi $1 với ')
    .replace(/Lật (?:từng )?ô([^,]*?),? rồi (?:chạm vào|chạm) /g, 'Nối mỗi ô$1 với ')
    .replace(/Chạm lần lượt các thẻ để ghép/g, 'Dùng các thẻ để viết')
    .replace(/Chạm các thẻ để ghép/g, 'Dùng các thẻ để viết')
    .replace(/Chạm lần lượt/g, 'Viết lần lượt')
    .replace(/[Cc]hạm vào/g, (m) => (m[0] === 'C' ? 'Khoanh vào' : 'khoanh vào'))
    .replace(/Kéo (?:thẻ đúng|số đúng|số tiền đúng|từ đúng) vào chỗ trống/g, 'Điền vào chỗ trống')
    .replace(/Kéo (.+?) vào chỗ trống/g, 'Điền $1 vào chỗ trống')
    .replace(/Kéo mỗi (.+?) vào/g, 'Xếp mỗi $1 vào')
    .replace(/Kéo /g, 'Xếp ');
}

function PrintTile({ tile, small = false }: { tile: Tile; small?: boolean }) {
  return (
    <span className="inline-flex flex-col items-center justify-center gap-0.5 text-center leading-tight">
      {tile.image && <img src={tile.image} alt={tile.text ?? ''} className={small ? 'h-9 w-9 object-contain' : 'h-12 w-12 object-contain'} />}
      {tile.money !== undefined && <MoneyRow items={Array.isArray(tile.money) ? tile.money : [tile.money]} width={small ? 70 : 90} />}
      {tile.emoji && <span className={small ? 'text-xl' : 'text-2xl'}>{withClocks(tile.emoji, small ? 44 : 56)}</span>}
      {tile.text && (
        // Thẻ chỉ có hình (dãy emoji / ảnh thay emoji, không có chữ) → in to cho dễ nhìn.
        <span className={`whitespace-pre-line font-semibold ${/\p{L}/u.test(tile.text) ? 'text-[13px]' : small ? 'text-xl' : 'text-2xl'}`}>
          {withClocks(tile.text, 24)}
        </span>
      )}
    </span>
  );
}

/** Đáp án viết bằng chữ (cho bản ba mẹ). */
export function answerText(q: Question): string {
  const t = (tile: Tile) => tile.text ?? tile.emoji ?? (tile.money !== undefined ? `${tile.money}` : '(hình)');
  switch (q.type) {
    case 'choice':
      return `${LETTERS[q.answer]}. ${t(q.options[q.answer])}`;
    case 'multi_choice':
      return q.answers.map((a) => `${LETTERS[a]}. ${t(q.options[a])}`).join(' · ');
    case 'input':
      return `${q.answers[0]}${q.unit ? ` ${q.unit}` : ''}`;
    case 'match':
    case 'match_vertical': {
      const right = seededShuffle(q.pairs.map((p, i) => ({ p, i })), q.id);
      return q.pairs.map((_, i) => `${i + 1} – ${LETTERS[right.findIndex((r) => r.i === i)]}`).join(' · ');
    }
    case 'reveal_match': {
      const right = seededShuffle(q.pairs.map((p, i) => ({ p, i })), q.id);
      return q.pairs.map((_, i) => `${i + 1} – ${LETTERS[right.findIndex((r) => r.i === i)]}`).join(' · ');
    }
    case 'match_multi':
      return q.groups.map((g, gi) => `${t(g)}: ${q.items.filter((it) => it.group === gi).map(t).join(', ')}`).join(' | ');
    case 'fill_blank':
      return q.sentence.replace(/\[\[(.*?)\]\]/g, '$1');
    case 'order':
      return q.items.map(t).join(' → ');
    case 'pick_order':
      return q.items.join(' ');
    case 'puzzle':
      return '';
  }
}

function Choices({ q, multi }: { q: Extract<Question, { type: 'choice' | 'multi_choice' }>; multi: boolean }) {
  const media = q.options.some((o) => o.emoji || o.image || o.money !== undefined);
  // Đáp án ngắn (số, chữ ngắn) → một hàng 4 ô cho gọn trang.
  const short = q.options.every((o) => (o.text ?? '').length <= 14);
  return (
    <div className={`mt-2 grid gap-2 ${media || short ? 'grid-cols-4' : 'grid-cols-2'}`}>
      {q.options.map((o, i) => (
        <div key={i} className="flex items-center gap-2 rounded-xl border-2 border-slate-200 px-2 py-1.5">
          <span className={`grid h-6 w-6 shrink-0 place-items-center border-2 border-slate-400 text-xs font-black text-slate-600 ${multi ? 'rounded-md' : 'rounded-full'}`}>
            {LETTERS[i]}
          </span>
          <PrintTile tile={o} small />
        </div>
      ))}
    </div>
  );
}

function TwoColumns({ left, right, ids }: { left: Tile[]; right: Tile[]; ids: string }) {
  return (
    <div className="mt-2 grid grid-cols-[1fr_70px_1fr] items-center gap-y-2">
      {left.map((l, i) => (
        <div key={`${ids}-${i}`} className="contents">
          <div className="flex items-center justify-end gap-2 rounded-xl border-2 border-slate-200 px-2 py-1.5">
            <span className="text-xs font-black text-slate-500">{i + 1}</span>
            <PrintTile tile={l} small />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
          </div>
          <span />
          <div className="flex items-center gap-2 rounded-xl border-2 border-slate-200 px-2 py-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
            <PrintTile tile={right[i]} small />
            <span className="ml-auto text-xs font-black text-slate-500">{LETTERS[i]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Body({ q }: { q: Question }) {
  switch (q.type) {
    case 'choice':
      return (
        <>
          <Hint>Khoanh vào chữ cái trước đáp án đúng.</Hint>
          <Choices q={q} multi={false} />
        </>
      );
    case 'multi_choice':
      return (
        <>
          <Hint>Đánh dấu ✓ vào TẤT CẢ các đáp án đúng.</Hint>
          <Choices q={q} multi />
        </>
      );
    case 'input':
      return (
        <p className="mt-3 text-[15px] font-bold text-slate-700">
          Đáp số: <span className="inline-block w-40 border-b-2 border-dotted border-slate-400" /> {q.unit}
        </p>
      );
    case 'match':
    case 'match_vertical': {
      const right = seededShuffle(q.pairs.map((p) => p.right), q.id);
      return (
        <>
          <Hint>Nối mỗi ô bên trái với ô phù hợp bên phải.</Hint>
          <TwoColumns left={q.pairs.map((p) => p.left)} right={right} ids={q.id} />
        </>
      );
    }
    case 'reveal_match': {
      const right = seededShuffle(q.pairs.map((p) => p.back), q.id);
      return (
        <>
          <Hint>Nối các ô tương ứng với nhau.</Hint>
          <TwoColumns left={q.pairs.map((p) => p.front)} right={right} ids={q.id} />
        </>
      );
    }
    case 'match_multi': {
      const items = seededShuffle(q.items, q.id);
      return (
        <>
          <Hint>Đánh dấu ✓ vào nhóm đúng của mỗi ô.</Hint>
          <table className="mt-2 w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border border-slate-300 p-1.5" />
                {q.groups.map((g, i) => (
                  <th key={i} className="border border-slate-300 p-1.5 font-bold">
                    <PrintTile tile={g} small />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td className="border border-slate-300 p-1.5">
                    <PrintTile tile={it} small />
                  </td>
                  {q.groups.map((_, gi) => (
                    <td key={gi} className="border border-slate-300 p-1.5 text-center">
                      <span className="inline-block h-5 w-5 rounded border-2 border-slate-400" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    }
    case 'fill_blank':
      return (
        <>
          <p className="mt-2 whitespace-pre-line text-[15px] leading-9">
            {q.sentence.split(/(\[\[.*?\]\])/).map((part, i) =>
              /^\[\[.*\]\]$/.test(part) ? <span key={i} className="mx-1 inline-block w-20 border-b-2 border-dotted border-slate-500" /> : <span key={i}>{withClocks(part, 24)}</span>,
            )}
          </p>
          <p className="mt-1 text-[13px] text-slate-600">
            Chọn từ: <b>{q.choices.join(' · ')}</b>
          </p>
        </>
      );
    case 'order': {
      const items = seededShuffle(q.items, q.id);
      return (
        <>
          <Hint>Ghi số 1, 2, 3… vào ô để xếp đúng thứ tự.</Hint>
          <div className="mt-2 flex flex-wrap gap-2">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl border-2 border-slate-200 px-2 py-1.5">
                <span className="inline-block h-7 w-7 rounded-lg border-2 border-slate-400" />
                <PrintTile tile={it} small />
              </div>
            ))}
          </div>
        </>
      );
    }
    case 'pick_order': {
      const cards = seededShuffle([...q.items, ...(q.distractors ?? [])], q.id);
      return (
        <>
          <Hint>Dùng các thẻ dưới đây, viết lại cho đúng (có thể thừa thẻ).</Hint>
          <div className="mt-2 flex flex-wrap gap-2">
            {cards.map((c, i) => (
              <span key={i} className="rounded-lg border-2 border-slate-300 px-3 py-1 text-[15px] font-bold">
                {withClocks(c, 24)}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[15px]">
            <span className="inline-block w-full border-b-2 border-dotted border-slate-400" />
          </p>
        </>
      );
    }
    case 'puzzle':
      return <p className="mt-2 text-[13px] italic text-slate-500">Câu ghép hình — bé làm trên máy ở khóa học online.</p>;
  }
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-[12px] italic text-slate-500">{children}</p>;
}

export default function PrintQuestion({ q, index, answers }: { q: Question; index: number; answers: boolean }) {
  return (
    <div className="q-item rounded-2xl border-2 border-slate-100 p-3">
      <div className="flex gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sky-600 text-sm font-black text-white">{index}</span>
        <p className="whitespace-pre-line text-[15px] font-semibold leading-6 text-slate-800">{withClocks(printPrompt(q.prompt), 32)}</p>
      </div>
      {q.visual && (
        // Thu nhỏ hình minh họa (bảng số, dãy hình) để mỗi trang in được nhiều câu hơn.
        <div className="mt-1" style={{ zoom: 0.7 }}>
          <Visual visual={q.visual} compact />
        </div>
      )}
      <Body q={q} />
      {answers && q.type !== 'puzzle' && (
        <div className="mt-3 rounded-xl bg-emerald-50 p-2.5 text-[13px] leading-5 text-slate-700">
          <p className="font-black text-emerald-700">Đáp án: {withClocks(answerText(q), 22)}</p>
          {q.method && (
            <p className="mt-1">
              <b>Cách làm:</b> {withClocks(q.method, 20)}
            </p>
          )}
          {q.explanation && (
            <p className="mt-1 whitespace-pre-line">
              <b>Lời giải:</b> {withClocks(q.explanation, 20)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
