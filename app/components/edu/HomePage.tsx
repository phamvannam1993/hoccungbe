import Link from 'next/link';
import Image from 'next/image';
import type { ApiCourse, ApiMiniGame } from '../../lib/api';

interface Article {
  id: number; title: string; slug: string;
  excerpt?: string; thumbnailUrl?: string;
  category?: string; publishedAt?: string; createdAt: string;
}

async function fetchArticles(): Promise<Article[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/articles?limit=4`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function fetchHomepageGames(): Promise<ApiMiniGame[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/mini-games/homepage`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Deterministic color mapping based on groupKey
const GROUP_COLORS: Record<string, { color: string; bg: string }> = {
  'math-counting': { color: '#1a3a6b', bg: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)' },
  'math-logic':    { color: '#7C3AED', bg: 'linear-gradient(135deg, #EDE9FE 0%, #C4B5FD 100%)' },
  'language':      { color: '#FF6B9D', bg: 'linear-gradient(135deg, #FFE5F1 0%, #FFD6E8 100%)' },
  'memory':        { color: '#8B5CF6', bg: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)' },
  'listening':     { color: '#059669', bg: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)' },
  'thinking-observation': { color: '#38BDF8', bg: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)' },
  'english':       { color: '#6BCB77', bg: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)' },
};

const FALLBACK_GAMES = [
  { slug: 'ghep-hinh-rung', routeKey: 'puzzle-game', emoji: '🧩', title: 'Ghép Hình', age: '3–6 tuổi', groupKey: 'thinking-observation' },
  { slug: 'tau-hoc-toan', routeKey: 'train-complete-lessons', emoji: '🚂', title: 'Đoàn tàu toán học', age: '4–8 tuổi', groupKey: 'math-counting' },
  { slug: 'day-so', routeKey: 'number-sequence', emoji: '🔢', title: 'Dãy số', age: '5–8 tuổi', groupKey: 'math-logic' },
  { slug: 'dem-chim', routeKey: 'bird-count', emoji: '🐦', title: 'Đếm chim', age: '3–6 tuổi', groupKey: 'math-counting' },
  { slug: 'keo-cot-so', routeKey: 'column-lift-drag', emoji: '📊', title: 'Kéo cột số', age: '5–8 tuổi', groupKey: 'math-logic' },
];

async function fetchCourses(): Promise<ApiCourse[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/courses?published=true`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const FEATURES = [
  { emoji: '📚', title: 'Bài học có video', desc: 'Video ngắn, trực quan giúp bé dễ hiểu và không mất tập trung.' },
  { emoji: '🎮', title: 'Trò chơi giáo dục', desc: 'Hơn 30 trò chơi rèn toán, chữ, tiếng Anh và tư duy mỗi ngày.' },
  { emoji: '✏️', title: 'Bài tập luyện tập', desc: 'Bài tập bám sát chương trình, giúp bé ôn tập và ghi nhớ lâu hơn.' },
  { emoji: '📊', title: 'Theo dõi tiến độ', desc: 'Phụ huynh xem được kết quả học tập và kỹ năng của bé rõ ràng.' },
];

const STATS = [
  { value: '40+', label: 'Bài học' },
  { value: '30+', label: 'Trò chơi' },
  { value: '3–10', label: 'Độ tuổi' },
  { value: '100%', label: 'Miễn phí dùng thử' },
];

export default async function HomePage() {
  const [courses, articles, apiGames] = await Promise.all([fetchCourses(), fetchArticles(), fetchHomepageGames()]);
  const homepageGames = apiGames.length > 0 ? apiGames : FALLBACK_GAMES;

  return (
    <main className="kid-bg relative overflow-hidden">
      {/* Decorative floating emojis */}
      <span aria-hidden className="pointer-events-none select-none absolute top-10 left-4 text-4xl opacity-70" style={{ animation: 'wiggle 3s ease-in-out infinite' }}>⭐</span>
      <span aria-hidden className="pointer-events-none select-none absolute top-20 right-8 text-5xl opacity-70" style={{ animation: 'bounce-pop 2.4s ease-in-out infinite' }}>🎈</span>
      <span aria-hidden className="pointer-events-none select-none absolute top-72 left-10 text-3xl opacity-60" style={{ animation: 'wiggle 4s ease-in-out infinite' }}>💖</span>
      <span aria-hidden className="pointer-events-none select-none absolute top-96 right-6 text-4xl opacity-60" style={{ animation: 'bounce-pop 3s ease-in-out infinite' }}>🌈</span>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6 relative">
        <div className="bg-white rounded-[32px] border-4 border-pink-200 overflow-hidden" style={{ boxShadow: '0 12px 40px rgba(255,107,157,0.20)' }}>
          <div className="grid lg:grid-cols-2">
            {/* Left */}
            <div className="p-8 sm:p-10 flex flex-col justify-center">
              <span className="inline-block rounded-full text-white text-xs font-black px-4 py-1.5 mb-4 w-fit kid-display" style={{ background: 'linear-gradient(135deg, #FF6B9D, #A06CD5)' }}>
                Nền tảng học tập cho bé 3–10 tuổi
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight kid-display">
                Học vui mỗi ngày —<br />
                <span style={{ background: 'linear-gradient(135deg, #FF6B9D, #FF9F45)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>bé tiến bộ thấy rõ</span> 🎉
              </h1>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Bài học ngắn, trò chơi giáo dục và bài tập luyện tập giúp bé học hiệu quả tại nhà. Phụ huynh theo dõi tiến độ dễ dàng mỗi ngày.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/khoa-hoc"
                  className="kid-btn-3d text-sm"
                  style={{ background: 'linear-gradient(135deg, #FF6B9D, #FF9F45)', boxShadow: '0 6px 0 #c0392b' }}>
                  📚 Xem khóa học
                </Link>
                <Link href="/tro-choi"
                  className="kid-btn-3d text-sm"
                  style={{ background: 'linear-gradient(135deg, #4ECDC4, #87CEEB)', boxShadow: '0 6px 0 #0e7490' }}>
                  🎮 Kho trò chơi
                </Link>
              </div>
              {/* Stats */}
              <div className="mt-8 grid grid-cols-4 gap-3">
                {STATS.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-xl font-black text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right */}
            <div className="p-8 flex items-center justify-center min-h-[280px]" style={{ background: 'linear-gradient(135deg, #FFE5F1 0%, #FFF4D6 50%, #C9F0FF 100%)' }}>
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                {FEATURES.map((f, i) => {
                  const colors = ['#FF6B9D', '#FFD93D', '#4ECDC4', '#A06CD5'];
                  const c = colors[i % colors.length];
                  return (
                    <div key={f.title} className="bg-white rounded-3xl p-4 kid-card-hover" style={{ border: `3px solid ${c}`, boxShadow: `0 4px 0 ${c}aa` }}>
                      <div className="text-4xl mb-2">{f.emoji}</div>
                      <p className="font-black text-sm text-slate-800 leading-snug kid-display">{f.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl border-4 border-pink-200 p-6 sm:p-8" style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}>
          <div className="flex items-end justify-between mb-6 flex-wrap gap-2">
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-1 kid-display" style={{ color: '#FF6B9D' }}>🎓 Khóa học</p>
              <h2 className="text-2xl sm:text-3xl font-black kid-display" style={{ background: 'linear-gradient(135deg, #FF6B9D, #FFD93D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Các khóa học dành cho bé</h2>
            </div>
            <Link href="/khoa-hoc" className="text-sm font-black kid-display px-4 py-2 rounded-full text-white shrink-0" style={{ background: 'linear-gradient(135deg, #FF6B9D, #FF9F45)', boxShadow: '0 3px 0 #c2185b' }}>
              Xem tất cả →
            </Link>
          </div>

          {courses.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Chưa có khóa học nào.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link key={course.id} href={`/khoa-hoc/${course.slug}`}
                  className="group flex gap-4 items-start rounded-3xl border-4 border-pink-100 p-4 kid-card-hover bg-white">
                  {course.thumbnailUrl ? (
                    <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden">
                      <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-14 w-14 shrink-0 rounded-xl bg-[#6ec6c6]/20 flex items-center justify-center text-2xl">📚</div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 group-hover:text-[#0e7490] leading-snug text-sm">{course.title}</h3>
                    {course.shortDescription && (
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.shortDescription}</p>
                    )}
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {course.isFree && <span className="text-xs font-semibold text-emerald-600">Miễn phí</span>}
                      {course.totalLessons > 0 && <span className="text-xs text-slate-400">{course.totalLessons} bài học</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl border-4 border-yellow-200 p-6 sm:p-8" style={{ boxShadow: '0 8px 30px rgba(255,217,61,0.20)' }}>
          <div className="text-center mb-8">
            <p className="text-xs font-black uppercase tracking-widest mb-2 kid-display" style={{ color: '#FF6B9D' }}>✨ Tại sao chọn Bé Hay Học ✨</p>
            <h2 className="text-3xl font-black kid-display" style={{ background: 'linear-gradient(135deg, #FF6B9D, #A06CD5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Học hiệu quả, bé vui, bố mẹ yên tâm</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([
              { emoji: '⏱️', title: 'Bài học ngắn 5–10 phút', desc: 'Phù hợp khả năng tập trung của trẻ nhỏ, không bị quá tải.', color: '#FF6B9D', bg: 'linear-gradient(135deg, #FFE5F1 0%, #FFD6E8 100%)' },
              { emoji: '🎯', title: 'Đúng độ tuổi', desc: 'Nội dung được phân cấp theo từng lứa tuổi từ 3 đến 10 tuổi.', color: '#4ECDC4', bg: 'linear-gradient(135deg, #C9F0FF 0%, #B3E5DC 100%)' },
              { emoji: '📊', title: 'Theo dõi tiến độ', desc: 'Phụ huynh nắm rõ bé học gì, làm tốt gì và cần ôn gì.', color: '#A06CD5', bg: 'linear-gradient(135deg, #EBD8FF 0%, #DDC3FF 100%)' },
              { emoji: '💛', title: 'Không áp lực', desc: 'Học qua trò chơi và video giúp bé hứng thú, không chán.', color: '#FF9F45', bg: 'linear-gradient(135deg, #FFF4D6 0%, #FFE5B4 100%)' },
            ] as const).map((f) => (
              <div key={f.title} className="rounded-3xl p-5 kid-card-hover" style={{ background: f.bg, border: `3px solid ${f.color}`, boxShadow: `0 4px 0 ${f.color}66` }}>
                <div className="text-4xl mb-2">{f.emoji}</div>
                <h3 className="font-black text-slate-900 text-sm mb-1.5 kid-display" style={{ color: f.color }}>{f.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAMES ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl border-4 border-purple-200 p-6 sm:p-8" style={{ boxShadow: '0 8px 30px rgba(160,108,213,0.20)' }}>
          <div className="flex items-end justify-between mb-6 flex-wrap gap-2">
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-1 kid-display" style={{ color: '#A06CD5' }}>🎮 Trò chơi giáo dục</p>
              <h2 className="text-2xl sm:text-3xl font-black kid-display" style={{ background: 'linear-gradient(135deg, #A06CD5, #4ECDC4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Vừa chơi vừa học mỗi ngày</h2>
            </div>
            <Link href="/tro-choi" className="text-sm font-black kid-display px-4 py-2 rounded-full text-white shrink-0" style={{ background: 'linear-gradient(135deg, #A06CD5, #FF6B9D)', boxShadow: '0 3px 0 #7c3aed' }}>
              Xem tất cả →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {homepageGames.map((g) => {
              const scheme = GROUP_COLORS[g.groupKey] ?? { color: '#A06CD5', bg: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)' };
              return (
                <Link key={g.slug} href={`/tro-choi/${g.slug}`}
                  className="group rounded-3xl p-5 kid-card-hover flex flex-col snap-start shrink-0"
                  style={{ width: 180, background: scheme.bg, border: `3px solid ${scheme.color}`, boxShadow: `0 4px 0 ${scheme.color}66` }}>
                  <div className="text-5xl mb-3">{g.emoji}</div>
                  <h3 className="font-black text-base leading-snug kid-display" style={{ color: scheme.color }}>{g.title}</h3>
                  <p className="mt-1 text-xs font-bold text-slate-600">{g.age}</p>
                  <span className="mt-4 text-xs font-black px-3 py-1.5 rounded-full text-white w-fit kid-display" style={{ background: scheme.color, boxShadow: `0 2px 0 ${scheme.color}99` }}>Chơi ngay »</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BÀI VIẾT ── */}
      {articles.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="bg-white rounded-3xl border-4 border-cyan-200 p-6 sm:p-8" style={{ boxShadow: '0 8px 30px rgba(78,205,196,0.20)' }}>
            <div className="flex items-end justify-between mb-6 flex-wrap gap-2">
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-1 kid-display" style={{ color: '#4ECDC4' }}>📚 Góc kiến thức</p>
                <h2 className="text-2xl sm:text-3xl font-black kid-display" style={{ background: 'linear-gradient(135deg, #4ECDC4, #FF6B9D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bài viết hữu ích cho ba mẹ</h2>
              </div>
              <Link href="/bai-viet" className="text-sm font-black kid-display px-4 py-2 rounded-full text-white shrink-0" style={{ background: 'linear-gradient(135deg, #4ECDC4, #6BCB77)', boxShadow: '0 3px 0 #0e9488' }}>
                Xem tất cả →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {articles.map((article, idx) => {
                const colors = ['#FF6B9D', '#4ECDC4', '#A06CD5', '#FF9F45'];
                const c = colors[idx % colors.length];
                return (
                  <Link key={article.id} href={`/bai-viet/${article.slug}`}
                    className="group flex flex-col rounded-3xl overflow-hidden kid-card-hover bg-white"
                    style={{ border: `3px solid ${c}`, boxShadow: `0 4px 0 ${c}66` }}>
                    <div className="relative w-full aspect-[16/9] shrink-0" style={{ background: `linear-gradient(135deg, ${c}, ${c}88)` }}>
                      {article.thumbnailUrl
                        ? <Image src={article.thumbnailUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                        : <div className="absolute inset-0 flex items-center justify-center text-4xl">📝</div>
                      }
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-black text-slate-900 text-sm leading-snug line-clamp-2 flex-1 kid-display">{article.title}</h3>
                      {article.excerpt && (
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                      )}
                      <span className="mt-3 text-xs font-black px-3 py-1.5 rounded-full text-white w-fit kid-display" style={{ background: c, boxShadow: `0 2px 0 ${c}99` }}>Đọc thêm »</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-10">
        <div className="rounded-[32px] px-8 py-10 text-center text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #FFD93D 50%, #4ECDC4 100%)', boxShadow: '0 12px 40px rgba(255,107,157,0.35)' }}>
          <span aria-hidden className="absolute top-4 left-6 text-4xl opacity-80" style={{ animation: 'wiggle 3s infinite' }}>🚀</span>
          <span aria-hidden className="absolute bottom-4 right-6 text-4xl opacity-80" style={{ animation: 'bounce-pop 2.5s infinite' }}>🌟</span>
          <h2 className="text-3xl sm:text-4xl font-black mb-3 kid-display drop-shadow-md">Bắt đầu cùng bé hôm nay 🎉</h2>
          <p className="text-white/90 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            Đăng ký miễn phí, khám phá bài học và trò chơi phù hợp với độ tuổi của bé ngay bây giờ.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/dang-ky"
              className="kid-btn-3d text-sm" style={{ background: 'white', color: '#FF6B9D', boxShadow: '0 6px 0 rgba(0,0,0,0.18)' }}>
              ✨ Đăng ký miễn phí
            </Link>
            <Link href="/khoa-hoc"
              className="kid-btn-3d text-sm" style={{ background: 'linear-gradient(135deg, #A06CD5, #6d28d9)', boxShadow: '0 6px 0 #4c1d95' }}>
              📚 Xem khóa học
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
