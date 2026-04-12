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

      <div className="relative mx-auto flex min-h-[80vh] max-w-7xl items-center px-6 py-12 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex items-center rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100">
              Lỗi điều hướng
            </span>

            <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              404
            </h1>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Oops, trang này không còn ở đây nữa
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Có thể đường dẫn đã bị thay đổi, trang đã được di chuyển hoặc bé vừa đi lạc
              khỏi khu vực học tập. Mình đưa bạn quay về đúng nơi nhé.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl"
              >
                Về trang chủ
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md"
              >
                Xem khóa học
              </Link>

              <Link
                href="/games"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md"
              >
                Mở kho trò chơi
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                { label: 'Khóa học', value: '24+' },
                { label: 'Trò chơi', value: '20+' },
                { label: 'Độ tuổi', value: '3-7' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] bg-white/80 px-5 py-4 shadow-sm ring-1 ring-slate-100 backdrop-blur"
                >
                  <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-sky-200/40 to-violet-200/40 blur-3xl" />

              <div className="relative rounded-[36px] bg-white p-8 shadow-xl ring-1 ring-slate-100">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 text-6xl shadow-lg">
                    🧭
                  </div>

                  <div className="mt-6 text-5xl">🧒📚✨</div>

                  <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
                    Bé đang đi lạc mất rồi
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">
                    Không sao cả, mình đã chuẩn bị sẵn lối về tới trang chủ, thư viện khóa học
                    và kho trò chơi để phụ huynh chọn nhanh.
                  </p>

                  <div className="mt-6 w-full rounded-[24px] bg-slate-50 p-4 ring-1 ring-slate-100">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-2xl bg-white px-3 py-4 ring-1 ring-slate-100">
                        <div className="text-2xl">🏠</div>
                        <p className="mt-2 text-xs font-bold text-slate-700">Trang chủ</p>
                      </div>

                      <div className="rounded-2xl bg-white px-3 py-4 ring-1 ring-slate-100">
                        <div className="text-2xl">📘</div>
                        <p className="mt-2 text-xs font-bold text-slate-700">Khóa học</p>
                      </div>

                      <div className="rounded-2xl bg-white px-3 py-4 ring-1 ring-slate-100">
                        <div className="text-2xl">🎮</div>
                        <p className="mt-2 text-xs font-bold text-slate-700">Trò chơi</p>
                      </div>
                    </div>
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