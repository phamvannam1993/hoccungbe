import { emojiRegex } from './emoji';
import { EMOJI_NAMES } from './emojiNames';

/** Emoji đồng hồ 🕐…🕧 → "7 giờ", "7 giờ 30 phút". */
function clockWords(ch: string) {
  const cp = ch.codePointAt(0) ?? 0;
  if (cp >= 0x1f550 && cp <= 0x1f55b) return ` ${cp - 0x1f550 + 1} giờ `;
  if (cp >= 0x1f55c && cp <= 0x1f567) return ` ${cp - 0x1f55c + 1} giờ 30 phút `;
  return null;
}

const COLOR = /^(đỏ|xanh|vàng|tím|cam|nâu|đen|trắng|hồng)$/;
const CLASSIFIER = /^(dấu|chồng|con|quả|cái|chùm|củ|bắp|cây|hình|bông|chiếc|quyển|tờ|đôi|hộp|cốc|bát|miếng|ổ|viên|lá|xe|thanh|hũ|chén|chai)\s+/;

/**
 * Emoji → tên đọc được, bọc trong ⟦…⟧ để gộp các emoji liền nhau (không có tên thì bỏ).
 * Tên đã có ngay trong mấy chữ phía trước ("Mèo 🐱", "sang phải 2 ô ➡️") thì không đọc lặp.
 */
function emojiWords(ch: string, offset: number, src: string) {
  const name = EMOJI_NAMES[ch.replace(/\uFE0F/g, '')];
  if (!name) return ' ';
  const words = name.replace(CLASSIFIER, '').toLowerCase().split(' ');
  // Từ dùng để dò trùng: từ chính đầu tiên + các từ chỉ màu / từ dài ("ô xanh 🟩", "thú bông 🧸").
  const keys = words.filter((w, i) => i === 0 || COLOR.test(w) || w.length >= 4);
  const before = src.slice(Math.max(0, offset - 24), offset).toLowerCase();
  const after = src.slice(offset + ch.length, offset + ch.length + 12).toLowerCase();
  const has = (t: string) =>
    keys.some((k) => k.length > 1 && new RegExp(`(^|[^\\p{L}])${k}([^\\p{L}]|$)`, 'u').test(t));
  // Tên đã có ngay trước ("Mèo 🐱") hoặc ngay sau ("🐶 Chó", "📏 thước") → không đọc lặp.
  if (has(before) || /^\s*\p{L}/u.test(after) && has(after)) return ' ';
  // Chữ ngay trước đã là từ chỉ loại ("7 quả 🎈", "Hình 🔻") → bỏ từ chỉ loại khỏi tên.
  const cls = CLASSIFIER.exec(name)?.[1];
  if (cls && new RegExp(`(^|[^\\p{L}])${cls}\\s*$`, 'u').test(before)) return `⟦${name.replace(CLASSIFIER, '')}⟧`;
  return `⟦${name}⟧`;
}

/** Đơn vị đo viết tắt → cách đọc. Đơn vị 1 chữ (m, g, l) chỉ đọc khi đứng sau số / ô trống. */
const UNITS: [string, string][] = [
  ['mm', 'mi li mét'],
  ['cm', 'xăng ti mét'],
  ['dm', 'đề xi mét'],
  ['km', 'ki lô mét'],
  ['kg', 'ki lô gam'],
  ['ml', 'mi li lít'],
  ['m', 'mét'],
  ['g', 'gam'],
  ['l', 'lít'],
];
const POWER: Record<string, string> = { '²': ' vuông', '³': ' khối' };

function readUnits(text: string) {
  let t = text;
  for (const [abbr, word] of UNITS) {
    // Sau số hoặc ô trống ("15 cm", "4 l 50 ml", "81 cm²", "= ? g") — mọi đơn vị.
    t = t.replace(new RegExp(`([\\d?_☐□…])\\s?${abbr}([²³]?)(?![\\p{L}\\d])`, 'gu'), (_, d, p) => `${d} ${word}${POWER[p] ?? ''}`);
    // Đứng riêng ("đổi ra cm", "bao nhiêu kg?") — chỉ đơn vị 2 chữ, không trùng chữ tiếng Việt.
    if (abbr.length > 1)
      t = t.replace(new RegExp(`(?<![\\p{L}\\d])${abbr}([²³]?)(?![\\p{L}\\d])`, 'gu'), (_, p) => `${word}${POWER[p] ?? ''}`);
    // Đơn vị 1 chữ đứng riêng giữa các dấu ngăn ("km → m → dm", "đo bằng m,").
    else t = t.replace(new RegExp(`(^|[,→;:]\\s*|bằng\\s+)${abbr}(?=\\s*(?:[,→;.)]|$))`, 'gu'), (_, pre) => `${pre}${word}`);
  }
  return t;
}

