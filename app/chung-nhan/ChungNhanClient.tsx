'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listChildren, childStats, childStreak, childHistory, subjectInfo, getCurrentChildId, type Child, type Stats, type Streak, type HistoryItem } from '../lib/childData';
import KidIcon, { type IconName } from '../components/edu/KidIcon';
import { Share2, Download } from 'lucide-react';

const LEVEL_SIZE = 400;
const IMG = '/assets/images';

// Ảnh webp tĩnh trong /public/assets/images.
function Asset({ src, className, alt = '' }: { src: string; className?: string; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- ảnh tĩnh trong /public
  return <img src={`${IMG}/${src}`} alt={alt} className={className} draggable={false} />;
}

function fmtTime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (!sec) return '';
  return h ? `${h} giờ ${m} phút` : `${m} phút`;
}
function todayVN() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export default function ChungNhanClient() {
  const [child, setChild] = useState<Child | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [noChild, setNoChild] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const id = getCurrentChildId();
    if (!id) { setNoChild(true); setLoading(false); return; }
    (async () => {
      const [arr, s, st, h] = await Promise.all([
        listChildren().catch(() => [] as Child[]),
        childStats(id).catch(() => null),
        childStreak(id).catch(() => null),
        childHistory(id, 500).catch(() => [] as HistoryItem[]),
      ]);
      setChild(arr.find((c) => c.id === id) ?? null);
      setStats(s);
      setStreak(st);
      setHistory(Array.isArray(h) ? h : []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <section className="mx-auto max-w-4xl px-4 py-16 text-center text-slate-400">Đang tải chứng nhận…</section>;

  if (noChild) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-[28px] bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
          <KidIcon name="medal" className="mx-auto h-16 w-16" />
          <h2 className="mt-3 text-2xl font-black text-slate-900">Chưa có hồ sơ bé</h2>
          <p className="mx-auto mt-2 max-w-md text-slate-500">Tạo hồ sơ bé để nhận chứng nhận cho hành trình học tập — không cần đăng nhập.</p>
          <Link href="/ho-so-be" className="mt-5 inline-block rounded-full bg-[#2563eb] px-6 py-3 text-sm font-bold text-white hover:bg-[#1d4ed8]">Tạo hồ sơ bé</Link>
        </div>
      </section>
    );
  }

  // ── Số liệu suy ra ──
  const name = child?.nickname?.trim() || child?.fullName || 'Bé';
  const points = (stats?.totalCorrect ?? 0) * 10;
  const level = Math.floor(points / LEVEL_SIZE) + 1;

  const byLesson = new Map<number, HistoryItem>();
  for (const h of history) if (!byLesson.has(h.lessonId)) byLesson.set(h.lessonId, h);
  const lessons = [...byLesson.values()];
  const passed = lessons.filter((h) => (h.totalQuestions ?? 0) > 0 && (h.correctCount ?? 0) >= (h.totalQuestions ?? 0));
  const perfect = lessons.filter((h) => Number(h.score) >= 90).length;
  const distinctSubjects = new Set(history.map((h) => h.courseType ?? 'other'));

  // Môn nổi bật nhất → tên "khóa học" trên chứng nhận.
  const passBySubject = new Map<string, number>();
  for (const p of passed) passBySubject.set(p.courseType ?? 'other', (passBySubject.get(p.courseType ?? 'other') ?? 0) + 1);
  const best = [...passBySubject.entries()].sort((a, b) => b[1] - a[1])[0];
  const courseName = best ? subjectInfo(best[0]).name : 'Hành trình học tập';

  const effort = fmtTime(stats?.totalTimeSec ?? 0) || `${stats?.totalAttempts ?? 0} lượt làm bài`;
  const maxPerDay = (() => {
    const m = new Map<string, number>();
    for (const h of history) { const d = h.createdAt.slice(0, 10); m.set(d, (m.get(d) ?? 0) + 1); }
    return Math.max(0, ...m.values());
  })();
  const longest = streak?.longestStreak ?? 0;

  // ── Thành tích (KPI) ──
  const kpis: { icon: IconName; color: string; value: string; label: string; pct?: number }[] = [
    { icon: 'bookBtn', color: '#2563eb', value: `${distinctSubjects.size}`, label: 'Môn đã học' },
    { icon: 'starBtn', color: '#7c3aed', value: `${stats?.lessonsCompleted ?? 0}`, label: 'Bài đã hoàn thành', pct: Math.round(stats?.accuracy ?? 0) },
    { icon: 'target', color: '#16a34a', value: `${points}`, label: 'Điểm thưởng' },
    { icon: 'flame', color: '#f59e0b', value: `${perfect}`, label: 'Bài đạt điểm cao' },
  ];

  // ── Phần thưởng (huy hiệu đạt / chưa đạt) ──
  const tier = (v: number, t: number[]) => t.filter((x) => v >= x).length; // 0..3
  const rewards: { icon: IconName; name: string; lv: number }[] = [
    { icon: 'starBadge', name: 'Học giỏi', lv: tier(Math.round(stats?.accuracy ?? 0), [60, 80, 90]) },
    { icon: 'target', name: 'Tập trung', lv: tier(maxPerDay, [2, 3, 5]) },
    { icon: 'book', name: 'Siêng năng', lv: tier(stats?.lessonsCompleted ?? 0, [5, 15, 30]) },
    { icon: 'clock', name: 'Kiên trì', lv: tier(longest, [3, 7, 14]) },
    { icon: 'trophy', name: 'Nhà vô địch', lv: Math.min(3, Math.max(0, level - 1)) },
    { icon: 'statusGray', name: 'Khám phá thêm', lv: 0 },
  ];

  async function download() {
    const el = document.getElementById('certificate');
    if (!el || downloading) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import('html2canvas-pro');
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
      const link = document.createElement('a');
      link.download = `chung-nhan-${(name || 'be').replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // Fallback: in / lưu PDF nếu chụp ảnh lỗi.
      window.print();
    } finally {
      setDownloading(false);
    }
  }

  function share() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `${name} đã hoàn thành xuất sắc "${courseName}" (Cấp ${level}) trên Bé Hay Học! 🎉`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'Chứng nhận Bé Hay Học', text, url }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${text} ${url}`).then(() => alert('Đã sao chép nội dung chứng nhận để chia sẻ!')).catch(() => {});
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-8">
      <div className="rounded-[28px] p-3 sm:rounded-[36px] sm:p-6" style={{ background: 'linear-gradient(180deg,#eef6ff 0%,#f1f9ff 42%,#faf5ff 100%)' }}>
        {/* ── Chứng nhận (ảnh nền khung + vương miện + confetti có sẵn) ── */}
        <div
          id="certificate"
          className="relative bg-center bg-no-repeat px-[9%] pb-[7%] pt-[6%] text-center sm:px-[12%]"
          style={{ backgroundImage: `url('${IMG}/bg_chung_nhan.webp')`, backgroundSize: '100% 100%' }}
        >
          {/* Ruy băng CHỨNG NHẬN (nằm dưới vương miện của ảnh nền) */}
          <div className="relative mx-auto w-[78%] max-w-md sm:w-[62%]">
            <Asset src="03-golden-banner.webp" className="w-full" />
            <span className="absolute inset-0 flex items-center justify-center pb-[6%] text-lg font-black uppercase tracking-[0.12em] text-white drop-shadow-[0_2px_2px_rgba(180,90,0,0.5)] sm:text-3xl">
              Chứng nhận
            </span>
          </div>

          {/* Nội dung */}
          <div className="relative mt-3 grid items-center gap-1 sm:mt-4 sm:grid-cols-[auto_1fr_auto]">
            <Asset src="01-mascot-tiger-trophy.webp" className="mx-auto hidden w-28 sm:block lg:w-36" alt="Bé hổ cầm cúp" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 sm:text-sm">BeHayHoc.com xin chúc mừng</p>
              <p className="mt-1 text-2xl font-black text-[#2563eb] sm:text-4xl">{name}</p>
              <div className="mx-auto my-2 flex max-w-[18rem] items-center gap-2 sm:my-3">
                <span className="flex-1 border-t border-dashed border-amber-300" /><span className="text-amber-400">⭐</span><span className="flex-1 border-t border-dashed border-amber-300" />
              </div>
              <p className="text-xs text-slate-600 sm:text-sm">Đã hoàn thành xuất sắc khóa học</p>
              <p className="mt-0.5 text-xl font-black text-emerald-600 sm:text-2xl">{courseName}</p>
              <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">Cấp độ: <strong className="text-amber-600">Cấp {level}</strong></p>
            </div>
            <Asset src="04-medal-ribbon.webp" className="mx-auto hidden w-20 sm:block lg:w-28" alt="Huy chương" />
          </div>

          {/* Ngày + thời gian */}
          <div className="mx-auto mt-3 flex w-fit items-stretch divide-x divide-amber-200/80 rounded-2xl bg-white/60 ring-1 ring-amber-100 sm:mt-4">
            <div className="flex items-center gap-2 px-4 py-2 text-left sm:px-5 sm:py-2.5">
              <Asset src="06-calendar-icon.webp" className="h-5 w-5 sm:h-6 sm:w-6" />
              <div><div className="text-[10px] text-slate-400 sm:text-[11px]">Ngày hoàn thành</div><div className="text-xs font-bold text-slate-700 sm:text-sm">{todayVN()}</div></div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 text-left sm:px-5 sm:py-2.5">
              <Asset src="07-clock-icon.webp" className="h-5 w-5 sm:h-6 sm:w-6" />
              <div><div className="text-[10px] text-slate-400 sm:text-[11px]">Nỗ lực học tập</div><div className="text-xs font-bold text-slate-700 sm:text-sm">{effort}</div></div>
            </div>
          </div>

          {/* Chữ ký */}
          <div className="mt-3 sm:mt-4">
            <p className="text-2xl text-sky-600 sm:text-3xl" style={{ fontFamily: '"Segoe Script","Brush Script MT",cursive' }}>BeHayHoc</p>
            <div className="mx-auto mt-0.5 h-px w-40 bg-slate-300 sm:w-44" />
            <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">Đội ngũ BeHayHoc.com</p>
          </div>
        </div>

        {/* Nút */}
        <div className="mt-4 flex justify-center gap-3 print:hidden">
          <button onClick={share} className="flex items-center gap-2 rounded-full bg-sky-100 px-6 py-3 text-sm font-bold text-sky-700 hover:bg-sky-200">
            <Share2 size={16} /> Chia sẻ
          </button>
          <button onClick={download} disabled={downloading} className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-60">
            <Download size={16} /> {downloading ? 'Đang tạo ảnh…' : 'Tải về'}
          </button>
        </div>

        {/* ── Thành tích của bé ── */}
        <div className="mt-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100 print:hidden">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900"><KidIcon name="trophy" className="h-6 w-6" /> Thành tích của bé</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="flex items-start gap-2.5">
                <KidIcon name={k.icon} className="h-11 w-11 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xl font-black leading-tight" style={{ color: k.color }}>{k.value}</div>
                  <div className="text-[11px] font-semibold text-slate-400">{k.label}</div>
                  {k.pct != null && (
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full" style={{ width: `${k.pct}%`, background: k.color }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Phần thưởng đã nhận ── */}
        <div className="mt-4 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100 print:hidden">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900"><KidIcon name="giftRed" className="h-6 w-6" /> Phần thưởng đã nhận</h2>
          <div className="grid grid-cols-3 gap-3 text-center sm:grid-cols-6">
            {rewards.map((r) => (
              <div key={r.name} className={r.lv > 0 ? '' : 'opacity-40 grayscale'}>
                <KidIcon name={r.icon} className="mx-auto h-14 w-14" />
                <div className="mt-1.5 text-[11px] font-black leading-tight text-slate-800">{r.name}</div>
                <div className="text-[10px] text-slate-400">{r.name === 'Khám phá thêm' ? 'nhé!' : r.lv > 0 ? `Cấp ${r.lv}` : 'Chưa đạt'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Động viên */}
        <div className="mt-4 flex items-center gap-3 rounded-[24px] bg-amber-50 p-4 ring-1 ring-amber-100 print:hidden">
          <KidIcon name="rabbit" className="h-12 w-12 shrink-0" />
          <p className="text-sm text-amber-900">
            <strong>Tuyệt vời!</strong> Bé đang học rất tốt! Hãy tiếp tục phát huy và chinh phục những khóa học tiếp theo nhé!
          </p>
        </div>
      </div>
    </section>
  );
}
