'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Flame, Target, Clock, BookOpen, Star, Trophy } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';

interface Child {
  id: string;
  fullName: string;
  nickname?: string;
  age?: number;
  birthDate?: string;
  gender?: string;
  avatarUrl?: string;
  currentLevel?: string;
  interests?: string[];
  learningGoal?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: { id?: string; email?: string; fullName?: string; phone?: string };
  parent?: { id?: string; email?: string; fullName?: string };
}

interface Stats {
  totalAttempts: number;
  avgScore: number;
  accuracy: number;
  totalTimeSec: number;
  totalQuestions: number;
  totalCorrect: number;
  lessonsCompleted: number;
}

interface HistoryRow {
  id: number;
  lessonId?: number;
  lessonTitle?: string | null;
  lessonSlug?: string | null;
  courseType?: string | null;
  exerciseNumber?: number;
  difficultyLevel?: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  createdAt: string;
}

interface Streak {
  currentStreak?: number;
  longestStreak?: number;
  totalActiveDays?: number;
  lastActiveDate?: string;
}

interface Reward {
  id: string;
  rewardType?: string;
  rewardName: string;
  rewardDescription?: string;
  points?: number;
  awardedAt?: string;
}

// Tên môn tiếng Việt: courseType trong CSDL là mã tiếng Anh, admin đọc khó.
const TEN_MON: Record<string, string> = {
  math: 'Toán', language: 'Tiếng Việt', english: 'Tiếng Anh',
  logic: 'Tư duy', emotion: 'Cảm xúc', creative: 'Sáng tạo', other: 'Khác',
};

const phutGio = (giay: number) => {
  if (!giay) return '0 phút';
  const h = Math.floor(giay / 3600);
  const m = Math.round((giay % 3600) / 60);
  return h ? `${h} giờ ${m} phút` : `${m} phút`;
};

const ngay = (s?: string | null) => (s ? new Date(s).toLocaleDateString('vi-VN') : '-');
const ngayGio = (s?: string | null) => (s ? new Date(s).toLocaleString('vi-VN') : '-');

function The({ icon, nhan, giaTri, mau }: { icon: React.ReactNode; nhan: string; giaTri: string; mau: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${mau}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500">{nhan}</div>
        <div className="text-lg font-bold text-gray-800 truncate">{giaTri}</div>
      </div>
    </div>
  );
}

