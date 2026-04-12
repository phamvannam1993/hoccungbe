import Link from 'next/link';

export default function RegisterPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="grid overflow-hidden rounded-[36px] bg-white shadow-sm ring-1 ring-slate-100 lg:grid-cols-2">
        <div className="bg-gradient-to-br from-emerald-500 via-sky-500 to-violet-500 p-8 text-white lg:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            Tạo tài khoản mới
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Bắt đầu hành trình học tập vui vẻ và có định hướng cho bé
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-white/90">
            Chỉ mất vài bước để tạo tài khoản phụ huynh, thiết lập hồ sơ cho bé
            và bắt đầu trải nghiệm thư viện trò chơi, bài học cùng báo cáo tiến độ.
          </p>

          <div className="mt-8 space-y-4">
            {[
              'Thiết lập hồ sơ theo độ tuổi của bé',
              'Nhận gợi ý trò chơi phù hợp mỗi ngày',
              'Theo dõi tiến độ học tập rõ ràng',
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Đăng ký tài khoản
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Tạo tài khoản để lưu tiến độ và cá nhân hóa lộ trình học cho bé.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Họ và tên phụ huynh
                </label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="ten@email.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Độ tuổi của bé
                </label>
                <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100">
                  <option>3-4 tuổi</option>
                  <option>4-6 tuổi</option>
                  <option>6-8 tuổi</option>
                </select>
              </div>

              <button className="w-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-200">
                Tạo tài khoản
              </button>

              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md"
              >
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}