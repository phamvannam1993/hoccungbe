'use client';

// Dữ liệu menu dùng chung cho header (máy tính) và trang Menu (điện thoại),
// cùng hai hook đọc tài khoản và slug khóa học thật.

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isGuest, listChildren, type Child } from '../../lib/childData';
import { ALL_GRADES, GRADE_AGE, SCHOOL_GRADES, byHref, gradeHref, gradeName } from '../../lib/catalog';

// Menu 5 mục theo bản thiết kế "cấu trúc mới" (19/11/2026): Lớp của bé · Môn học · Thi & ôn tập ·
// Chơi & thi đấu · Tài liệu in. Nhãn và emoji lấy từ sổ đăng ký app/lib/catalog.ts (byHref) để menu,
// trang lớp và trang chủ gọi cùng một tên.

export type NavLink = { href: string; label: string; emoji?: string; desc?: string };
export type NavGroup = { title: string; href?: string; emoji?: string; links: NavLink[] };
/**
 * `align`: neo bảng xổ xuống — 'start' (mép trái của mục), 'end' (mép phải), 'nav' (mép trái cả thanh menu,
 * dùng cho bảng rộng nhiều cột để không tràn ra ngoài màn 1024px).
 */
export type NavItem = { id: string; href: string; label: string; emoji: string; groups?: NavGroup[]; align?: 'start' | 'end' | 'nav' };

/** Link từ sổ đăng ký: tên + emoji đúng như trang lớp hiển thị. */
const reg = (href: string, label?: string): NavLink => {
  const it = byHref(href);
  return { href, label: label ?? it?.title ?? href, emoji: it?.emoji };
};

export const GRADES = SCHOOL_GRADES;
export const SUBJECTS = [
  { slug: 'toan', label: 'Toán', emoji: '🔢', color: '#FF6B9D' },
  { slug: 'tieng-viet', label: 'Tiếng Việt', emoji: '📖', color: '#4ECDC4' },
];

export const NAV_MENU: NavItem[] = [
  {
    id: 'lop',
    href: '/lop-1',
    label: 'Lớp của bé',
    emoji: '🎒',
    align: 'start',
    groups: [
      {
        title: 'Chọn lớp — mọi thứ của lớp ở một trang',
        links: ALL_GRADES.map((g) => ({ href: gradeHref(g), label: gradeName(g), emoji: g === 0 ? '🧸' : ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][g - 1], desc: GRADE_AGE[g] })),
      },
    ],
  },
  {
    id: 'mon',
    href: '/hoc-toan',
    label: 'Môn học',
    emoji: '📚',
    align: 'nav',
    groups: [
      {
        title: 'Toán',
        href: '/hoc-toan',
        emoji: '🔢',
        links: [
          { href: '/hoc-toan', label: 'Tất cả công cụ Toán', emoji: '🧰' },
          { href: '/khoa-hoc-iq', label: 'Toán IQ lớp 1–3', emoji: '💡' },
          reg('/toan-tu-duy', 'Toán tư duy'),
          reg('/bang-cuu-chuong'),
          reg('/luyen-tinh-nham'),
          reg('/dat-tinh'),
          reg('/xem-dong-ho'),
          reg('/phan-so'),
        ],
      },
      {
        title: 'Tiếng Việt',
        href: '/tieng-viet',
        emoji: '📖',
        links: [
          { href: '/tieng-viet', label: 'Tất cả Tiếng Việt', emoji: '🧰' },
          reg('/hoc-doc-tieng-viet'),
          reg('/tap-doc-tieng-viet'),
          reg('/luyen-viet-chu'),
          reg('/chinh-ta-tieng-viet'),
          reg('/luyen-tu-va-cau'),
          reg('/tap-lam-van'),
          reg('/truyen-co-tich'),
        ],
      },
      {
        title: 'Tiếng Anh',
        href: '/tu-vung-tieng-anh',
        emoji: '🌍',
        links: [
          reg('/tu-vung-tieng-anh'),
          reg('/bang-chu-cai-tieng-anh'),
          reg('/phonics-tieng-anh'),
          reg('/bang-phien-am-ipa'),
          reg('/sight-words-tieng-anh'),
          reg('/mau-cau-tieng-anh'),
          reg('/hoi-thoai-tieng-anh'),
          reg('/bai-hat-tieng-anh'),
          reg('/ngu-phap-tieng-anh'),
        ],
      },
    ],
  },
  {
    id: 'thi',
    href: '/de-thi',
    label: 'Thi & ôn tập',
    emoji: '📝',
    align: 'start',
    groups: [
      {
        title: 'Đề thi có chấm điểm',
        href: '/de-thi',
        links: [{ href: '/de-thi', label: 'Đề thi lớp 1–5', emoji: '📝' }, ...SCHOOL_GRADES.map((g) => reg(`/thi-lop-${g}`))],
      },
      { title: 'Ôn tập', links: [reg('/bai-tap'), reg('/ky-nang'), reg('/on-tap-cau-sai')] },
    ],
  },
  {
    id: 'choi',
    href: '/tro-choi',
    label: 'Chơi & thi đấu',
    emoji: '🏆',
    align: 'end',
    groups: [
      {
        title: 'Trò chơi học tập',
        href: '/tro-choi',
        links: [
          { href: '/tro-choi', label: 'Kho trò chơi', emoji: '🎮' },
          { href: '/tro-choi/toan', label: 'Trò chơi Toán', emoji: '🔢' },
          { href: '/tro-choi/tieng-viet', label: 'Trò chơi chữ', emoji: '🔤' },
          reg('/hoc-tieng-anh'),
          reg('/luyen-nghe'),
        ],
      },
      {
        title: 'Sân chơi Trí tuệ',
        href: '/san-choi-tri-tue',
        links: [reg('/san-choi-tri-tue'), reg('/thu-thach-iq'), reg('/thi-tai'), reg('/trieu-phu-nhi'), reg('/kham-pha'), reg('/san-choi-tri-tue/phong')],
      },
    ],
  },
  { id: 'in', href: '/tai-lieu-in', label: 'Tài liệu in', emoji: '🖨️' },
];

// Menu tài khoản: việc của bé + góc phụ huynh (trước đây chiếm chỗ trên thanh menu).
export const ACCOUNT_LINKS = [
  { href: '/hoc-hom-nay', label: 'Học hôm nay', emoji: '📅' },
  { href: '/bo-suu-tap', label: 'Bộ sưu tập', emoji: '⭐' },
  { href: '/on-tap-cau-sai', label: 'Ôn câu sai', emoji: '🔁' },
  { href: '/ho-so-be', label: 'Hồ sơ bé', emoji: '👶' },
  { href: '/chung-nhan', label: 'Chứng nhận', emoji: '🏆' },
];

/** Góc phụ huynh — menu tài khoản, trang Menu điện thoại và chân trang. */
export const PARENT_LINKS = [
  { href: '/bao-cao', label: 'Báo cáo tuần', emoji: '📊' },
  { href: '/dashboard', label: 'Bảng theo dõi', emoji: '📋' },
  { href: '/tien-do', label: 'Tiến độ học tập', emoji: '📈' },
  { href: '/bai-viet', label: 'Bài viết cho ba mẹ', emoji: '📰' },
  { href: '/huong-dan', label: 'Hướng dẫn bắt đầu', emoji: '🚀' },
  { href: '/cau-hoi-thuong-gap', label: 'Câu hỏi thường gặp', emoji: '❓' },
  { href: '/gioi-thieu', label: 'Giới thiệu Bé Hay Học', emoji: '🌈' },
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
