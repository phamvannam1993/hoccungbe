'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import PageHeader from '../components/PageHeader';
import { apiFetch } from '../lib/api';

interface Exam {
  id: number;
  title: string;
  slug: string;
  subject: string;
  grade: number;
  semester: number;
  timeLimitMinutes?: number;
  totalPoints: number;
  isActive: boolean;
}

const SUBJECT_LABEL: Record<string, string> = {
  toan: 'Toán',
  'tieng-viet': 'Tiếng Việt',
  'tieng-anh': 'Tiếng Anh',
};

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterGrade, setFilterGrade] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ all: '1' });
      if (filterSubject) params.set('subject', filterSubject);
      if (filterGrade) params.set('grade', filterGrade);
      const data = await apiFetch<Exam[]>(`/exams?${params}`);
      setExams(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterSubject, filterGrade]);

  const handleToggleActive = async (id: number, current: boolean) => {
    await apiFetch(`/exams/${id}`, { method: 'PATCH', body: JSON.stringify({ isActive: !current }) });
    setExams((prev) => prev.map((e) => e.id === id ? { ...e, isActive: !current } : e));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa đề thi này (cùng các câu hỏi)?')) return;
    await apiFetch(`/exams/${id}`, { method: 'DELETE' });
    load();
  };

  const rows = exams.map((e) => [
    <span key="id" className="text-gray-500 text-xs">#{e.id}</span>,
    <div key="t" className="font-medium text-gray-800">
      {e.title}
      <div className="text-xs text-gray-400 mt-0.5">/{e.slug}</div>
    </div>,
    <Badge key="s" variant="blue" label={SUBJECT_LABEL[e.subject] ?? e.subject} />,
    <span key="g">Lớp {e.grade}</span>,
    <span key="hk">HK{e.semester}</span>,
    <span key="t2">{e.timeLimitMinutes ? `${e.timeLimitMinutes} phút` : '—'}</span>,
    <span key="p">{e.totalPoints} đ</span>,
    <button key="a"
      onClick={() => handleToggleActive(e.id, e.isActive)}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
        e.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}>
      {e.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
      {e.isActive ? 'Hiển thị' : 'Ẩn'}
    </button>,
    <div key="act" className="flex items-center gap-2">
      <Link href={`/admin/exams/${e.id}`} className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50">
        <Edit size={15} />
      </Link>
      <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50">
        <Trash2 size={15} />
      </button>
    </div>,
  ]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Đề thi"
        subtitle={`${exams.length} đề thi`}
        addHref="/admin/exams/new"
        addLabel="Tạo đề thi"
      />

      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-gray-100">
        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Tất cả môn</option>
          <option value="toan">Toán</option>
          <option value="tieng-viet">Tiếng Việt</option>
          <option value="tieng-anh">Tiếng Anh</option>
        </select>
        <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Tất cả lớp</option>
          {[1, 2, 3, 4, 5].map((g) => <option key={g} value={g}>Lớp {g}</option>)}
        </select>
      </div>

      {loading && exams.length === 0 ? (
        <div className="py-10 text-center text-gray-400">Đang tải...</div>
      ) : (
        <DataTable
          headers={['ID', 'Tên đề thi', 'Môn', 'Lớp', 'HK', 'Thời gian', 'Điểm', 'Trạng thái', 'Thao tác']}
          rows={rows}
          emptyMessage="Chưa có đề thi nào"
        />
      )}
    </div>
  );
}
