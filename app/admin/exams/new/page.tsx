'use client';
import ExamForm from '../ExamForm';
import PageHeader from '../../components/PageHeader';

export default function NewExamPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Tạo đề thi mới" />
      <ExamForm mode="create" />
    </div>
  );
}
