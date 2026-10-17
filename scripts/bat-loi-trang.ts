/* Mở một trang bằng Chrome thật rồi in mọi lời console và lỗi của trang.
 *
 * Dùng khi gặp lỗi chỉ hiện trong trình duyệt — hydration mismatch chẳng hạn.
 * Lời báo của React bị cắt cụt trong terminal thì không biết thuộc tính nào lệch,
 * mà phần quan trọng nhất lại nằm ở cuối: khối so sánh server/client. Script này
 * in nguyên văn, nên tìm ra ngay chỗ lệch thay vì đoán.
 *
 *   npx tsx scripts/bat-loi-trang.ts 'http://localhost:3001/khoa-hoc-iq/...'
 */
import puppeteer from 'puppeteer-core';

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.argv[2];
if (!URL) { console.error('  Thiếu địa chỉ trang.'); process.exit(1); }

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const p = await b.newPage();
  p.on('console', (m) => console.log(`[${m.type()}] ${m.text()}`));
  p.on('pageerror', (e) => console.log(`[pageerror] ${e instanceof Error ? e.message : String(e)}`));
  const r = await p.goto(URL, { waitUntil: 'networkidle2', timeout: 90_000 });
  console.log(`  HTTP ${r?.status()} · tiêu đề: ${await p.title()}`);
  /* Chờ thêm: hydrate xong mới báo lỗi, networkidle2 chưa chắc đã tới đó. */
  await new Promise((x) => setTimeout(x, 4000));
  await b.close();
})();
