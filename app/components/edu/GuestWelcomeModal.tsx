'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, X, User, Baby, BarChart3, Trophy, ShieldCheck } from 'lucide-react';
import { apiFetch, type AuthResponse } from '../../lib/api';
import KidIcon from './KidIcon';

const SEEN_KEY = 'bhh_welcome_seen';
// Không tự bật ở các trang thao tác đăng nhập / tạo hồ sơ.
const SKIP_PREFIXES = ['/login', '/dang-nhap', '/dang-ky', '/register', '/ho-so-be', '/admin'];

export default function GuestWelcomeModal() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (SKIP_PREFIXES.some((p) => pathname?.startsWith(p))) return;
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const hasToken = !!localStorage.getItem('bhh_token');
    let hasChild = false;
    try {
      const arr = JSON.parse(localStorage.getItem('bhh_local_children') || '[]');
      hasChild = Array.isArray(arr) && arr.length > 0;
    } catch { hasChild = false; }
    // Khách (chưa đăng nhập) và chưa tạo bé → tự hiện để người dùng biết.
    if (!hasToken && !hasChild) {
      const t = setTimeout(() => setOpen(true), 700);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  function close() {
    setOpen(false);
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ }
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email: email.trim(), password }) });
      localStorage.setItem('bhh_token', data.accessToken);
      localStorage.setItem('bhh_user', JSON.stringify(data.user));
      sessionStorage.setItem(SEEN_KEY, '1');
      window.location.reload();
    } catch {
      setError('Email hoặc mật khẩu chưa đúng. Bạn thử lại nhé!');
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div data-nosnippet className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-3 sm:p-4" onClick={close}>
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
        style={{ maxHeight: '94vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-h-[94vh] overflow-y-auto p-5 sm:p-7">
          <button onClick={close} aria-label="Đóng" className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X size={18} />
          </button>

          {/* Tiêu đề + mascot */}
          <div className="relative text-center">
            <KidIcon name="rabbit" className="pointer-events-none absolute left-0 top-0 hidden h-20 w-20 sm:block" />
            <KidIcon name="tigerHero" className="pointer-events-none absolute right-0 top-0 hidden h-20 w-20 sm:block" />
            <h2 className="px-8 text-xl font-black leading-tight text-[#1e3a8a] sm:text-2xl">
              Bé ơi, cùng BeHayHoc.com<br /><span className="text-[#e11d48]">bắt đầu hành trình học tập nhé!</span>
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              Đăng nhập hoặc tạo hồ sơ cho bé để lưu kết quả, theo dõi tiến độ và nhận phần thưởng hấp dẫn!
            </p>
          </div>

          {/* 2 cột */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {/* Đăng nhập */}
            <form onSubmit={login} className="rounded-[22px] bg-sky-50/70 p-5 ring-1 ring-sky-100">
              <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-sky-500 text-white shadow"><User size={22} /></div>
              <h3 className="text-center text-lg font-black text-[#1e3a8a]">Đăng nhập tài khoản</h3>
              <p className="mb-4 text-center text-xs text-slate-400">Đã có tài khoản? Đăng nhập ngay</p>

              <label className="mb-2 flex items-center gap-2 rounded-xl bg-white px-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-400">
                <Mail size={16} className="text-slate-400" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email hoặc số điện thoại" className="w-full min-w-0 bg-transparent py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none" />
              </label>
              <label className="flex items-center gap-2 rounded-xl bg-white px-3 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-400">
                <Lock size={16} className="text-slate-400" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPw ? 'text' : 'password'} placeholder="Mật khẩu" className="w-full min-w-0 bg-transparent py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none" />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="text-slate-400 hover:text-slate-600">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </label>

              <div className="mt-1.5 text-right">
                <Link href="/quen-mat-khau" onClick={close} className="text-xs font-semibold text-sky-600 hover:underline">Quên mật khẩu?</Link>
              </div>
              {error && <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">{error}</p>}

              <button type="submit" disabled={loading} className="mt-3 w-full rounded-full bg-[#2563eb] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1d4ed8] disabled:opacity-60">
                {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
              </button>
            </form>

            {/* Tạo hồ sơ cho bé */}
            <div className="rounded-[22px] bg-rose-50/70 p-5 ring-1 ring-rose-100">
              <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-[#e11d48] text-white shadow"><Baby size={22} /></div>
              <h3 className="text-center text-lg font-black text-[#e11d48]">Tạo hồ sơ cho bé</h3>
              <p className="mb-4 text-center text-xs text-slate-400">Chưa có tài khoản? Tạo hồ sơ cho bé ngay</p>

              <ul className="space-y-3">
                <Benefit icon={<User size={16} />} title="Cá nhân hóa lộ trình học tập" desc="Phù hợp với độ tuổi và năng lực của bé" />
                <Benefit icon={<BarChart3 size={16} />} title="Theo dõi tiến độ học tập" desc="Dễ dàng theo dõi và đồng hành cùng bé" />
                <Benefit icon={<Trophy size={16} />} title="Nhận phần thưởng hấp dẫn" desc="Huy hiệu, điểm thưởng và nhiều quà tặng" />
              </ul>

              <Link href="/ho-so-be" onClick={close} className="mt-4 block rounded-full bg-[#e11d48] py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#be123c]">
                Tạo hồ sơ cho bé
              </Link>
              <p className="mt-2 text-center text-[11px] text-rose-400">Miễn phí · Không cần đăng nhập</p>
            </div>
          </div>

          {/* An toàn */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-amber-50 p-3.5 ring-1 ring-amber-100">
            <ShieldCheck size={22} className="shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-black text-amber-800">An toàn &amp; bảo mật</p>
              <p className="text-xs text-amber-700">Thông tin của bé được bảo mật tuyệt đối. Ba mẹ hoàn toàn yên tâm!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Benefit({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-100 text-[#e11d48]">{icon}</span>
      <div>
        <p className="text-sm font-black text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </li>
  );
}
