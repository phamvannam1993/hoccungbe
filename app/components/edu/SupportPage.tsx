import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hỗ trợ phụ huynh',
  description:
    'Liên hệ hỗ trợ để được tư vấn chọn lộ trình học, giải đáp về tài khoản, gói học và cách theo dõi tiến độ học tập của bé trên Học Cùng Bé.',
  keywords: [
    'hỗ trợ phụ huynh',
    'tư vấn gói học cho bé',
    'hỗ trợ tài khoản học cùng bé',
    'liên hệ học cùng bé',
    'chăm sóc khách hàng cho phụ huynh',
  ],
  alternates: {
    canonical: '/support',
  },
  openGraph: {
    title: 'Hỗ trợ phụ huynh | Học Cùng Bé',
    description:
      'Cần tư vấn chọn lộ trình, hỗ trợ tài khoản hoặc tìm hiểu thêm về cách hệ thống hoạt động? Chúng tôi luôn sẵn sàng đồng hành.',
    url: '/support',
    type: 'website',
    images: [
      {
        url: '/og-support.jpg',
        width: 1200,
        height: 630,
        alt: 'Hỗ trợ phụ huynh - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hỗ trợ phụ huynh | Học Cùng Bé',
    description:
      'Liên hệ để được hỗ trợ nhanh về tài khoản, gói học và lộ trình phù hợp cho bé.',
    images: ['/og-support.jpg'],
  },
};

export default function SupportPage() {
  const faqs = [
    'Bé mấy tuổi thì phù hợp để bắt đầu?',
    'Một tài khoản có thể tạo nhiều hồ sơ trẻ em không?',
    'Phụ huynh có xem được báo cáo học tập không?',
    'Có thể dùng thử trước khi mua gói không?',
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Hỗ trợ phụ huynh
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Cần hỗ trợ? Chúng tôi luôn sẵn sàng đồng hành
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Nếu bạn cần tư vấn chọn lộ trình, hỗ trợ tài khoản hoặc muốn tìm hiểu
            thêm về cách hệ thống hoạt động, hãy để lại thông tin để đội ngũ hỗ
            trợ phản hồi nhanh nhất.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Họ và tên
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="Nguyễn Thị B"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                placeholder="09xxxxxxxx"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Nội dung cần hỗ trợ
            </label>
            <textarea
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              placeholder="Mình muốn được tư vấn chọn gói học phù hợp cho bé 5 tuổi..."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl hover:shadow-sky-200">
              Gửi yêu cầu
            </button>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md"
            >
              Xem bảng giá trước
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Câu hỏi thường gặp
            </h3>

            <div className="mt-5 space-y-4">
              {faqs.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium leading-7 text-slate-700 ring-1 ring-slate-100 transition hover:bg-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] bg-emerald-50 p-6 shadow-sm ring-1 ring-emerald-100">
            <h3 className="text-2xl font-black tracking-tight text-emerald-950">
              Gợi ý nhanh
            </h3>
            <p className="mt-4 text-sm leading-8 text-emerald-900">
              Nếu bạn mới bắt đầu, hãy dùng thử trước để xem bé có hứng thú với
              cách học này không, sau đó mới chọn gói phù hợp để đi đường dài.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
