'use client';

import Link from 'next/link';
import { useState } from 'react';
import { apiFetch } from '../lib/api';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100';

const TOKEN_RE = /^[A-Za-z0-9_-]{30,100}$/;

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const validLink = TOKEN_RE.test(token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Mật khẩu tối thiểu 6 ký tự.');
    if (password !== confirm) return setError('Hai mật khẩu chưa giống nhau.');
    setLoading(true);
    try {
      const data = await apiFetch<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
      // Mật khẩu đã đổi → bỏ phiên đăng nhập cũ trên máy này.
      localStorage.removeItem('bhh_token');
      localStorage.removeItem('bhh_user');
      setDone(data.message);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Chưa đặt được mật khẩu, bố mẹ thử lại nhé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-100 sm:p-10">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Đặt mật khẩu mới</h1>
        {done ? (
          <>
            <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-700 ring-1 ring-emerald-100">✅ {done}</div>
            <Link
              href="/dang-nhap"
              className="mt-6 block rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-center text-sm font-bold text-white"
            >
              Đăng nhập
            </Link>
          </>
        ) : !validLink ? (
          <>
            <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-800 ring-1 ring-amber-100">
              Link đặt lại mật khẩu không đúng hoặc bị thiếu. Bố mẹ mở lại link trong email, hoặc yêu cầu gửi link mới.
            </div>
            <Link href="/quen-mat-khau" className="mt-6 block text-center text-sm font-semibold text-sky-600 hover:underline">
              Gửi link mới
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm leading-7 text-slate-600">Nhập mật khẩu mới cho tài khoản Bé Hay Học.</p>
            {error && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">
                {error}
                {/hết hạn|không đúng/.test(error) && (
                  <Link href="/quen-mat-khau" className="ml-1 font-semibold underline">
                    Gửi link mới
                  </Link>
                )}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="new-password" className="mb-2 block text-sm font-semibold text-slate-700">
                  Mật khẩu mới
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={72}
                  autoComplete="new-password"
                  placeholder="Tối thiểu 6 ký tự"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-slate-700">
                  Nhập lại mật khẩu mới
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 disabled:opacity-60"
              >
                {loading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
