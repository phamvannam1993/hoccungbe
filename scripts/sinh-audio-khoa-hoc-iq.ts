/* Sinh giọng đọc cho khoá học toán IQ (`/khoa-hoc-iq`): câu hỏi và gợi ý cách làm.
 *
 * GỌI THẲNG HÀM CỦA TRANG WEB, KHÔNG CHÉP TAY.
 *
 * Bản `.mjs` trước chép tay logic cắt mẩu rồi gửi `prompt` thô. Lệch ba lần liên
 * tiếp trong một buổi, vì trang web đọc qua BA tầng mà bản chép chỉ đuổi theo được
 * một hai tầng:
 *
 *     questionSpeech(q)   ưu tiên trường `speak`, không phải `prompt`
 *       speechText(…)     đọc đơn vị, dấu chéo, emoji, mũi tên, đếm vật
 *         splitForSpeech  cắt mẩu ≤180 ký tự, GỘP câu ngắn lại
 *           preprocessTTS chuẩn hoá cuối, `cacheKey` tính từ đây
 *
 * `cacheKey` tính từ kết quả của cả chuỗi ấy, nên lệch một tầng là audio sinh ra
 * không bao giờ được tra thấy — kho đầy tệp mà trang vẫn đọc giọng máy.
 *
 * Nay script nhập đúng ba hàm ấy. Trang đổi luật đọc thì script đi theo, không cần
 * ai nhớ sửa hai nơi.
 *
 *   npx tsx scripts/sinh-audio-khoa-hoc-iq.ts            # đếm, không gửi
 *   npx tsx scripts/sinh-audio-khoa-hoc-iq.ts --gui      # gửi thật
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
const NHAN = 'khoa-hoc-iq';
/** Gửi theo lô: một thân yêu cầu chứa cả nghìn mẩu dễ vượt giới hạn body. */
const CO_LO = 300;

type Cau = Record<string, unknown>;

/* Chữ cần đọc của MỘT câu — ĐÚNG thứ trang web đọc, không hơn không kém.
 *
 *   · đề bài: `questionSpeech(q)` (nó tự chọn `speak` hay `prompt`)
 *   · gợi ý : `speechText(q.method)` — hộp "GỢI Ý CÁCH LÀM" đọc đúng chuỗi này
 *
 * Thêm phạm vi đọc (phương án, lời giải) thì thêm ở ĐÂY, và nhớ trang web cũng phải
 * đọc chúng — sinh audio cho chữ trang không bao giờ hỏi là sinh rác. */
function chuCanDoc(q: Cau): string[] {
  const ra: string[] = [];
  const de = questionSpeech(q as never);
  if (de.trim()) ra.push(de);
  const method = typeof q.method === 'string' ? q.method : '';
  if (method.trim()) ra.push(speechText(method));
  return ra;
}

const tepJson = readdirSync(THU_MUC).filter((f) => f.endsWith('.json')).sort();
const nguyen: string[] = [];
const tepLoi: string[] = [];
let tongCau = 0;
let coGoiY = 0;

for (const ten of tepJson) {
  try {
    const j = JSON.parse(readFileSync(join(THU_MUC, ten), 'utf8'));
    for (const bai of j.lessons ?? []) {
      for (const q of (bai.questions ?? []) as Cau[]) {
        tongCau += 1;
        if (typeof q.method === 'string' && q.method.trim()) coGoiY += 1;
        nguyen.push(...chuCanDoc(q));
      }
    }
  } catch (e) {
    tepLoi.push(`${ten}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

/* Cắt mẩu bằng CHÍNH hàm trang web dùng, rồi chuẩn hoá từng mẩu — đúng thứ tự
 * `speak()` làm. Đổi thứ tự là khoá lệch. */
const mau = nguyen.flatMap((t) => splitForSpeech(t)).map((m) => preprocessTTS(m));
const chu = [...new Set(mau.map((t) => t.trim()).filter(Boolean))];

console.log(`  tệp đọc được : ${tepJson.length}`);
console.log(`  câu trong tệp: ${tongCau} (có gợi ý: ${coGoiY})`);
console.log(`  chuỗi cần đọc: ${nguyen.length}`);
console.log(`  cắt thành mẩu: ${mau.length}`);
console.log(`  sau bỏ trùng : ${chu.length}`);
for (const e of tepLoi) console.log(`   ! ${e}`);
console.log(`  ví dụ        : ${JSON.stringify(chu[0] ?? '').slice(0, 76)}`);

if (!process.argv.includes('--gui')) {
  console.log('\n  (chưa gửi. Chạy lại với --gui để sinh thật.)');
  process.exit(0);
}

/* Bọc trong hàm: dự án là CommonJS nên `await` ở mức tệp không dịch được. */
async function gui(): Promise<void> {
  let tong = 0;
  let daCo = 0;
  for (let i = 0; i < chu.length; i += CO_LO) {
    const lo = chu.slice(i, i + CO_LO);
    const res = await fetch(`${API}/tts/generate-texts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: lo, nhan: NHAN }),
    });
    if (!res.ok) {
      console.log(`   ! lô ${i}–${i + lo.length} lỗi HTTP ${res.status}`);
      continue;
    }
    const j = (await res.json()) as { totalTexts?: number; alreadyCached?: number };
    tong += j.totalTexts ?? 0;
    daCo += j.alreadyCached ?? 0;
    console.log(`   lô ${i + lo.length}/${chu.length} · đã gửi`);
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\n  đã gửi ${tong} mẩu · máy chủ báo có sẵn ${daCo} · cần đọc mới ${tong - daCo}`);
  console.log(`  Theo dõi ở /admin/audio-iq. Máy chủ chạy nền, tải lại trang để xem thêm.`);
}

void gui();
