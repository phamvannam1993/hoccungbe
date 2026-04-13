import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | Học Cùng Bé',
  description:
    'Chính sách bảo mật của Học Cùng Bé, mô tả cách thu thập, sử dụng và bảo vệ thông tin người dùng trên nền tảng học tập cho trẻ em.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-sky-700">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span>Chính sách bảo mật</span>
        </nav>

        <header className="border-b border-slate-100 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Thông tin pháp lý
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Chính sách bảo mật
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Học Cùng Bé cam kết tôn trọng và bảo vệ thông tin cá nhân của người dùng.
            Chính sách này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và
            bảo mật thông tin khi bạn truy cập hoặc sử dụng nền tảng.
          </p>
        </header>

        <div className="prose prose-slate mt-10 max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:leading-8 prose-li:leading-8">
          <section>
            <h2>1. Thông tin chúng tôi có thể thu thập</h2>
            <p>Trong quá trình sử dụng nền tảng, chúng tôi có thể thu thập một số thông tin như:</p>
            <ul>
              <li>Thông tin tài khoản như họ tên, email, số điện thoại nếu người dùng cung cấp.</li>
              <li>Thông tin liên quan đến hồ sơ học tập của trẻ như độ tuổi, tiến độ học hoặc hoạt động đã thực hiện.</li>
              <li>Dữ liệu kỹ thuật như địa chỉ IP, loại thiết bị, trình duyệt và hành vi sử dụng cơ bản trên website.</li>
            </ul>
          </section>

          <section>
            <h2>2. Mục đích sử dụng thông tin</h2>
            <p>Thông tin được thu thập nhằm phục vụ các mục đích sau:</p>
            <ul>
              <li>Cung cấp và vận hành các tính năng của nền tảng.</li>
              <li>Cá nhân hóa trải nghiệm học tập phù hợp hơn với trẻ.</li>
              <li>Hỗ trợ phụ huynh theo dõi tiến độ học tập của con.</li>
              <li>Cải thiện chất lượng nội dung, giao diện và dịch vụ.</li>
              <li>Gửi thông báo, cập nhật hoặc hỗ trợ khi người dùng có yêu cầu.</li>
            </ul>
          </section>

          <section>
            <h2>3. Cách chúng tôi bảo vệ thông tin</h2>
            <p>
              Học Cùng Bé áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo
              vệ thông tin người dùng khỏi truy cập trái phép, mất mát, sử dụng sai
              mục đích hoặc tiết lộ không được phép.
            </p>
            <p>
              Tuy nhiên, không có hệ thống truyền tải hoặc lưu trữ dữ liệu nào đảm
              bảo an toàn tuyệt đối. Vì vậy, người dùng cũng cần chủ động bảo mật
              thông tin tài khoản của mình.
            </p>
          </section>

          <section>
            <h2>4. Chia sẻ thông tin với bên thứ ba</h2>
            <p>
              Chúng tôi không bán hoặc trao đổi thông tin cá nhân của người dùng cho
              bên thứ ba vì mục đích thương mại. Trong một số trường hợp cần thiết,
              thông tin có thể được chia sẻ với đối tác cung cấp hạ tầng hoặc dịch
              vụ kỹ thuật để hỗ trợ vận hành nền tảng, với điều kiện các bên này có
              trách nhiệm bảo mật phù hợp.
            </p>
            <p>
              Chúng tôi cũng có thể cung cấp thông tin nếu được yêu cầu bởi cơ quan
              nhà nước có thẩm quyền theo quy định pháp luật.
            </p>
          </section>

          <section>
            <h2>5. Dữ liệu liên quan đến trẻ em</h2>
            <p>
              Vì Học Cùng Bé là nền tảng học tập dành cho trẻ em, chúng tôi đặc biệt
              coi trọng việc bảo vệ dữ liệu liên quan đến trẻ. Phụ huynh hoặc người
              giám hộ cần giám sát quá trình đăng ký, sử dụng và quản lý tài khoản
              liên quan đến trẻ em.
            </p>
            <p>
              Chúng tôi khuyến khích chỉ cung cấp các thông tin cần thiết cho mục
              đích sử dụng nền tảng và hạn chế chia sẻ thông tin nhạy cảm không cần
              thiết.
            </p>
          </section>

          <section>
            <h2>6. Cookie và dữ liệu sử dụng</h2>
            <p>
              Website có thể sử dụng cookie hoặc các công nghệ tương tự để ghi nhớ
              tùy chọn, cải thiện trải nghiệm người dùng và phân tích hiệu quả hoạt
              động của nền tảng. Người dùng có thể điều chỉnh cài đặt trình duyệt để
              từ chối cookie, tuy nhiên một số tính năng có thể bị ảnh hưởng.
            </p>
          </section>

          <section>
            <h2>7. Quyền của người dùng</h2>
            <p>Người dùng có thể:</p>
            <ul>
              <li>Yêu cầu xem lại thông tin cá nhân đã cung cấp.</li>
              <li>Yêu cầu chỉnh sửa thông tin không chính xác.</li>
              <li>Yêu cầu xóa hoặc ngừng xử lý thông tin trong phạm vi phù hợp.</li>
            </ul>
            <p>
              Các yêu cầu liên quan có thể được gửi qua email hỗ trợ của chúng tôi.
            </p>
          </section>

          <section>
            <h2>8. Thời gian lưu trữ thông tin</h2>
            <p>
              Chúng tôi lưu trữ thông tin trong khoảng thời gian cần thiết để phục vụ
              mục đích vận hành nền tảng, hỗ trợ người dùng, tuân thủ nghĩa vụ pháp
              lý hoặc giải quyết tranh chấp nếu có.
            </p>
          </section>

          <section>
            <h2>9. Thay đổi chính sách bảo mật</h2>
            <p>
              Học Cùng Bé có thể cập nhật chính sách bảo mật theo từng thời điểm.
              Phiên bản mới sẽ được đăng tải trên website và có hiệu lực kể từ thời
              điểm công bố.
            </p>
          </section>

          <section>
            <h2>10. Liên hệ</h2>
            <p>
              Nếu bạn có câu hỏi hoặc yêu cầu liên quan đến chính sách bảo mật, vui
              lòng liên hệ:
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