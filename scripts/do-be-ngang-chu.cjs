/**
 * Đo BỀ NGANG THẬT của từng ký tự trong font chữ mẫu (đơn vị em), rồi in ra
 * JSON để dựng lại app/lib/luyenVietBeNgang.ts.
 *
 *   npm run dev                      # cần máy chủ dev đang chạy
 *   node scripts/do-be-ngang-chu.cjs > /tmp/rong.json
 *
 * CẦN Node 22 trở lên (dùng WebSocket có sẵn của Node để nói chuyện với Chrome).
 *
 * Chạy lại script này mỗi khi ĐỔI FONT CHỮ MẪU. Không đo mà ước lượng trung
 * bình thì câu dài tràn ra ngoài mép giấy — đã gặp đúng lỗi đó.
 */
const { spawn } = require('child_process');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9335;
const p = spawn(CHROME, [`--remote-debugging-port=${PORT}`, '--headless=new', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  await sleep(3500);
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  const ws = new WebSocket(list.find((x) => x.type === 'page').webSocketDebuggerUrl);
  let id = 0; const w = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (w.has(m.id)) { w.get(m.id)(m); w.delete(m.id); } };
  await new Promise((r) => (ws.onopen = r));
  const send = (method, params) => new Promise((r) => { const i = ++id; w.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:3000/luyen-viet-chu-dep/cau-ngan' });
  await sleep(6000);
  const r = await send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(async () => {
    await document.fonts.ready;
    const cvs = document.createElement('canvas'); const cx = cvs.getContext('2d');
    cx.font = '100px ' + getComputedStyle(document.documentElement).getPropertyValue('--font-chu-mau') + ', sans-serif';
    const chars = new Set([' ', '.', ',', "'", '’', '-']);
    for (const el of document.querySelectorAll('.trang-viet text')) for (const c of el.textContent) chars.add(c);
    const base = 'aăâbcdđeêghiklmnoôơpqrstuưvxy0123456789';
    for (const c of base) { chars.add(c); chars.add(c.toUpperCase()); }
    for (const d of 'àáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ') { chars.add(d); chars.add(d.toUpperCase()); }
    const out = {};
    for (const c of chars) out[c] = Math.round(cx.measureText(c).width) / 100;
    return { n: Object.keys(out).length, out, font: cx.font };
  })()` });
  const v = r.result?.result?.value;
  console.log(JSON.stringify(v.out));
  console.error('đo', v.n, 'ký tự bằng', v.font);
  ws.close(); p.kill();
})();
