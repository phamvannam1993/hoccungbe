/* Soát ĐỦ/THIẾU giọng đọc của khoá toán IQ — hỏi đúng câu trang web sẽ hỏi.
 *
 * Đếm số dòng trong CSDL chỉ nói được "có bao nhiêu", không nói được "có ĐÚNG
 * những cái cần không". Hai lần trước kho đầy tệp mà trang vẫn đọc giọng máy, vì
 * khoá tra lệch: đếm thì đẹp, tra thì trượt.
 *
 * Nên bản soát này dựng lại y hệt chuỗi trang web đi (questionSpeech → speechText
 * → splitForSpeech → preprocessTTS) rồi hỏi `POST /tts/cached-map` — đúng cái
 * trang web hỏi. Thiếu mẩu nào nó chỉ ra mẩu ấy.
 *
 *   npx tsx scripts/soat-audio-iq.ts          # soát ngay
 *   npx tsx scripts/soat-audio-iq.ts --cho    # chờ sinh xong rồi mới soát
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { preprocessTTS } from '../app/components/edu/utils/ttsText';
import { questionSpeech, speechText } from '../app/khoa-hoc-iq/lib/speech';
import { splitForSpeech } from '../app/khoa-hoc-iq/lib/sound';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');
const THU_MUC = join(GOC, 'app/khoa-hoc-iq/data/lessons');
const API = process.env.API_URL || 'http://localhost:3002/api';
const CO_LO = 500;
const NHAN = 'khoa-hoc-iq';

type Cau = Record<string, unknown>;

function canDoc(): string[] {
  const nguyen: string[] = [];
  for (const ten of readdirSync(THU_MUC).filter((f) => f.endsWith('.json')).sort()) {
    const j = JSON.parse(readFileSync(join(THU_MUC, ten), 'utf8'));
    for (const bai of j.lessons ?? []) {
      for (const q of (bai.questions ?? []) as Cau[]) {
        const de = questionSpeech(q as never);
        if (de.trim()) nguyen.push(de);
        const m = typeof q.method === 'string' ? q.method : '';
        if (m.trim()) nguyen.push(speechText(m));
      }
    }
  }
  const mau = nguyen.flatMap((t) => splitForSpeech(t)).map((m) => preprocessTTS(m));
  return [...new Set(mau.map((t) => t.trim()).filter(Boolean))];
}

async function soat(chu: string[]): Promise<string[]> {
  const thieu: string[] = [];
  for (let i = 0; i < chu.length; i += CO_LO) {
    const lo = chu.slice(i, i + CO_LO);
    const r = await fetch(`${API}/tts/cached-map`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: lo }),
    });
    if (!r.ok) throw new Error(`cached-map lỗi HTTP ${r.status}`);
    const co = (await r.json()) as Record<string, string>;
    for (const t of lo) if (!co[t]) thieu.push(t);
  }
  return thieu;
}

async function chay(): Promise<void> {
  const chu = canDoc();
  console.log(`  trang web cần : ${chu.length} mẩu`);

  let hetHan = process.argv.includes('--cho');
  if (hetHan) {
    /* Chờ bằng CHÍNH số mẩu còn thiếu, không phải bằng số dòng trong bảng.
     * Đứng yên 5 lần đếm liên tiếp thì dừng — im lặng và đang chạy nhìn giống hệt nhau. */
    /* Hạn vòng lặp phải RỘNG hơn thời gian sinh, không thì hết hạn giữa chừng và
     * báo "còn thiếu 204" y như lúc hỏng — hai cảnh khác hẳn nhau mà nhìn giống nhau.
     * Hết hạn thì nói rõ là hết hạn. */
    let truoc = -1, yen = 0;
    for (let i = 0; i < 360; i++) {
      const t = (await soat(chu)).length;
      if (t === 0) { hetHan = false; break; }
      if (t === truoc) { if (++yen >= 5) { hetHan = false; console.log(`  … ĐỨNG YÊN ở thiếu ${t} — máy chủ có vẻ đã ngừng sinh.`); break; } }
      else { yen = 0; console.log(`  … còn thiếu ${t}`); }
      truoc = t;
      await new Promise((r) => setTimeout(r, 20_000));
    }
  }

  if (process.argv.includes('--sinh-thieu')) {
    /* Gửi lại ĐÚNG những mẩu còn thiếu, không gửi lại cả 3.544.
     * Mẩu đã có thì máy chủ bỏ qua, nhưng gửi lại tất cả thì không phân biệt được
     * "lần này thành công" với "vốn đã có từ trước". */
    const con = await soat(chu);
    console.log(`  gửi lại ${con.length} mẩu còn thiếu…`);
    for (let i = 0; i < con.length; i += 300) {
      const r = await fetch(`${API}/tts/generate-texts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: con.slice(i, i + 300), nhan: NHAN }),
      });
      console.log(`   lô ${Math.min(i + 300, con.length)}/${con.length} · HTTP ${r.status}`);
    }
  }

  const thieu = await soat(chu);
  if (process.argv.includes('--cho') && hetHan) console.log('\n  ! HẾT HẠN CHỜ, việc sinh có thể vẫn đang chạy.');
  console.log(`\n  đã có        : ${chu.length - thieu.length}/${chu.length}`);
  console.log(`  còn thiếu    : ${thieu.length}`);
  for (const t of thieu.slice(0, 12)) console.log(`   ✗ ${JSON.stringify(t).slice(0, 88)}`);
  if (thieu.length > 12) console.log(`   … và ${thieu.length - 12} mẩu nữa`);
  if (thieu.length) process.exitCode = 1;
}

void chay();
