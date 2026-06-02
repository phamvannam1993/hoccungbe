import PuzzleForm from '../../PuzzleForm';

export const metadata = {
  title: 'Chỉnh Sửa Puzzle | Admin',
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;
  const puzzleId = parseInt(id, 10);

  if (isNaN(puzzleId)) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">❌ ID Puzzle không hợp lệ</h1>
      </div>
    );
  }

  return <PuzzleForm puzzleId={puzzleId} />;
}
