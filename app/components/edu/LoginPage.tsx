import Link from 'next/link';

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="grid overflow-hidden rounded-[36px] bg-white shadow-sm ring-1 ring-slate-100 lg:grid-cols-2">
        <div className="bg-gradient-to-br from-sky-500 via-violet-500 to-pink-500 p-8 text-white lg:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            Đăng nhập tài khoản
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Tiếp tục hành trình học tập của bé một cách liền mạch
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-white/90">
            Đăng nhập để xem bài học gần đây, mở lại tiến độ đang học, theo dõi báo
            cáo và quản lý tài khoản phụ huynh hoặc nhiều hồ sơ trẻ em trong cùng
            một gia đình.
          </p>

          <div className="mt-8 space-y-4">
            {[
              'Lưu tiến độ tự động',
              'Theo dõi nhiều bé trong một tài khoản',
              'Nhận gợi ý bài học mỗi ngày',
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
              Chào mừng quay lại
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Đăng nhập để tiếp tục học và theo dõi tiến độ của bé.
            </p>

            <div className="mt-8 space-y-5">
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

              <button className="w-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl hover:shadow-sky-200">
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}