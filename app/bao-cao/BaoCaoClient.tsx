'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  childHistory,
  childStreak,
  childMastery,
  listChildren,
  getCurrentChildId,
  subjectInfo,
  type HistoryItem,
  type Child,
} from '../lib/childData';
import { starsForScore } from '../lib/stars';
import { shareAchievement } from '../lib/share';
import { choLuyen, loiKhuyen, type ChoLuyen } from '../lib/luyenTheoKyNang';
import FramedAvatar from '../components/edu/FramedAvatar';

type Report = {
  child: Child | null;
  lessons: number;
  prevLessons: number;
  questions: number;
  correct: number;
  accuracy: number;
  stars: number;
  streak: number;
  bySubject: { name: string; icon: string; count: number }[];
  topSubject: string | null;
  focus: string | null;
  yeu: DiemYeu[]; // kỹ năng yếu nên luyện thêm
};

const WEEK = 7 * 86400000;

function inRange(iso: string, from: number, to: number): boolean {
  const t = Date.parse(iso);
  return t >= from && t < to;
}

/** Một kỹ năng bé đang yếu, kèm chỗ luyện. */
type DiemYeu = {
  ten: string;
  mon: string;
  phanTram: number;
  dung: number;
  tong: number;
  cho: ChoLuyen;
};

