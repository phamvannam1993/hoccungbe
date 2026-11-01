/* eslint-disable @next/next/no-img-element -- ảnh câu hỏi (URL ngoài) trong bản in */
// Bộ đề ôn thi học kỳ 1 để in: bìa, từng đề một trang mới, phần đáp án + lời giải ở cuối.
// Dựng ở server; khi chưa mua chỉ dựng Đề 1 của môn đầu, không kèm đáp án.

import { SUBJECT_LABEL, type Pack } from '../packs';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const GROUPS = ['giua-hk1', 'cuoi-hk1'] as const;
const GROUP_LABEL: Record<string, string> = { 'giua-hk1': 'Giữa học kỳ 1', 'cuoi-hk1': 'Cuối học kỳ 1' };

type Exam = { id: number; title: string; subject: string; grade: number; semester: number; examGroup: string | null; orderIndex: number | null; timeLimitMinutes: number | null; totalPoints: number; isActive: boolean };
type Option = { key: string; text: string; imageUrl?: string | null };
type Question = { id: number; questionText: string; optionsJson: Option[] | string[] | Record<string, string> | null; correctAnswerJson: unknown; explanation: string | null; questionImageUrl: string | null; sortOrder: number };
type Loaded = Exam & { questions: Question[] };

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}/api${path}`, { next: { revalidate: 3600 } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

/** Các đề HK1 của gói, theo môn → giữa kỳ → cuối kỳ → số đề. */
async function loadExams(pack: Pack, onlyFirst: boolean): Promise<Loaded[]> {
  const out: Exam[] = [];
  for (const subject of pack.subjects ?? []) {
    const list = (await getJson<Exam[]>(`/exams?grade=${pack.grade}&subject=${subject}`)) ?? [];
    const hk1 = list
      .filter((e) => e.isActive && e.semester === 1 && GROUPS.includes(e.examGroup as (typeof GROUPS)[number]))
      .sort((a, b) => GROUPS.indexOf(a.examGroup as never) - GROUPS.indexOf(b.examGroup as never) || (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    out.push(...hk1);
    if (onlyFirst && out.length) break;
  }
  const chosen = onlyFirst ? out.slice(0, 1) : out;
  const qs = await Promise.all(chosen.map((e) => getJson<Question[]>(`/exams/${e.id}/questions`)));
  return chosen.map((e, i) => ({ ...e, questions: (qs[i] ?? []).sort((a, b) => a.sortOrder - b.sortOrder) }));
}

const LETTERS = 'ABCDEFGH';

/**
 * Đáp án lưu theo 3 kiểu (dữ liệu nhập ở nhiều đợt): [{key,text}] + "B" · ["Thứ Hai", …] + ["Thứ Ba"] ·
 * {"A": "71", …} + "C". Đưa hết về [{key,text}] với key A, B, C…
 */
function optionsOf(q: Question): Option[] {
  const o = q.optionsJson;
  if (Array.isArray(o))
    return o.map((x, i) => (typeof x === 'string' ? { key: LETTERS[i], text: x } : { key: String(x.key), text: String(x.text ?? ''), imageUrl: x.imageUrl }));
  if (o && typeof o === 'object') return Object.entries(o).map(([key, text]) => ({ key, text: String(text) }));
  return [];
}

/** Vị trí các phương án đúng (đáp án lưu theo key hoặc theo text; phương án ảnh có text rỗng). */
function correctIndexes(q: Question, opts: Option[]): Set<number> {
  const raw = q.correctAnswerJson;
  const out = new Set<number>();
  for (const v of Array.isArray(raw) ? raw : [raw]) {
    const s = String(v ?? '');
    let i = opts.findIndex((o) => o.key === s);
    if (i < 0 && s) i = opts.findIndex((o) => o.text === s);
    if (i >= 0) out.add(i);
  }
  return out;
}

// PRNG có hạt giống (mulberry32): cùng câu hỏi → cùng thứ tự mỗi lần in.
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Phương án nhắc tới phương án khác / vị trí ("Cả hai…", "Tất cả…", "A và B") → không xáo. */
const POSITIONAL = /cả hai|tất cả|cả ba|đều đúng|đều sai|không có|các ý trên|ý trên|đáp án trên|\b[A-D] và [A-D]\b|all of|none of|both/i;

/**
 * Đề gốc dồn đáp án đúng vào A/B (D gần như không bao giờ đúng) → bé đoán mò cũng được điểm.
 * Bản in xáo thứ tự phương án theo id câu hỏi rồi đánh lại A, B, C…; đề làm online không đổi.
 */
function printable(q: Question): { options: Option[]; answer: string } {
  const opts = optionsOf(q);
  const right = correctIndexes(q, opts);
  let order = opts.map((o, i) => ({ ...o, at: i }));
  if (opts.length > 1 && !opts.some((o) => POSITIONAL.test(o.text))) {
    const rnd = seeded(q.id);
    order = [...order];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  }
  const options = order.map((o, i) => ({ key: LETTERS[i] ?? o.key, text: o.text, imageUrl: o.imageUrl, at: o.at }));
  const keys = options.filter((o) => right.has(o.at)).map((o) => o.key);
  return { options, answer: keys.length ? keys.join(', ') : String(q.correctAnswerJson ?? '') };
}
const shortTitle = (e: Exam) => e.title.replace(/\s*\(có đáp án\)\s*$/i, '');

export default async function ExamBook({ pack, unlocked, locked }: { pack: Pack; unlocked: boolean; locked: React.ReactNode }) {
  const exams = await loadExams(pack, !unlocked);
  const total = exams.reduce((n, e) => n + e.questions.length, 0);

  return (
    <div className="ps mx-auto max-w-[794px] px-4 print:px-0">
      {/* Bìa */}
      <section className="page mt-6 flex aspect-[210/297] flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 p-10 text-center text-white shadow-xl print:mt-0">
        <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-white/80">Bé Hay Học</p>
        <h1 className="mt-4 text-4xl font-black leading-tight">{pack.title}</h1>
        <p className="mt-4 max-w-md text-lg text-white/90">{pack.subtitle}</p>
        <div className="mt-8 rounded-2xl bg-white/15 px-6 py-4 text-left text-base font-bold">
          {(pack.subjects ?? []).map((s) => (
            <p key={s}>✏️ {SUBJECT_LABEL[s]}: 5 đề giữa kỳ + 5 đề cuối kỳ</p>
          ))}
        </div>
        <p className="mt-10 text-sm text-white/80">Họ và tên: ................................................ Lớp: ..........</p>
      </section>

      {!unlocked && <div className="no-print mt-6">{locked}</div>}

      {exams.map((e, ei) => (
        <section key={e.id} className="page mt-6 rounded-3xl bg-white p-8 shadow print:mt-0 print:rounded-none print:p-0">
          <header className="keep flex items-start justify-between gap-4 border-b-2 border-slate-800 pb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {SUBJECT_LABEL[e.subject]} · Lớp {e.grade} · {GROUP_LABEL[e.examGroup ?? ''] ?? 'Học kỳ 1'}
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-900">{shortTitle(e)}</h2>
              <p className="mt-1 text-sm text-slate-600">
                Thời gian: {e.timeLimitMinutes ?? 40} phút · {e.questions.length} câu · Khoanh vào chữ cái trước câu trả lời đúng.
              </p>
            </div>
            <div className="shrink-0 rounded-xl border-2 border-slate-800 px-4 py-2 text-center">
              <p className="text-xs font-bold text-slate-500">Điểm</p>
              <p className="h-8 w-16" />
            </div>
          </header>
          <p className="mt-3 text-sm text-slate-700">Họ và tên: ........................................................ Lớp: ..........</p>
          <ol className="mt-4 space-y-4">
            {e.questions.map((q, qi) => (
              <li key={q.id} className="q-item">
                <p className="whitespace-pre-line font-bold text-slate-900">
                  Câu {qi + 1}. {q.questionText}
                </p>
                {q.questionImageUrl && <img src={q.questionImageUrl} alt="" className="mt-2 max-h-48 rounded-lg" />}
                <div className="mt-1.5 flex flex-wrap gap-x-10 gap-y-1 pl-4 text-slate-800">
                  {printable(q).options.map((o) => (
                    <p key={o.key} className="flex items-center gap-1.5">
                      <b>{o.key}.</b> {o.text}
                      {o.imageUrl && <img src={o.imageUrl} alt="" className="inline-block h-20 w-auto rounded" />}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          {ei === 0 && !unlocked && <p className="no-print mt-6 text-center text-sm font-bold text-amber-700">— Hết bản xem thử —</p>}
        </section>
      ))}

      {/* Đáp án + lời giải */}
      {unlocked && exams.length > 0 && (
        <section className="page mt-6 rounded-3xl bg-white p-8 shadow print:mt-0 print:rounded-none print:p-0">
          <h2 className="border-b-2 border-slate-800 pb-2 text-2xl font-black text-slate-900">Đáp án và lời giải</h2>
          <p className="mt-1 text-sm text-slate-500">
            {exams.length} đề · {total} câu. Bố mẹ có thể in riêng phần này để chấm cho bé.
          </p>
          {exams.map((e) => (
            <div key={e.id} className="keep mt-5">
              <h3 className="font-black text-slate-800">{shortTitle(e)}</h3>
              <ol className="mt-1 grid gap-x-6 gap-y-0.5 text-sm text-slate-700 sm:grid-cols-2 print:grid-cols-2">
                {e.questions.map((q, qi) => (
                  <li key={q.id}>
                    <b>Câu {qi + 1}: {printable(q).answer}</b>
                    {q.explanation ? <span className="text-slate-500"> — {q.explanation}</span> : null}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
