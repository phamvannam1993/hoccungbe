/* Dựng mặt đồng hồ ra ảnh để NHÌN. Số chồng nhau, kim che số, kim quá ngắn —
 * những thứ này không bản kiểm nào bắt được, phải mở ảnh ra xem. */
import { renderToStaticMarkup } from 'react-dom/server';
import puppeteer from 'puppeteer-core';
import { Clock } from '../app/khoa-hoc-iq/components/Clock';

const BO: [number, number, string][] = [
  [12, 0, 'hai kim chập ở 12'], [11, 55, '11:55 – kim sát nhau'], [10, 10, '10:10'],
  [4, 35, '4:35'], [2, 43, '2:43'], [7, 30, '7:30'], [9, 15, '9:15'], [3, 0, '3:00'],
];
const o = (h: number, m: number, ten: string, sz: number) =>
  `<figure style="margin:0;text-align:center"><div>${renderToStaticMarkup(<Clock hour={h} minute={m} size={sz} />)}</div>` +
  `<figcaption style="font:600 12px sans-serif;margin-top:4px;color:#334">${ten}</figcaption></figure>`;

const html = `<!doctype html><meta charset="utf-8"><body style="margin:0;padding:20px;background:#dff1ec;font-family:sans-serif">
<div style="display:flex;flex-wrap:wrap;gap:20px">${BO.map(([h, m, t]) => o(h, m, t, 150)).join('')}</div>
<p style="font:700 13px sans-serif;margin:22px 0 8px">cỡ nhỏ trong ô đáp án (48) và cỡ gọn (88)</p>
<div style="display:flex;align-items:center;gap:18px">${BO.slice(0, 5).map(([h, m, t]) => o(h, m, t, 48)).join('')}
${BO.slice(0, 3).map(([h, m, t]) => o(h, m, t, 88)).join('')}</div></body>`;

(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const p = await b.newPage();
  await p.setViewport({ width: 1180, height: 560, deviceScaleFactor: 2 });
  await p.setContent(html);
  await p.screenshot({ path: process.argv[2], fullPage: true });
  await b.close();
  console.log('  đã vẽ ' + process.argv[2]);
})();
