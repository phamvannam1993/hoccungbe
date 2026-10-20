/* eslint-disable @next/next/no-img-element -- ảnh tĩnh trong bản in (bìa, linh vật) */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAccess } from '../../lib/access';
import { setIconOverrides } from '../../lib/assets';
import { getIconOverrides } from '../../lib/icons-server';
import { combos, getCourse, getLessons, grades, isFreeLesson } from '../../lib/catalog';
import PrintQuestion, { answerText } from '../../components/print/PrintQuestion';
import { withClocks } from '../../components/Clock';
import PrintToolbar from './PrintToolbar';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ bai?: string; 'dap-an'?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse((await params).slug);
  return { title: course ? `Phiếu in · ${course.title}` : 'Phiếu in', robots: { index: false, follow: false } };
}

// Khổ A4, giữ màu nền khi in, mỗi bài sang trang mới, số trang ở chân trang (Chrome hỗ trợ @page margin box).
const PRINT_CSS = `
  @page { size: A4; margin: 12mm 12mm 14mm; @bottom-right { content: "Trang " counter(page); font: 9px sans-serif; color: #94a3b8; } }
  .book, .book * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  @media print {
    .no-print { display: none !important; }
    body, .khv-root { background: #fff !important; }
    .page { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; max-width: none !important; }
    .page + .page { break-before: page; }
    .q-item, .keep { break-inside: avoid; }
  }
`;

const MASCOT = '/assets/images/01-mascot-tiger-trophy.webp';

