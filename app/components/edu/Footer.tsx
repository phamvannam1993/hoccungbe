'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { PARENT_LINKS } from './navData';
import { ALL_GRADES, gradeHref, gradeName } from '../../lib/catalog';

const quickLinks = [
  { label: 'Tiếng Việt', href: '/tieng-viet' },
  { label: 'Học Toán – bộ công cụ', href: '/hoc-toan' },
  { label: 'Tiếng Anh', href: '/tu-vung-tieng-anh' },
  { label: 'Đề thi có chấm điểm', href: '/de-thi' },
  { label: 'Sân chơi Trí tuệ', href: '/san-choi-tri-tue' },
  { label: 'Tài liệu in', href: '/tai-lieu-in' },
  { label: 'Khóa học cho bé', href: '/khoa-hoc' },
  { label: 'Kho trò chơi giáo dục', href: '/tro-choi' },
  { label: 'Bài tập theo chủ đề', href: '/bai-tap' },
  { label: 'Phiếu bài tập PDF', href: '/phieu-bai-tap' },
  { label: 'Luyện viết chữ đẹp', href: '/luyen-viet-chu-dep' },
  { label: 'Đề thi có chấm điểm', href: '/de-thi' },
  { label: 'Học đọc tiếng Việt', href: '/hoc-doc-tieng-viet' },
  { label: 'Chính tả tiếng Việt', href: '/chinh-ta-tieng-viet' },
  { label: 'Luyện từ và câu', href: '/luyen-tu-va-cau' },
  { label: 'Tập đọc tiếng Việt', href: '/tap-doc-tieng-viet' },
  { label: 'Đồng dao, ca dao', href: '/dong-dao-ca-dao' },
  { label: 'Mở rộng vốn từ', href: '/mo-rong-von-tu' },
  { label: 'Truyện cổ tích', href: '/truyen-co-tich' },
  { label: 'Thành ngữ, tục ngữ', href: '/thanh-ngu-tuc-ngu' },
  { label: 'Tập làm văn', href: '/tap-lam-van' },
  { label: 'Học Toán – bộ công cụ', href: '/hoc-toan' },
  { label: 'Toán tư duy', href: '/toan-tu-duy' },
  { label: 'Luyện tính nhẩm', href: '/luyen-tinh-nham' },
  { label: 'Xem đồng hồ', href: '/xem-dong-ho' },
  { label: 'Phân số trực quan', href: '/phan-so' },
  { label: 'Sơ đồ đoạn thẳng', href: '/so-do-doan-thang' },
  { label: 'Đặt tính rồi tính', href: '/dat-tinh' },
  { label: 'Tiền Việt Nam', href: '/tien-viet-nam' },
  { label: 'Đo lường', href: '/do-luong' },
  { label: 'Hình học', href: '/hinh-hoc' },
  { label: 'Chu vi & diện tích', href: '/chu-vi-dien-tich' },
  { label: 'Biểu đồ', href: '/bieu-do' },
  { label: 'Tìm x', href: '/tim-x' },
  { label: 'Số thập phân', href: '/so-thap-phan' },
  { label: 'Cấu tạo số', href: '/cau-tao-so' },
  { label: 'Xác suất', href: '/xac-suat' },
  { label: 'Bảng cộng trừ', href: '/bang-cong-tru' },
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

// Góc phụ huynh: cùng danh sách với menu tài khoản (navData.PARENT_LINKS), cộng hồ sơ bé, chứng nhận.
const parentLinks = [
  ...PARENT_LINKS.map((l) => ({ label: l.label, href: l.href })),
  { label: 'Hồ sơ bé', href: '/ho-so-be' },
  { label: 'Chứng nhận', href: '/chung-nhan' },
  { label: 'Công cụ miễn phí', href: '/cong-cu' },
  { label: 'Gói tài liệu in', href: '/goi-tai-lieu' },
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
      {/* Dưới lg có thanh tab cố định ở đáy (~60px + vùng an toàn): chừa đáy (cả chỗ linh vật Hổ Con ngồi ngay trên thanh tab) để dòng bản quyền/điều khoản không bị che. */}
      <div className="mx-auto max-w-[1440px] px-4 pt-7 pb-[calc(7.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-9 lg:pb-9">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-8 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" aria-label="Về trang chủ Bé Hay Học">
              <Image src="/assets/images/logo.png" alt="Bé Hay Học" width={180} height={65} className="h-10 w-auto object-contain mix-blend-multiply sm:h-14" unoptimized />
            </Link>

            {/* Một đoạn thay vì hai: chân trang không phải chỗ đọc giới thiệu dài. */}
            <p className="mt-3 max-w-md text-[13px] leading-6 text-white/90 sm:text-sm">
              Nền tảng học tập và trò chơi giáo dục cho bé 3–10 tuổi: học chữ, toán,
              tiếng Anh và tư duy qua các bài học ngắn, trực quan.
            </p>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h2 className="text-[11px] font-black uppercase tracking-[0.12em] text-white sm:text-sm">
              Khám phá
            </h2>
            <ul className="mt-4 space-y-2">
              {/* Chỉ 8 lối vào chính. Trước đây đổ hết 26 mục làm chân trang dài
                  hơn cả phần nội dung; số còn lại vẫn có ở khối "Xem tất cả nội
                  dung" trên trang chủ nên không mất liên kết nội bộ. */}
              {quickLinks.slice(0, 8).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[13px] text-white/90 transition hover:text-white sm:text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h2 className="text-[11px] font-black uppercase tracking-[0.12em] text-white sm:text-sm">
              Chủ đề học tập
            </h2>
            <ul className="mt-4 space-y-2">
              {seoLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-white/90 transition hover:text-white sm:text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h2 className="text-[11px] font-black uppercase tracking-[0.12em] text-white sm:text-sm">
              Góc phụ huynh
            </h2>
            <ul className="mt-4 space-y-2">
              {parentLinks.map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} className="text-[13px] text-white/90 transition hover:text-white sm:text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h2 className="text-[11px] font-black uppercase tracking-[0.12em] text-white sm:text-sm">
              Liên hệ
            </h2>
            <div className="mt-5 space-y-4 text-sm text-white/90">
              {/* min-w-0 + break-all: địa chỉ email là một chuỗi liền không có
                  chỗ ngắt, ở bề ngang 1024px nó đẩy cả trang rộng ra 1043px
                  làm xuất hiện thanh cuộn ngang. Đã đo trên iPad ngang. */}
              <p className="flex min-w-0 gap-3">
                <Mail size={18} className="mt-1 shrink-0 text-white/90" />
                <span className="min-w-0 break-all">
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

        {/* Học theo lớp — lối vào chính của cấu trúc mới */}
        <nav aria-label="Học theo lớp" className="mt-6 flex flex-wrap items-center gap-2 sm:mt-8">
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-white sm:text-sm">Học theo lớp</span>
          {ALL_GRADES.map((g) => (
            <Link key={g} href={gradeHref(g)} className="rounded-full bg-white/15 px-3 py-1 text-[13px] font-bold text-white transition hover:bg-white/25">
              {gradeName(g)}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t border-white/20 pt-4 sm:mt-8 sm:pt-5">
          <div className="flex flex-col gap-2.5 text-[12px] text-white/80 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
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
