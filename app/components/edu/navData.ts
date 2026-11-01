'use client';

// Dữ liệu menu dùng chung cho header (máy tính) và trang Menu (điện thoại),
// cùng hai hook đọc tài khoản và slug khóa học thật.

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CONG_CU_TOAN } from '../../lib/congCuToan';
import { isGuest, listChildren, type Child } from '../../lib/childData';

/** `wideOnly`: chỉ hiện trên menu ngang từ 1280px (màn vừa không đủ chỗ; vẫn có trong menu mobile). */
export type NavItem = { href: string; label: string; children?: NavItem[]; mega?: 'grades'; wideOnly?: boolean };

export const GRADES = [1, 2, 3, 4, 5] as const;
export const SUBJECTS = [
  { slug: 'toan', label: 'Toán', emoji: '🔢', color: '#FF6B9D' },
  { slug: 'tieng-viet', label: 'Tiếng Việt', emoji: '📖', color: '#4ECDC4' },
];

export const NAV_MENU: NavItem[] = [
  // Logo đã dẫn về trang chủ → ở màn 1024–1279px bỏ mục này để menu không chạm nút Đăng ký.
  { href: '/', label: 'Trang chủ', wideOnly: true },
  { href: '/khoa-hoc', label: 'Lớp học', mega: 'grades' },
  {
    // Gom công cụ Toán vào một nhóm — danh sách lấy từ app/lib/congCuToan.ts
    // để thêm công cụ mới chỉ phải sửa một chỗ.
    href: '/hoc-toan',
    label: 'Toán',
    children: [
      { href: '/hoc-toan', label: 'Tất cả công cụ Toán' },
      ...CONG_CU_TOAN.map((c) => ({ href: c.href, label: `${c.emoji} ${c.ten}` })),
    ],
  },
  {
    // Khu bán khóa Toán IQ (app/khoa-hoc-iq) — 12 khóa mỗi lớp, mở theo gói.
    href: '/khoa-hoc-iq',
    label: 'Toán IQ',
    children: [
      { href: '/khoa-hoc-iq', label: '🧠 Tất cả khóa Toán IQ' },
      { href: '/khoa-hoc-iq?lop=lop-1', label: '1️⃣ Toán IQ lớp 1' },
      { href: '/khoa-hoc-iq?lop=lop-2', label: '2️⃣ Toán IQ lớp 2' },
      { href: '/khoa-hoc-iq?lop=lop-3', label: '3️⃣ Toán IQ lớp 3' },
    ],
  },
  { href: '/tro-choi', label: 'Game' },
  {
    href: '/tu-vung-tieng-anh',
    label: 'Tiếng Anh',
    children: [
      { href: '/tu-vung-tieng-anh', label: 'Từ vựng theo chủ đề' },
      { href: '/bang-chu-cai-tieng-anh', label: 'Bảng chữ cái A–Z' },
      { href: '/phonics-tieng-anh', label: 'Phonics – Ghép vần đọc' },
      { href: '/bang-phien-am-ipa', label: 'Bảng phiên âm IPA' },
      { href: '/sight-words-tieng-anh', label: 'Sight words – Từ thông dụng' },
      { href: '/mau-cau-tieng-anh', label: 'Mẫu câu giao tiếp' },
      { href: '/hoi-thoai-tieng-anh', label: 'Hội thoại tình huống' },
      { href: '/bai-hat-tieng-anh', label: 'Bài hát tiếng Anh' },
      { href: '/ngu-phap-tieng-anh', label: 'Ngữ pháp qua trò chơi' },
    ],
  },
  {
    // Gom các sân chơi thi đấu vào một nhóm — thêm mục cấp 1 nữa thì thanh menu
    // quá chật trên màn hình vừa.
    href: '/thi-tai',
    label: 'Thi tài',
    children: [
      { href: '/thi-tai', label: 'Thi Tài giành huy chương' },
      { href: '/trieu-phu-nhi', label: 'Ai Là Triệu Phú Nhí' },
      { href: '/kham-pha', label: 'Đố vui khám phá' },
    ],
  },
  { href: '/de-thi', label: 'Ôn thi' },
  // { href: '/tai-lieu', label: 'KHO TÀI LIỆU' },  // tạm ẩn
  { href: '/bai-viet', label: 'Blog' },
];

// Khu vực phụ huynh — chỉ hiện khi đã đăng nhập (hoặc khách đã tạo bé).
export const ACCOUNT_LINKS = [
  { href: '/hoc-hom-nay', label: 'Học hôm nay', emoji: '📅' },
  { href: '/bo-suu-tap', label: 'Bộ sưu tập', emoji: '⭐' },
  { href: '/bao-cao', label: 'Báo cáo tuần', emoji: '📊' },
  { href: '/dashboard', label: 'Bảng theo dõi', emoji: '📊' },
  { href: '/tien-do', label: 'Tiến độ học tập', emoji: '📈' },
  { href: '/ho-so-be', label: 'Hồ sơ bé', emoji: '👶' },
  { href: '/on-tap-cau-sai', label: 'Ôn câu sai', emoji: '🔁' },
  { href: '/chung-nhan', label: 'Chứng nhận', emoji: '🏆' },
];

/** Người dùng đăng nhập, hoặc bé đang chọn của khách đã tạo hồ sơ bé (lưu trên máy). */
export function useAccount() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ fullName: string } | null>(null);
  const [guestChild, setGuestChild] = useState<Child | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('bhh_user');
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
      setGuestChild(null);
      return;
    }
    setUser(null);
    // Khách: nếu đã tạo bé (local) → hiện menu phụ huynh theo tên bé đang chọn.
    if (isGuest()) {
      listChildren()
        .then((arr) => {
          if (!arr.length) { setGuestChild(null); return; }
          const stored = Number(localStorage.getItem('bhh_child_id') || '0');
          setGuestChild(arr.find((c) => c.id === stored) ?? arr[0]);
        })
        .catch(() => setGuestChild(null));
    }
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('bhh_token');
    localStorage.removeItem('bhh_user');
    setUser(null);
    window.location.href = '/';
  };

  return { user, guestChild, logout };
}

/** Map "toan-1" → slug khóa thật (vd "toan-hoc-lop-1") để link khỏi 404. */
export function useCourseSlugs() {
  const [courseSlugs, setCourseSlugs] = useState<Record<string, string>>({});
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${API}/api/courses`)
      .then((r) => (r.ok ? r.json() : []))
      .then((courses: { slug: string; title: string }[]) => {
        const map: Record<string, string> = {};
        for (const c of courses) {
          const s = c.slug.toLowerCase();
          const m = s.match(/lop-?(\d)/);
          if (!m) continue;
          const grade = m[1];
          if (s.includes('toan')) map[`toan-${grade}`] = c.slug;
          else if (s.includes('tieng-viet')) map[`tieng-viet-${grade}`] = c.slug;
        }
        setCourseSlugs(map);
      })
      .catch(() => {});
  }, []);
  return courseSlugs;
}
