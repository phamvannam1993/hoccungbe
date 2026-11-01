import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { CONG_CU_TOAN } from '../lib/congCuToan';
import { gamesData } from '../components/edu/data/gamesData';
import { KidCrumb, KidFaq, TONES, type Tone } from '../components/seo/kid';

// Trang giới thiệu toàn bộ tính năng: /gioi-thieu.
// Khác /so-do-trang (chỉ là danh sách link): ở đây mỗi tính năng có một câu nói rõ bé
// hoặc ba mẹ LÀM GÌ ở đó, gom theo nhu cầu chứ không theo cấu trúc URL.
export const revalidate = 86400;

const TITLE = 'Giới thiệu Bé Hay Học – toàn bộ tính năng cho bé và ba mẹ';
const DESCRIPTION =
  'Mọi thứ Bé Hay Học có: khóa học lớp 1–5, bài tập và đề thi có chấm điểm, công cụ Toán trực quan, Tiếng Việt, Tiếng Anh, trò chơi giáo dục, thi đấu, sao thưởng và báo cáo cho phụ huynh.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/gioi-thieu') },
  openGraph: { title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, url: canonical('/gioi-thieu'), type: 'website', siteName: SITE_NAME, locale: 'vi_VN' },
};

type Feature = { href: string; ten: string; emoji: string; moTa: string };
type Group = { id: string; emoji: string; title: string; intro: string; tone: Tone; items: Feature[] };

const GAMES = gamesData.filter((g) => g.status === 'ready');

