'use client';

import Link from 'next/link';
import { useState } from 'react';
import { apiFetch } from '../lib/api';

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      });
      setSent(data.message);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Chưa gửi được yêu cầu, bố mẹ thử lại nhé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-100 sm:p-10">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Quên mật khẩu</h1>
        {sent ? (
          <>
            <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-700 ring-1 ring-emerald-100">
              📧 {sent}
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Link dùng được trong 30 phút. Không thấy email?{' '}
              <button type="button" onClick={() => setSent('')} className="font-semibold text-sky-600 hover:underline">
                Gửi lại
              </button>
            </p>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Nhập email đã đăng ký, Bé Hay Học sẽ gửi link để bố mẹ đặt mật khẩu mới.
            </p>
            {error && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">
                {error}
                {/chưa đăng ký/.test(error) && (
                  <Link href="/dang-ky" className="ml-1 font-semibold underline">
                    Đăng ký ngay
                  </Link>
                )}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="forgot-email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="ten@email.com"
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 disabled:opacity-60"
              >
                {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
              </button>
            </form>
          </>
        )}
        <Link href="/dang-nhap" className="mt-6 block text-center text-sm font-semibold text-slate-600 hover:text-sky-600">
          ← Quay lại đăng nhập
        </Link>
      </div>
    </section>
  );
}
