'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  HelpCircle,
  Gamepad2,
  Baby,
  TrendingUp,
  Star,
  CreditCard,
  LogOut,
  Menu,
  X,
  Layers,
  Tag,
  Newspaper,
  MessageSquare,
  ClipboardList,
  File,
  Music,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Người dùng', icon: Users },
  { href: '/admin/courses', label: 'Khóa học', icon: BookOpen },
  { href: '/admin/volumes', label: 'Tập (Volume)', icon: Layers },
  { href: '/admin/topics', label: 'Chủ đề', icon: Tag },
  { href: '/admin/lessons', label: 'Bài học', icon: FileText },
  { href: '/admin/documents', label: '📄 Kho Tài Liệu', icon: File },
  { href: '/admin/audio-library', label: '🎵 Kho Âm Thanh', icon: Music },
  { href: '/admin/categories', label: '🏷️ Danh Mục', icon: Tag },
  { href: '/admin/quizzes', label: 'Câu hỏi', icon: HelpCircle },
  { href: '/admin/games', label: 'Trò chơi (Quiz)', icon: Gamepad2 },
  { href: '/admin/mini-games', label: 'Mini Game', icon: Gamepad2 },
  { href: '/admin/games/puzzles', label: '🧩 Puzzle Game', icon: Gamepad2 },
  { href: '/admin/games/leaderboard', label: '🏆 Bảng Xếp Hạng', icon: TrendingUp },
  { href: '/admin/games/progress', label: '📊 Tiến Độ Game', icon: TrendingUp },
  { href: '/admin/children', label: 'Trẻ em', icon: Baby },
  { href: '/admin/progress', label: 'Tiến độ', icon: TrendingUp },
  { href: '/admin/rewards', label: 'Phần thưởng', icon: Star },
  { href: '/admin/subscriptions', label: 'Đăng ký', icon: CreditCard },
  { href: '/admin/articles', label: 'Bài viết', icon: Newspaper },
  { href: '/admin/exams', label: 'Đề thi', icon: ClipboardList },
  { href: '/admin/feedback', label: 'Góp ý', icon: MessageSquare },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isLoginPage = pathname === '/admin/login';
    if (isLoginPage) {
      setChecked(true);
      return;
    }
    const token = localStorage.getItem('bhh_admin_token');
    if (!token) {
      router.replace('/admin/login');
    } else {
      setChecked(true);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('bhh_admin_token');
    router.replace('/admin/login');
  };

  const isLoginPage = pathname === '/admin/login';

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#1e3a5f' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <span className="text-white font-bold text-lg">Bé Hay Học</span>
          <button
            className="text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600"
          >
            <Menu size={22} />
          </button>
          <span className="font-semibold text-gray-800">Trang quản trị</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
