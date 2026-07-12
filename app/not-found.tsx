import Link from 'next/link';

export const metadata = {
    title: '404 - Không tìm thấy trang',
    description: 'Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.',
};

export default function NotFoundPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-violet-50" />

      <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-pink-200/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center rounded-full bg-sky-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-sky-700 ring-1 ring-sky-100">
              Lỗi điều hướng
            </span>

            <h1 className="mt-5 bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 bg-clip-text text-7xl font-black leading-none tracking-tight text-transparent sm:text-8xl lg:text-[8rem]">
              404
            </h1>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Oops, trang này không còn ở đây nữa
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base lg:mx-0 lg:max-w-lg">
              Có thể đường dẫn đã bị thay đổi, trang đã được di chuyển hoặc bé vừa đi lạc
              khỏi khu vực học tập. Mình đưa bạn quay về đúng nơi nhé.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl"
              >
                🏠 Về trang chủ
              </Link>

              <Link
                href="/khoa-hoc"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
              >
                Xem khóa học
              </Link>

              <Link
                href="/tro-choi"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
              >
                Kho trò chơi
              </Link>
            </div>

            <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3 lg:mx-0">
              {[
                { label: 'Khóa học', value: '24+' },
                { label: 'Trò chơi', value: '20+' },
                { label: 'Độ tuổi', value: '3-7' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white/80 px-3 py-3 text-center shadow-sm ring-1 ring-slate-100 backdrop-blur"
                >
                  <p className="text-xs font-semibold text-slate-500">{item.label}</p>
                  <p className="mt-1 text-xl font-black text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 scale-105 rounded-[32px] bg-gradient-to-br from-sky-200/40 to-violet-200/40 blur-2xl" />

              <div className="relative rounded-[28px] bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:p-7">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 text-5xl shadow-lg shadow-pink-200 animate-pulse">
                    🧭
                  </div>

                  <div className="mt-5 text-4xl">🧒📚✨</div>

                  <h3 className="mt-4 text-xl font-black tracking-tight text-slate-900">
                    Bé đang đi lạc mất rồi
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Không sao cả, đã có sẵn lối về để phụ huynh chọn nhanh.
                  </p>

                  <div className="mt-5 grid w-full grid-cols-3 gap-2">
                    <Link href="/" className="group rounded-xl bg-slate-50 px-2 py-3 text-center ring-1 ring-slate-100 transition hover:bg-sky-50 hover:ring-sky-200">
                      <div className="text-2xl transition-transform group-hover:scale-110">🏠</div>
                      <p className="mt-1.5 text-xs font-bold text-slate-700">Trang chủ</p>
                    </Link>
                    <Link href="/khoa-hoc" className="group rounded-xl bg-slate-50 px-2 py-3 text-center ring-1 ring-slate-100 transition hover:bg-violet-50 hover:ring-violet-200">
                      <div className="text-2xl transition-transform group-hover:scale-110">📘</div>
                      <p className="mt-1.5 text-xs font-bold text-slate-700">Khóa học</p>
                    </Link>
                    <Link href="/tro-choi" className="group rounded-xl bg-slate-50 px-2 py-3 text-center ring-1 ring-slate-100 transition hover:bg-pink-50 hover:ring-pink-200">
                      <div className="text-2xl transition-transform group-hover:scale-110">🎮</div>
                      <p className="mt-1.5 text-xs font-bold text-slate-700">Trò chơi</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
