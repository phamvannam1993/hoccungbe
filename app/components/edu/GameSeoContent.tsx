import Link from 'next/link';
import { resolveGame } from './GameStructuredData';
import { gamesData } from './data/gamesData';

type Props = {
  /** English folder name / routeKey / data page key / canonical Vietnamese slug. */
  slug: string;
};

/**
 * Khối nội dung chữ cho từng trang trò chơi: cung cấp H1, mô tả chi tiết, kỹ năng,
 * cách chơi, câu hỏi thường gặp (kèm FAQ schema) và trò chơi liên quan.
 * Giúp trang game có nội dung thực để xếp hạng thay vì chỉ là canvas game.
 */
export default function GameSeoContent({ slug }: Props) {
  const game = resolveGame(slug);
  if (!game) return null;

  const related = gamesData
    .filter((g) => g.groupKey === game.groupKey && g.slug !== game.slug && g.status === 'ready')
    .slice(0, 4);

  const faqs = [
    {
      q: `Trò chơi ${game.title} phù hợp với bé mấy tuổi?`,
      a: `${game.title} phù hợp với bé ${game.age}. Trò chơi ở mức độ ${game.difficulty.toLowerCase()}, chơi khoảng ${game.time} mỗi lần.`,
    },
    {
      q: `Chơi ${game.title} giúp bé phát triển kỹ năng gì?`,
      a: `Khi chơi ${game.title}, bé rèn được: ${game.skills.join(', ')}. ${game.description}`,
    },
    {
      q: `Trò chơi ${game.title} có miễn phí không?`,
      a: `Có. ${game.title} và các trò chơi giáo dục khác trên Bé Hay Học đều chơi trực tuyến miễn phí, không cần cài đặt.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          {game.emoji} {game.title} – trò chơi giáo dục cho bé {game.age}
        </h2>

        <p className="mt-4 text-base leading-8 text-slate-600">{game.description}</p>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-sky-50 px-3 py-1 font-bold text-sky-700">
            Độ tuổi: {game.age}
          </span>
          <span className="rounded-full bg-violet-50 px-3 py-1 font-bold text-violet-700">
            Độ khó: {game.difficulty}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700">
            Thời gian: {game.time}
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 font-bold text-amber-700">
            {game.category}
          </span>
        </div>

        <h3 className="mt-8 text-xl font-black text-slate-900">Bé rèn được kỹ năng gì?</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {game.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700"
            >
              ✅ {skill}
            </span>
          ))}
        </div>

        <h3 className="mt-8 text-xl font-black text-slate-900">Câu hỏi thường gặp</h3>
        <div className="mt-3 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <summary className="cursor-pointer text-sm font-bold text-slate-800">
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-7 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>

        {related.length > 0 && (
          <>
            <h3 className="mt-8 text-xl font-black text-slate-900">Trò chơi liên quan</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {related.map((g) => (
                <Link
                  key={g.slug}
                  href={`/tro-choi/${g.slug}`}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:border-sky-200"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {g.emoji}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-900">{g.title}</span>
                    <span className="block text-xs text-slate-500">{g.age}</span>
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-500">
          <Link href="/tro-choi" className="font-bold text-sky-600 hover:text-sky-700">
            ← Xem tất cả trò chơi giáo dục
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
