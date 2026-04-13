import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng | Học Cùng Bé',
  description:
    'Điều khoản sử dụng của Học Cùng Bé, quy định quyền và trách nhiệm của người dùng khi truy cập và sử dụng nền tảng học tập cho trẻ em.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-sky-700">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span>Điều khoản sử dụng</span>
        </nav>

        <header className="border-b border-slate-100 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Thông tin pháp lý
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Điều khoản sử dụng
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Khi truy cập và sử dụng Học Cùng Bé, người dùng đồng ý tuân thủ các điều
            khoản dưới đây. Những điều khoản này được xây dựng nhằm đảm bảo trải
            nghiệm an toàn, minh bạch và phù hợp cho phụ huynh và trẻ em.
          </p>
        </header>

        <div className="prose prose-slate mt-10 max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:leading-8 prose-li:leading-8">
          <section>
            <h2>1. Phạm vi áp dụng</h2>
            <p>
              Điều khoản sử dụng này áp dụng cho tất cả người dùng truy cập website,
              tạo tài khoản hoặc sử dụng bất kỳ nội dung, tính năng, trò chơi, bài
              học hay dịch vụ nào thuộc nền tảng Học Cùng Bé.
            </p>
          </section>

          <section>
            <h2>2. Mục đích của nền tảng</h2>
            <p>
              Học Cùng Bé là nền tảng học tập dành cho trẻ em, hướng đến việc cung
              cấp các nội dung giáo dục trực quan, trò chơi học tập ngắn và công cụ
              hỗ trợ phụ huynh theo dõi tiến độ học tập của trẻ. Nội dung trên nền
              tảng được thiết kế nhằm hỗ trợ học tập và không thay thế hoàn toàn vai
              trò hướng dẫn của phụ huynh, giáo viên hoặc chuyên gia giáo dục.
            </p>
          </section>

          <section>
            <h2>3. Tài khoản người dùng</h2>
            <p>
              Khi đăng ký tài khoản, người dùng có trách nhiệm cung cấp thông tin
              chính xác, đầy đủ và cập nhật khi cần thiết. Người dùng chịu trách
              nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài
              khoản của mình.
            </p>
            <p>
              Trong trường hợp phát hiện tài khoản bị truy cập trái phép hoặc có dấu
              hiệu mất an toàn, người dùng cần thông báo cho Học Cùng Bé trong thời
              gian sớm nhất để được hỗ trợ.
            </p>
          </section>

          <section>
            <h2>4. Quyền và trách nhiệm của người dùng</h2>
            <p>Người dùng đồng ý:</p>
            <ul>
              <li>Sử dụng nền tảng cho mục đích hợp pháp và phù hợp.</li>
              <li>Không đăng tải hoặc truyền tải nội dung vi phạm pháp luật.</li>
              <li>Không can thiệp vào hoạt động bình thường của hệ thống.</li>
              <li>
                Không sao chép, phân phối hoặc khai thác thương mại nội dung của nền
                tảng khi chưa có sự cho phép.
              </li>
            </ul>
            <p>
              Người dùng có trách nhiệm giám sát việc sử dụng nền tảng của trẻ em
              trong trường hợp tài khoản được sử dụng cho mục đích học tập của con.
            </p>
          </section>

          <section>
            <h2>5. Nội dung và quyền sở hữu trí tuệ</h2>
            <p>
              Toàn bộ nội dung trên Học Cùng Bé, bao gồm nhưng không giới hạn ở văn
              bản, hình ảnh, biểu tượng, giao diện, bài học, trò chơi, thiết kế và
              các tài liệu liên quan, đều thuộc quyền sở hữu của Học Cùng Bé hoặc
              các bên cấp phép hợp pháp.
            </p>
            <p>
              Người dùng không được sao chép, chỉnh sửa, tái xuất bản hoặc sử dụng
              các nội dung này cho mục đích thương mại nếu chưa được chấp thuận bằng
              văn bản.
            </p>
          </section>

          <section>
            <h2>6. Giới hạn trách nhiệm</h2>
            <p>
              Học Cùng Bé nỗ lực duy trì nền tảng ổn định, chính xác và an toàn.
              Tuy nhiên, chúng tôi không đảm bảo rằng dịch vụ sẽ luôn hoạt động liên
              tục, không có lỗi hoặc hoàn toàn phù hợp với mọi nhu cầu cụ thể của
              từng người dùng.
            </p>
            <p>
              Học Cùng Bé không chịu trách nhiệm đối với các thiệt hại phát sinh do
              lỗi kết nối, thiết bị, hành vi sử dụng không đúng mục đích hoặc các
              yếu tố nằm ngoài khả năng kiểm soát hợp lý của chúng tôi.
            </p>
          </section>

          <section>
            <h2>7. Tạm ngưng hoặc chấm dứt quyền truy cập</h2>
            <p>
              Chúng tôi có quyền tạm ngưng hoặc chấm dứt quyền truy cập của người
              dùng trong trường hợp phát hiện hành vi vi phạm điều khoản sử dụng,
              gây ảnh hưởng đến hệ thống, cộng đồng người dùng hoặc an toàn của nền
              tảng.
            </p>
          </section>

          <section>
            <h2>8. Liên kết đến bên thứ ba</h2>
            <p>
              Website có thể chứa liên kết đến các trang hoặc dịch vụ của bên thứ
              ba. Học Cùng Bé không chịu trách nhiệm đối với nội dung, chính sách
              hoặc cách vận hành của các website bên ngoài đó.
            </p>
          </section>

          <section>
            <h2>9. Thay đổi điều khoản</h2>
            <p>
              Học Cùng Bé có thể cập nhật điều khoản sử dụng theo từng thời điểm để
              phù hợp với sự thay đổi của dịch vụ hoặc yêu cầu pháp lý. Phiên bản
              cập nhật sẽ được đăng tải trên website và có hiệu lực kể từ thời điểm
              công bố.
            </p>
          </section>

          <section>
            <h2>10. Liên hệ</h2>
            <p>
              Nếu bạn có câu hỏi liên quan đến điều khoản sử dụng, vui lòng liên hệ
              với chúng tôi qua email:
            </p>
            <p>
              <a
                href="mailto:support@hoccungbe.com"
                className="font-semibold text-sky-700 no-underline hover:text-sky-800"
              >
                support@hoccungbe.com
              </a>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
