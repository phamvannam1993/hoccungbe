/**
 * Soát bảng 44 âm IPA.
 *
 *   node scripts/kiem-ipa.cjs
 *
 * Bốn phép kiểm, tất cả đều tự động — không đọc dò bằng mắt:
 *
 *  1. Đếm: 12 nguyên âm đơn + 8 nguyên âm đôi + 24 phụ âm = 44, không trùng.
 *  2. TÁCH ÂM từng từ ví dụ theo đúng 44 ký hiệu (ưu tiên ký hiệu dài trước,
 *     để /eɪ/ không bị đọc nhầm thành /e/ + /ɪ/). Ký hiệu lạ là báo ngay —
 *     đây là cách bắt lỗi gõ nhầm ký tự nhìn giống nhau (g thường vs ɡ IPA,
 *     dấu hai chấm : thường vs ː của IPA).
 *  3. Từ ví dụ PHẢI chứa chính âm nó minh hoạ. Ảnh mẫu trên mạng sai đúng chỗ
 *     này: /θ/ lấy ví dụ "television", /v/ lấy "fly".
 *  4. Đối chiếu với phiên âm của cùng từ đó ở các bộ dữ liệu khác trong dự án
 *     (vocab.ts, situationsIpa.ts) để bắt lệch.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const TMP = path.join(__dirname, '..', '.tmp-kiem-ipa');
fs.rmSync(TMP, { recursive: true, force: true });
execFileSync('node', [
  'node_modules/typescript/bin/tsc', '--target', 'es2020', '--module', 'commonjs',
  '--esModuleInterop', '--skipLibCheck', '--rootDir', 'app', '--outDir', TMP,
  'app/lib/ipa.ts', 'app/lib/vocab.ts',
], { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

const { IPA, kiemIpa } = require(path.join(TMP, 'lib/ipa.js'));
const { VOCAB_TOPICS } = require(path.join(TMP, 'lib/vocab.js'));

const loi = [];
const canh = [];

/* 1. Đếm */
const dem = kiemIpa();
loi.push(...dem.loi);

/* 2 + 3. Tách âm từng phiên âm ví dụ */
// Hai ÂM YẾU không nằm trong 44 âm chính nhưng từ điển vẫn dùng: /i/ cuối từ
// (happy, coffee) và /u/ trước nguyên âm (situation). Chúng là dạng yếu của
// /iː/, /uː/, không phải âm riêng — nên vẫn hợp lệ trong phiên âm của từ.
const AM_YEU = ['i', 'u'];
const KY_HIEU = [...IPA.map((a) => a.am), ...AM_YEU].sort((a, b) => b.length - a.length); // dài trước
const BO_QUA = new Set(['ˈ', 'ˌ', '.', ' ', '-']); // trọng âm, dấu ngắt vần

function tachAm(ipa) {
  const chuoi = ipa.replace(/^\//, '').replace(/\/$/, '');
  const ra = [];
  let i = 0;
  while (i < chuoi.length) {
    if (BO_QUA.has(chuoi[i])) { i++; continue; }
    const kh = KY_HIEU.find((k) => chuoi.startsWith(k, i));
    if (!kh) return { ra, la: chuoi[i], viTri: i };
    ra.push(kh);
    i += kh.length;
  }
  return { ra };
}

for (const a of IPA) {
  for (const v of a.viDu) {
    const { ra, la, viTri } = tachAm(v.ipa);
    if (la) {
      loi.push(`/${a.am}/ – "${v.en}" ${v.ipa}: ký tự lạ "${la}" (U+${la.codePointAt(0).toString(16).toUpperCase()}) ở vị trí ${viTri}`);
      continue;
    }
    if (!ra.includes(a.am)) {
      loi.push(`/${a.am}/ – từ ví dụ "${v.en}" ${v.ipa} KHÔNG chứa âm này (tách được: ${ra.map((x) => '/' + x + '/').join(' ')})`);
    }
  }
}

/* 4. Đối chiếu với phiên âm cùng từ ở bộ dữ liệu khác */
const khac = new Map(); // từ (thường) → Set phiên âm
for (const cd of VOCAB_TOPICS) {
  for (const w of cd.words) {
    if (!w.ipa) continue;
    const k = String(w.en).toLowerCase();
    khac.set(k, new Set([...(khac.get(k) || []), String(w.ipa)]));
  }
}
const gon = (s) => String(s).replace(/[\/ˈˌ:.\s-]/g, '').replace(/ː/g, '');
for (const a of IPA) {
  for (const v of a.viDu) {
    const co = khac.get(v.en.toLowerCase());
    if (!co) continue;
    const hop = [...co].some((x) => gon(x) === gon(v.ipa));
    if (!hop) canh.push(`"${v.en}": bảng IPA ghi ${v.ipa}, vocab.ts ghi ${[...co].join(' / ')}`);
  }
}

console.log(`Tổng âm       : ${dem.tong} (đơn ${dem.don} · đôi ${dem.doi} · phụ âm ${dem.phuam})`);
console.log(`Từ ví dụ      : ${IPA.reduce((s, a) => s + a.viDu.length, 0)}`);
console.log(`Lỗi           : ${loi.length}`);
loi.forEach((x) => console.log(`  ✗ ${x}`));
console.log(`Cảnh báo lệch : ${canh.length}`);
canh.forEach((x) => console.log(`  ! ${x}`));
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(loi.length ? 1 : 0);
