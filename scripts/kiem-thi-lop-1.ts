// Kiểm bộ tờ đề /thi-lop-1: biên dịch toàn bộ (giai.ts ném lỗi nếu phép tính âm / nhiều nghiệm / không giải được),
// rồi soát slug trùng, tranh thiếu file, bài không có ô nào, điểm vượt thang.
// Chạy: npx tsx scripts/kiem-thi-lop-1.ts
import { existsSync } from 'node:fs';
import { THI_LOP_1 } from '../app/thi-lop-1/de';

let loi = 0;
const bao = (m: string) => {
  loi++;
  console.error('✗', m);
};
const slugs = new Set<string>();
for (const p of THI_LOP_1) {
  if (slugs.has(p.slug)) bao(`slug trùng: ${p.slug}`);
  slugs.add(p.slug);
  const json = JSON.stringify(p.bai);
  for (const m of json.matchAll(/"(?:img|src)":"([^"]+)"/g)) if (!existsSync(`public/thi-lop-1/${m[1]}.webp`)) bao(`${p.slug}: thiếu tranh ${m[1]}`);
  const max = p.bai.reduce((s, b) => s + b.diem, 0);
  if (max > 10.001) bao(`${p.slug}: tổng điểm ${max} > 10`);
  p.bai.forEach((b, i) => {
    if (b.diem > 0 && !Object.values(p.blanks).some((x) => x.bai === i)) bao(`${p.slug} ${b.title}: có điểm mà không có ô nào`);
  });
  console.log(`✓ ${p.slug} — ${p.bai.length} bài, ${p.soO} ô, ${max} điểm`);
}
console.log(`\n${THI_LOP_1.length} tờ đề`);
if (loi) {
  console.error(`${loi} lỗi`);
  process.exit(1);
}
