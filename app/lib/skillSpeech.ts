// Chuẩn bị văn bản cho giọng đọc ở phần luyện kỹ năng.
//
// Một câu hỏi thường TRỘN hai thứ tiếng: 'Từ "window" nghĩa là gì?'. Đọc cả câu
// bằng giọng Việt thì từ tiếng Anh sai bét, mà đọc cả câu bằng giọng Anh thì
// phần tiếng Việt cũng hỏng. Vì vậy phải cắt câu thành từng đoạn kèm nhãn ngôn
// ngữ rồi phát nối tiếp.

export type SpeechPart = { text: string; lang: 'en' | 'vi' };

/** Ký tự ngoài bảng ASCII ⇒ chắc chắn là tiếng Việt (có dấu). */
const hasNonAscii = (s: string) => /[^\x00-\x7F]/.test(s);

/**
 * Đổi ký hiệu toán sang chữ đọc được (chỉ dùng cho đoạn TIẾNG VIỆT).
 * Máy đọc bỏ qua hoặc đọc sai "=", "×", "5/8" nên phải diễn giải thành lời.
 */
export function forSpeechVi(text: string): string {
  return text
    .replace(/\[b\d+\]/g, ' chỗ trống ')
    .replace(/_{2,}/g, ' chỗ trống ')
    .replace(/☐/g, ' ô trống ')
    .replace(/(\d)\s*\/\s*(\d)/g, '$1 phần $2')
    .replace(/(\d)\s*%/g, '$1 phần trăm')
    .replace(/cm²/g, 'xăng-ti-mét vuông')
    .replace(/cm³/g, 'xăng-ti-mét khối')
    .replace(/×/g, ' nhân ')
    .replace(/÷/g, ' chia ')
    .replace(/−/g, ' trừ ')
    .replace(/(\d)\s*-\s*(\d)/g, '$1 trừ $2')
    .replace(/(\d)\s*\+\s*(\d)/g, '$1 cộng $2')
    // Dấu ":" vừa là phép chia vừa là dấu hai chấm tiếng Việt. Phép chia luôn có
    // khoảng trắng CẢ HAI bên ("36 : 4"), dấu câu thì không ("Cộng 14 với 2: …").
    .replace(/(\d) : (\d)/g, '$1 chia $2')
    .replace(/ \+ /g, ' cộng ')
    .replace(/ - /g, ' trừ ')
    .replace(/→/g, ' thành ')
    .replace(/=\s*\?/g, ' bằng bao nhiêu?')
    .replace(/=/g, ' bằng ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Chỗ trống trong câu tiếng Anh đọc là "blank". */
function forSpeechEn(text: string): string {
  return text.replace(/_{2,}/g, ' blank ').replace(/\s+/g, ' ').trim();
}

// Từ chức năng tiếng Anh — dùng làm DẤU HIỆU nhận biết một cụm là tiếng Anh.
// Cần thiết vì tiếng Việt có rất nhiều từ không dấu ("Anh", "em", "trong",
// "cho", "la") — cứ thấy chữ ASCII mà coi là tiếng Anh thì đọc sai hàng loạt.
const EN_MARKERS = new Set([
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those',
  'is', 'are', 'am', 'was', 'were', 'be', 'do', 'does', 'did', 'have', 'has', 'can', 'may',
  'a', 'an', 'the', 'my', 'your', 'his', 'her', 'their', 'our',
  'what', 'how', 'who', 'where', 'when', 'why', 'which',
  'and', 'or', 'not', 'yes', 'no', 'please', 'thank', 'thanks', 'sorry',
  'good', 'nice', 'well', 'see', 'let', 'come', 'go', 'like', 'love', 'open',
  'on', 'in', 'at', 'of', 'to', 'from', 'with', 'many', 'old', 'name', 'meet',
]);

const words = (s: string) => s.toLowerCase().match(/[a-z']+/g) ?? [];

/** Một cụm ngoài ngoặc kép chỉ được coi là tiếng Anh khi đủ tin cậy. */
function looksEnglish(chunk: string): boolean {
  if (hasNonAscii(chunk)) return false;
  const w = words(chunk);
  // Ít nhất hai từ, và phải có một từ chức năng tiếng Anh làm dấu hiệu.
  return w.length >= 2 && w.some((x) => EN_MARKERS.has(x));
}

/**
 * Cắt câu thành các đoạn kèm ngôn ngữ.
 *
 * Chỉ bật nhận diện tiếng Anh cho KỸ NĂNG TIẾNG ANH. Ở môn Toán và Tiếng Việt
 * không có nội dung tiếng Anh, mà lại có những cụm trong ngoặc kép toàn chữ
 * không dấu như "Ai?" — bật lên là đọc sai.
 */
export function splitForSpeech(text: string, englishSkill = false): SpeechPart[] {
  const parts: SpeechPart[] = [];
  const push = (raw: string, lang: 'en' | 'vi') => {
    const t = lang === 'en' ? forSpeechEn(raw) : forSpeechVi(raw);
    // Đoạn chỉ còn dấu câu thì gắn vào đoạn trước để giữ ngữ điệu, không bỏ hẳn
    // — bỏ thì '"s": "banana"' bị nối thành "s banana".
    if (!t) return;
    if (!/[\p{L}\p{N}]/u.test(t)) {
      const prev = parts[parts.length - 1];
      if (prev) prev.text += t;
      return;
    }
    const last = parts[parts.length - 1];
    if (last && last.lang === lang) last.text = `${last.text} ${t}`.trim();
    else parts.push({ text: t, lang });
  };

  if (!englishSkill) {
    push(text, 'vi');
    return parts;
  }

  // Tách theo ngoặc kép trước: 'Số nhiều của "candy" là:'.
  // CHỈ dùng ngoặc kép — dấu nháy đơn nằm ngay trong từ tiếng Anh ("Let's",
  // "don't"), nhận nhầm là dấu đóng ngoặc thì cắt câu sai bét.
  const quoted = /["“]([^"”]+)["”]/g;
  let cursor = 0;
  let m: RegExpExecArray | null;
  while ((m = quoted.exec(text))) {
    pushChunk(text.slice(cursor, m.index));
    const inner = m[1];
    if (!hasNonAscii(inner) && /[A-Za-z]/.test(inner)) push(inner, 'en');
    else push(inner, 'vi');
    cursor = m.index + m[0].length;
  }
  pushChunk(text.slice(cursor));

  // Ngoài ngoặc kép: cắt theo dấu câu, cụm nào "trông như tiếng Anh" mới đọc Anh.
  // Dấu câu được GẮN LẠI vào cuối cụm trước nó để giữ ngữ điệu khi đọc.
  function pushChunk(chunk: string) {
    if (!chunk.trim()) return;
    const pieces = chunk.split(/([,;:.!?]+)/);
    for (let i = 0; i < pieces.length; i += 2) {
      const seg = pieces[i];
      const punct = pieces[i + 1] ?? '';
      if (!seg.trim() && !punct.trim()) continue;
      // Cụm rỗng nhưng có dấu câu (vd ": " giữa hai cụm tiếng Anh): vẫn đẩy vào
      // để dấu câu bám lại đoạn trước, nếu không '"s": "banana"' nối thành "s banana".
      if (!seg.trim()) { push(punct, 'vi'); continue; }
      push(seg + punct, looksEnglish(seg) ? 'en' : 'vi');
    }
  }

  return parts;
}

/** Kỹ năng thuộc môn tiếng Anh (mã kết thúc bằng "-en"). */
export const isEnglishSkill = (code: string) => /-en$/.test(code);
