import Link from 'next/link';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  addHref?: string;
  addLabel?: string;
}

export default function PageHeader({ title, addHref, addLabel = 'Thêm mới' }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {addHref && (
        <Link
          href={addHref}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          {addLabel}
        </Link>
      )}
    </div>
  );
}
