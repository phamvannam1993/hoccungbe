import ExamPage from '../../components/edu/ExamPage';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ExamPage slug={slug} />;
}
