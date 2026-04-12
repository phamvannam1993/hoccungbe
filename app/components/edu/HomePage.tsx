import type { Metadata } from 'next';
import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Nền tảng học tập cho bé
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Học vui mỗi ngày, phụ huynh theo dõi dễ dàng
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Trò chơi giáo dục ngắn, trực quan và phù hợp theo độ tuổi, giúp bé học
            hứng thú hơn trong khi phụ huynh vẫn nắm được tiến độ rõ ràng.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/games"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl hover:shadow-sky-300"
            >
              Khám phá trò chơi
            </Link>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md"
            >
              Xem bảng giá
            </Link>
          </div>
        </div>

        <div className="rounded-[36px] bg-gradient-to-br from-sky-100 via-violet-50 to-pink-100 p-6 shadow-sm">
          <div className="rounded-[28px] bg-white p-6 shadow-inner">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-sky-50 p-5">
                <div className="text-4xl">🎮</div>
                <h3 className="mt-4 text-lg font-black text-slate-900">Trò chơi ngắn</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Bé dễ bắt đầu, dễ tập trung và không bị quá tải.
                </p>
              </div>

              <div className="rounded-3xl bg-violet-50 p-5">
                <div className="text-4xl">📈</div>
                <h3 className="mt-4 text-lg font-black text-slate-900">Báo cáo tiến độ</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Phụ huynh biết bé đang mạnh ở đâu và cần hỗ trợ gì.
                </p>
              </div>

              <div className="rounded-3xl bg-pink-50 p-5">
                <div className="text-4xl">🧠</div>
                <h3 className="mt-4 text-lg font-black text-slate-900">Kỹ năng nền tảng</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Ngôn ngữ, toán vui, logic và phản xạ được rèn đều.
                </p>
              </div>

              <div className="rounded-3xl bg-emerald-50 p-5">
                <div className="text-4xl">👨‍👩‍👧</div>
                <h3 className="mt-4 text-lg font-black text-slate-900">Thân thiện gia đình</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Một tài khoản có thể theo dõi nhiều hồ sơ trẻ em.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}