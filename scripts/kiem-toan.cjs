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
  'app/lib/dongHo.ts', 'app/lib/phanSo.ts', 'app/lib/soDoDoanThang.ts', 'app/lib/datTinh.ts', 'app/lib/datTinhChia.ts', 'app/lib/tienViet.ts', 'app/lib/bangCongTru.ts', 'app/lib/doLuong.ts', 'app/lib/hinhHoc.ts', 'app/lib/chuViDienTich.ts', 'app/lib/bieuDo.ts', 'app/lib/timX.ts', 'app/lib/soThapPhan.ts',
], { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

const { kiemDongHo } = require(path.join(TMP, 'lib/dongHo.js'));
const { kiemPhanSo } = require(path.join(TMP, 'lib/phanSo.js'));
const { kiemSoDo } = require(path.join(TMP, 'lib/soDoDoanThang.js'));
const { kiemDatTinh } = require(path.join(TMP, 'lib/datTinh.js'));
const { kiemTien } = require(path.join(TMP, 'lib/tienViet.js'));
const { kiemChia } = require(path.join(TMP, 'lib/datTinhChia.js'));
const { kiemBangCongTru } = require(path.join(TMP, 'lib/bangCongTru.js'));
const { kiemDoLuong } = require(path.join(TMP, 'lib/doLuong.js'));
const { kiemHinhHoc } = require(path.join(TMP, 'lib/hinhHoc.js'));
const { kiemChuViDienTich } = require(path.join(TMP, 'lib/chuViDienTich.js'));
const { kiemBieuDo } = require(path.join(TMP, 'lib/bieuDo.js'));
const { kiemTimX } = require(path.join(TMP, 'lib/timX.js'));
const { kiemSoThapPhan } = require(path.join(TMP, 'lib/soThapPhan.js'));

let tongLoi = 0;
for (const [ten, kiem] of [['Xem đồng hồ', kiemDongHo], ['Phân số', kiemPhanSo], ['Sơ đồ đoạn thẳng', kiemSoDo], ['Đặt tính cột dọc', kiemDatTinh], ['Chia cột dọc', kiemChia], ['Tiền Việt Nam', kiemTien], ['Bảng cộng trừ', kiemBangCongTru], ['Đo lường', kiemDoLuong], ['Hình học', kiemHinhHoc], ['Chu vi & diện tích', kiemChuViDienTich], ['Biểu đồ', kiemBieuDo], ['Tìm x', kiemTimX], ['Số thập phân', kiemSoThapPhan]]) {
  const { loi } = kiem();
  tongLoi += loi.length;
  console.log(`${ten.padEnd(14)}: ${loi.length ? `${loi.length} lỗi` : 'không lỗi'}`);
  loi.forEach((x) => console.log(`  ✗ ${x}`));
}
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(tongLoi ? 1 : 0);
