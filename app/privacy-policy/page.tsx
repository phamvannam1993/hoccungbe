import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '../components/edu/LegalPage';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description:
    'Chính sách bảo mật của Bé Hay Học, mô tả cách thu thập, sử dụng và bảo vệ thông tin người dùng trên nền tảng học tập cho trẻ em.',
  alternates: {
    canonical: '/chinh-sach-bao-mat',
  },
};

const sections: LegalSection[] = [
  {
    title: 'Thông tin chúng tôi có thể thu thập',
    content: (
      <>
        <p>Trong quá trình sử dụng nền tảng, chúng tôi có thể thu thập một số thông tin như:</p>
        <ul>
          <li>Thông tin tài khoản như họ tên, email, số điện thoại nếu người dùng cung cấp.</li>
          <li>Thông tin liên quan đến hồ sơ học tập của trẻ như độ tuổi, tiến độ học hoặc hoạt động đã thực hiện.</li>
          <li>Dữ liệu kỹ thuật như địa chỉ IP, loại thiết bị, trình duyệt và hành vi sử dụng cơ bản trên website.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Mục đích sử dụng thông tin',
    content: (
      <>
        <p>Thông tin được thu thập nhằm phục vụ các mục đích sau:</p>
        <ul>
          <li>Cung cấp và vận hành các tính năng của nền tảng.</li>
          <li>Cá nhân hóa trải nghiệm học tập phù hợp hơn với trẻ.</li>
          <li>Hỗ trợ phụ huynh theo dõi tiến độ học tập của con.</li>
          <li>Cải thiện chất lượng nội dung, giao diện và dịch vụ.</li>
          <li>Gửi thông báo, cập nhật hoặc hỗ trợ khi người dùng có yêu cầu.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Cách chúng tôi bảo vệ thông tin',
    content: (
      <>
        <p>
          Bé Hay Học áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ
          thông tin người dùng khỏi truy cập trái phép, mất mát, sử dụng sai mục
          đích hoặc tiết lộ không được phép.
        </p>
        <p>
          Tuy nhiên, không có hệ thống truyền tải hoặc lưu trữ dữ liệu nào đảm bảo
          an toàn tuyệt đối. Vì vậy, người dùng cũng cần chủ động bảo mật thông tin
          tài khoản của mình.
        </p>
      </>
    ),
  },
  {
    title: 'Chia sẻ thông tin với bên thứ ba',
    content: (
      <>
        <p>
          Chúng tôi không bán hoặc trao đổi thông tin cá nhân của người dùng cho
          bên thứ ba vì mục đích thương mại. Trong một số trường hợp cần thiết,
          thông tin có thể được chia sẻ với đối tác cung cấp hạ tầng hoặc dịch vụ
          kỹ thuật để hỗ trợ vận hành nền tảng, với điều kiện các bên này có trách
          nhiệm bảo mật phù hợp.
        </p>
        <p>
          Chúng tôi cũng có thể cung cấp thông tin nếu được yêu cầu bởi cơ quan nhà
          nước có thẩm quyền theo quy định pháp luật.
        </p>
      </>
    ),
  },
  {
    title: 'Dữ liệu liên quan đến trẻ em',
    content: (
      <>
        <p>
          Vì Bé Hay Học là nền tảng học tập dành cho trẻ em, chúng tôi đặc biệt coi
          trọng việc bảo vệ dữ liệu liên quan đến trẻ. Phụ huynh hoặc người giám hộ
          cần giám sát quá trình đăng ký, sử dụng và quản lý tài khoản liên quan đến
          trẻ em.
        </p>
        <p>
          Chúng tôi khuyến khích chỉ cung cấp các thông tin cần thiết cho mục đích
          sử dụng nền tảng và hạn chế chia sẻ thông tin nhạy cảm không cần thiết.
        </p>
      </>
    ),
  },
  {
    title: 'Cookie và dữ liệu sử dụng',
    content: (
      <p>
        Website có thể sử dụng cookie hoặc các công nghệ tương tự để ghi nhớ tùy
        chọn, cải thiện trải nghiệm người dùng và phân tích hiệu quả hoạt động của
        nền tảng. Người dùng có thể điều chỉnh cài đặt trình duyệt để từ chối
        cookie, tuy nhiên một số tính năng có thể bị ảnh hưởng.
      </p>
    ),
  },
  {
    title: 'Quyền của người dùng',
    content: (
      <>
        <p>Người dùng có thể:</p>
        <ul>
          <li>Yêu cầu xem lại thông tin cá nhân đã cung cấp.</li>
          <li>Yêu cầu chỉnh sửa thông tin không chính xác.</li>
          <li>Yêu cầu xóa hoặc ngừng xử lý thông tin trong phạm vi phù hợp.</li>
        </ul>
        <p>Các yêu cầu liên quan có thể được gửi qua email hỗ trợ của chúng tôi.</p>
      </>
    ),
  },
  {
    title: 'Thời gian lưu trữ thông tin',
    content: (
      <p>
        Chúng tôi lưu trữ thông tin trong khoảng thời gian cần thiết để phục vụ mục
        đích vận hành nền tảng, hỗ trợ người dùng, tuân thủ nghĩa vụ pháp lý hoặc
        giải quyết tranh chấp nếu có.
      </p>
    ),
  },
  {
    title: 'Thay đổi chính sách bảo mật',
    content: (
      <p>
        Bé Hay Học có thể cập nhật chính sách bảo mật theo từng thời điểm. Phiên bản
        mới sẽ được đăng tải trên website và có hiệu lực kể từ thời điểm công bố.
      </p>
    ),
  },
  {
    title: 'Liên hệ',
    content: (
      <p>
        Nếu bạn có câu hỏi hoặc yêu cầu liên quan đến chính sách bảo mật, vui lòng
        liên hệ qua email{' '}
        <a href="mailto:behayhoc@gmail.com">behayhoc@gmail.com</a>.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      kicker="Thông tin pháp lý"
      title="Chính sách bảo mật"
      crumb="Chính sách bảo mật"
      intro="Bé Hay Học cam kết tôn trọng và bảo vệ thông tin cá nhân của người dùng. Chính sách này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo mật thông tin khi bạn truy cập hoặc sử dụng nền tảng."
      updated="16/07/2026"
      sections={sections}
      related={{ href: '/dieu-khoan', label: 'Điều khoản sử dụng' }}
    />
  );
}