export default function BaoCaoClient() {
  const [ready, setReady] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [noChild, setNoChild] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const id = getCurrentChildId();
      if (!id) {
        setNoChild(true);
        setReady(true);
        return;
      }
      const [hist, kids, streak, mastery] = await Promise.all([
        childHistory(id, 300).catch(() => [] as HistoryItem[]),
        listChildren().catch(() => [] as Child[]),
        childStreak(id).catch(() => null),
        childMastery(id).catch(() => []),
      ]);

      const now = Date.now();
      const thisWeek = hist.filter((h) => inRange(h.createdAt, now - WEEK, now + 1));
      const prevWeek = hist.filter((h) => inRange(h.createdAt, now - 2 * WEEK, now - WEEK));

      const questions = thisWeek.reduce((s, h) => s + (h.totalQuestions || 0), 0);
      const correct = thisWeek.reduce((s, h) => s + (h.correctCount || 0), 0);
      const stars = thisWeek.reduce((s, h) => s + starsForScore(h.score || 0), 0);

      // Gom theo môn
      const subMap = new Map<string, { name: string; icon: string; count: number }>();
      for (const h of thisWeek) {
        const info = subjectInfo(h.courseType);
        const cur = subMap.get(info.name) || { name: info.name, icon: info.icon, count: 0 };
        cur.count += 1;
        subMap.set(info.name, cur);
      }
      const bySubject = [...subMap.values()].sort((a, b) => b.count - a.count);

      // Kỹ năng yếu nhất (mastery thấp nhất) → gợi ý luyện tuần tới
      const weakest = [...mastery].sort((a, b) => a.masteryPercent - b.masteryPercent)[0];

      // DANH SÁCH điểm yếu, không chỉ một cái. Chỉ tính kỹ năng bé đã làm ít
      // nhất 3 câu — dưới mức đó thì con số phần trăm không nói lên điều gì,
      // nêu ra chỉ làm ba mẹ lo hão.
      const yeu: DiemYeu[] = mastery
        .filter((m) => (m.totalCount ?? 0) >= 3 && Number(m.masteryPercent) < 80)
        .sort((a, b) => Number(a.masteryPercent) - Number(b.masteryPercent))
        .slice(0, 4)
        .map((m) => ({
          ten: m.skill?.name || m.subject,
          mon: m.skill?.subject || m.subject,
          phanTram: Math.round(Number(m.masteryPercent)),
          dung: m.correctCount ?? 0,
          tong: m.totalCount ?? 0,
          cho: choLuyen(m.skill?.name || m.subject, m.skill?.subject || m.subject),
        }));

      setReport({
        child: kids.find((k) => k.id === id) || null,
        lessons: thisWeek.length,
        prevLessons: prevWeek.length,
        questions,
        correct,
        accuracy: questions ? Math.round((correct / questions) * 100) : 0,
        stars,
        streak: streak?.currentStreak || 0,
        bySubject,
        topSubject: bySubject[0]?.name || null,
        focus: weakest ? weakest.skill?.name || weakest.subject : null,
        yeu,
      });
      setReady(true);
    })();
  }, []);

  if (!ready) return <p className="py-10 text-center text-slate-400">Đang tổng hợp báo cáo…</p>;

  if (noChild || !report) {
    return (
      <div className="mt-6 rounded-3xl border-4 border-sky-100 bg-white p-8 text-center">
        <p className="text-5xl">📊</p>
        <h2 className="mt-3 text-xl font-black text-slate-800">Chưa có hồ sơ bé</h2>
        <p className="mt-1 text-slate-500">Tạo hồ sơ và cho bé học vài bài, báo cáo tuần sẽ tự động hiện ở đây.</p>
        <Link href="/ho-so-be" className="mt-4 inline-block rounded-full bg-sky-500 px-5 py-2.5 text-sm font-black text-white shadow">Tạo hồ sơ bé</Link>
      </div>
    );
  }

  const name = report.child?.nickname || report.child?.fullName || 'Bé';
  const diff = report.lessons - report.prevLessons;

  const share = async () => {
    const summary = `${report.lessons} bài · đúng ${report.accuracy}%${report.topSubject ? ` · chăm nhất ${report.topSubject}` : ''}`;
    const r = await shareAchievement('bao-cao', name, summary);
    if (r === 'copied') {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  if (report.lessons === 0) {
    return (
      <div className="mt-6 rounded-3xl border-4 border-amber-100 bg-white p-8 text-center">
        <p className="text-5xl">🌱</p>
        <h2 className="mt-3 text-xl font-black text-slate-800">Tuần này {name} chưa học bài nào</h2>
        <p className="mt-1 text-slate-500">Cùng bắt đầu một bài ngắn hôm nay để có báo cáo tuần nhé!</p>
        <Link href="/hoc-hom-nay" className="mt-4 inline-block rounded-full bg-amber-500 px-5 py-2.5 text-sm font-black text-white shadow">Bắt đầu học</Link>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-5">
      {/* Thẻ tóm tắt */}
      <div className="rounded-3xl border-4 border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6">
        <div className="flex items-center gap-3">
          <FramedAvatar child={report.child} className="h-14 w-14" />
          <div>
            <p className="text-sm font-bold text-sky-600">Báo cáo 7 ngày qua</p>
            <h2 className="text-xl font-black text-slate-800 sm:text-2xl">{name} học chăm thế nào?</h2>
          </div>
        </div>
        <p className="mt-3 leading-7 text-slate-700">
          Tuần này <b>{name}</b> đã hoàn thành <b className="text-sky-600">{report.lessons} bài</b>, trả lời{' '}
          <b>{report.questions} câu</b> với độ chính xác <b className="text-emerald-600">{report.accuracy}%</b>
          {report.topSubject ? <> — chăm nhất môn <b>{report.topSubject}</b> 💪</> : null}.
        </p>
      </div>

      {/* Ô số liệu */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Bài học" value={`${report.lessons}`} sub={diff === 0 ? 'bằng tuần trước' : diff > 0 ? `+${diff} so với tuần trước` : `${diff} so với tuần trước`} up={diff >= 0} />
        <Tile label="Độ chính xác" value={`${report.accuracy}%`} sub={`${report.correct}/${report.questions} câu đúng`} up={report.accuracy >= 70} />
        <Tile label="Chuỗi ngày" value={`${report.streak} 🔥`} sub="học liên tiếp" up />
        <Tile label="Sao kiếm được" value={`${report.stars} ⭐`} sub="tuần này" up />
      </div>

      {/* Theo môn */}
      {report.bySubject.length > 0 && (
        <div className="rounded-3xl border-2 border-slate-100 bg-white p-5">
          <h3 className="mb-3 text-sm font-black text-slate-900">Bé học những môn nào?</h3>
          <div className="flex flex-wrap gap-2">
            {report.bySubject.map((s) => (
              <span key={s.name} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
                {s.icon} {s.name} · {s.count} bài
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Điểm yếu — kèm CHỖ LUYỆN cụ thể, đây mới là thứ ba mẹ cần */}
      {report.yeu.length > 0 ? (
        <div className="rounded-3xl border-2 border-violet-100 bg-violet-50 p-5">
          <h3 className="text-sm font-black text-violet-700">🎯 Bé còn yếu ở đâu, luyện ở đâu</h3>
          <p className="mt-1 text-sm text-slate-600">
            Xếp theo mức làm đúng thấp nhất. Chỉ tính những phần bé đã làm từ 3 câu trở lên.
          </p>
          <ul className="mt-3 space-y-2.5">
            {report.yeu.map((y) => (
              <li key={y.ten} className="rounded-2xl bg-white p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <b className="text-slate-900">{y.ten}</b>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                    y.phanTram < 50 ? 'bg-rose-100 text-rose-700'
                      : y.phanTram < 70 ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'}`}>
                    đúng {y.phanTram}%
                  </span>
                  <span className="text-xs font-bold text-slate-400">{y.dung}/{y.tong} câu</span>
                  <Link href={y.cho.href}
                        className="ml-auto rounded-full bg-violet-600 px-4 py-1.5 text-xs font-black text-white shadow-[0_3px_0_#5b21b6] transition active:translate-y-0.5 active:shadow-none">
                    {y.cho.emoji} Luyện {y.cho.ten}
                  </Link>
                </div>
                {/* Thanh mức độ — nhìn là thấy phần nào hụt nhiều nhất */}
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${y.phanTram < 50 ? 'bg-rose-400' : y.phanTram < 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                       style={{ width: `${Math.max(4, y.phanTram)}%` }} />
                </div>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{loiKhuyen(y.phanTram, y.tong)}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : report.focus ? (
        <div className="rounded-3xl border-2 border-violet-100 bg-violet-50 p-5">
          <h3 className="text-sm font-black text-violet-700">🎯 Gợi ý cho tuần tới</h3>
          <p className="mt-1 text-slate-700">
            Bé chưa làm đủ bài để chỉ ra điểm yếu chắc chắn. Cho bé làm thêm vài bài ở <b>{report.focus}</b>, hoặc vào{' '}
            <Link href="/hoc-hom-nay" className="font-bold text-violet-600 underline">Học hôm nay</Link> để hệ thống gợi ý.
          </p>
        </div>
      ) : null}

      {/* Hành động */}
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={share} className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-black text-white shadow-md">
          {copied ? '✅ Đã sao chép báo cáo' : '📤 Chia sẻ báo cáo'}
        </button>
        <Link href="/tien-do" className="rounded-full border-2 border-slate-200 px-6 py-3 text-sm font-black text-slate-600">Xem tiến độ chi tiết</Link>
      </div>
    </div>
  );
}

function Tile({ label, value, sub, up }: { label: string; value: string; sub: string; up: boolean }) {
  return (
    <div className="rounded-2xl border-2 border-slate-100 bg-white p-3 text-center">
      <p className="text-xs font-bold text-slate-400">{label}</p>
      <p className="mt-0.5 text-2xl font-black text-slate-800">{value}</p>
      <p className={`mt-0.5 text-[11px] font-semibold ${up ? 'text-emerald-600' : 'text-orange-500'}`}>{sub}</p>
    </div>
  );
}