const GROUPS: Group[] = [
  {
    id: 'hoc-theo-lop', emoji: '🎒', title: 'Học theo lớp', tone: 'pink',
    intro: 'Bài học bám sát chương trình Bộ GD&ĐT, từ mẫu giáo đến lớp 5. Chọn lớp một lần, lần sau vào là thẳng lớp của bé.',
    items: [
      { href: '/khoa-hoc', ten: 'Khóa học cho bé', emoji: '📚', moTa: 'Toán, Tiếng Việt, Tiếng Anh theo từng lớp: bài giảng ngắn, bài tập tương tác và trò chơi.' },
      { href: '/lop-1', ten: 'Trang riêng từng lớp', emoji: '1️⃣', moTa: 'Mỗi lớp 1–5 một trang gom đủ bài học, bài tập và đề thi của lớp đó.' },
      { href: '/ky-nang', ten: 'Học theo kỹ năng', emoji: '🎯', moTa: 'Chọn đúng thứ bé đang yếu (phép chia, toán lời văn…), hệ thống gom bài từ nhiều bài SGK liên quan.' },
      { href: '/khao-sat-dau-vao', ten: 'Khảo sát đầu vào', emoji: '🧭', moTa: '10–15 câu ngắn để hiểu năng lực của bé và gợi ý lộ trình học phù hợp.' },
      { href: '/hoc-hom-nay', ten: 'Học hôm nay', emoji: '📅', moTa: 'Nhiệm vụ trong ngày, tiến độ và bài học gợi ý — mở ra là biết hôm nay học gì.' },
      { href: '/huong-dan', ten: 'Cách bắt đầu', emoji: '🚀', moTa: 'Hướng dẫn từng bước cho ba mẹ lần đầu cho bé học tại nhà.' },
    ],
  },
  {
    id: 'luyen-tap', emoji: '📝', title: 'Luyện tập & ôn thi', tone: 'orange',
    intro: 'Làm bài trực tiếp trên web, chấm điểm ngay, sai câu nào thì ôn lại câu đó.',
    items: [
      { href: '/bai-tap', ten: 'Bài tập theo chủ đề', emoji: '✏️', moTa: 'Mỗi chủ đề 3 mức độ từ dễ đến nâng cao, có đáp án và lời giải.' },
      { href: '/phieu-bai-tap', ten: 'Phiếu bài tập PDF', emoji: '🖨️', moTa: 'Mỗi bài một phiếu kèm đáp án, in hoặc lưu PDF cho bé luyện trên giấy.' },
      { href: '/de-thi', ten: 'Đề thi có chấm điểm', emoji: '📋', moTa: 'Đề kiểm tra giữa kỳ, cuối kỳ theo lớp — làm xong biết điểm và xem lời giải.' },
      { href: '/on-tap-cau-sai', ten: 'Ôn lại câu sai', emoji: '🔁', moTa: 'Tự gom những câu bé từng làm sai để ôn lại cho nhớ lâu.' },
    ],
  },
  {
    id: 'toan', emoji: '🧮', title: 'Toán trực quan', tone: 'purple',
    intro: 'Công cụ bấm, kéo, tô được — bé thấy vì sao ra kết quả thay vì chỉ chọn đáp án.',
    items: CONG_CU_TOAN.filter((c) => c.href !== '/trieu-phu-nhi').map((c) => ({ href: c.href, ten: c.ten, emoji: c.emoji, moTa: c.moTa })),
  },
  {
    id: 'toan-iq', emoji: '🧠', title: 'Khóa Toán IQ', tone: 'yellow',
    intro: 'Khóa nâng cao dạng game cho bé thích thử thách. Có phí theo tháng, mỗi khóa đều có bài học thử miễn phí.',
    items: [
      { href: '/khoa-hoc-iq', ten: 'Toán IQ theo lớp', emoji: '🏅', moTa: 'Mỗi lớp 12 khóa, 60 bài thử thách: quy luật, logic, đếm hình, thời gian, tiền bạc, đo lường.' },
      { href: '/khoa-hoc-iq', ten: 'Đếm ngược & gợi ý', emoji: '⏱️', moTa: 'Mỗi câu có đồng hồ đếm ngược, gợi ý cách làm và lời giải từng bước.' },
      { href: '/khoa-hoc-iq', ten: 'In bài ra giấy', emoji: '🖨️', moTa: 'Bản in của từng khóa để bé làm thêm ngoài màn hình.' },
    ],
  },
  {
    id: 'tieng-viet', emoji: '📖', title: 'Tiếng Việt', tone: 'green',
    intro: 'Từ nhận mặt chữ, đánh vần đến đọc hiểu và viết văn — bài nào cũng có nghe đọc mẫu.',
    items: [
      { href: '/hoc-doc-tieng-viet', ten: 'Học đọc tiếng Việt', emoji: '🔠', moTa: 'Bảng chữ cái, tập đánh vần, 6 dấu thanh và bảng vần đầy đủ.' },
      { href: '/bang-chu-cai', ten: 'Bảng chữ cái 29 chữ', emoji: '🅰️', moTa: 'Chữ thường, chữ hoa, nguyên âm, phụ âm và dấu thanh cho bé lớp 1.' },
      { href: '/vong-tron-am', ten: 'Vòng tròn âm vần', emoji: '⭕', moTa: 'Mỗi âm đầu 10 từ quen thuộc, xem đánh vần từng bước đúng cách dạy lớp 1.' },
      { href: '/noi-am-van', ten: 'Nối âm vần', emoji: '🔗', moTa: 'Nhìn hình nối với chữ — bốn từ cùng âm nên bé phải đọc hết vần mới nối trúng.' },
      { href: '/luyen-viet-chu', ten: 'Luyện viết chữ', emoji: '✍️', moTa: 'Tập viết chữ cái đúng nét, đúng ô li, có trò chơi tô chữ.' },
      { href: '/chinh-ta-tieng-viet', ten: 'Chính tả', emoji: '🔍', moTa: 'Phân biệt s/x, ch/tr, l/n, d/gi/r và dấu hỏi/ngã, có giải thích.' },
      { href: '/luyen-tu-va-cau', ten: 'Luyện từ và câu', emoji: '🧱', moTa: 'Từ chỉ sự vật, hoạt động, đặc điểm; dấu câu; từ trái nghĩa (lớp 2–3).' },
      { href: '/tap-doc-tieng-viet', ten: 'Tập đọc', emoji: '📗', moTa: 'Bài đọc ngắn có nghe đọc mẫu từng câu và câu hỏi đọc hiểu.' },
      { href: '/mo-rong-von-tu', ten: 'Mở rộng vốn từ', emoji: '💬', moTa: 'Từ theo chủ đề, mỗi từ có nghĩa, ví dụ và phát âm.' },
      { href: '/tap-lam-van', ten: 'Tập làm văn', emoji: '📝', moTa: 'Dàn ý, từ ngữ hay, bài văn mẫu nghe được và ô cho bé tự viết.' },
      { href: '/truyen-co-tich', ten: 'Truyện cổ tích', emoji: '🏯', moTa: 'Thánh Gióng, Sơn Tinh – Thủy Tinh… có đọc mẫu và câu hỏi đọc hiểu.' },
      { href: '/dong-dao-ca-dao', ten: 'Đồng dao, ca dao', emoji: '🎶', moTa: 'Dung dăng dung dẻ, Nu na nu nống… có đọc mẫu và ý nghĩa.' },
      { href: '/thanh-ngu-tuc-ngu', ten: 'Thành ngữ, tục ngữ', emoji: '🪷', moTa: 'Theo chủ đề chăm chỉ, đoàn kết, biết ơn — giải nghĩa dễ hiểu.' },
    ],
  },
  {
    id: 'tieng-anh', emoji: '🔤', title: 'Tiếng Anh', tone: 'sky',
    intro: 'Nghe giọng bản ngữ, có nghe chậm và nghĩa tiếng Việt — từ chữ cái đến hội thoại.',
    items: [
      { href: '/hoc-tieng-anh', ten: 'Bài học kiểu game', emoji: '🦉', moTa: 'Nghe chọn tranh, chọn nghĩa, ghép cặp — có tim, sao và phản hồi tức thì.' },
      { href: '/tu-vung-tieng-anh', ten: 'Từ vựng theo chủ đề', emoji: '🐶', moTa: 'Động vật, màu sắc, gia đình… có phiên âm, hình minh hoạ và phát âm.' },
      { href: '/vong-tu-vung', ten: 'Vòng tròn từ vựng', emoji: '🎡', moTa: 'Bánh xe chủ đề từ vựng chia sẵn theo lớp 1 đến lớp 5.' },
      { href: '/bang-chu-cai-tieng-anh', ten: 'Bảng chữ cái A–Z', emoji: '🔡', moTa: 'Tên chữ, âm phonics và từ mẫu có hình, nghe phát âm chuẩn.' },
      { href: '/phonics-tieng-anh', ten: 'Phonics – ghép vần', emoji: '🐱', moTa: 'Âm 26 chữ cái, từ CVC, họ từ -at, -ed… để bé tự đọc từ mới.' },
      { href: '/bang-phien-am-ipa', ten: 'Bảng phiên âm IPA', emoji: '👄', moTa: '44 âm có khẩu hình, vị trí lưỡi và lỗi người Việt hay mắc.' },
      { href: '/sight-words-tieng-anh', ten: 'Sight words', emoji: '👀', moTa: 'Từ thông dụng theo cấp độ Dolch giúp bé đọc trôi chảy.' },
      { href: '/mau-cau-tieng-anh', ten: 'Mẫu câu giao tiếp', emoji: '🗨️', moTa: 'Chào hỏi, This is a…, I like…, I can… nghe cả câu.' },
      { href: '/hoi-thoai-tieng-anh', ten: 'Hội thoại tình huống', emoji: '👫', moTa: 'Làm quen, ở lớp, ở nhà, đi mua đồ — nghe cả đoạn kèm nghĩa.' },
      { href: '/bai-hat-tieng-anh', ten: 'Bài hát tiếng Anh', emoji: '🎤', moTa: 'ABC Song, Twinkle Twinkle… có lời, nghĩa và nghe hát cả bài.' },
      { href: '/ngu-phap-tieng-anh', ten: 'Ngữ pháp qua trò chơi', emoji: '🧩', moTa: 'a/an, số nhiều, this/that, to be, can/can’t — có quy tắc và giải thích.' },
      { href: '/luyen-nghe', ten: 'Luyện nghe', emoji: '🎧', moTa: 'Nghe chọn hình, nghe đoán từ, nghe nhanh 60 giây và nghe truyện trả lời câu hỏi.' },
      { href: '/tinh-huong-tieng-anh', ten: '360 tình huống cho ba mẹ', emoji: '🏠', moTa: 'Câu tiếng Anh ba mẹ nói với con trong sinh hoạt hằng ngày, có nghe chậm.' },
    ],
  },
  {
    id: 'tro-choi', emoji: '🎮', title: 'Trò chơi giáo dục', tone: 'blue',
    intro: `${GAMES.length} trò chơi luyện đếm số, phép tính, chữ cái, từ vựng, ghi nhớ và tư duy — mỗi ván vài phút.`,
    items: GAMES.map((g) => ({ href: `/tro-choi/${g.slug}`, ten: g.title, emoji: g.emoji, moTa: g.shortDescription })),
  },
  {
    id: 'thi-dau', emoji: '🏆', title: 'Thi đấu & đố vui', tone: 'pink',
    intro: 'Khi bé muốn thử sức: tính giờ, tính điểm, có huy chương và bảng xếp hạng.',
    items: [
      { href: '/thi-tai', ten: 'Thi Tài', emoji: '🥇', moTa: 'Thi Toán, Tiếng Anh, Khám phá tính giờ — combo điểm, huy chương Vàng–Bạc–Đồng và hạng mùa.' },
      { href: '/trieu-phu-nhi', ten: 'Ai Là Triệu Phú Nhí', emoji: '💰', moTa: 'Leo 15 mốc thưởng, thử thách 60 giây và Boss; có trợ giúp và phân tích năng lực sau ván.' },
      { href: '/kham-pha', ten: 'Đố vui khám phá', emoji: '🔭', moTa: 'Động vật, cơ thể người, vũ trụ, Việt Nam và thế giới — mỗi câu có giải thích và nghe đọc.' },
    ],
  },
  {
    id: 'dong-luc', emoji: '⭐', title: 'Động lực học mỗi ngày', tone: 'yellow',
    intro: 'Học xong có thưởng để bé tự muốn quay lại — không cần ba mẹ nhắc.',
    items: [
      { href: '/bo-suu-tap', ten: 'Sao & bộ sưu tập', emoji: '🐾', moTa: 'Làm bài kiếm sao, đổi lấy nhãn dán và thú cưng đáng yêu.' },
      { href: '/hoc-hom-nay', ten: 'Chuỗi ngày & nhiệm vụ tuần', emoji: '🔥', moTa: 'Giữ chuỗi ngày học liên tiếp và hoàn thành nhiệm vụ mỗi tuần.' },
      { href: '/chung-nhan', ten: 'Chứng nhận hoàn thành', emoji: '📜', moTa: 'Xem và in chứng nhận khi bé học xong một khóa.' },
      { href: '/thi-tai', ten: 'Khoe thành tích', emoji: '🎉', moTa: 'Chia sẻ huy hiệu, huy chương của bé cho người thân bằng một đường link.' },
    ],
  },
  {
    id: 'phu-huynh', emoji: '👨‍👩‍👧', title: 'Dành cho ba mẹ', tone: 'green',
    intro: 'Biết con học gì, giỏi gì, yếu gì — mà không phải ngồi cạnh từng phút.',
    items: [
      { href: '/ho-so-be', ten: 'Hồ sơ từng bé', emoji: '👶', moTa: 'Một tài khoản tạo được nhiều hồ sơ, mỗi bé một lộ trình và tiến độ riêng.' },
      { href: '/dashboard', ten: 'Bảng theo dõi phụ huynh', emoji: '📊', moTa: 'Bài đã hoàn thành, thời gian học, kỹ năng nổi bật và gợi ý học tiếp.' },
      { href: '/tien-do', ten: 'Tiến độ học tập', emoji: '📈', moTa: 'Báo cáo trực quan theo môn, theo bài và theo kỹ năng.' },
      { href: '/bao-cao', ten: 'Báo cáo tuần', emoji: '🗓️', moTa: 'Tóm tắt 7 ngày: số bài, độ chính xác, môn chăm nhất, chuỗi ngày — chia sẻ được.' },
      { href: '/bai-viet', ten: 'Góc phụ huynh', emoji: '📰', moTa: 'Kinh nghiệm nuôi dạy con và cách kèm con học từng môn.' },
      { href: '/cau-hoi-thuong-gap', ten: 'Câu hỏi thường gặp', emoji: '❓', moTa: 'Giải đáp nhanh về tài khoản, cách học và khóa Toán IQ.' },
      { href: '/ho-tro', ten: 'Hỗ trợ', emoji: '🤝', moTa: 'Liên hệ khi cần giúp đỡ hoặc góp ý cho Bé Hay Học.' },
    ],
  },
  {
    id: 'cong-cu', emoji: '🛠️', title: 'Công cụ miễn phí', tone: 'orange',
    intro: 'Cho phụ huynh và giáo viên tiểu học — không cần đăng ký.',
    items: [
      { href: '/cong-cu/tao-bai-tap-cong-tru', ten: 'Tạo phiếu toán', emoji: '➗', moTa: 'Chọn phép tính, phạm vi số, số câu rồi in hoặc lưu PDF, có đáp án.' },
      { href: '/cong-cu/chuyen-van-ban-thanh-giong-noi', ten: 'Văn bản → giọng nói', emoji: '🔊', moTa: 'Dán đoạn văn tiếng Việt, nghe đọc thành tiếng.' },
      { href: '/cong-cu/chuyen-giong-noi-thanh-van-ban', ten: 'Giọng nói → văn bản', emoji: '🎙️', moTa: 'Nói vào micro, máy gõ ra chữ.' },
      { href: '/tim-kiem', ten: 'Tìm kiếm', emoji: '🔎', moTa: 'Tìm khóa học, bài tập, đề thi, trò chơi và bài viết trong một ô.' },
    ],
  },
];


