import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']});
const p=await b.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,90)));
await p.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:2});
await p.goto('http://localhost:3000/',{waitUntil:'domcontentloaded'});
await p.evaluate(()=>{localStorage.setItem('bhh_child_id','1');
 localStorage.setItem('bhh_local_children',JSON.stringify([{id:1,fullName:'Minh',gender:'male',currentLevel:'1'}]));});
await p.goto('http://localhost:3000/toan-lop-1-bai-7/toan-lop-1-bai-7-de.html?ex=1',{waitUntil:'networkidle2'});
await new Promise(r=>setTimeout(r,4500));
// tìm câu Đúng/Sai về hình
let hit=null;
for(let i=1;i<=10;i++){
  await p.evaluate((n)=>{const el=[...document.querySelectorAll('button')].filter(b=>b.textContent.trim()===String(n)&&b.getBoundingClientRect().width<=40);if(el[0])el[0].click();},i);
  await new Promise(r=>setTimeout(r,650));
  const info=await p.evaluate(()=>{
    const t=document.body.innerText;
    const q=(t.match(/(Tam giác|Hình tròn|Hình vuông|Hình chữ nhật)[^\n]*(góc|cạnh)[^\n]*(Đúng hay sai)/)||[])[0];
    const card=[...document.querySelectorAll('div')].find(d=>d.className.includes('px-6')&&d.querySelector('p'));
    const illos=[...document.querySelectorAll('svg')].filter(s=>{const bb=s.getBoundingClientRect();return bb.width>70&&bb.height>70;});
    return {q, soHinhMinhHoa: illos.length};
  });
  if(info.q){ hit={cau:i, ...info}; break; }
}
console.log('câu Đúng/Sai:', hit?hit.q:'(không thấy trong ex1)');
console.log('số hình minh họa vẽ:', hit?hit.soHinhMinhHoa:'-');
console.log('Lỗi JS:', errs.length?errs:'không');
if(hit) await p.screenshot({path:'/tmp/truefalse.png',clip:{x:0,y:280,width:390,height:520}});
await b.close();
