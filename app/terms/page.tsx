import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '../components/edu/LegalPage';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description:
    'Điều khoản sử dụng của Bé Hay Học, quy định quyền và trách nhiệm của người dùng khi truy cập và sử dụng nền tảng học tập cho trẻ em.',
  alternates: {
    canonical: '/dieu-khoan',
  },
};

const sections: LegalSection[] = [
  {
    title: 'Phạm vi áp dụng',
    content: (
      <p>
        Điều khoản sử dụng này áp dụng cho tất cả người dùng truy cập website, tạo
        tài khoản hoặc sử dụng bất kỳ nội dung, tính năng, trò chơi, bài học hay
        dịch vụ nào thuộc nền tảng Bé Hay Học.
      </p>
    ),
  },
  {
    title: 'Mục đích của nền tảng',
    content: (
      <p>
        Bé Hay Học là nền tảng học tập dành cho trẻ em, hướng đến việc cung cấp các
        nội dung giáo dục trực quan, trò chơi học tập ngắn và công cụ hỗ trợ phụ
        huynh theo dõi tiến độ học tập của trẻ. Nội dung trên nền tảng được thiết kế
        nhằm hỗ trợ học tập và không thay thế hoàn toàn vai trò hướng dẫn của phụ
        huynh, giáo viên hoặc chuyên gia giáo dục.
      </p>
    ),
  },
  {
    title: 'Tài khoản người dùng',
    content: (
      <>
        <p>
          Khi đăng ký tài khoản, người dùng có trách nhiệm cung cấp thông tin chính
          xác, đầy đủ và cập nhật khi cần thiết. Người dùng chịu trách nhiệm bảo mật
          thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản của mình.
        </p>
        <p>
          Trong trường hợp phát hiện tài khoản bị truy cập trái phép hoặc có dấu
          hiệu mất an toàn, người dùng cần thông báo cho Bé Hay Học trong thời gian
          sớm nhất để được hỗ trợ.
        </p>
      </>
    ),
  },
  {
    title: 'Quyền và trách nhiệm của người dùng',
    content: (
      <>
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
          Người dùng có trách nhiệm giám sát việc sử dụng nền tảng của trẻ em trong
          trường hợp tài khoản được sử dụng cho mục đích học tập của con.
        </p>
      </>
    ),
  },
  {
    title: 'Nội dung và quyền sở hữu trí tuệ',
    content: (
      <>
        <p>
          Toàn bộ nội dung trên Bé Hay Học, bao gồm nhưng không giới hạn ở văn bản,
          hình ảnh, biểu tượng, giao diện, bài học, trò chơi, thiết kế và các tài
          liệu liên quan, đều thuộc quyền sở hữu của Bé Hay Học hoặc các bên cấp
          phép hợp pháp.
        </p>
        <p>
          Người dùng không được sao chép, chỉnh sửa, tái xuất bản hoặc sử dụng các
          nội dung này cho mục đích thương mại nếu chưa được chấp thuận bằng văn bản.
        </p>
      </>
    ),
  },
  {
    title: 'Giới hạn trách nhiệm',
    content: (
      <>
        <p>
          Bé Hay Học nỗ lực duy trì nền tảng ổn định, chính xác và an toàn. Tuy
          nhiên, chúng tôi không đảm bảo rằng dịch vụ sẽ luôn hoạt động liên tục,
          không có lỗi hoặc hoàn toàn phù hợp với mọi nhu cầu cụ thể của từng người
          dùng.
        </p>
        <p>
          Bé Hay Học không chịu trách nhiệm đối với các thiệt hại phát sinh do lỗi
          kết nối, thiết bị, hành vi sử dụng không đúng mục đích hoặc các yếu tố nằm
          ngoài khả năng kiểm soát hợp lý của chúng tôi.
        </p>
      </>
    ),
  },
  {
    title: 'Tạm ngưng hoặc chấm dứt quyền truy cập',
    content: (
      <p>
        Chúng tôi có quyền tạm ngưng hoặc chấm dứt quyền truy cập của người dùng
        trong trường hợp phát hiện hành vi vi phạm điều khoản sử dụng, gây ảnh hưởng
        đến hệ thống, cộng đồng người dùng hoặc an toàn của nền tảng.
      </p>
    ),
  },
  {
    title: 'Liên kết đến bên thứ ba',
    content: (
      <p>
        Website có thể chứa liên kết đến các trang hoặc dịch vụ của bên thứ ba. Bé
        Hay Học không chịu trách nhiệm đối với nội dung, chính sách hoặc cách vận
        hành của các website bên ngoài đó.
      </p>
    ),
  },
  {
    title: 'Thay đổi điều khoản',
    content: (
      <p>
        Bé Hay Học có thể cập nhật điều khoản sử dụng theo từng thời điểm để phù hợp
        với sự thay đổi của dịch vụ hoặc yêu cầu pháp lý. Phiên bản cập nhật sẽ được
        đăng tải trên website và có hiệu lực kể từ thời điểm công bố.
      </p>
    ),
  },
  {
    title: 'Liên hệ',
    content: (
      <p>
        Nếu bạn có câu hỏi liên quan đến điều khoản sử dụng, vui lòng liên hệ với
        chúng tôi qua email{' '}
        <a href="mailto:behayhoc@gmail.com">behayhoc@gmail.com</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      kicker="Thông tin pháp lý"
      title="Điều khoản sử dụng"
      crumb="Điều khoản sử dụng"
      intro="Khi truy cập và sử dụng Bé Hay Học, người dùng đồng ý tuân thủ các điều khoản dưới đây. Những điều khoản này được xây dựng nhằm đảm bảo trải nghiệm an toàn, minh bạch và phù hợp cho phụ huynh và trẻ em."
      updated="16/07/2026"
      sections={sections}
      related={{ href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' }}
    />
  );
}
