/**
 * Soát luật sinh đề của các công cụ Toán mới: Xem đồng hồ và Phân số.
 *   node scripts/kiem-toan.cjs
 *
 * Hai bộ luật này sinh đề NGẪU NHIÊN nên ngồi thử tay không bao giờ gặp hết
 * các trường hợp. Mỗi lớp chạy 2.000 lượt, kiểm đúng những thứ đã từng sai:
 * "7 giờ 60 phút", "12 giờ đúng thiếu đáp án nhiễu", "tử lớn hơn mẫu",
 * "1/2 chỉ tạo được 2 đáp án nhiễu".
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const TMP = path.join(__dirname, '..', '.tmp-kiem-toan');
fs.rmSync(TMP, { recursive: true, force: true });
execFileSync('node', [
  'node_modules/typescript/bin/tsc', '--target', 'es2020', '--module', 'commonjs',
  '--esModuleInterop', '--skipLibCheck', '--rootDir', 'app', '--outDir', TMP,
  'app/lib/dongHo.ts', 'app/lib/phanSo.ts', 'app/lib/soDoDoanThang.ts', 'app/lib/datTinh.ts', 'app/lib/tienViet.ts', 'app/lib/bangCongTru.ts',
], { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

const { kiemDongHo } = require(path.join(TMP, 'lib/dongHo.js'));
const { kiemPhanSo } = require(path.join(TMP, 'lib/phanSo.js'));
const { kiemSoDo } = require(path.join(TMP, 'lib/soDoDoanThang.js'));
const { kiemDatTinh } = require(path.join(TMP, 'lib/datTinh.js'));
const { kiemTien } = require(path.join(TMP, 'lib/tienViet.js'));
const { kiemBangCongTru } = require(path.join(TMP, 'lib/bangCongTru.js'));

let tongLoi = 0;
for (const [ten, kiem] of [['Xem đồng hồ', kiemDongHo], ['Phân số', kiemPhanSo], ['Sơ đồ đoạn thẳng', kiemSoDo], ['Đặt tính cột dọc', kiemDatTinh], ['Tiền Việt Nam', kiemTien], ['Bảng cộng trừ', kiemBangCongTru]]) {
  const { loi } = kiem();
  tongLoi += loi.length;
  console.log(`${ten.padEnd(14)}: ${loi.length ? `${loi.length} lỗi` : 'không lỗi'}`);
  loi.forEach((x) => console.log(`  ✗ ${x}`));
}
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(tongLoi ? 1 : 0);
