/**
 * Soát bộ "Luyện viết chữ đẹp":
 *   node scripts/kiem-luyen-viet.cjs
 *
 * Phiếu này IN RA GIẤY nên sai là tốn giấy mực thật: trang tràn khổ A4, nét vẽ
 * chạy ra ngoài khung, chữ g/y/p/q bị cắt mất đuôi. Vì vậy soát toàn bộ dữ
 * liệu trước khi dựng trang.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const TMP = path.join(__dirname, '..', '.tmp-kiem-viet');
fs.rmSync(TMP, { recursive: true, force: true });
execFileSync('node', [
  'node_modules/typescript/bin/tsc', '--target', 'es2020', '--module', 'commonjs',
  '--esModuleInterop', '--skipLibCheck', '--rootDir', 'app', '--outDir', TMP,
  'app/lib/luyenViet.ts',
], { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

const { kiemLuyenViet, CAC_BO, taoTrang } = require(path.join(TMP, 'lib/luyenViet.js'));

const r = kiemLuyenViet();
console.log('LUYỆN VIẾT CHỮ ĐẸP');
for (const b of CAC_BO) {
  console.log(`  ${b.slug.padEnd(14)} ${String(taoTrang(b.slug).length).padStart(3)} trang  ${b.ten}`);
}
console.log(`  ${'TỔNG'.padEnd(14)} ${String(r.tongTrang).padStart(3)} trang A4`);
fs.rmSync(TMP, { recursive: true, force: true });

if (r.loi.length) {
  console.log(`\n✗ ${r.loi.length} lỗi:`);
  for (const l of r.loi) console.log('   -', l);
  process.exit(1);
}
console.log('\n✓ Không có lỗi.');
