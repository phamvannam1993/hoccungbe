import Link from 'next/link';
import type { Metadata } from 'next';
import {
  HelpCircle,
  BookOpen,
  Gamepad2,
  BarChart3,
  CreditCard,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Câu hỏi thường gặp',

  description:
    'Giải đáp các câu hỏi thường gặp về Học Cùng Bé: độ tuổi phù hợp, cách học, trò chơi giáo dục, theo dõi tiến độ, tài khoản, bảng giá và hỗ trợ phụ huynh.',

  keywords: [
    'câu hỏi thường gặp Học Cùng Bé',
    'FAQ Học Cùng Bé',
    'hướng dẫn học cùng bé',
    'trò chơi giáo dục cho bé',
    'nền tảng học tập cho bé',
    'học online cho trẻ em',
    'phụ huynh theo dõi tiến độ học tập',
  ],

  alternates: {
    canonical: '/faq',
  },

  openGraph: {
    title: 'Câu hỏi thường gặp | Học Cùng Bé',
    description:
      'Giải đáp các thắc mắc phổ biến của phụ huynh khi cho bé học chữ, toán, tiếng Anh và tư duy qua trò chơi giáo dục.',
    url: '/faq',
    siteName: 'Học Cùng Bé',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-faq.jpg',
        width: 1200,
        height: 630,
        alt: 'Câu hỏi thường gặp về Học Cùng Bé',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Câu hỏi thường gặp | Học Cùng Bé',
    description:
      'Thông tin hỗ trợ phụ huynh khi cho bé học tập tại nhà cùng Học Cùng Bé.',
    images: ['/og-faq.jpg'],
  },
};