const HIGHLIGHTS = [
  { emoji: '🆓', ten: 'Học miễn phí', moTa: 'Phần lớn nội dung mở cho mọi bé', mau: '#FFE4EE' },
  { emoji: '📘', ten: 'Bám chương trình', moTa: 'Theo SGK Bộ GD&ĐT, mẫu giáo – lớp 5', mau: '#E0F2FE' },
  { emoji: '🔊', ten: 'Bấm là nghe đọc', moTa: 'Bé chưa đọc thạo vẫn tự học được', mau: '#DCFCE7' },
  { emoji: '📱', ten: 'Cài như app', moTa: 'Thêm vào màn hình chính điện thoại', mau: '#FEF3C7' },
];

const FAQ = [
  { q: 'Bé Hay Học dành cho bé mấy tuổi?', a: 'Bé từ 3 đến 10 tuổi: mẫu giáo làm quen chữ và số, lớp 1–5 học theo chương trình tiểu học.' },
  { q: 'Có phải trả phí không?', a: 'Khóa học, bài tập, đề thi, trò chơi và công cụ đều học miễn phí. Riêng khóa Toán IQ nâng cao có phí theo tháng, mỗi khóa đều có bài học thử miễn phí.' },
  { q: 'Có cần tạo tài khoản không?', a: 'Nhiều trang dùng được ngay. Tạo tài khoản để lưu tiến độ, sao thưởng, hồ sơ từng bé và nhận báo cáo tuần.' },
  { q: 'Một tài khoản dùng cho mấy bé?', a: 'Một tài khoản phụ huynh tạo được nhiều hồ sơ bé, tiến độ của mỗi bé tách riêng.' },
];

