'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ListChecks } from 'lucide-react';
import ExamForm, { ExamFormData } from '../ExamForm';
import PageHeader from '../../components/PageHeader';
import { apiFetch } from '../../lib/api';

export default function EditExamPage() {
  const params = useParams<{ id: string }>();
  const [exam, setExam] = useState<ExamFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<ExamFormData>(`/exams/${params.id}`)
      .then(setExam)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="text-gray-400">Đang tải...</div>;
  if (!exam) return <div className="text-red-500">Không tìm thấy đề thi</div>;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Chỉnh sửa đề thi"
        subtitle={exam.title}
        actions={
          <Link href={`/admin/exams/${params.id}/questions`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">
            <ListChecks size={15} /> Quản lý câu hỏi
          </Link>
        }
      />
      <ExamForm mode="edit" initial={exam} />
    </div>
  );
}
