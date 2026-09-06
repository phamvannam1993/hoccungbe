'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentChildId } from '../../lib/childData';
import { getChildOverview, type SkillOverviewItem } from '../../lib/skillPractice';

/**
 * Lưới kỹ năng cho trang "Học theo kỹ năng".
 *
 * Cố ý KHÔNG hiện số bài sách giáo khoa: phần luyện kỹ năng có kho câu riêng,
 * không lấy từ bài SGK, nên con số đó vừa sai bản chất vừa chẳng giúp bé chọn
 * nên luyện gì. Thay vào đó hiện TÌNH TRẠNG của chính bé — đây mới là thứ trả
 * lời được câu hỏi "con đang yếu ở đâu".
 *
 * Khi chưa có hồ sơ bé thì chỉ hiện tên kỹ năng (trang vẫn tĩnh, tốt cho SEO).
 */

export type SkillItem = { code: string; name: string; icon?: string | null };

const TONE: Record<string, { chip: string; ring: string; dot: string }> = {
  yeu: { chip: 'bg-rose-50 text-rose-600', ring: 'border-rose-200', dot: '🔴' },
  'can-luyen': { chip: 'bg-amber-50 text-amber-600', ring: 'border-amber-200', dot: '🟡' },
  on: { chip: 'bg-sky-50 text-sky-600', ring: 'border-sky-200', dot: '🔵' },
  tot: { chip: 'bg-emerald-50 text-emerald-600', ring: 'border-emerald-200', dot: '🟢' },
  'chua-luyen': { chip: 'bg-slate-100 text-slate-500', ring: 'border-slate-200', dot: '⚪' },
};

export default function SkillGrid({
  skills,
  grade,
  courseSlug,
}: {
  skills: SkillItem[];
  grade: string;
  courseSlug: string;
}) {
  const [status, setStatus] = useState<Map<string, SkillOverviewItem>>(new Map());

  useEffect(() => {
    const cid = getCurrentChildId();
    if (!cid) return;
    getChildOverview(cid, grade)
      .then((rows) => setStatus(new Map(rows.map((r) => [r.code, r]))))
      .catch(() => { /* chưa luyện hoặc lỗi mạng thì chỉ không hiện tình trạng */ });
  }, [grade]);

  // Bé yếu chỗ nào thì đưa lên trước — mở trang là thấy ngay việc cần làm.
  const ordered = status.size
    ? [...skills].sort((a, b) => {
        const rank = (c: string) => {
          const s = status.get(c)?.status ?? 'chua-luyen';
          return { yeu: 0, 'can-luyen': 1, 'chua-luyen': 2, on: 3, tot: 4 }[s] ?? 5;
        };
        return rank(a.code) - rank(b.code);
      })
    : skills;

  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {ordered.map((k) => {
        const st = status.get(k.code);
        const tone = TONE[st?.status ?? 'chua-luyen'];
        return (
          <li key={k.code}>
            <Link
              href={`/ky-nang/${courseSlug}/${k.code}`}
              className={`group flex items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 transition hover:-translate-y-0.5 ${st ? tone.ring : 'border-slate-200'}`}
            >
              {k.icon && <span className="text-lg" aria-hidden>{k.icon}</span>}
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-slate-800">{k.name}</span>
                {st && (
                  <span className="mt-1 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${tone.chip}`}>
                      {tone.dot} {st.label}
                    </span>
                    {st.practiced && (
                      <span className="text-[11px] font-bold text-slate-400">{st.levelName}</span>
                    )}
                    {st.dueForReview && (
                      <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-black text-violet-600">
                        Đến hạn ôn
                      </span>
                    )}
                  </span>
                )}
              </span>
              <span className="text-lg text-slate-300 transition group-hover:translate-x-0.5" aria-hidden>→</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
