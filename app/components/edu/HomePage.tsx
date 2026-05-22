import Link from 'next/link';
import Image from 'next/image';
import type { ApiCourse } from '../../lib/api';

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
  const courses = await fetchCourses();

  return (
    <main>
      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left */}
            <div className="p-8 sm:p-10 flex flex-col justify-center">
              <span className="inline-block rounded-full bg-[#6ec6c6]/20 text-[#0e7490] text-xs font-bold px-3 py-1 mb-4 w-fit">
                Nền tảng học tập cho bé 3–10 tuổi
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Học vui mỗi ngày —<br />
                <span className="text-[#c0392b]">bé tiến bộ thấy rõ</span>
              </h1>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Bài học ngắn, trò chơi giáo dục và bài tập luyện tập giúp bé học hiệu quả tại nhà. Phụ huynh theo dõi tiến độ dễ dàng mỗi ngày.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/khoa-hoc"
                  className="rounded-full bg-[#c0392b] text-white font-bold px-6 py-2.5 text-sm hover:bg-[#a93226] transition shadow-sm">
                  Xem khóa học
                </Link>
                <Link href="/tro-choi"
                  className="rounded-full bg-white border-2 border-[#6ec6c6] text-[#0e7490] font-bold px-6 py-2.5 text-sm hover:bg-[#6ec6c6]/10 transition">
                  Kho trò chơi
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
            <div className="bg-gradient-to-br from-[#6ec6c6]/30 to-[#6ec6c6]/10 p-8 flex items-center justify-center min-h-[280px]">
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                {FEATURES.map((f) => (
                  <div key={f.title} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="text-3xl mb-2">{f.emoji}</div>
                    <p className="font-bold text-sm text-slate-800 leading-snug">{f.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#c0392b] mb-1">Khóa học</p>
              <h2 className="text-2xl font-black text-slate-900">Các khóa học dành cho bé</h2>
            </div>
            <Link href="/khoa-hoc" className="text-sm font-bold text-[#0e7490] hover:underline shrink-0">
              Xem tất cả →
            </Link>
          </div>

          {courses.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Chưa có khóa học nào.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link key={course.id} href={`/khoa-hoc/${course.slug}`}
                  className="group flex gap-4 items-start rounded-xl border border-slate-100 p-4 hover:border-[#6ec6c6] hover:shadow-sm transition-all">
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
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c0392b] mb-1">Tại sao chọn Bé Hay Học</p>
            <h2 className="text-2xl font-black text-slate-900">Học hiệu quả, bé vui, bố mẹ yên tâm</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: '⏱️', title: 'Bài học ngắn 5–10 phút', desc: 'Phù hợp khả năng tập trung của trẻ nhỏ, không bị quá tải.' },
              { emoji: '🎯', title: 'Đúng độ tuổi', desc: 'Nội dung được phân cấp theo từng lứa tuổi từ 3 đến 10 tuổi.' },
              { emoji: '📊', title: 'Theo dõi tiến độ', desc: 'Phụ huynh nắm rõ bé học gì, làm tốt gì và cần ôn gì.' },
              { emoji: '💛', title: 'Không áp lực', desc: 'Học qua trò chơi và video giúp bé hứng thú, không chán.' },
            ].map((f) => (
              <div key={f.title} className="rounded-xl bg-slate-50 p-5">
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAMES ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#c0392b] mb-1">Trò chơi giáo dục</p>
              <h2 className="text-2xl font-black text-slate-900">Vừa chơi vừa học mỗi ngày</h2>
            </div>
            <Link href="/tro-choi" className="text-sm font-bold text-[#0e7490] hover:underline shrink-0">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: '🔤', title: 'Ghép chữ với hình', age: '4–6 tuổi', href: '/tro-choi/ghep-tu' },
              { emoji: '➕', title: 'Toán vui cộng trừ', age: '5–7 tuổi', href: '/tro-choi/toan-vui' },
              { emoji: '🧠', title: 'Săn hình ghi nhớ', age: '4–6 tuổi', href: '/tro-choi/san-hinh-ghi-nho' },
              { emoji: '🌍', title: 'Từ vựng tiếng Anh', age: '6–8 tuổi', href: '/tro-choi/tu-vung-tieng-anh' },
            ].map((g) => (
              <Link key={g.title} href={g.href}
                className="group rounded-xl border border-slate-100 p-5 hover:border-[#6ec6c6] hover:shadow-sm transition-all flex flex-col">
                <div className="text-4xl mb-3">{g.emoji}</div>
                <h3 className="font-bold text-slate-900 group-hover:text-[#0e7490] text-sm leading-snug">{g.title}</h3>
                <p className="mt-1 text-xs text-slate-400">{g.age}</p>
                <span className="mt-4 text-xs font-bold text-[#c0392b] group-hover:underline">Chơi ngay →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-10">
        <div className="rounded-2xl bg-[#c0392b] px-8 py-10 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Bắt đầu cùng bé hôm nay</h2>
          <p className="text-white/80 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            Đăng ký miễn phí, khám phá bài học và trò chơi phù hợp với độ tuổi của bé ngay bây giờ.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/dang-ky"
              className="rounded-full bg-white text-[#c0392b] font-bold px-6 py-2.5 text-sm hover:bg-slate-100 transition shadow">
              Đăng ký miễn phí
            </Link>
            <Link href="/khoa-hoc"
              className="rounded-full border border-white/40 text-white font-bold px-6 py-2.5 text-sm hover:bg-white/10 transition">
              Xem khóa học
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
