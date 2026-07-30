// Tiền xử lý văn bản trước khi đọc (TTS) — dùng CHUNG cho trang làm bài tập
// (QuizPlayPage) và trò chơi, để giọng đọc & cách đọc hoàn toàn giống nhau:
// đổi số sang chữ Việt, đọc phân số "a phần b", ô trống [bN] → "mấy", ký hiệu
// toán → chữ (cộng/trừ/nhân/chia/bằng/lớn hơn/bé hơn…).

const VI_NUMBERS: Record<number, string> = {
  0: 'không', 1: 'một', 2: 'hai', 3: 'ba', 4: 'bốn', 5: 'năm',
  6: 'sáu', 7: 'bảy', 8: 'tám', 9: 'chín', 10: 'mười',
  11: 'mười một', 12: 'mười hai', 13: 'mười ba', 14: 'mười bốn', 15: 'mười lăm',
  16: 'mười sáu', 17: 'mười bảy', 18: 'mười tám', 19: 'mười chín', 20: 'hai mươi',
};

export function numToVi(n: number): string {
  if (VI_NUMBERS[n] !== undefined) return VI_NUMBERS[n];
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    const tensWord = ['', '', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'][tens];
    const onesWord = ones === 0 ? '' : ones === 5 ? ' lăm' : ones === 1 ? ' mốt' : ' ' + VI_NUMBERS[ones];
    return `${tensWord} mươi${onesWord}`;
  }
  return String(n);
}

