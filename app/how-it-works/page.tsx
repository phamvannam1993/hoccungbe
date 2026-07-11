import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Baby,
  BookOpen,
  Gamepad2,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Brain,
  Sparkles,
} from 'lucide-react';

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
    icon: Baby,
    title: 'Chọn độ tuổi và nhu cầu của bé',
    description:
      'Phụ huynh bắt đầu bằng cách xác định độ tuổi, khả năng hiện tại và mục tiêu học tập của bé như học chữ, học toán, tiếng Anh hay rèn tư duy.',
  },
  {
    icon: BookOpen,
    title: 'Chọn bài học phù hợp',
    description:
      'Mỗi bài học được thiết kế ngắn gọn, trực quan và dễ hiểu để bé có thể tiếp cận từng bước mà không cảm thấy áp lực.',
  },
  {
    icon: Gamepad2,
    title: 'Cho bé học qua trò chơi giáo dục',
    description:
      'Bé được luyện tập qua các trò chơi học chữ, toán vui, ghi nhớ, phản xạ và tư duy logic, giúp việc học trở nên tự nhiên và hứng thú hơn.',
  },
  {
    icon: BarChart3,
    title: 'Theo dõi tiến độ mỗi ngày',
    description:
      'Phụ huynh có thể quan sát quá trình học của con, nhận biết điểm mạnh, phần cần rèn thêm và lựa chọn nội dung tiếp theo phù hợp hơn.',
  },
];

const tips = [
  'Mỗi lần học chỉ nên kéo dài khoảng 10-15 phút để bé không bị quá tải.',
  'Nên bắt đầu bằng trò chơi dễ trước, sau đó mới tăng dần độ khó.',
  'Phụ huynh nên khen ngợi nỗ lực của bé thay vì chỉ tập trung vào kết quả đúng sai.',
  'Duy trì thói quen học ngắn mỗi ngày sẽ hiệu quả hơn việc học quá lâu trong một buổi.',
];

// Mô tả chi tiết các loại trò chơi giáo dục: cách chơi, kỹ năng phát triển và cơ sở
// giáo dục/khoa học phía sau — giúp phụ huynh hiểu và tin tưởng lựa chọn.
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

export default function HowItWorksPage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-600">
            Cách bắt đầu
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Bắt đầu cho bé học tại nhà thật nhẹ nhàng
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Bé Hay Học giúp phụ huynh dễ dàng chọn bài học và trò chơi giáo dục
            phù hợp với độ tuổi của con, từ đó xây dựng thói quen học tập ngắn,
            vui và đều đặn mỗi ngày.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/tro-choi"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky-700"
            >
              Khám phá trò chơi
              <ArrowRight className="ml-2" size={18} aria-hidden="true" />
            </Link>

            <Link
              href="/khoa-hoc"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
            >
              Xem khóa học cho bé
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Icon size={24} aria-hidden="true" />
                </div>

                <p className="mt-5 text-sm font-black text-sky-600">
                  Bước {index + 1}
                </p>

                <h2 className="mt-2 text-xl font-black text-slate-900">
                  {step.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
            Các loại trò chơi giáo dục
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Mỗi trò chơi rèn một nhóm kỹ năng cụ thể cho bé
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600">
            Không chỉ để bé vui, mỗi loại trò chơi được thiết kế dựa trên phương pháp
            giáo dục sớm và nghiên cứu phát triển trí não, hướng tới một nhóm kỹ năng
            rõ ràng. Dưới đây là cách từng trò chơi giúp con phát triển.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gameTypes.map((game) => (
            <article
              key={game.name}
              className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <Gamepad2 size={22} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-black leading-tight text-slate-900">
                    {game.name}
                  </h3>
                  <p className="text-xs font-bold text-sky-600">{game.age}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {game.howToPlay}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {game.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-5">
                <div className="flex gap-3 rounded-2xl bg-violet-50/70 p-4">
                  <Brain
                    size={18}
                    className="mt-0.5 shrink-0 text-violet-600"
                    aria-hidden="true"
                  />
                  <p className="text-xs leading-6 text-slate-600">
                    <span className="font-black text-violet-700">Cơ sở giáo dục: </span>
                    {game.basis}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 text-center text-sm text-slate-500">
          <Sparkles size={16} className="shrink-0 text-violet-500" aria-hidden="true" />
          Nội dung tham khảo các phương pháp Montessori, Piaget, học qua trò chơi và
          nghiên cứu về trí nhớ làm việc, chức năng điều hành ở trẻ.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
        <div className="grid gap-8 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 lg:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-600">
              Gợi ý cho phụ huynh
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              Làm sao để bé học đều mà không bị áp lực?
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Với trẻ nhỏ, điều quan trọng không phải là học thật nhiều trong
              một lần, mà là tạo được cảm giác vui vẻ, an toàn và quen thuộc
              khi tiếp xúc với việc học. Phụ huynh nên đồng hành cùng bé bằng
              những hoạt động ngắn, có hình ảnh trực quan và có sự khích lệ nhẹ
              nhàng sau mỗi lần hoàn thành.
            </p>
          </div>

          <div className="space-y-4">
            {tips.map((tip) => (
              <div
                key={tip}
                className="flex gap-3 rounded-2xl bg-slate-50 p-4"
              >
                <CheckCircle2
                  size={20}
                  className="mt-1 shrink-0 text-sky-600"
                  aria-hidden="true"
                />

                <p className="text-sm leading-7 text-slate-600">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-gradient-to-br from-sky-600 to-violet-600 p-8 text-center text-white shadow-md lg:p-10">
          <h2 className="text-3xl font-black tracking-tight">
            Sẵn sàng để bé học vui hơn mỗi ngày?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-sky-50">
            Bắt đầu từ một trò chơi ngắn, một bài học nhỏ và một thói quen học
            tập nhẹ nhàng. Khi bé thấy vui, việc học sẽ trở nên tự nhiên hơn.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/tro-choi"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-sky-700 shadow-sm transition hover:bg-sky-50"
            >
              Cho bé chơi thử
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
