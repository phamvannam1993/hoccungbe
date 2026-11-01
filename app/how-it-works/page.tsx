import Link from 'next/link';
import type React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, Brain, ChevronDown, Sparkles } from 'lucide-react';
import InstallAppCard from './InstallAppCard';
import { CONTACT, zaloLink } from '../lib/contact';

export const metadata: Metadata = {
  title: 'Cách bắt đầu cho bé học tại nhà',

  description:
    'Hướng dẫn phụ huynh bắt đầu cho bé học tại nhà với Bé Hay Học: chọn độ tuổi, chọn bài học hoặc trò chơi giáo dục phù hợp, theo dõi tiến độ và đồng hành cùng con mỗi ngày.',

  keywords: [
    'cách bắt đầu bé hay học',
    'cho bé học tại nhà',
    'hướng dẫn bé học online',
    'cách cho bé học hiệu quả',
    'trò chơi giáo dục cho bé',
    'nền tảng học tập cho bé',
    'phụ huynh đồng hành cùng con',
  ],

  alternates: {
    canonical: '/huong-dan',
  },

  openGraph: {
    title: 'Cách bắt đầu cho bé học tại nhà | Bé Hay Học',
    description:
      'Chỉ với vài bước đơn giản, phụ huynh có thể chọn nội dung học phù hợp và đồng hành cùng bé mỗi ngày.',
    url: '/huong-dan',
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-how-it-works.jpg',
        width: 1200,
        height: 630,
        alt: 'Cách bắt đầu bé hay học tại nhà',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Cách bắt đầu cho bé học tại nhà | Bé Hay Học',
    description:
      'Hướng dẫn phụ huynh chọn bài học, trò chơi giáo dục và theo dõi tiến độ học tập của bé.',
    images: ['/og-how-it-works.jpg'],
  },
};

const steps = [
  {
    icon: '/icons/hom-nay/13_book_purple.webp',
    color: 'from-pink-400 to-rose-500',
    tint: 'bg-pink-50',
    title: 'Chọn lớp của bé',
    description: 'Mẫu giáo hay lớp 1–5 — chọn một lần, lần sau vào là thẳng lớp của bé. Bài học bám sát chương trình của Bộ GD&ĐT.',
  },
  {
    icon: '/icons/khao_sat/02_header_book_star.webp',
    color: 'from-amber-400 to-orange-500',
    tint: 'bg-amber-50',
    title: 'Học bài ngắn, có hình và tiếng',
    description: 'Mỗi bài chỉ vài phút: giải thích bằng hình ảnh, giọng đọc rõ ràng và ví dụ gần gũi để bé tự hiểu.',
  },
  {
    icon: '/icons/hom-nay/08_gamepad_orange.webp',
    color: 'from-emerald-400 to-teal-500',
    tint: 'bg-emerald-50',
    title: 'Luyện tập bằng trò chơi',
    description: 'Bé chơi mà học: nối cặp, kéo thả, tìm quy luật, mê cung… Đúng là được khen ngay, sai có gợi ý làm lại.',
  },
  {
    icon: '/icons/hom-nay/17_chart_growth_green.webp',
    color: 'from-sky-400 to-blue-600',
    tint: 'bg-sky-50',
    title: 'Bố mẹ xem tiến độ',
    description: 'Sao, huy chương và báo cáo tuần cho biết bé giỏi phần nào, phần nào cần ôn thêm — để đồng hành đúng lúc.',
  },
];