/** "1/4 số dầu" → "1 phần 4"; "25/2 thứ Hai", "từ 25/2 đến 3/3" → "25 tháng 2" (ngày tháng). */
function readSlashes(text: string) {
  return text.replace(/(^|[^\d/])(\d{1,2})\/(\d{1,2})(?![\d/])/gu, (all, pre: string, a: string, b: string, offset: number, src: string) => {
    const before = src.slice(Math.max(0, offset - 8), offset + pre.length).toLowerCase();
    const after = src.slice(offset + all.length, offset + all.length + 12).toLowerCase();
    const isDate =
      /(ngày|từ|đến|tới|sáng|chiều|hôm)\s*$/.test(before) ||
      /^\s*(thứ|chủ nhật|là thứ)/.test(after) ||
      (Number(a) >= Number(b) && Number(b) <= 12 && Number(a) <= 31);
    return isDate ? `${pre}${a} tháng ${b}` : `${pre}${a} phần ${b}`;
  });
}

/**
 * Chuyển chữ trên màn hình thành câu đọc được cho giọng đọc: đồng hồ → giờ, phép tính → chữ,
 * đơn vị viết tắt / phân số / ngày tháng → chữ, ô trống → "mấy", emoji → tên ("🐰" → "con thỏ", "🍎🍎🍎" → "3 quả táo").
 */
