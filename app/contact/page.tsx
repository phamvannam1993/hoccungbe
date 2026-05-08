import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Liên hệ',

  description:
    'Liên hệ Học Cùng Bé để được hỗ trợ về tài khoản, khóa học, trò chơi giáo dục, bảng giá và cách đồng hành cùng bé học tập tại nhà.',

  keywords: [
    'liên hệ Học Cùng Bé',
    'hỗ trợ Học Cùng Bé',
    'liên hệ Bé Hay Học',
    'hỗ trợ học online cho bé',
    'tư vấn khóa học cho bé',
    'trò chơi giáo dục cho bé',
  ],

  alternates: {
    canonical: '/contact',
  },

  openGraph: {
    title: 'Liên hệ | Học Cùng Bé',
    description:
      'Cần hỗ trợ về tài khoản, khóa học, trò chơi giáo dục hoặc bảng giá? Liên hệ Học Cùng Bé để được đồng hành.',
    url: '/contact',
    siteName: 'Học Cùng Bé',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Liên hệ Học Cùng Bé',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Liên hệ | Học Cùng Bé',
    description:
      'Học Cùng Bé luôn sẵn sàng hỗ trợ phụ huynh trong quá trình đồng hành cùng con học tập tại nhà.',
    images: ['/og-contact.jpg'],
  },
};

const contactItems = [
  {
    icon: Mail,
    title: 'Email hỗ trợ',
    value: 'support@behayhoc.com',
    href: 'mailto:support@behayhoc.com',
    description:
      'Gửi câu hỏi về tài khoản, khóa học, trò chơi hoặc các vấn đề kỹ thuật khi sử dụng website.',
  },
  {
    icon: Phone,
    title: 'Hotline',
    value: '0123 456 789',
    href: 'tel:0123456789',
    description:
      'Liên hệ trong giờ hỗ trợ để được tư vấn nhanh về lộ trình học và cách bắt đầu cho bé.',
  },
  {
    icon: MessageCircle,
    title: 'Tư vấn phụ huynh',
    value: 'Gửi yêu cầu hỗ trợ',
    href: 'mailto:support@behayhoc.com?subject=Yêu cầu tư vấn Học Cùng Bé',
    description:
      'Phù hợp nếu phụ huynh chưa biết nên chọn bài học, trò chơi hoặc gói học nào cho con.',
  },
];

const supportTopics = [
  'Tư vấn chọn nội dung học phù hợp với độ tuổi của bé.',
  'Hỗ trợ tài khoản, đăng nhập và quá trình sử dụng nền tảng.',
  'Giải đáp thông tin về bảng giá, gói học và quyền lợi đi kèm.',
  'Tiếp nhận góp ý để cải thiện bài học, trò chơi và trải nghiệm cho phụ huynh.',
];

export default function ContactPage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-600">
              Liên hệ
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Học Cùng Bé luôn sẵn sàng hỗ trợ phụ huynh
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Nếu bạn cần tư vấn cách cho bé bắt đầu học tại nhà, chọn trò chơi
              giáo dục phù hợp, tìm hiểu bảng giá hoặc cần hỗ trợ trong quá
              trình sử dụng nền tảng, hãy liên hệ với Học Cùng Bé qua các kênh
              bên dưới.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="mailto:support@behayhoc.com"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky-700"
              >
                Gửi email hỗ trợ
                <ArrowRight className="ml-2" size={18} aria-hidden="true" />
              </Link>

              <Link
                href="/faq"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
              >
                Xem câu hỏi thường gặp
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:p-8">
            <h2 className="text-2xl font-black text-slate-900">
              Thông tin hỗ trợ
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                <Clock
                  size={22}
                  className="mt-1 shrink-0 text-sky-600"
                  aria-hidden="true"
                />

                <div>
                  <h3 className="font-bold text-slate-900">Thời gian phản hồi</h3>
                  <p className="mt-1 text-sm leading-7 text-slate-600">
                    Học Cùng Bé sẽ cố gắng phản hồi trong vòng 24 giờ làm việc
                    kể từ khi nhận được yêu cầu hỗ trợ của phụ huynh.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                <MapPin
                  size={22}
                  className="mt-1 shrink-0 text-sky-600"
                  aria-hidden="true"
                />

                <div>
                  <h3 className="font-bold text-slate-900">Website chính thức</h3>
                  <p className="mt-1 text-sm leading-7 text-slate-600">
                    <a
                      href="https://behayhoc.com"
                      className="font-semibold text-slate-800 transition hover:text-sky-700"
                    >
                      behayhoc.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                <HelpCircle
                  size={22}
                  className="mt-1 shrink-0 text-sky-600"
                  aria-hidden="true"
                />

                <div>
                  <h3 className="font-bold text-slate-900">
                    Nên gửi thông tin gì?
                  </h3>
                  <p className="mt-1 text-sm leading-7 text-slate-600">
                    Khi cần hỗ trợ, phụ huynh nên mô tả ngắn vấn đề đang gặp,
                    thiết bị đang sử dụng và tên tài khoản nếu có để đội ngũ hỗ
                    trợ kiểm tra nhanh hơn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {contactItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Icon size={24} aria-hidden="true" />
                </div>

                <h2 className="mt-5 text-xl font-black text-slate-900">
                  {item.title}
                </h2>

                <a
                  href={item.href}
                  className="mt-2 inline-block font-bold text-sky-700 transition hover:text-sky-800"
                >
                  {item.value}
                </a>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
        <div className="grid gap-8 rounded-3xl bg-white p-6 shadow-sm lg:grid-cols-2 lg:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-600">
              Nội dung hỗ trợ
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              Học Cùng Bé có thể hỗ trợ phụ huynh những gì?
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Mục tiêu của Học Cùng Bé không chỉ là cung cấp bài học và trò chơi
              giáo dục cho trẻ em, mà còn giúp phụ huynh dễ dàng hơn khi đồng
              hành cùng con học tập tại nhà một cách nhẹ nhàng, đều đặn và phù
              hợp với từng độ tuổi.
            </p>
          </div>

          <div className="space-y-4">
            {supportTopics.map((topic) => (
              <div key={topic} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-black text-sky-700">
                  ✓
                </span>

                <p className="text-sm leading-7 text-slate-600">{topic}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-gradient-to-br from-sky-600 to-violet-600 p-8 text-center text-white shadow-md lg:p-10">
          <h2 className="text-3xl font-black tracking-tight">
            Muốn cho bé bắt đầu học ngay?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-sky-50">
            Phụ huynh có thể cho bé bắt đầu bằng một trò chơi giáo dục ngắn hoặc
            xem trước các khóa học phù hợp với độ tuổi của con.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/games"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-sky-700 shadow-sm transition hover:bg-sky-50"
            >
              Khám phá trò chơi
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Xem khóa học
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
