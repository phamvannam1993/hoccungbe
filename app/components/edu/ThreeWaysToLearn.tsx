import Link from 'next/link';

// "3 cách học" — cùng một kho bài, ba lối vào khác nhau:
//  📚 theo sách   — bé đang bám chương trình trên lớp
//  🎯 theo kỹ năng — bé đang vướng một mảng cụ thể (phép chia, toán có lời văn…)
//  🚀 học hôm nay  — bé/phụ huynh không muốn phải chọn, để hệ thống chọn hộ
// Đặt ngay dưới hero trang chủ để phụ huynh chọn lối vào trước khi xem khoá học.

const WAYS = [
  {
    href: '/khoa-hoc',
    emoji: '📚',
    eyebrow: 'Bám sát trên lớp',
    title: 'Học theo sách',
    desc: 'Đi đúng thứ tự sách giáo khoa: chọn lớp, chọn môn, học lần lượt từng bài như cô dạy trên lớp.',
    cta: 'Chọn khóa học',
    color: '#FF6B9D',
    border: 'border-pink-200',
    tint: 'bg-pink-50',
    shadow: 'rgba(255,107,157,0.20)',
  },
  {
    href: '/ky-nang',
    emoji: '🎯',
    eyebrow: 'Luyện đúng chỗ yếu',
    title: 'Học theo kỹ năng',
    desc: 'Con yếu phép chia hay toán có lời văn? Vào thẳng kỹ năng đó — hệ thống gom sẵn bài từ nhiều bài trong sách.',
    cta: 'Chọn kỹ năng',
    color: '#7C3AED',
    border: 'border-violet-200',
    tint: 'bg-violet-50',
    shadow: 'rgba(124,58,237,0.20)',
  },
  {
    href: '/hoc-hom-nay',
    emoji: '🚀',
    eyebrow: 'Không phải nghĩ',
    title: 'Học hôm nay',
    desc: 'Hệ thống tự chọn bài cho bé mỗi ngày, ưu tiên câu bé từng làm sai. Khoảng 7 phút là xong.',
    cta: 'Bắt đầu ngay',
    color: '#0891B2',
    border: 'border-cyan-200',
    tint: 'bg-cyan-50',
    shadow: 'rgba(8,145,178,0.20)',
  },
];

export default function ThreeWaysToLearn() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6" aria-label="Ba cách học trên Bé Hay Học">
      <div className="mb-4 text-center">
        <p className="text-[11px] font-black uppercase tracking-widest kid-display" style={{ color: '#7C3AED' }}>
          Bé muốn học kiểu nào?
        </p>
        <h2
          className="text-xl sm:text-3xl font-black kid-display"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #0891B2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          3 cách học, cùng một kho bài
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {WAYS.map((w) => (
          <Link
            key={w.href}
            href={w.href}
            className={`group flex flex-col rounded-3xl border-4 bg-white p-5 transition hover:-translate-y-1 ${w.border}`}
            style={{ boxShadow: `0 8px 30px ${w.shadow}` }}
          >
            <span
              className={`grid h-14 w-14 place-items-center rounded-2xl text-3xl ${w.tint}`}
              aria-hidden
            >
              {w.emoji}
            </span>
            <p className="mt-3 text-[11px] font-black uppercase tracking-widest kid-display" style={{ color: w.color }}>
              {w.eyebrow}
            </p>
            <h3 className="text-lg sm:text-xl font-black kid-display text-slate-900">{w.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{w.desc}</p>
            <span
              className="mt-4 inline-flex items-center gap-1 text-sm font-black kid-display"
              style={{ color: w.color }}
            >
              {w.cta}
              <span className="transition group-hover:translate-x-0.5" aria-hidden>→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
