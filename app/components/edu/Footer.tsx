'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const quickLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Khóa học cho bé', href: '/khoa-hoc' },
  { label: 'Kho trò chơi giáo dục', href: '/tro-choi' },
  { label: 'Bài tập theo chủ đề', href: '/bai-tap' },
  { label: 'Phiếu bài tập PDF', href: '/phieu-bai-tap' },
  { label: 'Đề thi có chấm điểm', href: '/de-thi' },
  { label: 'Học đọc tiếng Việt', href: '/hoc-doc-tieng-viet' },
  { label: 'Toán tư duy', href: '/toan-tu-duy' },
  { label: 'Từ vựng tiếng Anh', href: '/tu-vung-tieng-anh' },
  { label: 'Bảng chữ cái tiếng Anh', href: '/bang-chu-cai-tieng-anh' },
  { label: 'Phonics – Ghép vần đọc', href: '/phonics-tieng-anh' },
  { label: 'Mẫu câu tiếng Anh', href: '/mau-cau-tieng-anh' },
  { label: 'Sight words tiếng Anh', href: '/sight-words-tieng-anh' },
  { label: 'Hội thoại tiếng Anh', href: '/hoi-thoai-tieng-anh' },
  { label: 'Bài hát tiếng Anh', href: '/bai-hat-tieng-anh' },
  { label: 'Ngữ pháp tiếng Anh', href: '/ngu-phap-tieng-anh' },
  { label: 'Tiến độ học tập', href: '/tien-do' },
];

const parentLinks = [
  { label: 'Góc phụ huynh', href: '/bai-viet' },
  { label: 'Công cụ miễn phí', href: '/cong-cu' },
  { label: 'Cách bắt đầu', href: '/huong-dan' },
  { label: 'Câu hỏi thường gặp', href: '/cau-hoi-thuong-gap' },
  { label: 'Hỗ trợ', href: '/ho-tro' },
];

const legalLinks = [
  { label: 'Sơ đồ trang', href: '/so-do-trang' },
  { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
  { label: 'Điều khoản sử dụng', href: '/dieu-khoan' },
];

export default function Footer() {
  // "Chủ đề học tập" lấy ĐỘNG theo khóa học đã xuất bản (không fix cứng landing page).
  const [seoLinks, setSeoLinks] = useState<{ label: string; href: string }[]>([
    { label: 'Toán lớp 1', href: '/khoa-hoc/toan-lop-1' },
    { label: 'Tiếng Việt lớp 1', href: '/khoa-hoc/tieng-viet-lop-1' },
    { label: 'Tiếng Anh lớp 1', href: '/khoa-hoc/tieng-anh-lop-1' },
    { label: 'Trò chơi cho bé', href: '/tro-choi' },
  ]);
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${base}/api/courses?limit=100`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const list = (Array.isArray(data) ? data : (data?.data ?? [])) as { slug?: string; title?: string; isPublished?: boolean }[];
        const courses = list.filter((c) => c.slug && c.isPublished).map((c) => ({ label: c.title ?? c.slug!, href: `/khoa-hoc/${c.slug}` }));
        if (courses.length) setSeoLinks([...courses, { label: 'Trò chơi cho bé', href: '/tro-choi' }]);
      })
      .catch(() => {});
  }, []);
  return (
    <footer data-nosnippet className="bg-[#e8735a] border-t border-white/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Về trang chủ Bé Hay Học">
              <Image src="/assets/images/logo.png" alt="Bé Hay Học" width={180} height={65} className="object-contain mix-blend-multiply" unoptimized />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/90">
              Bé Hay Học là nền tảng học tập và trò chơi giáo dục cho bé từ
              3 đến 10 tuổi, giúp trẻ học chữ, toán, tiếng Anh và tư duy qua
              các bài học ngắn, trực quan, dễ tiếp thu.
            </p>

            <p className="mt-3 max-w-md text-sm leading-7 text-white/90">
              Phụ huynh có thể đồng hành cùng con tại nhà, theo dõi tiến độ học
              tập và lựa chọn nội dung phù hợp với từng độ tuổi của bé.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">
              Khám phá
            </h2>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/90 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">
              Chủ đề học tập
            </h2>
            <ul className="mt-5 space-y-3">
              {seoLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/90 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">
              Phụ huynh
            </h2>
            <ul className="mt-5 space-y-3">
              {[...parentLinks, ...legalLinks].map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} className="text-sm text-white/90 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">
              Liên hệ
            </h2>
            <div className="mt-5 space-y-4 text-sm text-white/90">
              <p className="flex gap-3">
                <Mail size={18} className="mt-1 shrink-0 text-white/90" />
                <span>
                  Email hỗ trợ:<br />
                  <a href="mailto:behayhoc@gmail.com" className="font-semibold text-white transition hover:underline">
                    behayhoc@gmail.com
                  </a>
                </span>
              </p>
              {/* Hotline tạm ẩn */}
              <p className="flex gap-3">
                <MapPin size={18} className="mt-1 shrink-0 text-white/90" />
                <span>
                  Website:<br />
                  <a href="https://behayhoc.com" className="font-semibold text-white transition hover:underline">
                    behayhoc.com
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6">
          <div className="flex flex-col gap-3 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Bé Hay Học. Nền tảng học tập và trò chơi giáo dục cho bé.</p>
            <div className="flex flex-wrap gap-4">
              {legalLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
              <Link href="/ho-tro" className="transition hover:text-white">Hỗ trợ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