const faqs = [
  {
    icon: HelpCircle,
    question: 'Học Cùng Bé phù hợp với trẻ ở độ tuổi nào?',
    answer:
      'Học Cùng Bé được thiết kế cho trẻ từ 3 đến 10 tuổi, đặc biệt phù hợp với các bé đang làm quen với chữ cái, con số, tiếng Anh đầu đời, tư duy logic, phản xạ và khả năng ghi nhớ. Phụ huynh có thể chọn nội dung theo độ tuổi và khả năng hiện tại của bé để việc học nhẹ nhàng hơn.',
  },
  {
    icon: BookOpen,
    question: 'Bé sẽ học những nội dung gì trên Học Cùng Bé?',
    answer:
      'Bé có thể học các nhóm nội dung nền tảng như làm quen mặt chữ, học toán vui, tiếng Anh đầu đời, ghi nhớ, phản xạ, quan sát và tư duy logic. Các bài học được thiết kế ngắn gọn, trực quan, dễ hiểu để trẻ tiếp cận từng bước mà không cảm thấy bị ép học.',
  },
  {
    icon: Gamepad2,
    question: 'Trò chơi giáo dục trên website có tác dụng gì?',
    answer:
      'Các trò chơi giáo dục giúp bé luyện tập kiến thức thông qua hoạt động vui và có tương tác. Thay vì chỉ nghe giảng hoặc làm bài khô cứng, bé được nhận diện hình ảnh, ghép cặp, chọn đáp án, ghi nhớ, sắp xếp và xử lý tình huống đơn giản. Cách học này giúp bé dễ tập trung và hứng thú hơn.',
  },
  {
    icon: BarChart3,
    question: 'Phụ huynh có theo dõi được tiến độ học của bé không?',
    answer:
      'Có. Học Cùng Bé hướng tới việc giúp phụ huynh quan sát quá trình học tập của con, biết bạn nhỏ đã học nội dung nào, đang mạnh ở kỹ năng nào và phần nào cần rèn thêm. Nhờ đó, phụ huynh có thể đồng hành cùng con rõ ràng hơn thay vì chỉ cho bé học một cách ngẫu nhiên.',
  },
  {
    icon: HelpCircle,
    question: 'Mỗi ngày bé nên học bao lâu?',
    answer:
      'Với trẻ nhỏ, phụ huynh nên ưu tiên thời lượng ngắn nhưng đều đặn. Mỗi lần học có thể kéo dài khoảng 10 đến 15 phút, tùy theo độ tuổi và khả năng tập trung của bé. Điều quan trọng là giữ cho bé cảm thấy vui, được khích lệ và muốn quay lại học vào ngày hôm sau.',
  },
  {
    icon: BookOpen,
    question: 'Bé chưa biết chữ có sử dụng được không?',
    answer:
      'Có. Nhiều hoạt động trên Học Cùng Bé được xây dựng bằng hình ảnh, âm thanh, màu sắc và thao tác đơn giản, giúp bé chưa biết chữ vẫn có thể làm quen dần với mặt chữ, âm thanh, số lượng và tư duy quan sát. Phụ huynh có thể ngồi cùng bé trong giai đoạn đầu để hướng dẫn nhẹ nhàng.',
  },
  {
    icon: Gamepad2,
    question: 'Học Cùng Bé có thay thế hoàn toàn việc học ở trường không?',
    answer:
      'Không. Học Cùng Bé phù hợp để hỗ trợ việc học tại nhà, giúp bé ôn luyện, làm quen kiến thức nền tảng và rèn thói quen học tập tích cực. Nền tảng này nên được xem như một công cụ đồng hành cùng phụ huynh, không thay thế hoàn toàn vai trò của trường học, giáo viên hoặc các hoạt động trải nghiệm ngoài đời thực.',
  },
  {
    icon: CreditCard,
    question: 'Học Cùng Bé có miễn phí không?',
    answer:
      'Một số nội dung có thể được mở để phụ huynh và bé trải nghiệm trước. Các gói học đầy đủ, quyền lợi cụ thể và chi phí sẽ được cập nhật tại trang bảng giá. Phụ huynh nên xem kỹ thông tin gói học để chọn lựa phù hợp với nhu cầu của bé.',
  },
  {
    icon: ShieldCheck,
    question: 'Thông tin của bé và phụ huynh có được bảo mật không?',
    answer:
      'Học Cùng Bé tôn trọng quyền riêng tư của người dùng và hướng tới việc thu thập thông tin ở mức cần thiết để vận hành tài khoản, hỗ trợ học tập và cải thiện trải nghiệm. Phụ huynh có thể xem thêm tại trang Chính sách bảo mật để hiểu rõ hơn cách thông tin được xử lý.',
  },
  {
    icon: HelpCircle,
    question: 'Nếu gặp lỗi khi sử dụng thì liên hệ ở đâu?',
    answer:
      'Nếu gặp lỗi đăng nhập, lỗi hiển thị, vấn đề với bài học, trò chơi hoặc tài khoản, phụ huynh có thể gửi email đến support@behayhoc.com hoặc truy cập trang Liên hệ để gửi yêu cầu hỗ trợ. Khi liên hệ, nên mô tả ngắn vấn đề, thiết bị đang dùng và tài khoản nếu có.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <main className="bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-600">
            Câu hỏi thường gặp
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Phụ huynh thường hỏi gì về Học Cùng Bé?
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Dưới đây là những câu hỏi phổ biến khi phụ huynh bắt đầu cho bé học
            tại nhà với Học Cùng Bé, từ độ tuổi phù hợp, cách học, trò chơi giáo
            dục đến tiến độ, bảng giá và hỗ trợ tài khoản.
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
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
            >
              Gửi câu hỏi hỗ trợ
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16 lg:px-8 lg:pb-24">
        <div className="space-y-5">
          {faqs.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.question}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                    <Icon size={22} aria-hidden="true" />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      {item.question}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl bg-gradient-to-br from-sky-600 to-violet-600 p-8 text-center text-white shadow-md lg:p-10">
          <h2 className="text-3xl font-black tracking-tight">
            Chưa tìm thấy câu trả lời phù hợp?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-sky-50">
            Phụ huynh có thể gửi câu hỏi trực tiếp để Học Cùng Bé hỗ trợ rõ hơn
            về tài khoản, khóa học, trò chơi giáo dục hoặc cách bắt đầu cho bé.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-sky-700 shadow-sm transition hover:bg-sky-50"
            >
              Liên hệ hỗ trợ
            </Link>

            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Xem cách bắt đầu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
