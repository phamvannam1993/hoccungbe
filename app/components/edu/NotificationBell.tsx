'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { getCurrentChildId, childStats, childStreak, childHistory, type HistoryItem } from '../../lib/childData';
import { apiFetch } from '../../lib/api';

type Tone = 'amber' | 'sky' | 'violet' | 'orange' | 'emerald' | 'rose';
type Notif = { id: string; emoji: string; title: string; desc?: string; href: string; tone: Tone; khi?: string; mayChuId?: number };

const TONE: Record<Tone, string> = {
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
  violet: 'bg-violet-50 text-violet-600',
  orange: 'bg-orange-50 text-orange-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  rose: 'bg-rose-50 text-rose-600',
};

/* Thông báo do MÁY CHỦ gửi (bảng `notifications`): nhắc học, báo cáo, huy hiệu…
 *
 * Khác hẳn mấy mục bên dưới: những mục kia chuông tự suy ra từ dữ liệu học của bé
 * ngay trong trình duyệt, còn đây là thứ người lớn chủ động gửi. Trước đây chuông
 * không hề hỏi tới bảng này, nên thông báo gửi đi không ai nhìn thấy. */
type MayChu = {
  id: number;
  type: string;
  title: string;
  body?: string | null;
  data?: unknown;
  readAt?: string | null;
  createdAt: string;
};

const KIEU: Record<string, { emoji: string; tone: Tone }> = {
  reminder: { emoji: '⏰', tone: 'sky' },
  achievement: { emoji: '🏆', tone: 'violet' },
  report: { emoji: '📊', tone: 'emerald' },
  streak: { emoji: '🔥', tone: 'orange' },
  certificate: { emoji: '🎖️', tone: 'amber' },
  system: { emoji: '🔔', tone: 'rose' },
};

/** Đường dẫn kèm theo thông báo, nếu có. Không có thì về trang tổng quan. */
function duongDan(data: unknown): string {
  if (data && typeof data === 'object' && 'href' in data) {
    const h = (data as { href?: unknown }).href;
    if (typeof h === 'string' && h.startsWith('/')) return h;
  }
  return '/dashboard';
}

/** "3 phút trước", "2 giờ trước", "5 ngày trước". */
function khiNao(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  const phut = Math.floor((Date.now() - t) / 60000);
  if (phut < 1) return 'vừa xong';
  if (phut < 60) return `${phut} phút trước`;
  const gio = Math.floor(phut / 60);
  if (gio < 24) return `${gio} giờ trước`;
  const ngay = Math.floor(gio / 24);
  return ngay < 30 ? `${ngay} ngày trước` : new Date(t).toLocaleDateString('vi-VN');
}

const LEVEL_SIZE = 400;
const WEEKLY_GOAL = 5;
const SEEN_KEY = 'bhh_notif_seen';

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function weekDates(): string[] {
  const now = new Date();
  const monOffset = (now.getDay() + 6) % 7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - monOffset);
  return Array.from({ length: 7 }, (_, i) => ymd(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)));
}

// Tính các thông báo cần thiết từ dữ liệu thật của bé.
function buildNotifs(stats: Awaited<ReturnType<typeof childStats>>, streak: Awaited<ReturnType<typeof childStreak>>, history: HistoryItem[]): Notif[] {
  const list: Notif[] = [];
  const today = ymd(new Date());

  // Bài đang làm sai (gộp theo bài, lấy lần gần nhất).
  const byLesson = new Map<number, HistoryItem>();
  for (const h of history) if (!byLesson.has(h.lessonId)) byLesson.set(h.lessonId, h);
  const wrong = [...byLesson.values()].filter((h) => (h.totalQuestions ?? 0) - (h.correctCount ?? 0) > 0).length;
  if (wrong > 0) {
    list.push({ id: `wrong-${wrong}`, emoji: '📝', title: `Có ${wrong} bài cần ôn lại`, desc: 'Ôn câu sai để nhớ lâu hơn nhé!', href: '/on-tap-cau-sai', tone: 'amber' });
  }

  // Hôm nay chưa học (chỉ nhắc khi bé đã từng học).
  const activeDays = new Set(history.map((h) => ymd(new Date(h.createdAt))));
  const cur = streak?.currentStreak ?? 0;
  if (history.length > 0 && !activeDays.has(today)) {
    list.push({
      id: `nostudy-${today}`,
      emoji: '☀️',
      title: 'Hôm nay bé chưa học',
      desc: cur > 0 ? `Học một bài để giữ chuỗi ${cur} ngày nhé!` : 'Cùng làm một bài ngắn thôi!',
      href: '/khoa-hoc',
      tone: 'sky',
    });
  }

  // Sắp lên cấp.
  const points = (stats?.totalCorrect ?? 0) * 10;
  const into = points % LEVEL_SIZE;
  const level = Math.floor(points / LEVEL_SIZE) + 1;
  if (points > 0 && into >= LEVEL_SIZE * 0.7) {
    list.push({ id: `levelup-${level}`, emoji: '🚀', title: `Sắp lên Cấp ${level + 1}!`, desc: `Chỉ còn ${LEVEL_SIZE - into} điểm nữa thôi.`, href: '/tien-do', tone: 'violet' });
  }

  // Mốc chuỗi ngày.
  if ([3, 7, 14, 30, 50, 100].includes(cur)) {
    list.push({ id: `streak-${cur}`, emoji: '🔥', title: `Chuỗi ${cur} ngày liên tiếp!`, desc: 'Bé thật kiên trì. Cố gắng tiếp nhé!', href: '/tien-do', tone: 'orange' });
  }

  // Mục tiêu tuần.
  const week = weekDates();
  const activeThisWeek = week.filter((d) => activeDays.has(d)).length;
  if (activeThisWeek > 0 && activeThisWeek < WEEKLY_GOAL) {
    list.push({ id: `weekly-${activeThisWeek}`, emoji: '🎯', title: 'Mục tiêu tuần', desc: `Còn ${WEEKLY_GOAL - activeThisWeek} ngày nữa để đạt ${WEEKLY_GOAL} ngày/tuần.`, href: '/dashboard', tone: 'emerald' });
  }

  // Khen khi mọi thứ ổn.
  if (list.length === 0 && history.length > 0) {
    list.push({ id: 'praise', emoji: '🎉', title: 'Bé đang làm rất tốt!', desc: 'Không còn bài sai, đã học hôm nay. Tuyệt vời!', href: '/tien-do', tone: 'emerald' });
  }
  return list;
}

