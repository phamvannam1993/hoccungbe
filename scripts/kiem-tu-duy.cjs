/**
 * Soát ngân hàng câu hỏi Toán tư duy.
 *   node scripts/kiem-tu-duy.cjs
 *
 * Kiểm những thứ ĐỌC BẰNG MẮT rất dễ bỏ sót:
 *   • id trùng nhau (chép câu này rồi sửa thành câu khác mà quên đổi id);
 *   • đáp án đúng nằm ngoài danh sách lựa chọn;
 *   • bốn lựa chọn bị trùng nhau;
 *   • thiếu lời giải hoặc bản đọc cho máy phát âm;
 *   • câu hỏi trùng nội dung với câu khác trong cùng lớp;
 *   • đáp án đúng luôn nằm ở cùng một vị trí (bé đoán mò cũng trúng).
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const TMP = path.join(__dirname, '..', '.tmp-kiem-tu-duy');
fs.rmSync(TMP, { recursive: true, force: true });
execFileSync('node', [
  'node_modules/typescript/bin/tsc', '--target', 'es2020', '--module', 'commonjs',
  '--esModuleInterop', '--skipLibCheck', '--outDir', TMP,
  'app/toan-tu-duy/data.ts',
], { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

const { TOAN_TU_DUY, GRADES } = require(path.join(TMP, 'data.js'));

const loi = [];
const canh = [];
const idDaThay = new Set();

for (const lop of GRADES) {
  const g = TOAN_TU_DUY[lop];
  const ds = g.questions;
  const viTriDung = {};

  for (const q of ds) {
    const noi = (m) => loi.push(`Lớp ${lop} – ${q.id}: ${m}`);
    if (idDaThay.has(q.id)) noi('id bị trùng');
    idDaThay.add(q.id);

    if (!Array.isArray(q.options) || q.options.length !== 4) noi(`có ${q.options?.length} lựa chọn thay vì 4`);
    if (new Set(q.options).size !== q.options.length) noi('các lựa chọn bị trùng nhau');
    if (!(q.correct_index >= 0 && q.correct_index < q.options.length)) noi(`correct_index ${q.correct_index} nằm ngoài danh sách`);
    if (!q.explanation || q.explanation.length < 20) noi('lời giải quá ngắn hoặc thiếu');
    if (!q.question_speech) noi('thiếu bản đọc câu hỏi');
    if (!q.explanation_speech) noi('thiếu bản đọc lời giải');
    // Bản đọc không được còn ký hiệu toán: máy đọc "−" thành "gạch ngang".
    if (/[+−×÷=]/.test(q.question_speech || '')) canh.push(`Lớp ${lop} – ${q.id}: bản đọc câu hỏi còn ký hiệu toán`);
    viTriDung[q.correct_index] = (viTriDung[q.correct_index] || 0) + 1;
  }

  // Trùng nội dung trong cùng lớp
  const thay = new Map();
  for (const q of ds) {
    const khoa = q.question.replace(/\s+/g, ' ').trim().toLowerCase();
    if (thay.has(khoa)) loi.push(`Lớp ${lop}: hai câu trùng nội dung (${thay.get(khoa)} và ${q.id})`);
    thay.set(khoa, q.id);
  }

  const nhieuNhat = Math.max(...Object.values(viTriDung));
  if (nhieuNhat > ds.length * 0.75) {
    canh.push(`Lớp ${lop}: ${nhieuNhat}/${ds.length} câu có đáp án đúng ở cùng một vị trí — trang tự xáo đáp án lúc hiển thị, nhưng nên trộn sẵn cho chắc`);
  }
  console.log(`Lớp ${lop}: ${ds.length} câu · ${g.topics.length} chủ đề · ${g.faq.length} câu hỏi thường gặp`);
}

console.log(`\nTổng số câu : ${GRADES.reduce((s, l) => s + TOAN_TU_DUY[l].questions.length, 0)}`);
console.log(`Lỗi         : ${loi.length}`);
loi.forEach((x) => console.log(`  ✗ ${x}`));
console.log(`Cảnh báo    : ${canh.length}`);
canh.forEach((x) => console.log(`  ! ${x}`));
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(loi.length ? 1 : 0);
