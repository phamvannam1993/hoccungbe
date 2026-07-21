'use client';

import Link from 'next/link';
import { useState } from 'react';

const faqs = [
  { q: 'Bé mấy tuổi thì phù hợp để bắt đầu?', a: 'Bé Hay Học phù hợp với trẻ từ 3–10 tuổi. Mỗi khóa học được thiết kế riêng theo độ tuổi và trình độ.' },
  { q: 'Một tài khoản có thể tạo nhiều hồ sơ trẻ em không?', a: 'Có, một tài khoản phụ huynh có thể tạo nhiều hồ sơ cho các bé khác nhau trong gia đình.' },
  { q: 'Phụ huynh có xem được báo cáo học tập không?', a: 'Có. Trang Tiến độ hiển thị chi tiết bài đã học, điểm số và thời gian học của từng bé.' },
  { q: 'Có thể dùng thử trước khi mua gói không?', a: 'Có, nhiều bài học và trò chơi được mở miễn phí để bé trải nghiệm trước khi quyết định.' },
  { q: 'Tôi quên mật khẩu thì làm thế nào?', a: 'Nhấn "Quên mật khẩu" ở trang đăng nhập, hệ thống sẽ gửi link đặt lại qua email của bạn.' },
];

const channels = [
  { icon: '📧', label: 'Email hỗ trợ', desc: 'behayhoc@gmail.com', color: '#6366f1', bg: '#f5f3ff', href: 'mailto:behayhoc@gmail.com' },
  { icon: '💬', label: 'Zalo', desc: 'Nhắn tin cho đội hỗ trợ', color: '#0068ff', bg: '#eff6ff', href: 'https://zalo.me' },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', content: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-sky-500 to-violet-600 px-4 py-14 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
            🎧 Hỗ trợ phụ huynh
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Hỗ trợ phụ huynh<br />
            <span className="text-yellow-300">sử dụng Bé Hay Học</span>
          </h1>
          <p className="mt-4 text-lg text-white/85">
            Có câu hỏi về lộ trình học, tài khoản hay cách cho bé bắt đầu?<br />
            Gửi yêu cầu qua biểu mẫu, chúng tôi phản hồi trong vòng 24 giờ.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-10">

        {/* Contact channels */}
        <div className="grid gap-4 sm:grid-cols-2">
          {channels.map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: c.bg }}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl shadow-sm" style={{ background: '#fff' }}>
                {c.icon}
              </div>
              <div>
                <p className="font-bold" style={{ color: c.color }}>{c.label}</p>
                <p className="text-sm text-slate-600">{c.desc}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">

          {/* Form */}
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-2xl font-black text-slate-900">Gửi yêu cầu hỗ trợ</h2>
            <p className="mt-1 text-sm text-slate-500">Điền thông tin, chúng tôi sẽ liên hệ lại trong vòng 24 giờ.</p>

            {sent ? (
              <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-emerald-50 py-12 text-center ring-1 ring-emerald-100">
                <span className="text-5xl">✅</span>
                <p className="text-lg font-bold text-emerald-800">Đã gửi yêu cầu thành công!</p>
                <p className="text-sm text-emerald-700">Chúng tôi sẽ liên hệ lại với bạn sớm nhất.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', phone: '', content: '' }); }}
                  className="mt-2 rounded-full bg-emerald-500 px-6 py-2 text-sm font-bold text-white hover:bg-emerald-600 transition">
                  Gửi yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Họ và tên <span className="text-red-400">*</span></label>
                    <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                      placeholder="Nguyễn Thị B" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Số điện thoại <span className="text-red-400">*</span></label>
                    <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                      placeholder="09xxxxxxxx" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Chủ đề hỗ trợ</label>
                  <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100">
                    <option>Tư vấn chọn lộ trình học</option>
                    <option>Vấn đề tài khoản / đăng nhập</option>
                    <option>Gói học & thanh toán</option>
                    <option>Báo lỗi kỹ thuật</option>
                    <option>Khác</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nội dung cần hỗ trợ <span className="text-red-400">*</span></label>
                  <textarea required rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 resize-none"
                    placeholder="Mình muốn được tư vấn chọn gói học phù hợp cho bé 5 tuổi..." />
                </div>

                <button type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-violet-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-100 transition hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl">
                  Gửi yêu cầu hỗ trợ →
                </button>
              </form>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* FAQ accordion */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-xl font-black text-slate-900">Câu hỏi thường gặp</h2>
              <div className="mt-4 space-y-2">
                {faqs.map((item, i) => (
                  <div key={i} className="rounded-2xl ring-1 ring-slate-100 overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 transition">
                      <span>{item.q}</span>
                      <span className="shrink-0 text-sky-500 text-lg">{openFaq === i ? '−' : '+'}</span>
                    </button>
                    {openFaq === i && (
                      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Link href="/cau-hoi-thuong-gap"
                className="mt-4 flex items-center gap-1 text-sm font-semibold text-sky-600 hover:underline">
                Xem tất cả câu hỏi →
              </Link>
            </div>

            {/* Quick tip */}
            <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-sky-50 p-6 ring-1 ring-violet-100">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-black text-slate-900">Mới bắt đầu?</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Hãy dùng thử miễn phí trước để xem bé có hứng thú không, sau đó mới chọn gói phù hợp để đi đường dài.
              </p>
              <Link href="/khoa-hoc"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-violet-600 transition">
                Khám phá khóa học miễn phí
              </Link>
            </div>

            {/* Hours */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h3 className="font-bold text-slate-900">🕐 Giờ hỗ trợ</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Thứ 2 – Thứ 6</span>
                  <span className="font-semibold text-slate-800">8:00 – 21:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ 7 – Chủ nhật</span>
                  <span className="font-semibold text-slate-800">9:00 – 18:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