export default async function PrintCoursePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  // Trang in dựng ở server (không qua IconOverrides của trình duyệt) → nạp ảnh admin đã thay cho emoji / icon
  // ngay tại đây, để bản in hiện đúng ảnh như trang học.
  setIconOverrides(await getIconOverrides());
  const course = getCourse(slug);
  if (!course) notFound();
  const grade = grades.find((g) => g.id === course.grade);
  const combo = combos.find((c) => c.grade === course.grade);
  const unlocked = slug in (await getAccess());
  const all = getLessons(slug);
  const allowed = all.filter((_, i) => unlocked || isFreeLesson(course, i));
  const chosen = sp.bai ? allowed.filter((l) => l.id === sp.bai) : allowed;
  const withAnswers = sp['dap-an'] === '1';
  const [c1, c2] = course.colors;
  const band = { background: `linear-gradient(120deg, ${c1}, ${c2})` };
  const whole = !sp.bai;

  return (
    <div className="book min-h-screen bg-slate-100 pb-10 print:bg-white print:pb-0">
      <style>{PRINT_CSS}</style>
      <PrintToolbar
        slug={slug}
        lessons={all.map((l, i) => ({ id: l.id, label: `Bài ${i + 1}: ${l.title}`, free: isFreeLesson(course, i) }))}
        current={sp.bai ?? null}
        withAnswers={withAnswers}
        locked={!unlocked}
      />

      {!unlocked && (
        <div className="no-print mx-auto mt-4 max-w-[794px] rounded-2xl border-4 border-amber-300 bg-amber-50 p-4 text-center">
          <p className="font-bold text-amber-900">
            Bản in thử: chỉ có Bài 1. Mua trọn {grade?.title.toLowerCase()} {combo ? `(${combo.price.toLocaleString('vi-VN')}đ)` : ''} để in đủ 5 bài của cả 12
            khóa, kèm đáp án & lời giải.
          </p>
          <Link href={`/khoa-hoc-iq/${slug}?mo-khoa=1`} className="khv-btn-buy mt-3 inline-block px-6">
            Mua trọn lớp
          </Link>
        </div>
      )}

      {/* ── Bìa ── */}
      {whole && (
        <section className="page mx-auto mt-6 flex aspect-[210/297] max-w-[794px] flex-col overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="relative flex flex-1 flex-col items-center px-10 pt-10 text-center text-white" style={band}>
            <span className="rounded-full bg-white px-5 py-1.5 text-sm font-black tracking-widest" style={{ color: c2 }}>
              TOÁN IQ · {grade?.title.toUpperCase()}
            </span>
            <p className="mt-5 text-lg font-black opacity-90">KHÓA {course.number}</p>
            <h1 className="mt-1 text-[40px] font-black leading-tight">{course.title}</h1>
            <p className="mt-2 max-w-md text-base font-semibold opacity-95">{course.subtitle}</p>
            {course.cover && (
              <img src={course.cover} alt="" className="mt-8 w-[78%] rounded-[28px] border-[6px] border-white" />
            )}
            <div className="mt-auto mb-8 flex flex-wrap justify-center gap-2 pt-6">
              {['5 bài · 50 câu', 'Có lý thuyết & mẹo', 'Có đáp án & lời giải'].map((t) => (
                <span key={t} className="rounded-full bg-white/25 px-4 py-1.5 text-sm font-black ring-2 ring-white/60">
                  ⭐ {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-6 px-10 py-7">
            <img src={MASCOT} alt="" className="h-28 w-auto" />
            <div className="flex-1 space-y-4 pb-2 text-[15px] font-bold text-slate-700">
              <p>
                Họ và tên bé: <span className="inline-block w-64 border-b-2 border-dotted border-slate-400" />
              </p>
              <p>
                Lớp: <span className="inline-block w-24 border-b-2 border-dotted border-slate-400" /> Trường:{' '}
                <span className="inline-block w-44 border-b-2 border-dotted border-slate-400" />
              </p>
            </div>
            <div className="pb-2 text-right">
              <img src="/assets/images/logo.png" alt="Bé Hay Học" className="ml-auto h-10 w-auto" />
              <p className="mt-1 text-xs font-bold text-slate-400">behayhoc.com</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Bảng thành tích ── */}
      {whole && (
        <section className="page mx-auto mt-6 max-w-[794px] rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="rounded-2xl px-5 py-3 text-center text-2xl font-black text-white" style={band}>
            🏆 BẢNG THÀNH TÍCH CỦA BÉ
          </h2>
          <p className="mt-4 text-center text-[15px] text-slate-600">Làm xong mỗi bài, bé tô màu số sao mình đạt được nhé!</p>
          <div className="mt-6 space-y-3">
            {all.map((l, i) => (
              <div key={l.id} className="keep flex items-center gap-4 rounded-2xl border-2 border-slate-100 p-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-black text-white" style={band}>
                  {i + 1}
                </span>
                <span className="flex-1 font-bold text-slate-800">{l.title}</span>
                <span className="text-3xl tracking-widest text-slate-300">☆☆☆</span>
                <span className="w-28 text-right text-sm font-bold text-slate-500">___ /10 câu</span>
              </div>
            ))}
          </div>
          <div className="keep mt-8 flex items-center gap-4 rounded-2xl bg-amber-50 p-5">
            <img src={MASCOT} alt="" className="h-20 w-auto" />
            <p className="text-[15px] leading-7 text-amber-900">
              <b>Gợi ý cho ba mẹ:</b> mỗi ngày bé làm 1 bài (khoảng 15 phút). Bé đọc phần <b>Ghi nhớ</b> trước, làm xong ba mẹ chấm bằng phần{' '}
              <b>Đáp án</b> ở cuối quyển, và cùng bé xem lời giải các câu sai.
            </p>
          </div>
        </section>
      )}

      {/* ── Các bài ── */}
      {chosen.map((lesson) => {
        const idx = all.findIndex((l) => l.id === lesson.id);
        const qs = lesson.questions.filter((q) => q.type !== 'puzzle');
        const skipped = lesson.questions.length - qs.length;
        const t = lesson.theory;
        return (
          <section key={lesson.id} className="page mx-auto mt-6 max-w-[794px] rounded-3xl bg-white p-8 shadow-xl">
            <header className="keep flex items-center gap-4 rounded-2xl px-5 py-4 text-white" style={band}>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-2xl font-black" style={{ color: c2 }}>
                {idx + 1}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-widest opacity-90">
                  Khóa {course.number} · {course.title}
                </p>
                <h2 className="text-2xl font-black leading-tight">
                  Bài {idx + 1}: {lesson.title}
                </h2>
              </div>
              <span className="ml-auto text-4xl">{withClocks(lesson.emoji, 40)}</span>
            </header>

            {t && (
              <div className="keep mt-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/70 p-4">
                <div className="flex gap-3">
                  <img src={MASCOT} alt="" className="h-16 w-auto shrink-0" />
                  <div className="text-[14px] leading-6 text-slate-700">
                    <p className="text-base font-black text-amber-700">📌 Ghi nhớ</p>
                    <p className="mt-1 whitespace-pre-line">{withClocks(t.concept, 22)}</p>
                    {t.tips[0] && (
                      <p className="mt-2 rounded-xl bg-white px-3 py-2">
                        💡 <b>Mẹo:</b> {withClocks(t.tips[0], 22)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-3">
              {qs.map((q, i) => (
                <PrintQuestion key={q.id} q={q} index={i + 1} answers={false} />
              ))}
              {skipped > 0 && <p className="text-xs italic text-slate-400">({skipped} câu ghép hình chỉ làm trên máy ở khóa học online.)</p>}
            </div>

            <footer className="keep mt-5 grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
              <div>
                Bé tự đánh giá: <span className="text-2xl tracking-widest text-slate-300">☆☆☆</span> · Đúng{' '}
                <span className="inline-block w-10 border-b-2 border-dotted border-slate-400" /> / {qs.length} câu
              </div>
              <div>
                Ba mẹ ký: <span className="inline-block w-28 border-b-2 border-dotted border-slate-400" />
              </div>
            </footer>
          </section>
        );
      })}

      {/* ── Đáp án & lời giải (cuối quyển, như sách in) ── */}
      {withAnswers && chosen.length > 0 && (
        <section className="page mx-auto mt-6 max-w-[794px] rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="rounded-2xl px-5 py-3 text-center text-2xl font-black text-white" style={band}>
            ĐÁP ÁN & LỜI GIẢI
          </h2>
          {chosen.map((lesson) => {
            const idx = all.findIndex((l) => l.id === lesson.id);
            const qs = lesson.questions.filter((q) => q.type !== 'puzzle');
            return (
              <div key={lesson.id} className="mt-5">
                <h3 className="text-lg font-black" style={{ color: c2 }}>
                  Bài {idx + 1}: {lesson.title}
                </h3>
                <ol className="mt-2 space-y-2 text-[13px] leading-5 text-slate-700">
                  {qs.map((q, i) => (
                    <li key={q.id} className="keep rounded-xl bg-emerald-50/60 px-3 py-2">
                      <b className="text-emerald-700">
                        Câu {i + 1}: {withClocks(answerText(q), 18)}
                      </b>
                      {q.explanation && <span className="whitespace-pre-line"> — {withClocks(q.explanation.split('\nLưu ý:')[0], 18)}</span>}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
