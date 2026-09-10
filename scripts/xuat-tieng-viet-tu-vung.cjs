/**
 * Xuất danh sách MỌI ĐOẠN TIẾNG VIỆT mà trang từ vựng sẽ đọc thành tiếng.
 *   node scripts/xuat-tieng-viet-tu-vung.cjs /tmp/tu-vung-vi.json
 *
 * Chỉ lấy phần TIẾNG VIỆT. Phần tiếng Anh (từ, câu ví dụ) đọc bằng giọng Anh
 * qua /api/tts?tl=en, không đi qua máy chủ giọng đọc tiếng Việt.
 *
 * Danh sách phải TRÙNG KHÍT với chuỗi trang web gửi đi lúc chạy, nếu không khoá
 * cache lệch và trang lại rơi về giọng cũ. Vì vậy script lấy thẳng dữ liệu từ
 * `vocab.ts` (đã biên dịch) chứ không tự gõ lại.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RA = process.argv[2] || '/tmp/tu-vung-vi.json';
// --chu-de <slug>: chỉ lấy một chủ đề. Dùng để chạy thử trước khi sinh cả kho.
const iCd = process.argv.indexOf('--chu-de');
// Nhận nhiều slug, ngăn bằng dấu phẩy: --chu-de chao-hoi,dong-vat
const CHI_CHU_DE = iCd > -1 ? process.argv[iCd + 1].split(',').map((x) => x.trim()) : null;
const TMP = path.join(__dirname, '..', '.tmp-vi');

fs.rmSync(TMP, { recursive: true, force: true });
execFileSync('node', [
  'node_modules/typescript/bin/tsc', '--target', 'es2020', '--module', 'commonjs',
  '--esModuleInterop', '--skipLibCheck', '--outDir', TMP,
  // Cố định gốc là 'app' để đường dẫn sau khi dịch luôn là lib/… và
  // components/…, không đổi mỗi khi thêm bớt file nguồn.
  '--rootDir', 'app',
  'app/lib/vocab.ts', 'app/lib/vongTuVung.ts', 'app/lib/truyenNghe.ts', 'app/lib/docTuVung.ts',
  'app/components/edu/data/englishVocabularyData.ts',
], { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

const { VOCAB_TOPICS } = require(path.join(TMP, 'lib/vocab.js'));
const { TRUYEN_NGHE } = require(path.join(TMP, 'lib/truyenNghe.js'));
const { docNghiaDs } = require(path.join(TMP, 'lib/docTuVung.js'));
// Bộ từ riêng của trang Từ vựng tiếng Anh / Thẻ ghi nhớ — tách khỏi vocab.ts,
// quên nó là thẻ ghi nhớ đọc bằng giọng cũ trong khi các trang khác đã đổi.
const { englishVocabularyData } = require(path.join(TMP, 'components/edu/data/englishVocabularyData.js'));

const doan = new Set();
const them = (t) => { if (t && String(t).trim()) doan.add(String(t).trim()); };

for (const cd of VOCAB_TOPICS) {
  if (CHI_CHU_DE && !CHI_CHU_DE.includes(cd.slug)) continue;
  // Bấm vào lõi vòng tròn đọc tên chủ đề.
  them(cd.heading);
  for (const w of cd.words) {
    // Nghĩa nhiều vế được ĐỌC RỜI TỪNG VẾ trên trang, nên phải sinh audio cho
    // từng vế; sinh cả chuỗi "chú, bác, cậu" thì không đời nào tra tới.
    for (const nghia of docNghiaDs(w.vi)) them(nghia);
    them(w.exampleVi);     // nút nghe câu ví dụ đọc tiếp bản dịch
  }
}

// Thẻ ghi nhớ + trang Từ vựng tiếng Anh: đọc nghĩa ở mặt sau thẻ.
for (const w of CHI_CHU_DE ? [] : englishVocabularyData) {
  for (const nghia of docNghiaDs(w.meaning)) them(nghia);
}

// Trang nghe truyện: bản dịch từng câu và bản dịch câu hỏi.
for (const t of CHI_CHU_DE ? [] : TRUYEN_NGHE) {
  for (const c of t.cau) them(c.vi);
  for (const h of t.hoi) them(h.hoiVi);
}

// Tách hai nhóm vì mỗi nhóm phải sinh bằng một giọng khác nhau.
//
// Giọng nhái (VieNeu) đọc một tiếng trơ trọi ra rác — đo lại 10 tiếng thì cả
// 10 lần đều không thành tiếng nói, chỉ 0,2–0,4 giây ù ù. Nhóm một tiếng phải
// sinh bằng giọng Microsoft: chạy script sinh với
//     TTS_LOCAL_URL=http://localhost:8000/api/tts/danh-van TTS_RATE=-10
// Mặc định script này xuất nhóm NHIỀU TIẾNG; thêm --mot-tieng để xuất nhóm kia.
const CHI_MOT_TIENG = process.argv.includes('--mot-tieng');
const nhieuTieng = (t) => t.trim().split(/\s+/).length >= 2;
const giu = CHI_MOT_TIENG ? (t) => !nhieuTieng(t) : nhieuTieng;

const boQua = [...doan].filter((t) => !giu(t));
const ds = [...doan].filter(giu).sort((a, b) => a.localeCompare(b, 'vi'));
fs.writeFileSync(RA, JSON.stringify(ds, null, 2));
fs.rmSync(TMP, { recursive: true, force: true });

console.log(`Chủ đề        : ${VOCAB_TOPICS.length}`);
console.log(`Truyện        : ${TRUYEN_NGHE.length}`);
console.log(`Đoạn tiếng Việt khác nhau: ${doan.size}`);
console.log(`  → xuất ra (${CHI_MOT_TIENG ? '1 tiếng, giọng Microsoft' : '≥ 2 tiếng, giọng nhái'}) : ${ds.length}`);
console.log(`  → nhóm còn lại                    : ${boQua.length}`);
console.log(`\n✓ Đã ghi ra ${RA}`);
console.log('Vài ví dụ:');
for (const t of ds.slice(0, 8)) console.log(`   "${t}"`);
