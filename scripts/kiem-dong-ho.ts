/* Đối chiếu ĐỒNG HỒ VẼ với ĐÁP ÁN của chính câu hỏi.
 *
 * Giờ đồng hồ nằm trong JSON dưới dạng chuỗi "4:35". Gõ nhầm thành "4:53" thì
 * hình vẫn vẽ ra một chiếc đồng hồ rất đẹp, chỉ sai giờ — và không ai nhìn ra,
 * vì muốn biết đúng sai phải tự đọc mặt đồng hồ rồi so với đáp án.
 *
 * Nên để máy so: lấy giờ vẽ ra, lấy đáp án đúng, hai cái phải khớp.
 *
 *   npx tsx scripts/kiem-dong-ho.ts
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseTime, taKim } from '../app/khoa-hoc-iq/components/Clock';

const THU_MUC = join(__dirname, '../app/khoa-hoc-iq/data/lessons');

/** "4 giờ 35 phút" / "9 giờ" / "15" → số phút tính từ 12 giờ, hoặc null. */
function docDap(s: string): { hour: number; minute: number } | null {
  const m = /^\s*(\d{1,2})\s*giờ(?:\s*(\d{1,2})\s*phút)?\s*$/u.exec(s);
  return m ? { hour: Number(m[1]), minute: Number(m[2] ?? 0) } : null;
}

type Cau = Record<string, unknown>;
const loi: string[] = [];
let daSoat = 0;

for (const tep of readdirSync(THU_MUC).filter((f) => f.endsWith('.json')).sort()) {
  const j = JSON.parse(readFileSync(join(THU_MUC, tep), 'utf8'));
  for (const bai of j.lessons ?? []) {
    for (const q of (bai.questions ?? []) as Cau[]) {
      const v = q.visual as { clock?: string[] } | undefined;
      if (!v?.clock) continue;
      const chuoi: string[] = v.clock;
      if (chuoi.length !== 1) continue;       // nhiều đồng hồ: không có một đáp án đơn

      const t = parseTime(chuoi[0]);
      if (!t) { loi.push(`${q.id}: không đọc được giờ ${JSON.stringify(chuoi[0])}`); continue; }

      let dung: { hour: number; minute: number } | null = null;
      if (q.type === 'choice' && Array.isArray(q.options) && typeof q.answer === 'number') {
        const o = (q.options as { text?: string }[])[q.answer];
        dung = docDap(String(o?.text ?? ''));
      } else if (q.type === 'input' && Array.isArray(q.answers)) {
        const so = Number(q.answers[0]);
        if (Number.isFinite(so)) {
          dung = /bao nhiêu phút/iu.test(String(q.prompt))
            ? { hour: t.hour, minute: so }     // đề hỏi riêng số phút
            : { hour: so, minute: 0 };
        }
      }
      if (!dung) continue;                     // dạng khác: không so tự động được

      daSoat++;
      if (dung.hour % 12 !== t.hour % 12 || dung.minute !== t.minute) {
        loi.push(
          `${tep} · ${q.id}: hình vẽ ${t.hour}:${String(t.minute).padStart(2, '0')}` +
          ` nhưng đáp án là ${dung.hour}:${String(dung.minute).padStart(2, '0')}`,
        );
      } else {
        console.log(`  ✓ ${q.id}: ${taKim(t.hour, t.minute)}`);
      }
    }
  }
}

console.log(`\n  đã soát ${daSoat} đồng hồ · lỗi ${loi.length}`);
for (const e of loi) console.log(`   ✗ ${e}`);
if (loi.length) process.exit(1);
