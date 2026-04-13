import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '3 sai lầm phụ huynh hay mắc khi dạy con học ở nhà',
  description:
    'Những sai lầm phổ biến khiến bé mất tập trung và chán học tại nhà, cùng cách điều chỉnh để giúp con học nhẹ nhàng và hiệu quả hơn.',
  keywords: [
    'sai lầm khi dạy con học',
    'bé không tập trung khi học',
    'cách dạy con tại nhà',
    'trẻ chán học phải làm sao',
    'phụ huynh dạy con sai cách',
  ],
  alternates: {
    canonical: '/blog/sai-lam-day-con-hoc-tai-nha',
  },
  openGraph: {
    title: '3 sai lầm phụ huynh hay mắc khi dạy con học ở nhà',
    description:
      'Nhiều phụ huynh vô tình khiến con chán học mà không nhận ra.',
    url: '/blog/sai-lam-day-con-hoc-tai-nha',
    type: 'article',
    images: [
      {
        url: '/og-blog-mistakes.jpg',
        width: 1200,
        height: 630,
        alt: 'Sai lầm khi dạy con học tại nhà',
      },
    ],
  },
};

export default function BlogMistakesPage() {
  return (
    <main className="bg-white text-slate-900">
      <article className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-sky-700">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-sky-700">Blog</Link>
          <span className="mx-2">/</span>
          <span>3 sai lầm khi dạy con học</span>
        </nav>

        {/* Header */}
        <header className="border-b border-slate-100 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Góc phụ huynh
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            3 sai lầm phụ huynh hay mắc khi dạy con học ở nhà
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Rất nhiều phụ huynh nghĩ rằng con mình lười học, nhưng thực tế có thể
            vấn đề nằm ở cách dạy. Một số thói quen tưởng chừng bình thường lại
            khiến trẻ mất tập trung và dần chán học mà không ai nhận ra.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-slate max-w-none mt-10">
          <p>
            Dạy con học tại nhà không phải là việc dễ, đặc biệt với trẻ nhỏ. Khi
            không có môi trường lớp học, phụ huynh thường phải vừa hướng dẫn, vừa
            kiểm soát, vừa tạo động lực cho con. Trong quá trình đó, rất dễ mắc
            phải những sai lầm khiến việc học trở nên nặng nề hơn.
          </p>

          <p>
            Dưới đây là 3 sai lầm phổ biến nhất mà nhiều phụ huynh đang gặp phải.
          </p>

          <h2>1. Ép con học quá lâu</h2>

          <p>
            Nhiều bố mẹ nghĩ rằng học càng lâu thì con sẽ càng giỏi. Nhưng với trẻ
            nhỏ, điều này hoàn toàn ngược lại. Khi bị yêu cầu ngồi học quá lâu,
            trẻ sẽ nhanh chóng mệt mỏi và mất tập trung.
          </p>

          <p>
            Thực tế, khả năng tập trung của trẻ 3–6 tuổi chỉ kéo dài trong một
            khoảng thời gian ngắn. Sau đó, dù vẫn ngồi đó nhưng bé không còn tiếp
            thu nữa.
          </p>

          <p>
            Thay vì kéo dài thời gian, hãy chia nhỏ buổi học thành các phần ngắn.
            Điều này giúp trẻ học hiệu quả hơn và không bị áp lực.
          </p>

          <h2>2. Nhắc nhở và kiểm soát quá nhiều</h2>

          <p>
            Khi thấy con mất tập trung, phản xạ tự nhiên của phụ huynh là nhắc liên
            tục: “Ngồi yên”, “Tập trung đi”, “Đừng nghịch nữa”. Tuy nhiên, việc này
            lại khiến trẻ cảm thấy bị kiểm soát và dễ phản ứng ngược.
          </p>

          <p>
            Trẻ nhỏ không thích bị ép buộc. Khi bị nhắc quá nhiều, bé có xu hướng
            chống đối hoặc mất hứng thú hoàn toàn với việc học.
          </p>

          <p>
            Thay vì nhắc liên tục, hãy điều chỉnh môi trường học và cách bắt đầu
            bài học để bé tự nhiên tập trung hơn.
          </p>

          <h2>3. Bắt đầu bằng nội dung quá khó hoặc quá khô khan</h2>

          <p>
            Một sai lầm phổ biến khác là cho bé học những nội dung chưa phù hợp với
            độ tuổi hoặc cách trình bày quá nhàm chán. Khi không hiểu hoặc không
            hứng thú, trẻ sẽ nhanh chóng mất tập trung.
          </p>

          <p>
            Trẻ nhỏ học tốt nhất qua hình ảnh, trò chơi và hoạt động tương tác.
            Nếu bài học chỉ là chữ hoặc lý thuyết, bé sẽ khó duy trì sự chú ý.
          </p>

          <p>
            Hãy bắt đầu bằng những hoạt động đơn giản, vui nhộn và dễ tiếp cận.
            Khi bé cảm thấy “học được”, động lực sẽ tự nhiên xuất hiện.
          </p>

          <h2>Kết luận</h2>

          <p>
            Trẻ không phải lúc nào cũng lười học. Nhiều khi, chính cách dạy chưa
            phù hợp khiến con khó tập trung và dễ chán. Khi phụ huynh điều chỉnh
            lại thời gian, môi trường và cách tiếp cận, việc học sẽ trở nên nhẹ
            nhàng hơn rất nhiều.
          </p>

          <p>
            Điều quan trọng không phải là ép con học nhiều hơn, mà là giúp con học
            đúng cách.
          </p>

          {/* CTA */}
          <div className="mt-10 rounded-3xl bg-sky-50 p-6">
            <h3 className="!mt-0">Gợi ý dành cho phụ huynh</h3>
            <p>
              Một cách hiệu quả để giúp bé tập trung hơn là cho bé bắt đầu với các
              hoạt động ngắn, trực quan và có tính tương tác cao.
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