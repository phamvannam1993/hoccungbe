import type { Metadata } from 'next';

// Phiếu "ôn câu sai" cá nhân hoá theo từng bé (dữ liệu cục bộ, rỗng với bot)
// → không cho index để tránh trang mỏng/không nội dung lọt vào kết quả tìm kiếm.
export const metadata: Metadata = {
  title: 'Phiếu ôn câu sai',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
