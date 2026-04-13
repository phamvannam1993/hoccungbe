import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nên cho trẻ 3–6 tuổi học bao lâu mỗi lần',
  description:
    'Thời lượng học phù hợp cho trẻ 3–6 tuổi giúp bé không bị quá tải, duy trì sự tập trung và hình thành thói quen học tập tự nhiên mỗi ngày.',
  keywords: [
    'trẻ 3-6 tuổi học bao lâu',
    'thời gian học cho trẻ em',
    'bé học bao lâu là đủ',
    'cách dạy trẻ tại nhà',
    'trẻ mất tập trung khi học',
    'học tập cho trẻ nhỏ',
  ],
  alternates: {
    canonical: '/blog/thoi-luong-hoc-phu-hop-cho-tre',
  },
  openGraph: {
    title: 'Nên cho trẻ 3–6 tuổi học bao lâu mỗi lần',
    description:
      'Thời lượng học phù hợp giúp bé tập trung hơn và không bị quá tải khi học tại nhà.',
    url: '/blog/thoi-luong-hoc-phu-hop-cho-tre',
    type: 'article',
    images: [
      {
        url: '/og-blog-time.jpg',
        width: 1200,
        height: 630,
        alt: 'Thời lượng học cho trẻ 3–6 tuổi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nên cho trẻ 3–6 tuổi học bao lâu mỗi lần',
    description:
      'Giúp phụ huynh xác định thời gian học phù hợp để bé tập trung tốt hơn.',
    images: ['/og-blog-time.jpg'],
  },
};

export default function BlogStudyTimePage() {
  return (
    <main className="bg-white text-slate-900">
      <article className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-sky-700">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-sky-700">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span>Nên cho trẻ 3–6 tuổi học bao lâu mỗi lần</span>
        </nav>

        {/* Header */}
        <header className="border-b border-slate-100 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Góc phụ huynh
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Nên cho trẻ 3–6 tuổi học bao lâu mỗi lần
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Một trong những câu hỏi phổ biến nhất của phụ huynh là: “Nên cho con học
            bao lâu là đủ?”. Thực tế, không phải học càng lâu càng tốt. Với trẻ nhỏ,
            thời lượng học hợp lý mới là yếu tố quyết định giúp bé tập trung và duy
            trì hứng thú lâu dài.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-sky-50 px-3 py-1 font-semibold text-sky-700">
              Dành cho phụ huynh có con 3–6 tuổi
            </span>
            <span>•</span>
            <span>4 phút đọc</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:leading-8 prose-li:leading-8 prose-strong:text-slate-900">
          <section className="mt-10">
            <p>
              Trẻ từ 3 đến 6 tuổi đang trong giai đoạn phát triển rất nhanh về nhận
              thức, nhưng khả năng tập trung vẫn còn hạn chế. Điều này hoàn toàn
              bình thường. Nếu ép trẻ ngồi học quá lâu, bé không những không tiếp
              thu tốt hơn mà còn dễ hình thành cảm giác chán học.
            </p>

            <p>
              Vì vậy, thay vì cố kéo dài thời gian học, phụ huynh nên tập trung vào
              việc lựa chọn thời lượng phù hợp với từng độ tuổi. Khi học đúng nhịp,
              trẻ sẽ hợp tác hơn, học nhẹ nhàng hơn và duy trì được sự tập trung
              tốt hơn.
            </p>
          </section>

          <section className="mt-10">
            <h2>Thời lượng học phù hợp theo từng độ tuổi</h2>

            <p>
              Không có một con số cố định cho tất cả trẻ, nhưng bạn có thể tham khảo
              khoảng thời gian sau:
            </p>

            <ul>
              <li>
                <strong>Trẻ 3–4 tuổi:</strong> khoảng 5–10 phút cho mỗi hoạt động
              </li>
              <li>
                <strong>Trẻ 4–5 tuổi:</strong> khoảng 10–15 phút
              </li>
              <li>
                <strong>Trẻ 5–6 tuổi:</strong> khoảng 15–20 phút
              </li>
            </ul>

            <p>
              Đây là khoảng thời gian trung bình phù hợp với khả năng tập trung tự
              nhiên của trẻ. Sau mỗi lần học, nên có một khoảng nghỉ ngắn để bé vận
              động hoặc thư giãn trước khi bắt đầu lại.
            </p>
          </section>

          <section className="mt-10">
            <h2>Vì sao không nên cho bé học quá lâu</h2>

            <p>
              Khi trẻ phải ngồi học quá lâu, não bộ sẽ nhanh chóng rơi vào trạng
              thái mệt mỏi. Lúc này, dù bé vẫn ngồi đó nhưng thực tế không còn tập
              trung nữa. Điều này khiến thời gian học trở nên kém hiệu quả.
            </p>

            <p>
              Ngoài ra, việc kéo dài thời gian học dễ tạo cảm giác “bị ép”, khiến
              trẻ dần hình thành tâm lý né tránh việc học. Đây là điều mà nhiều phụ
              huynh gặp phải nhưng không nhận ra nguyên nhân.
            </p>

            <p>
              Ngược lại, những buổi học ngắn nhưng đều đặn sẽ giúp trẻ duy trì sự
              hứng thú và tiếp thu tốt hơn theo thời gian.
            </p>
          </section>

          <section className="mt-10">
            <h2>Dấu hiệu cho thấy bé đang học quá sức</h2>

            <p>
              Phụ huynh nên chú ý một số dấu hiệu sau để điều chỉnh kịp thời:
            </p>

            <ul>
              <li>Bé bắt đầu ngọ nguậy, đứng lên hoặc nhìn xung quanh liên tục</li>
              <li>Dễ cáu gắt hoặc mất kiên nhẫn</li>
              <li>Không còn phản hồi khi được hỏi</li>
              <li>Muốn chuyển sang hoạt động khác ngay lập tức</li>
            </ul>

            <p>
              Khi thấy những dấu hiệu này, tốt nhất nên dừng lại thay vì cố kéo dài.
              Việc dừng đúng lúc giúp bé giữ được cảm xúc tích cực với việc học.
            </p>
          </section>

          <section className="mt-10">
            <h2>Làm thế nào để bé học hiệu quả trong thời gian ngắn</h2>

            <p>
              Khi thời lượng học đã ngắn lại, điều quan trọng là làm sao để mỗi phút
              học đều có giá trị. Một vài nguyên tắc đơn giản có thể giúp bạn:
            </p>

            <ul>
              <li>Bắt đầu bằng hoạt động dễ để bé vào nhịp nhanh</li>
              <li>Chọn nội dung trực quan, có tương tác</li>
              <li>Tránh giảng giải dài dòng</li>
              <li>Kết thúc khi bé vẫn còn hứng thú</li>
            </ul>

            <p>
              Những yếu tố này giúp trẻ duy trì sự chú ý tốt hơn và cảm thấy việc
              học không phải là áp lực.
            </p>
          </section>

          <section className="mt-10">
            <h2>Kết luận</h2>

            <p>
              Với trẻ 3–6 tuổi, học lâu không quan trọng bằng học đúng cách. Những
              buổi học ngắn, rõ ràng và phù hợp với khả năng tập trung của trẻ sẽ
              mang lại hiệu quả tốt hơn rất nhiều so với việc ép con ngồi hàng giờ.
            </p>

            <p>
              Khi phụ huynh điều chỉnh được thời lượng hợp lý và tạo ra trải nghiệm
              học nhẹ nhàng, trẻ sẽ dần hình thành thói quen học tập tích cực mà
              không cần quá nhiều sự ép buộc.
            </p>
          </section>

          {/* CTA */}
          <section className="mt-10 rounded-3xl bg-sky-50 p-6 sm:p-8">
            <h2 className="!mt-0">Gợi ý dành cho phụ huynh</h2>

            <p>
              Nếu bạn muốn bé bắt đầu học theo nhịp ngắn, dễ tập trung, hãy thử các
              trò chơi giáo dục trực quan được thiết kế theo độ tuổi. Những hoạt
              động này giúp bé học tự nhiên hơn và không bị quá tải.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/games"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                Khám phá trò chơi
              </Link>

              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-300 hover:bg-sky-100 hover:text-sky-700"
              >
                Xem thêm bài viết
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}