const IQ_ANH = [
  { src: '/assets/images/anh-khoa-hoc-iq/01-quan-sat-tim-quy-luat.webp', alt: 'Quan sát, tìm quy luật' },
  { src: '/assets/images/anh-khoa-hoc-iq/05-logic-suy-luan-thong-minh.webp', alt: 'Logic và suy luận thông minh' },
  { src: '/assets/images/anh-khoa-hoc-iq/04-tu-duy-hinh-hoc-dem-hinh.webp', alt: 'Tư duy hình học, đếm hình' },
];

const NUT_CHINH = 'kid-display inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-black transition active:translate-y-0.5';

function FeatureGrid({ items, tone }: { items: Feature[]; tone: Tone }) {
  const t = TONES[tone];
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <li key={it.href + i}>
          <Link
            href={it.href}
            className="group flex h-full items-start gap-3.5 rounded-2xl border-2 border-transparent bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition duration-200 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)] hover:[border-color:var(--vien)]"
            style={{ '--vien': t.border } as CSSProperties}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl transition group-hover:scale-110" style={{ background: t.tint }} aria-hidden>{it.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 font-black leading-snug text-slate-800 kid-display">
                {it.ten}
                <span className="ml-auto text-base opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" style={{ color: t.c }} aria-hidden>→</span>
              </span>
              <span className="mt-1 block text-[13px] leading-[1.6] text-slate-500">{it.moTa}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function GroupHeading({ g, so }: { g: Group; so: number }) {
  const t = TONES[g.tone];
  return (
    <div className="mb-5 flex items-start gap-4">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[20px] text-3xl text-white shadow-md sm:h-16 sm:w-16" style={{ backgroundImage: t.grad }} aria-hidden>
        {g.emoji}
      </span>
      <div className="min-w-0">
        <p className="kid-display text-[11px] font-black uppercase tracking-[0.14em]" style={{ color: t.c }}>
          Nhóm {so} · {new Set(g.items.map((x) => x.href)).size} tính năng
        </p>
        <h2 id={`${g.id}-tieu-de`} className="kid-display text-2xl font-black leading-tight text-slate-900 sm:text-3xl">{g.title}</h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{g.intro}</p>
      </div>
    </div>
  );
}

function IqBanner({ g, so }: { g: Group; so: number }) {
  return (
    <div className="overflow-hidden rounded-[28px] p-5 sm:p-8" style={{ background: 'linear-gradient(135deg,#FFF7D6 0%,#FFE8C2 55%,#FFD9E6 100%)' }}>
      <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="kid-display inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#a16207] shadow-sm">
            Nhóm {so} · Nâng cao
          </span>
          <h2 id={`${g.id}-tieu-de`} className="kid-display mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">{g.emoji} {g.title}</h2>
          <p className="mt-2 leading-relaxed text-slate-700">{g.intro}</p>
          <ul className="mt-4 space-y-2.5">
            {g.items.map((it) => (
              <li key={it.ten} className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-lg shadow-sm" aria-hidden>{it.emoji}</span>
                <span className="text-sm leading-relaxed text-slate-700"><b className="text-slate-900">{it.ten}.</b> {it.moTa}</span>
              </li>
            ))}
          </ul>
          <Link href="/khoa-hoc-iq" className={`${NUT_CHINH} mt-6 text-[#7a4a00]`} style={{ background: 'linear-gradient(180deg,#ffd452 0%,#f7b731 100%)', boxShadow: '0 5px 0 #d99a12' }}>
            Xem các khóa Toán IQ →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {IQ_ANH.map((a, i) => (
            <Image key={a.src} src={a.src} alt={a.alt} width={374} height={320}
              className={`h-auto w-full rounded-2xl bg-white object-cover shadow-md ring-4 ring-white ${i === 1 ? 'lg:-translate-y-4' : 'lg:translate-y-3'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const total = GROUPS.reduce((n, g) => n + new Set(g.items.map((x) => x.href)).size, 0);
  const stats = [
    { so: `${Math.floor(total / 10) * 10}+`, nhan: 'tính năng' },
    { so: `${GAMES.length}`, nhan: 'trò chơi' },
    { so: `${GROUPS.find((g) => g.id === 'toan')!.items.length}`, nhan: 'công cụ Toán' },
    { so: '1–5', nhan: 'lớp tiểu học' },
  ];

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Giới thiệu', item: `${SITE_URL}/gioi-thieu` },
    ],
  };

  return (
    <div className="kid-bg min-h-screen pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Giới thiệu' }]} />

        {/* ── HERO: cùng nền trời và cặp màu xanh – cam với hero trang chủ để hai trang trông là một nhà. */}
        <section className="relative overflow-hidden rounded-[32px] px-5 pb-6 pt-7 shadow-[0_14px_40px_rgba(30,90,168,0.14)] sm:px-10 sm:pt-10"
          style={{ background: 'linear-gradient(180deg,#bfe9ff 0%,#daf3ff 50%,#eaf9e6 100%)' }}>
          <div className="pointer-events-none absolute inset-0 select-none" aria-hidden>
            <span className="absolute left-[4%] top-[8%] text-4xl opacity-70">☁️</span>
            <span className="absolute right-[38%] top-[5%] hidden text-3xl opacity-60 sm:block">☁️</span>
            <span className="absolute right-[6%] top-[10%] text-2xl opacity-70 sm:hidden">⭐</span>
          </div>

          <div className="relative grid items-end gap-4 lg:grid-cols-[1.35fr_1fr]">
            <div className="pb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-black text-slate-600 shadow-sm">
                🌈 Giới thiệu Bé Hay Học
              </span>
              <h1 className="kid-display mt-3 text-[34px] font-black leading-[1.08] sm:text-5xl">
                <span className="block text-[#1e5aa8]">Mọi thứ bé cần</span>
                <span className="block text-[#f5911e]">để học vui mỗi ngày</span>
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
                Nền tảng học tập và trò chơi giáo dục cho bé 3–10 tuổi: Toán, Tiếng Việt, Tiếng Anh và tư duy
                qua bài học ngắn, trực quan. Dưới đây là toàn bộ tính năng, gom theo {GROUPS.length} nhóm — bấm vào mục nào cũng dùng thử được ngay.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/dang-ky" className={`${NUT_CHINH} text-[#7a4a00]`} style={{ background: 'linear-gradient(180deg,#ffd452 0%,#f7b731 100%)', boxShadow: '0 5px 0 #d99a12' }}>
                  ▶ Tạo tài khoản miễn phí
                </Link>
                <Link href="/huong-dan" className={`${NUT_CHINH} bg-white text-[#1e5aa8]`} style={{ boxShadow: '0 5px 0 #b6d9f2' }}>
                  Cách bắt đầu
                </Link>
              </div>
            </div>
            <div className="relative mx-auto hidden w-full max-w-[300px] lg:block">
              <Image src="/assets/images/01-mascot-tiger-trophy.webp" alt="Hổ Con – linh vật Bé Hay Học" width={374} height={420} priority className="bhh-float h-auto w-full drop-shadow-xl" />
            </div>
          </div>

          <dl className="relative mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {stats.map((s) => (
              <div key={s.nhan} className="rounded-2xl bg-white/90 px-4 py-3 text-center shadow-sm backdrop-blur">
                <dt className="sr-only">{s.nhan}</dt>
                <dd className="kid-display text-2xl font-black leading-none text-[#1e5aa8] sm:text-3xl">{s.so}</dd>
                <dd className="mt-1 text-xs font-bold text-slate-500">{s.nhan}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── ĐIỂM MẠNH: một dải gọn như trang chủ, không phải bốn thẻ to. */}
        <ul className="mt-5 grid grid-cols-1 gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-slate-100">
          {HIGHLIGHTS.map((h) => (
            <li key={h.ten} className="flex items-center gap-3 px-2">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl" style={{ background: h.mau }} aria-hidden>{h.emoji}</span>
              <span className="min-w-0 text-xs leading-snug text-slate-500">
                <span className="kid-display block text-sm font-black text-slate-800">{h.ten}</span>
                {h.moTa}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── MỤC LỤC: dính đầu màn khi cuộn; mobile vuốt ngang thay vì xuống dòng thành 4–5 hàng. */}
      <nav aria-label="Các nhóm tính năng" className="sticky top-0 z-20 mt-6 border-y border-white/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
          {GROUPS.map((g) => {
            const t = TONES[g.tone];
            return (
              <a key={g.id} href={`#${g.id}`} className="kid-display shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-black transition hover:brightness-95" style={{ background: t.tint, color: t.c }}>
                {g.emoji} {g.title}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-6 sm:px-6">
        {GROUPS.map((g, i) => (
          <section key={g.id} id={g.id} className="scroll-mt-20" aria-labelledby={`${g.id}-tieu-de`}>
            {g.id === 'toan-iq' ? (
              <IqBanner g={g} so={i + 1} />
            ) : (
              <div className="rounded-[28px] bg-white/60 p-4 ring-1 ring-white sm:p-7">
                <GroupHeading g={g} so={i + 1} />
                <FeatureGrid items={g.items} tone={g.tone} />
              </div>
            )}
          </section>
        ))}

        <section className="rounded-[28px] bg-white/60 p-4 ring-1 ring-white sm:p-7">
          <h2 className="kid-display mb-4 text-2xl font-black text-slate-900 sm:text-3xl">💡 Ba mẹ hay hỏi</h2>
          <KidFaq items={FAQ} />
        </section>

        {/* ── LỜI MỜI CUỐI TRANG */}
        <section className="relative overflow-hidden rounded-[32px] px-6 py-8 text-white shadow-[0_14px_40px_rgba(255,107,157,0.30)] sm:px-10 sm:py-10"
          style={{ backgroundImage: 'linear-gradient(135deg,#FF6B9D 0%,#FF9F45 100%)' }}>
          <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <h2 className="kid-display text-2xl font-black leading-tight sm:text-4xl">Bắt đầu cùng bé ngay hôm nay</h2>
              <p className="mt-2 max-w-xl text-white/90">Chọn lớp của bé một lần, Bé Hay Học gợi ý bài phù hợp mỗi ngày và gửi báo cáo cho ba mẹ.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/dang-ky" className={`${NUT_CHINH} bg-white text-[#c81e5b]`} style={{ boxShadow: '0 5px 0 rgba(0,0,0,0.12)' }}>
                  Tạo tài khoản miễn phí
                </Link>
                <Link href="/khoa-hoc" className={`${NUT_CHINH} bg-white/15 text-white ring-2 ring-white/70`}>
                  Xem khóa học →
                </Link>
              </div>
            </div>
            <Image src="/assets/images/01-mascot-tiger-trophy.webp" alt="" width={374} height={420} className="bhh-float mx-auto hidden h-auto w-40 drop-shadow-xl sm:block" />
          </div>
        </section>
      </div>
    </div>
  );
}
