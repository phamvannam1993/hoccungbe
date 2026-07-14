import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:'new', args:['--no-sandbox'] });
const p = await b.newPage();
// khách hoàn toàn mới: xóa hết
await p.goto('http://localhost:3000/', { waitUntil:'domcontentloaded' });
await p.evaluate(()=>{ localStorage.clear(); sessionStorage.clear(); });
await p.setViewport({ width:1200, height:900, deviceScaleFactor:1 });
await p.goto('http://localhost:3000/hoc-hom-nay', { waitUntil:'networkidle0' });
await new Promise(r=>setTimeout(r,1600));
const shown = await p.evaluate(()=>!!document.body.innerText.match(/bắt đầu hành trình học tập/));
console.log('modal auto-shown?', shown);
await p.screenshot({ path:'/tmp/modal.png', fullPage:false });
await b.close();
