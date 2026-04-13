import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gợi ý góc học tập đơn giản cho bé tại nhà',
  description:
    'Cách tạo góc học tập đơn giản giúp bé ít xao nhãng hơn, tập trung tốt hơn và hình thành thói quen học tập tích cực mỗi ngày.',
  keywords: [
    'góc học tập cho bé',
    'cách tạo góc học tập cho trẻ',
    'bé mất tập trung khi học',
    'setup bàn học cho trẻ em',
    'học tại nhà cho bé',
  ],
  alternates: {
    canonical: '/blog/goc-hoc-tap-cho-be',
  },
  openGraph: {
    title: 'Gợi ý góc học tập đơn giản cho bé tại nhà',
    description:
      'Một góc học tập phù hợp giúp bé tập trung tốt hơn và học hiệu quả hơn mỗi ngày.',
    url: '/blog/goc-hoc-tap-cho-be',
    type: 'article',
    images: [
      {
        url: '/og-blog-study-space.jpg',
        width: 1200,
        height: 630,
        alt: 'Góc học tập cho bé',
      },
    ],
  },
};

export default function BlogStudySpacePage() {
  return (
    <main className="bg-white text-slate-900">
      <article className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-sky-700">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-sky-700">Blog</Link>
          <span className="mx-2">/</span>
          <span>Góc học tập cho bé</span>
        </nav>

        {/* Header */}
        <header className="border-b border-slate-100 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Góc phụ huynh
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Gợi ý góc học tập đơn giản cho bé tại nhà
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Một góc học tập phù hợp có thể thay đổi hoàn toàn khả năng tập trung
            của trẻ. Không cần quá cầu kỳ, chỉ cần đúng cách, bé sẽ dễ vào nhịp học
            hơn rất nhiều.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-slate max-w-none mt-10">
          <p>
            Nhiều phụ huynh nghĩ rằng trẻ mất tập trung là do tính cách của con.
            Nhưng thực tế, môi trường xung quanh ảnh hưởng rất lớn đến khả năng
            chú ý của trẻ. Một góc học tập không phù hợp có thể khiến bé bị xao
            nhãng liên tục, dù bản thân bé không hề “lười”.
          </p>

          <p>
            Tin tốt là bạn không cần một không gian hoàn hảo. Chỉ cần điều chỉnh
            một vài yếu tố cơ bản, góc học tập của bé có thể trở nên hiệu quả hơn
            rất nhiều.
          </p>

          <h2>1. Chọn vị trí yên tĩnh và ít bị gián đoạn</h2>

          <p>
            Góc học tập nên đặt ở nơi ít tiếng ồn, tránh gần tivi hoặc khu vực
            sinh hoạt chung. Nếu không thể hoàn toàn yên tĩnh, hãy cố gắng giảm bớt
            các yếu tố gây xao nhãng trong thời gian bé học.
          </p>

          <p>
            Điều này giúp bé giữ được sự chú ý lâu hơn, đặc biệt trong những phút
            đầu tiên – giai đoạn quan trọng nhất để vào nhịp học.
          </p>

          <h2>2. Giữ bàn học gọn gàng, chỉ để những thứ cần thiết</h2>

          <p>
            Trẻ nhỏ rất dễ bị thu hút bởi những vật xung quanh. Một bàn học đầy đồ
            chơi hoặc đồ vật không liên quan sẽ khiến bé mất tập trung ngay lập tức.
          </p>

          <p>
            Hãy chỉ để lại những vật phục vụ cho buổi học hiện tại. Ví dụ: sách,
            bút, thẻ học hoặc thiết bị học. Càng đơn giản, bé càng dễ tập trung.
          </p>

          <h2>3. Ánh sáng đủ và dễ chịu</h2>

          <p>
            Ánh sáng ảnh hưởng trực tiếp đến khả năng tập trung. Góc học tập nên có
            ánh sáng tự nhiên hoặc đèn đủ sáng, không quá chói và không quá tối.
          </p>

          <p>
            Một không gian sáng sủa giúp bé tỉnh táo hơn và giảm cảm giác mệt mỏi
            khi học.
          </p>

          <h2>4. Sử dụng ghế và bàn phù hợp với chiều cao của bé</h2>

          <p>
            Nếu bé ngồi không thoải mái, việc tập trung sẽ giảm rất nhanh. Bàn và
            ghế nên vừa tầm để bé không phải cúi quá thấp hoặc với quá cao.
          </p>

          <p>
            Tư thế ngồi đúng giúp bé duy trì sự chú ý lâu hơn và tránh mệt mỏi
            không cần thiết.
          </p>

          <h2>5. Thêm một chút yếu tố “thu hút” nhưng không gây rối</h2>

          <p>
            Góc học tập không nên quá khô khan. Bạn có thể thêm một vài yếu tố nhẹ
            như bảng sticker, hình ảnh đơn giản hoặc màu sắc dịu để bé cảm thấy
            hứng thú hơn.
          </p>

          <p>
            Tuy nhiên, cần tránh trang trí quá nhiều vì điều đó lại khiến bé bị
            phân tâm.
          </p>

          <h2>Kết luận</h2>

          <p>
            Một góc học tập tốt không cần phải đắt tiền hay phức tạp. Điều quan
            trọng nhất là giúp bé cảm thấy thoải mái, dễ tập trung và ít bị xao
            nhãng.
          </p>

          <p>
            Khi môi trường học được tối ưu, việc học của trẻ sẽ trở nên nhẹ nhàng
            hơn rất nhiều. Bé không cần bị nhắc nhở quá nhiều mà vẫn có thể vào
            nhịp một cách tự nhiên.
          </p>

          {/* CTA */}
          <div className="mt-10 rounded-3xl bg-sky-50 p-6">
            <h3 className="!mt-0">Gợi ý dành cho phụ huynh</h3>
            <p>
              Sau khi đã có góc học tập phù hợp, bước tiếp theo là chọn nội dung
              học ngắn và dễ tiếp cận để bé duy trì sự tập trung tốt hơn.
            </p>

            <div className="mt-5 flex gap-4">
              <Link
                href="/games"
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-700"
              >
                Khám phá trò chơi
              </Link>

              <Link
                href="/blog"
                className="rounded-full border px-5 py-3 text-sm font-bold hover:bg-sky-100"
              >
                Xem thêm bài viết
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