const ways = [
  {
    href: '/khoa-hoc',
    icon: '/icons/hom-nay/01_book_blue_circle.webp',
    title: 'Học theo lớp',
    description: 'Toán, Tiếng Việt, Tiếng Anh theo từng bài của sách giáo khoa, có bài tập và đề ôn thi.',
    cta: 'Chọn lớp học',
    color: 'bg-sky-50 text-sky-700 ring-sky-100',
  },
  {
    href: '/tro-choi',
    icon: '/icons/khao_sat/07_puzzle_level.webp',
    title: 'Trò chơi giáo dục',
    description: 'Hàng chục trò chơi rèn trí nhớ, phản xạ, tư duy logic — miễn phí, chơi ngay không cần tài khoản.',
    cta: 'Chơi thử ngay',
    color: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  {
    href: '/khoa-hoc-iq',
    icon: '/icons/khao_sat/06_brain_skill.webp',
    title: 'Khóa Toán IQ',
    description: '12 khóa thử thách tư duy mỗi lớp (lớp 1–3), 60 bài dạng game, có lý thuyết, gợi ý và lời giải từng bước.',
    cta: 'Xem khóa Toán IQ',
    color: 'bg-violet-50 text-violet-700 ring-violet-100',
  },
];

const tips = [
  { icon: '/icons/hom-nay/02_clock_green_circle.webp', text: 'Mỗi lần học 10–15 phút là đủ — ngắn mà đều mỗi ngày hiệu quả hơn học dồn.' },
  { icon: '/icons/hom-nay/03_star_badge_purple.webp', text: 'Bắt đầu bằng bài dễ để bé thấy mình làm được, rồi tăng dần độ khó.' },
  { icon: '/icons/09_huy_chuong.png', text: 'Khen nỗ lực của bé ("con chăm quá!") thay vì chỉ khen đúng sai.' },
  { icon: '/icons/khao_sat/11_chat_info.webp', text: 'Ngồi cùng bé vài phút đầu, hỏi "con làm thế nào?" để bé tự giải thích.' },
];

const faqs = [
  {
    q: 'Bé Hay Học có miễn phí không?',
    a: 'Phần lớn bài học, trò chơi và đề ôn đều miễn phí. Riêng các khóa Toán IQ là khóa nâng cao có phí theo tháng; mỗi khóa luôn có bài học thử miễn phí.',
  },
  {
    q: 'Có cần tạo tài khoản không?',
    a: 'Không bắt buộc — bé vào học ngay được. Tạo tài khoản phụ huynh (miễn phí) để lưu tiến độ, xem báo cáo và học tiếp trên máy khác.',
  },
  {
    q: 'Cài app trên điện thoại thế nào?',
    a: 'Không cần vào kho ứng dụng: bấm nút "Cài App" (Android, máy tính) hoặc làm 3 bước "Thêm vào MH chính" trên iPhone ở phần cài app phía trên.',
  },
  {
    q: 'Mua khóa Toán IQ như thế nào?',
    a: 'Đăng nhập, bấm "Mua" ở khóa muốn học rồi chuyển khoản theo mã QR (nội dung là mã kích hoạt). Bé Hay Học xác nhận xong, khóa tự mở trên tài khoản, học 1 tháng tính từ lúc kích hoạt.',
  },
  {
    q: 'Bé nên học bao lâu mỗi ngày?',
    a: 'Khoảng 10–20 phút tùy tuổi. Trẻ nhỏ nên chia thành 1–2 lần ngắn, xen kẽ trò chơi để giữ hứng thú.',
  },
];

const GAME_STYLE = [
  ['🎯', 'bg-rose-50 text-rose-600'],
  ['🔗', 'bg-amber-50 text-amber-600'],
  ['🔢', 'bg-emerald-50 text-emerald-600'],
  ['🧩', 'bg-sky-50 text-sky-600'],
  ['✋', 'bg-violet-50 text-violet-600'],
  ['↕️', 'bg-pink-50 text-pink-600'],
  ['🧠', 'bg-indigo-50 text-indigo-600'],
  ['🔁', 'bg-teal-50 text-teal-600'],
  ['🌀', 'bg-orange-50 text-orange-600'],
  ['🔍', 'bg-lime-50 text-lime-700'],
];

const gameTypes = [
  {
    name: 'Chọn đáp án đúng',
    howToPlay:
      'Bé đọc/nghe câu hỏi kèm hình minh họa rồi chọn đáp án đúng, được khen ngay khi chọn đúng.',
    skills: ['Nhận biết & phân loại', 'Ghi nhớ', 'Ra quyết định', 'Tập trung'],
    basis:
      'Phản hồi tức thì trong học tăng cường giúp bé ghi nhớ bền hơn và giảm áp lực sợ sai.',
    age: '4–8 tuổi',
  },
  {
    name: 'Nối cặp tương ứng',
    howToPlay:
      'Bé nối các mục tương ứng: chữ với hình, số với số lượng, con vật với thức ăn…',
    skills: ['Tư duy liên kết', 'Tương ứng 1–1', 'Phối hợp mắt – tay'],
    basis:
      'Tương ứng 1–1 là bước nền cho khái niệm số lượng theo lý thuyết phát triển nhận thức của Piaget.',
    age: '4–7 tuổi',
  },
  {
    name: 'Sắp xếp thứ tự',
    howToPlay:
      'Bé sắp xếp các mục theo đúng trình tự: số tăng dần, bảng chữ cái, hoặc các bước.',
    skills: ['Tư duy logic', 'Hiểu thứ tự', 'So sánh lớn – nhỏ', 'Lập kế hoạch'],
    basis:
      'Rèn tư duy chuỗi (seriation) — dấu mốc giai đoạn thao tác cụ thể của Piaget, nền cho tiền đọc–viết & toán.',
    age: '5–9 tuổi',
  },
  {
    name: 'Ghép hình giống nhau',
    howToPlay: 'Bé quan sát và ghép các hình giống nhau hoặc tương ứng với nhau.',
    skills: ['Quan sát chi tiết', 'Trí nhớ hình ảnh', 'Phân biệt tương đồng'],
    basis:
      'Phát triển trí nhớ thị giác — nền tảng để bé nhận mặt chữ cái, chữ số và học đọc.',
    age: '3–7 tuổi',
  },
  {
    name: 'Kéo thả phân loại',
    howToPlay:
      'Bé dùng ngón tay kéo từng mục về đúng vị trí hoặc đúng nhóm.',
    skills: ['Vận động tinh', 'Phối hợp mắt – tay', 'Phân loại'],
    basis:
      'Học qua thao tác tay (Montessori): trẻ thao tác trực tiếp sẽ ghi nhớ sâu và hiểu bản chất tốt hơn.',
    age: '3–7 tuổi',
  },
  {
    name: 'Kéo thả sắp xếp',
    howToPlay:
      'Bé vừa kéo thả vừa sắp xếp các mục theo đúng thứ tự trong cùng một trò chơi.',
    skills: ['Vận động + logic', 'Giải quyết nhiều bước', 'Tự sửa lỗi'],
    basis:
      'Kết hợp vận động và logic phát triển chức năng điều hành (executive function) — dự báo mạnh cho kết quả học tập.',
    age: '5–9 tuổi',
  },
  {
    name: 'Ma trận ghi nhớ',
    howToPlay:
      'Bé quan sát một lưới ô (2×2, 3×3…), ghi nhớ vị trí rồi tái hiện lại.',
    skills: ['Trí nhớ làm việc', 'Tư duy không gian', 'Tập trung cao'],
    basis:
      'Rèn trí nhớ làm việc — theo nghiên cứu của Alloway, dự báo thành tích học tập còn mạnh hơn cả IQ.',
    age: '5–10 tuổi',
  },
  {
    name: 'Tìm quy luật',
    howToPlay:
      'Bé quan sát một dãy màu sắc/hình khối/con số, nhận ra quy luật và chọn phần tử tiếp theo.',
    skills: ['Nhận biết quy luật', 'Tư duy toán học', 'Dự đoán'],
    basis:
      'Pattern recognition là nền tảng của tư duy đại số sớm; trẻ giỏi tìm quy luật thường học toán thuận lợi hơn.',
    age: '5–10 tuổi',
  },
  {
    name: 'Mê cung tìm đường',
    howToPlay:
      'Bé tìm và vẽ đường đi từ điểm bắt đầu đến đích, tránh các ngõ cụt.',
    skills: ['Định hướng không gian', 'Lập kế hoạch', 'Kiên trì'],
    basis:
      'Rèn định hướng không gian và lập kế hoạch (planning) — chức năng điều hành của thùy trán.',
    age: '4–9 tuổi',
  },
  {
    name: 'Tìm điểm khác biệt',
    howToPlay: 'Bé so sánh hai bức tranh gần giống nhau và tìm ra các điểm khác biệt.',
    skills: ['Chú ý chi tiết', 'Chú ý chọn lọc', 'So sánh', 'Kiên nhẫn'],
    basis:
      'Rèn chú ý chọn lọc và tri giác thị giác — giúp trẻ đọc kỹ, phát hiện lỗi và tập trung lâu hơn.',
    age: '4–9 tuổi',
  },
];

const SECTION = 'mx-auto max-w-6xl px-4 sm:px-6';

function SectionTitle({ eyebrow, title, mau, children }: { eyebrow: string; title: string; mau: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="kid-display inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.16em] shadow-sm ring-1 ring-slate-100" style={{ color: mau }}>
        {eyebrow}
      </p>
      <h2 className="kid-display mt-3 text-[28px] font-black leading-tight text-slate-900 sm:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-[15px] leading-7 text-slate-600 sm:text-base">{children}</p>}
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="kid-bg overflow-hidden pb-16">
      {/* ── Hero: cùng nền trời với hero trang chủ và trang giới thiệu. */}
      <section className={`${SECTION} pt-5`}>
        <div className="relative overflow-hidden rounded-[32px] px-5 py-8 shadow-[0_14px_40px_rgba(30,90,168,0.14)] sm:px-10 lg:py-10"
          style={{ background: 'linear-gradient(180deg,#bfe9ff 0%,#daf3ff 50%,#eaf9e6 100%)' }}>
          <div className="pointer-events-none absolute inset-0 select-none" aria-hidden>
            <span className="absolute left-[3%] top-[6%] text-4xl opacity-70">☁️</span>
            <span className="absolute left-[46%] top-[4%] hidden text-3xl opacity-60 lg:block">☁️</span>
          </div>
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-black text-slate-600 shadow-sm">
                <Sparkles size={14} className="text-amber-500" /> Hướng dẫn cho bố mẹ
              </span>
              <h1 className="kid-display mt-3 text-[34px] font-black leading-[1.08] sm:text-[42px]">
                <span className="block text-[#1e5aa8]">Cho bé học tại nhà</span>
                <span className="block text-[#f5911e]">vui như chơi, đều mỗi ngày</span>
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
                Chỉ 4 bước để bé bắt đầu với Bé Hay Học: chọn lớp, học bài ngắn có hình và tiếng, luyện bằng trò chơi và để bố mẹ
                theo dõi tiến độ.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/khoa-hoc"
                  className="kid-display inline-flex items-center gap-2 rounded-full px-6 py-3 font-black text-[#7a4a00] transition active:translate-y-0.5"
                  style={{ background: 'linear-gradient(180deg,#ffd452 0%,#f7b731 100%)', boxShadow: '0 5px 0 #d99a12' }}>
                  Bắt đầu học ngay <ArrowRight size={18} />
                </Link>
                <a href="#cai-app"
                  className="kid-display inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-black text-[#1e5aa8] transition active:translate-y-0.5"
                  style={{ boxShadow: '0 5px 0 #b6d9f2' }}>
                  📲 Cài app miễn phí
                </a>
              </div>
              <ul className="mt-6 flex flex-wrap gap-2">
                {['✅ Bám sát SGK lớp 1–5', '🔊 Có giọng đọc cho bé', '🆓 Phần lớn bài miễn phí'].map((t) => (
                  <li key={t} className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-600">{t}</li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-[380px]">
              {/* Linh vật giữa vòng nền, các nhãn nổi quanh. */}
              <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-pink-300 shadow-inner" />
              <div className="absolute inset-[16%] rounded-full bg-white/50" />
              <Image
                src="/assets/images/01-mascot-tiger-trophy.webp"
                alt="Linh vật Bé Hay Học"
                width={388}
                height={420}
                priority
                className="bhh-float absolute left-[19%] top-[14%] w-[62%] drop-shadow-xl"
              />
              {[
                { t: '📚 Bài học ngắn', c: 'left-0 top-[10%] text-sky-700' },
                { t: '🎮 Học qua trò chơi', c: 'right-0 top-[30%] text-emerald-700' },
                { t: '🔊 Có giọng đọc', c: 'left-0 bottom-[22%] text-violet-700' },
                { t: '⭐ Sao & huy chương', c: 'right-[2%] bottom-[6%] text-orange-600' },
              ].map((chip) => (
                <span key={chip.t} className={`kid-display absolute rounded-full bg-white px-3.5 py-1.5 text-xs font-black shadow-lg ring-1 ring-slate-100 sm:text-sm ${chip.c}`}>
                  {chip.t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 bước ── */}
      <section className={`${SECTION} pt-14`}>
        <SectionTitle eyebrow="4 bước bắt đầu" title="Bé học thế nào trên Bé Hay Học?" mau="#db2777" />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex flex-col items-center rounded-[28px] bg-white p-6 text-center shadow-[0_4px_18px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg">
              <span className={`grid h-[72px] w-[72px] place-items-center rounded-full ${step.tint} ring-[6px] ring-white`}>
                <Image src={step.icon} alt="" width={64} height={64} className="h-12 w-12 object-contain" />
              </span>
              <span className={`kid-display -mt-3 rounded-full bg-gradient-to-r ${step.color} px-3 py-0.5 text-xs font-black text-white shadow`}>
                Bước {i + 1}
              </span>
              <h3 className="kid-display mt-3 text-lg font-black leading-snug text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Cài app ── */}
      <section id="cai-app" className={`${SECTION} scroll-mt-24 pt-14`}>
        <InstallAppCard />
      </section>

      {/* ── 3 cách học ── */}
      <section className={`${SECTION} pt-14`}>
        <SectionTitle eyebrow="Chọn cách học" title="3 cách học, cùng một kho bài" mau="#059669" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ways.map((w) => (
            <Link key={w.href} href={w.href} className="group flex flex-col rounded-[28px] bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg sm:p-7">
              <span className={`grid h-16 w-16 place-items-center rounded-2xl ring-4 ${w.color}`}>
                <Image src={w.icon} alt="" width={64} height={64} className="h-11 w-11 object-contain" />
              </span>
              <h3 className="kid-display mt-4 text-xl font-black text-slate-900 sm:text-2xl">{w.title}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-7 text-slate-600">{w.description}</p>
              <span className="kid-display mt-5 inline-flex items-center gap-1.5 font-black text-[#1e5aa8] transition-all group-hover:gap-3">
                {w.cta} <ArrowRight size={18} />
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-600">
          Muốn xem hết mọi thứ Bé Hay Học có?{' '}
          <Link href="/gioi-thieu" className="kid-display font-black text-[#c81e5b] hover:underline">Xem toàn bộ tính năng →</Link>
        </p>
      </section>

      {/* ── Các dạng trò chơi: 2 cột thẻ ngang thay vì 5 cột hẹp làm gãy tên trò chơi. */}
      <section className={`${SECTION} pt-14`}>
        <SectionTitle eyebrow="10 dạng trò chơi" title="Mỗi trò chơi rèn một nhóm kỹ năng" mau="#7c3aed">
          Thiết kế dựa trên phương pháp giáo dục sớm (Montessori, Piaget) và nghiên cứu về trí nhớ làm việc, chức năng điều hành ở trẻ.
        </SectionTitle>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {gameTypes.map((g, i) => {
            const [emoji, tone] = GAME_STYLE[i % GAME_STYLE.length];
            return (
              <article key={g.name} className="flex gap-4 rounded-3xl bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.05)] ring-1 ring-slate-100">
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl ${tone}`} aria-hidden>{emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h3 className="kid-display text-lg font-black leading-tight text-slate-900">{g.name}</h3>
                    <span className="text-xs font-bold text-slate-400">{g.age}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{g.howToPlay}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {g.skills.map((sk) => (
                      <span key={sk} className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tone}`}>{sk}</span>
                    ))}
                  </div>
                  <details className="group mt-3">
                    <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-black text-violet-600">
                      <Brain size={14} /> Cơ sở giáo dục
                      <ChevronDown size={14} className="transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 rounded-2xl bg-violet-50 p-3 text-xs leading-5 text-slate-600">{g.basis}</p>
                  </details>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Gợi ý cho bố mẹ ── */}
      <section className={`${SECTION} pt-14`}>
        <div className="grid gap-8 rounded-[32px] p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr]" style={{ background: 'linear-gradient(135deg,#FFF7D6 0%,#FFE8C2 55%,#FFD9E6 100%)' }}>
          <div>
            <p className="kid-display text-[11px] font-black uppercase tracking-[0.16em] text-orange-600">Gợi ý cho bố mẹ</p>
            <h2 className="kid-display mt-2 text-[28px] font-black leading-tight text-slate-900 sm:text-4xl">Để bé học đều mà không áp lực</h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-700">
              Với trẻ nhỏ, điều quan trọng là cảm giác vui và “mình làm được”. Học ngắn, có hình ảnh, được khích lệ đúng lúc sẽ giúp bé
              tự giác mở bài mỗi ngày.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {tips.map((t) => (
              <li key={t.text} className="flex gap-3 rounded-2xl bg-white/90 p-4 shadow-sm">
                <Image src={t.icon} alt="" width={40} height={40} className="h-10 w-10 shrink-0 object-contain" />
                <p className="text-sm leading-6 text-slate-700">{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Câu hỏi thường gặp ── */}
      <section className="mx-auto max-w-3xl px-4 pt-14 sm:px-6">
        <SectionTitle eyebrow="Hỏi nhanh" title="Câu hỏi thường gặp" mau="#2563eb" />
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 open:ring-2 open:ring-sky-200">
              <summary className="kid-display flex cursor-pointer list-none items-center justify-between gap-4 font-black text-slate-900">
                {f.q}
                <ChevronDown size={20} className="shrink-0 text-slate-400 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[15px] leading-7 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-600">
          Cần hỗ trợ thêm? Nhắn Zalo{' '}
          <a href={zaloLink()} target="_blank" rel="noopener noreferrer" className="font-bold text-[#1e5aa8] underline">
            {CONTACT.zaloDisplay}
          </a>{' '}
          hoặc{' '}
          <Link href={CONTACT.supportPath} className="font-bold text-[#1e5aa8] underline">
            gửi form liên hệ
          </Link>
          .
        </p>
      </section>

      {/* ── CTA ── */}
      <section className={`${SECTION} pt-14`}>
        <div className="relative overflow-hidden rounded-[32px] px-6 py-8 text-white shadow-[0_14px_40px_rgba(255,107,157,0.30)] sm:px-10 sm:py-10"
          style={{ backgroundImage: 'linear-gradient(135deg,#FF6B9D 0%,#FF9F45 100%)' }}>
          <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <h2 className="kid-display text-2xl font-black leading-tight sm:text-4xl">Sẵn sàng cho bé học vui hơn mỗi ngày?</h2>
              <p className="mt-2 max-w-xl text-white/90">Bắt đầu bằng một trò chơi 5 phút — khi bé thấy vui, việc học sẽ thành thói quen.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/tro-choi" className="kid-display rounded-full bg-white px-6 py-3 font-black text-[#c81e5b] transition active:translate-y-0.5" style={{ boxShadow: '0 5px 0 rgba(0,0,0,0.12)' }}>
                  🎮 Cho bé chơi thử
                </Link>
                <Link href="/khoa-hoc" className="kid-display rounded-full bg-white/15 px-6 py-3 font-black text-white ring-2 ring-white/70 transition hover:bg-white/25">
                  📚 Chọn lớp học
                </Link>
              </div>
            </div>
            <Image src="/assets/images/01-mascot-tiger-trophy.webp" alt="" width={388} height={420} className="bhh-float mx-auto hidden h-auto w-40 drop-shadow-xl sm:block" />
          </div>
        </div>
      </section>
    </main>
  );
}