export function speechText(text: string): string {
  const asksCount = /bao nhiêu|mấy|đếm/i.test(text);
  return (
    // Đơn vị trong ngoặc ngay sau tên đầy đủ ("mi-li-lít (ml)") không đọc lại.
    readUnits(readSlashes(text.replace(/\s*\((?:mm|cm|dm|km|kg|ml|m|g|l)\)/g, '')))
      // Xuống dòng = hết câu (đọc ngắt nghỉ, không dính sang câu sau).
      // (dòng sau viết thường thì chỉ là câu dài xuống dòng → nối bằng dấu cách).
      .replace(/([^\s.,!?:;])[ \t]*\n+(?=\s*[\p{Lu}\d\p{Extended_Pictographic}])/gu, '$1. ')
      .replace(/\n+/g, ' ')
      // "3 ✖ 4" là phép nhân; ✖ đứng riêng là dấu gạch chéo (đánh dấu ô).
      .replace(/(\d)\s*✖\uFE0F?\s*(?=\d)/g, '$1 nhân ')
      .replace(emojiRegex(), (ch, offset: number, src: string) => clockWords(ch) ?? emojiWords(ch, offset, src))
      .replace(/(\d)\s*→\s*(?=\d)/g, '$1 thành ')
      // Ký hiệu không phải emoji nhưng có tên trong bảng (✘ ✓ → ← ↑ ↓ ↔ ☐).
      .replace(/[✘✓→←↑↓↔☐]/g, (ch, offset: number, src: string) => {
        if (ch !== '→') return emojiWords(ch, offset, src);
        // "→" nối hai hình (đã thành ⟦…⟧) đọc "rồi đến"; giữa hai chữ ("hôm qua → hôm nay") chỉ là ngắt nghỉ.
        const near = src.slice(Math.max(0, offset - 3), offset) + src.slice(offset + 1, offset + 4);
        return near.includes('⟦') || near.includes('⟧') ? '⟦sang⟧' : ', ';
      })
      // Dãy emoji giống nhau → đếm ("🍎🍎🍎" → "3 quả táo"); các emoji khác nhau cách bằng dấu phẩy.
      // Đề hỏi số lượng ("mấy", "bao nhiêu", "đếm") thì chỉ đọc tên một lần — để bé tự nhìn đếm.
      .replace(/⟦([^⟧]+)⟧(?:\s*⟦\1⟧)+/g, (run, name: string) =>
        asksCount ? `⟦${name}⟧` : `⟦${run.split('⟦').length - 1} ${name}⟧`,
      )
      // "?" ngay sau dãy hình ("🔴🔵🔵 ?") là hỏi hình tiếp theo.
      .replace(/⟧\s*\?\s*⟦/g, '⟧, ô trống, ⟦')
      .replace(/⟧\s*\?/g, '⟧, tiếp theo là gì?')
      // Mũi tên giữa hai hình ("🏠 → 🏪") đọc là "rồi đến".
      .replace(/⟧\s*⟦sang⟧\s*⟦/g, ' rồi đến ')
      .replace(/⟧\s*⟦/g, ', ')
      .replace(/[⟦⟧]/g, ' ')
      // 7:15 → 7 giờ 15 (phép chia luôn viết có dấu cách: "12 : 3")
      // Số viết tách hàng nghìn ("10 000", "2 500 000") đọc liền một số.
      .replace(/\b\d{1,3}(?: \d{3})+\b/g, (n) => n.replace(/ /g, ''))
      .replace(/\b(\d{1,2}):(\d{2})\b/g, (_, h, m) => (m === '00' ? `${h} giờ` : `${h} giờ ${Number(m)}`))
      .replace(/\s:\s/g, ' chia ')
      .replace(/[×✕]/g, ' nhân ')
      .replace(/÷/g, ' chia ')
      .replace(/dấu \?/g, 'dấu hỏi')
      // "?" là ô trống: "chỗ ?" → "chỗ trống"; đứng riêng trong dãy ("2, 4, ?, 10") → "mấy".
      .replace(/chỗ \?/g, 'chỗ trống')
      .replace(/số \?/g, 'số mấy')
      .replace(/([Ôô]) \?/g, '$1 dấu hỏi')
      .replace(/(\d|\))\s\?\s(?=\d|\()/g, '$1 ô trống ')
      // (chỉ khi "?" đứng sau dấu phẩy / đầu câu / ngoặc — không nhầm với dấu hỏi cuối câu "…táo đỏ 🍎?").
      .replace(/(^|,\s*|[(:]\s*)\?(?=\s*[,)]|\s+\d|\s*$)/g, '$1 mấy ')
      .replace(/\+/g, ' cộng ')
      // Gạch ngang "–" giữa hai chữ ("đi – về") chỉ là ngắt nghỉ; dấu trừ "−" đứng riêng mới đọc "trừ".
      .replace(/(\p{L})\s*–\s*(?=\p{L})/gu, '$1, ')
      .replace(/(^|\s)−(?=\s|$|[?.,!])/g, '$1trừ')
      .replace(/(^|\s)[−–](?=\d)/g, '$1trừ ')
      .replace(/(\d|\?|\))\s*[−–-]\s*(?=\d|\?|\()/g, '$1 trừ ')
      .replace(/≥/g, ' lớn hơn hoặc bằng ')
      .replace(/≤/g, ' bé hơn hoặc bằng ')
      .replace(/≠/g, ' khác ')
      .replace(/>/g, ' lớn hơn ')
      .replace(/</g, ' bé hơn ')
      .replace(/=/g, ' bằng ')
      // "…" cuối dãy chỉ là ngắt nghỉ; ô trống ___ □ đọc là "mấy", dấu ? giữa hai vế so sánh là "ô trống"
      .replace(/(\d|mét|gam|lít|giờ|phút|đồng|ngày)\s*(?:\.{3,}|…)\s*(?=\d)/g, '$1 ô trống ')
      .replace(/(?:\.{3,}|…)\s*(?=\p{Lu})/gu, '. ')
      .replace(/\.{3,}|…/g, ' ')
      .replace(/_{2,}/g, ' mấy ')
      .replace(/[□☐⬜▢]/g, ' ô trống ')
      .replace(/bằng\s+ô trống/g, 'bằng mấy')
      .replace(/bằng\s*\?/g, 'bằng mấy')
      .replace(/(cộng|trừ|nhân|chia)\s+\?/g, '$1 mấy')
      .replace(/\?\s*(?=cộng|trừ|nhân|chia|bằng)/g, 'mấy ')
      .replace(/[*#|~^`→←↑↓]/g, ' ')
      .replace(/•/g, '. ')
      .replace(/([.!?]["”])\s*\./g, '$1')
      // Hai dấu câu liền nhau: giữ dấu đầu ("?" không bị nuốt), riêng ", ." thành ".".
      .replace(/,\s*\./g, '.')
      .replace(/([.!?;:])\s*[,.]+/g, '$1')
      .replace(/,\s*,+/g, ',')
      .replace(/\s+\)/g, ')')
      .replace(/\(\s+/g, '(')
      .replace(/^[\s.,;:]+/, '')
      .replace(/\s+([,.!?;:])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Lời đọc đề của một câu: đề + (câu điền chỗ trống) câu cần điền, chỗ trống đọc "chỗ trống".
 */
export function questionSpeech(q: { speak?: string; prompt?: string; type?: string; sentence?: string }): string {
  const parts = [q.speak ?? q.prompt ?? ''];
  if (!q.speak && q.type === 'fill_blank' && q.sentence) parts.push(q.sentence.replace(/\[\[.*?\]\]/g, ' chỗ trống '));
  return speechText(parts.filter(Boolean).join('\n'));
}