export default function ChildDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [child, setChild] = useState<Child | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<Child>(`/children/${id}`)
      .then(setChild)
      .catch((err) => setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));

    // Các khối phụ hỏng thì vẫn xem được hồ sơ — nuốt lỗi từng khối một.
    apiFetch<Stats>(`/attempts/stats/${id}`).then(setStats).catch(() => {});
    apiFetch<HistoryRow[]>(`/attempts/history/${id}?limit=50`).then((r) => setHistory(r || [])).catch(() => {});
    apiFetch<Streak>(`/streaks/${id}`).then(setStreak).catch(() => {});
    apiFetch<Reward[]>(`/rewards/child/${id}`).then((r) => setRewards(r || [])).catch(() => {});
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" /></div>;
  if (error) return <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>;
  if (!child) return null;

  const phuHuynh = child.user || child.parent;
  const tongSao = rewards.reduce((s, r) => s + (r.points || 0), 0);

  // Gộp lịch sử theo môn để thấy bé mạnh/yếu môn nào.
  const theoMon = new Map<string, { luot: number; dung: number; tong: number }>();
  for (const h of history) {
    const k = h.courseType || 'other';
    const c = theoMon.get(k) || { luot: 0, dung: 0, tong: 0 };
    c.luot += 1;
    c.dung += h.correctCount;
    c.tong += h.totalQuestions;
    theoMon.set(k, c);
  }
  const monDs = [...theoMon.entries()]
    .map(([mon, v]) => ({ mon, ...v, phanTram: v.tong ? Math.round((v.dung / v.tong) * 100) : 0 }))
    .sort((a, b) => b.luot - a.luot);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/children" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-800">Chi tiết trẻ</h1>
      </div>

      {/* Hồ sơ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-4 mb-5">
          {child.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={child.avatarUrl} alt={child.fullName} className="w-16 h-16 rounded-full object-cover border" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
              {child.fullName?.trim().slice(-1).toUpperCase() || '?'}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-xl font-bold text-gray-800">{child.fullName}</div>
            <div className="text-sm text-gray-500">
              {child.nickname ? `“${child.nickname}” · ` : ''}ID {child.id}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {child.status === 'active'
                ? <Badge label="Hoạt động" variant="green" />
                : <Badge label={child.status || 'không rõ'} variant="gray" />}
              {child.currentLevel ? <Badge label={child.currentLevel} variant="purple" /> : null}
              {child.gender ? <Badge label={child.gender === 'male' ? 'Bé trai' : child.gender === 'female' ? 'Bé gái' : child.gender} variant="blue" /> : null}
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
          <div><dt className="text-gray-500 mb-0.5">Tuổi</dt><dd className="font-medium">{child.age != null ? `${child.age} tuổi` : '-'}</dd></div>
          <div><dt className="text-gray-500 mb-0.5">Ngày sinh</dt><dd className="font-medium">{ngay(child.birthDate)}</dd></div>
          <div><dt className="text-gray-500 mb-0.5">Tạo lúc</dt><dd className="font-medium">{ngayGio(child.createdAt)}</dd></div>
          <div><dt className="text-gray-500 mb-0.5">Cập nhật</dt><dd className="font-medium">{ngayGio(child.updatedAt)}</dd></div>
          <div className="col-span-2">
            <dt className="text-gray-500 mb-0.5">Phụ huynh</dt>
            <dd className="font-medium">
              {phuHuynh ? (
                phuHuynh.id ? (
                  <Link href={`/admin/users/${phuHuynh.id}`} className="text-blue-600 hover:underline">
                    {phuHuynh.fullName || phuHuynh.email}
                  </Link>
                ) : (phuHuynh.fullName || phuHuynh.email)
              ) : '-'}
              {phuHuynh?.email && phuHuynh?.fullName ? <span className="text-gray-400"> · {phuHuynh.email}</span> : null}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-gray-500 mb-0.5">Sở thích</dt>
            <dd className="font-medium">
              {child.interests?.length
                ? <span className="flex flex-wrap gap-1.5">{child.interests.map((s) => <Badge key={s} label={s} variant="orange" />)}</span>
                : '-'}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <dt className="text-gray-500 mb-0.5">Mục tiêu học</dt>
            <dd className="font-medium whitespace-pre-line">{child.learningGoal || '-'}</dd>
          </div>
        </dl>
      </div>

      {/* Số liệu học tập */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <The icon={<BookOpen size={20} className="text-blue-600" />} mau="bg-blue-50" nhan="Lượt làm bài" giaTri={String(stats?.totalAttempts ?? 0)} />
        <The icon={<Target size={20} className="text-emerald-600" />} mau="bg-emerald-50" nhan="Độ chính xác" giaTri={`${stats?.accuracy ?? 0}%`} />
        <The icon={<Trophy size={20} className="text-amber-600" />} mau="bg-amber-50" nhan="Điểm trung bình" giaTri={String(stats?.avgScore ?? 0)} />
        <The icon={<Clock size={20} className="text-violet-600" />} mau="bg-violet-50" nhan="Thời gian học" giaTri={phutGio(stats?.totalTimeSec ?? 0)} />
        <The icon={<Flame size={20} className="text-orange-600" />} mau="bg-orange-50" nhan="Chuỗi ngày" giaTri={`${streak?.currentStreak ?? 0} ngày`} />
        <The icon={<Star size={20} className="text-yellow-600" />} mau="bg-yellow-50" nhan="Sao tích luỹ" giaTri={String(tongSao)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Theo môn */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Kết quả theo môn <span className="font-normal text-gray-400 text-sm">(50 lượt gần nhất)</span></h2>
          {monDs.length === 0 ? (
            <p className="text-gray-400 text-sm">Bé chưa làm bài nào.</p>
          ) : (
            <ul className="space-y-3">
              {monDs.map((m) => (
                <li key={m.mon}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{TEN_MON[m.mon] || m.mon}</span>
                    <span className="text-gray-500">{m.dung}/{m.tong} câu · {m.luot} lượt · <b className={m.phanTram >= 80 ? 'text-emerald-600' : m.phanTram >= 50 ? 'text-amber-600' : 'text-red-600'}>{m.phanTram}%</b></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.phanTram >= 80 ? 'bg-emerald-500' : m.phanTram >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${m.phanTram}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Chuỗi ngày + phần thưởng */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Chuyên cần & phần thưởng</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm mb-5">
            <div><dt className="text-gray-500 mb-0.5">Chuỗi hiện tại</dt><dd className="font-medium">{streak?.currentStreak ?? 0} ngày</dd></div>
            <div><dt className="text-gray-500 mb-0.5">Chuỗi dài nhất</dt><dd className="font-medium">{streak?.longestStreak ?? 0} ngày</dd></div>
            <div><dt className="text-gray-500 mb-0.5">Tổng ngày học</dt><dd className="font-medium">{streak?.totalActiveDays ?? 0} ngày</dd></div>
            <div><dt className="text-gray-500 mb-0.5">Học gần nhất</dt><dd className="font-medium">{ngay(streak?.lastActiveDate)}</dd></div>
            <div><dt className="text-gray-500 mb-0.5">Bài đã xong</dt><dd className="font-medium">{stats?.lessonsCompleted ?? 0} bài</dd></div>
            <div><dt className="text-gray-500 mb-0.5">Số phần thưởng</dt><dd className="font-medium">{rewards.length}</dd></div>
          </dl>
          {rewards.length > 0 && (
            <ul className="space-y-2 max-h-56 overflow-y-auto">
              {rewards.slice(0, 30).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 text-sm border-b border-gray-50 pb-2 last:border-0">
                  <span className="min-w-0">
                    <span className="font-medium text-gray-700">{r.rewardName}</span>
                    {r.rewardType ? <Badge label={r.rewardType} variant="gray" /> : null}
                  </span>
                  <span className="text-gray-400 whitespace-nowrap">{r.points ? `+${r.points} ⭐ · ` : ''}{ngay(r.awardedAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Lịch sử làm bài */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Lịch sử làm bài ({history.length})</h2>
        <DataTable
          headers={['Thời gian', 'Môn', 'Bài học', 'Bài tập', 'Mức', 'Đúng/Tổng', 'Điểm']}
          rows={history.map((h) => [
            <span key="t" className="whitespace-nowrap text-gray-500">{ngayGio(h.createdAt)}</span>,
            h.courseType ? <Badge key="m" label={TEN_MON[h.courseType] || h.courseType} variant="blue" /> : '-',
            <span key="b" className="block max-w-[22rem] truncate" title={h.lessonTitle || ''}>{h.lessonTitle || `#${h.lessonId ?? '-'}`}</span>,
            h.exerciseNumber ?? '-',
            h.difficultyLevel || '-',
            `${h.correctCount}/${h.totalQuestions}`,
            <b key="d" className={Number(h.score) >= 80 ? 'text-emerald-600' : Number(h.score) >= 50 ? 'text-amber-600' : 'text-red-600'}>{Number(h.score)}</b>,
          ])}
          emptyMessage="Bé chưa làm bài nào"
        />
      </div>
    </div>
  );
}
