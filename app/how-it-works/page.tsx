import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Baby,
  BookOpen,
  Gamepad2,
  BarChart3,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cách bắt đầu cho bé học tại nhà',

  description:
    'Hướng dẫn phụ huynh bắt đầu cho bé học tại nhà với Học Cùng Bé: chọn độ tuổi, chọn bài học hoặc trò chơi giáo dục phù hợp, theo dõi tiến độ và đồng hành cùng con mỗi ngày.',

  keywords: [
    'cách bắt đầu học cùng bé',
    'cho bé học tại nhà',
    'hướng dẫn bé học online',
    'cách cho bé học hiệu quả',
    'trò chơi giáo dục cho bé',
    'nền tảng học tập cho bé',
    'phụ huynh đồng hành cùng con',
  ],

  alternates: {
    canonical: '/how-it-works',
  },

  openGraph: {
    title: 'Cách bắt đầu cho bé học tại nhà | Học Cùng Bé',
    description:
      'Chỉ với vài bước đơn giản, phụ huynh có thể chọn nội dung học phù hợp và đồng hành cùng bé mỗi ngày.',
    url: '/how-it-works',
    siteName: 'Học Cùng Bé',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-how-it-works.jpg',
        width: 1200,
        height: 630,
        alt: 'Cách bắt đầu học cùng bé tại nhà',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Cách bắt đầu cho bé học tại nhà | Học Cùng Bé',
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
            Học Cùng Bé giúp phụ huynh dễ dàng chọn bài học và trò chơi giáo dục
            phù hợp với độ tuổi của con, từ đó xây dựng thói quen học tập ngắn,
            vui và đều đặn mỗi ngày.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/games"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky-700"
            >
              Khám phá trò chơi
              <ArrowRight className="ml-2" size={18} aria-hidden="true" />
            </Link>

            <Link
              href="/courses"
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
              href="/games"
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
