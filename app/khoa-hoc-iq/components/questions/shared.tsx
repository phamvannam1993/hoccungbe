import type { AnswerState, Tile } from '../../lib/types';
import { withClocks } from '../Clock';
import { MoneyRow } from '../Money';

export type QuestionProps<Q> = {
  q: Q;
  /** Đã chấm: khóa thao tác và tô màu đúng/sai. */
  done: boolean;
  onChange: (state: AnswerState) => void;
  /** Kết quả khung chơi đã chấm (hết giờ thì không tô xanh dù bé vừa điền đúng). */
  verdict?: 'correct' | 'wrong' | 'timeout' | null;
};

/** Màu cho các cặp nối / ô lật (giống bảng màu bên app 3 Gốc). */
export const PALETTE = ['#A4D233', '#F05B55', '#B79CFA', '#48B032', '#FFB21E', '#FF8A3D', '#5DA5E8', '#E563D8', '#33C9BF'];

function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Xáo trộn cố định theo `seed` (server và client ra cùng kết quả → không lệch hydrate).
 * Đảm bảo kết quả khác thứ tự ban đầu khi có từ 2 phần tử.
 */
export function seededShuffle<T>(arr: T[], seed: string): T[] {
  const out = [...arr];
  let s = hashSeed(seed) || 1;
  const rand = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.length > 1 && out.every((v, i) => v === arr[i])) out.push(out.shift() as T);
  return out;
}

/** Danh sách chỉ số 0..n-1 đã xáo. */
export function shuffledIndexes(n: number, seed: string) {
  return seededShuffle(
    Array.from({ length: n }, (_, i) => i),
    seed,
  );
}

export function TileContent({ tile, big = false }: { tile: Tile; big?: boolean }) {
  return (
    <span className="flex flex-col items-center justify-center gap-1 leading-tight">
      {tile.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tile.image} alt={tile.text ?? ''} className={big ? 'h-20 w-20 object-contain' : 'h-12 w-12 object-contain'} />
      )}
      {tile.money !== undefined && (
        <MoneyRow items={Array.isArray(tile.money) ? tile.money : [tile.money]} width={Array.isArray(tile.money) && tile.money.length > 1 ? 84 : big ? 150 : 120} />
      )}
      {tile.emoji && <span className={big ? 'text-5xl' : 'text-3xl'}>{withClocks(tile.emoji, big ? 96 : 80)}</span>}
      {tile.text && <span className="whitespace-pre-line">{withClocks(tile.text, 32)}</span>}
    </span>
  );
}

/** Lớp nền chung cho ô đáp án kiểu "thẻ nổi" giống app 3 Gốc. */
export function tileClass(state: 'idle' | 'active' | 'correct' | 'wrong' | 'muted') {
  const base =
    'relative rounded-[14px] border-[3px] bg-white px-3 py-3 text-center text-lg font-bold text-[#1b1b1b] transition duration-150 select-none';
  switch (state) {
    case 'active':
      return `${base} border-[#45aeff] shadow-[0_3px_0_#339bde] -translate-y-0.5`;
    case 'correct':
      return `${base} border-[#85cc31] shadow-[0_3px_0_#62b403]`;
    case 'wrong':
      return `${base} border-[#ff7e89] shadow-[0_3px_0_#ff5563]`;
    case 'muted':
      return `${base} border-[#e4e3e3] opacity-40`;
    default:
      return `${base} border-[#e4e3e3] shadow-[0_3px_0_#c6c6c7] hover:-translate-y-0.5`;
  }
}