export default function NotificationBell({ compact = false }: { compact?: boolean }) {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  /* Hiện chuông khi CÓ BÉ hoặc ĐÃ ĐĂNG NHẬP.
   *
   * Bản trước chỉ xét `getCurrentChildId()`, nên phụ huynh đăng nhập mà chưa chọn
   * hồ sơ bé thì chuông biến mất hoàn toàn — không phải chuông rỗng, mà là không
   * có chuông. Thông báo của máy chủ gửi cho TÀI KHOẢN, không gửi cho hồ sơ bé,
   * nên điều kiện cũ giấu mất đúng nhóm người cần đọc chúng. */
  const [hienChuong, setHienChuong] = useState(false);

  useEffect(() => {
    let huy = false;
    const childId = getCurrentChildId();
    const daDangNhap = (() => {
      try { return !!localStorage.getItem('bhh_token'); } catch { return false; }
    })();
    if (!childId && !daDangNhap) return;

    /* Mục tự suy từ dữ liệu của bé (chỉ khi đã chọn hồ sơ bé). */
    const cuaBe: Promise<Notif[]> = childId
      ? Promise.all([childStats(childId), childStreak(childId), childHistory(childId, 500).catch(() => [])])
          .then(([s, st, h]) => buildNotifs(s, st, Array.isArray(h) ? h : []))
          .catch(() => [])
      : Promise.resolve([]);

    /* Mục do máy chủ gửi (chỉ khi đã đăng nhập).
     * Hỏng thì trả mảng rỗng chứ KHÔNG để vỡ cả chuông: mất thông báo máy chủ vẫn
     * còn hơn mất luôn những mục tính được tại chỗ. */
    const cuaMayChu: Promise<MayChu[]> = daDangNhap
      ? apiFetch<MayChu[]>('/notifications/me').then((r) => (Array.isArray(r) ? r : [])).catch(() => [])
      : Promise.resolve([]);

    Promise.all([cuaBe, cuaMayChu]).then(([be, may]) => {
      if (huy) return;
      /* Bật hiển thị TRONG callback chứ không ngay trong thân effect: gọi setState
         thẳng trong thân effect làm React dựng lại dây chuyền, và linter chặn. */
      setHienChuong(true);
      const tuMay: Notif[] = may.map((n) => {
        const k = KIEU[n.type] ?? KIEU.system;
        return {
          id: `may-${n.id}`,
          mayChuId: n.id,
          emoji: k.emoji,
          tone: k.tone,
          title: n.title,
          desc: n.body ?? undefined,
          href: duongDan(n.data),
          khi: khiNao(n.createdAt),
        };
      });
      /* Thông báo máy chủ lên trước: đó là thứ người lớn chủ động gửi. */
      const gop = [...tuMay, ...be];
      setNotifs(gop);

      let seen: string[] = [];
      try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch { seen = []; }
      const daXem = new Set(seen);
      const chuaDocMay = may.filter((n) => !n.readAt).length;
      const chuaXemBe = be.filter((n) => !daXem.has(n.id)).length;
      setUnread(chuaDocMay + chuaXemBe);
    });

    return () => { huy = true; };
  }, []);

  // Đóng khi bấm ra ngoài.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && notifs.length) {
      /* Mục tính tại chỗ: đánh dấu đã xem trong máy này.
         Mục của máy chủ: báo lên máy chủ, vì nó phải "đã đọc" ở mọi thiết bị. */
      try {
        const prev: string[] = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
        const merged = Array.from(new Set([...prev, ...notifs.filter((n) => !n.mayChuId).map((n) => n.id)]));
        localStorage.setItem(SEEN_KEY, JSON.stringify(merged.slice(-50)));
      } catch { /* ignore */ }
      if (notifs.some((n) => n.mayChuId)) {
        apiFetch('/notifications/me/read-all', { method: 'PATCH' }).catch(() => {});
      }
      setUnread(0);
    }
  }

  if (!hienChuong) return null;

  const size = compact ? 16 : 18;
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        aria-label="Thông báo"
        className={`relative grid place-items-center rounded-full bg-white text-[#c0392b] shadow hover:bg-gray-50 transition ${compact ? 'h-8 w-8' : 'h-9 w-9'}`}
      >
        <Bell size={size} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white ring-2 ring-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-[62px] z-[60] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <span className="text-sm font-black text-slate-800">Thông báo</span>
            <span className="text-[11px] font-semibold text-slate-400">{notifs.length} mục</span>
          </div>
          <div className="max-h-80 overflow-y-auto py-1">
            {notifs.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-400">Chưa có thông báo nào.</p>
            ) : (
              notifs.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-2.5 transition hover:bg-slate-50"
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg ${TONE[n.tone]}`}>{n.emoji}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-slate-800">{n.title}</span>
                    {n.desc && <span className="block text-xs text-slate-500">{n.desc}</span>}
                    {n.khi && <span className="mt-0.5 block text-[11px] font-medium text-slate-400">{n.khi}</span>}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