export function preprocessTTS(text: string): string {
  return text
    .replace(/[\u{1F000}-\u{1FFFF}|\u{2600}-\u{27BF}|\u{1F300}-\u{1F9FF}|\u{FE00}-\u{FE0F}|\u{200D}]/gu, '')
    // Gộp số ngăn cách hàng nghìn bằng dấu cách: "1 000" → "1000", "12 500" → "12500"
    // (để TTS đọc trọn số, không tách thành dãy rời rạc).
    .replace(/(\d)[\s ]+(?=\d{3}(?:[^\d]|$))/g, '$1')
    // Số thập phân dấu phẩy (không có dấu cách): "2,5" → "2 phẩy 5".
    .replace(/(\d),(\d)/g, '$1 phẩy $2')
    // Phân số "a/b" → "a phần b" (đặt trước khi số đổi sang chữ và trước xử lý ":").
    .replace(/(\d+)\s*\/\s*(\d+)/g, ' $1 phần $2 ')
    // "Dấu nào đúng? X _ Y" → "X lớn hơn, bé hơn hay bằng Y?"
    .replace(/[Dd]ấu\s+nào\s+đúng\?\s*(\d+)\s*_\s*(\d+)/g, (_m, a, b) =>
      `${numToVi(parseInt(a))} lớn hơn, bé hơn hay bằng ${numToVi(parseInt(b))}?`,
    )
    // fill_blank so sánh: "6 [b1] 4 (điền dấu so sánh)" → "Sáu lớn hơn, bé hơn hay bằng bốn?"
    .replace(/(\d+)\s*\[b\d+\]\s*(\d+)\s*\(điền dấu so sánh\)/gi, (_m, a, b) =>
      `${numToVi(parseInt(a))} lớn hơn, bé hơn hay bằng ${numToVi(parseInt(b))}?`,
    )
    // Dãy số có ô trống [bN]: "5 [b1] 3 [b2] 1" → "năm, mấy, ba, mấy, một".
    .replace(/(?:\d+|\[b\d+\])(?:\s+(?:\d+|\[b\d+\]))+/g, (m) =>
      m.trim().split(/\s+/).map((t) => (/^\[b\d+\]$/.test(t) ? 'mấy' : numToVi(parseInt(t)))).join(', '),
    )
    // Câu kết thúc "?" mà còn [bN] cuối → ô nhập, không đọc.
    .replace(/\?\s*\[b\d+\]\s*[.．]?\s*$/u, '?')
    .replace(/\[b\d+\]/g, 'mấy')
    // "Điền dấu: 2+5 [?] 10-2" → "Điền dấu so sánh thích hợp…: … như thế nào so với …?"
    .replace(/[Dd]iền dấu[^:]*:\s*(.*?)\s*\[\?\]\s*([\w\d\s+\-×÷=<>]+)/g, (_m, left, right) => {
      const mathToVi = (s: string) => s
        .replace(/(?<!\d)(\d)[-−–](\d)/g, '$1 đến $2')
        .replace(/[+＋]/g, ' cộng ').replace(/[-−–]/g, ' trừ ')
        .replace(/[×✕*＊·]/g, ' nhân ').replace(/[÷]/g, ' chia ')
        .replace(/\d+/g, (n) => numToVi(parseInt(n))).trim();
      return `Điền dấu so sánh thích hợp vào chỗ trống: ${mathToVi(left)} như thế nào so với ${mathToVi(right)}?`;
    })
    .replace(/\[\?\]/g, 'như thế nào so với')
    .replace(/_{2,}/g, 'mấy')
    .replace(/_/g, 'mấy')
    .replace(/\?/g, '')
    .replace(/(?<!\d)(\d)[-−–](\d)/g, '$1 đến $2')
    .replace(/[+＋]/g, ' cộng ')
    .replace(/[-−–]/g, ' trừ ')
    .replace(/[×✕*＊·]/g, ' nhân ')
    // Dấu chia toán: "x : 6" / "12 : 3" → "chia" (chỉ khi ":" có space 2 bên, không phải nhãn).
    .replace(/(?<=\w)\s+:\s+(?=\w)/g, ' chia ')
    .replace(/(\d)\s*:\s*(\d)/g, '$1 chia $2')
    .replace(/[÷]/g, ' chia ')
    .replace(/=/g, ' bằng ')
    .replace(/</g, ' nhỏ hơn ')
    .replace(/>/g, ' lớn hơn ')
    .replace(/≤/g, ' nhỏ hơn hoặc bằng ')
    .replace(/≥/g, ' lớn hơn hoặc bằng ')
    .replace(/≠/g, ' khác ')
    // ── Đơn vị đo → đọc đầy đủ tiếng Việt (đặt TRƯỚC bước đổi số sang chữ) ──
    // Vận tốc (có "/") — xử lý trước đơn vị cơ bản.
    .replace(/(?<!\p{L})km\s*\/\s*(?:giờ|h)(?!\p{L})/gu, ' ki lô mét trên giờ ')
    .replace(/(?<!\p{L})m\s*\/\s*(?:giây|s)(?!\p{L})/gu, ' mét trên giây ')
    .replace(/(?<!\p{L})m\s*\/\s*phút(?!\p{L})/gu, ' mét trên phút ')
    // Diện tích / thể tích (mũ ² ³) — xử lý trước đơn vị dài.
    .replace(/(?<!\p{L})km(?:²|2)(?!\p{L})/gu, ' ki lô mét vuông ')
    .replace(/(?<!\p{L})dm(?:²|2)(?!\p{L})/gu, ' đề xi mét vuông ')
    .replace(/(?<!\p{L})cm(?:²|2)(?!\p{L})/gu, ' xen ti mét vuông ')
    .replace(/(?<!\p{L})mm(?:²|2)(?!\p{L})/gu, ' mi li mét vuông ')
    .replace(/(?<!\p{L})m(?:²|2)(?!\p{L})/gu, ' mét vuông ')
    .replace(/(?<!\p{L})dm(?:³|3)(?!\p{L})/gu, ' đề xi mét khối ')
    .replace(/(?<!\p{L})cm(?:³|3)(?!\p{L})/gu, ' xen ti mét khối ')
    .replace(/(?<!\p{L})m(?:³|3)(?!\p{L})/gu, ' mét khối ')
    // Đơn vị cơ bản (nhiều ký tự).
    .replace(/(?<!\p{L})km(?!\p{L})/gu, ' ki lô mét ')
    .replace(/(?<!\p{L})dm(?!\p{L})/gu, ' đề xi mét ')
    .replace(/(?<!\p{L})cm(?!\p{L})/gu, ' xen ti mét ')
    .replace(/(?<!\p{L})mm(?!\p{L})/gu, ' mi li mét ')
    .replace(/(?<!\p{L})kg(?!\p{L})/gu, ' ki lô gam ')
    .replace(/(?<!\p{L})mg(?!\p{L})/gu, ' mi li gam ')
    .replace(/(?<!\p{L})ml(?!\p{L})/gu, ' mi li lít ')
    .replace(/(?<!\p{L})ha(?!\p{L})/gu, ' héc ta ')
    // Đơn vị 1 ký tự (m, g) chỉ đổi khi đứng ngay sau một chữ số.
    .replace(/(\d)\s*m(?!\p{L})/gu, '$1 mét ')
    .replace(/(\d)\s*g(?!\p{L})/gu, '$1 gam ')
    // Nhiệt độ, phần trăm.
    .replace(/°\s*C(?!\p{L})/gu, ' độ xê ')
    .replace(/°/g, ' độ ')
    .replace(/%/g, ' phần trăm ')
    .replace(/\d+/g, (m) => numToVi(parseInt(m)))
    .replace(/\s{2,}/g, ' ')
    .trim();
}
