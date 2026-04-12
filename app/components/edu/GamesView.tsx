import Link from 'next/link';
import { gamesData } from './data/gamesData';

export default function GamesPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-6 rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Kho trò chơi
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Chọn trò phù hợp với độ tuổi và mục tiêu học tập của bé
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Mỗi trò chơi đều được thiết kế ngắn gọn, dễ hiểu, có hình ảnh rõ ràng
            và phản hồi trực tiếp để bé học vui hơn mỗi ngày.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 ring-1 ring-sky-100">
            {gamesData.length} trò chơi
          </div>
          <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 ring-1 ring-violet-100">
            Nhiều độ tuổi
          </div>
          <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700 ring-1 ring-pink-100">
            Có báo cáo tiến độ
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {gamesData.map((game) => (
          <div
            key={game.id}
            className="group flex h-full flex-col rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 p-[2px] shadow-[0_12px_30px_rgba(168,85,247,0.28)] transition duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]">
                <div className="absolute inset-1 rounded-[24px] bg-white/20 blur-md" />
                <div className="relative flex h-full w-full items-center justify-center rounded-[26px] bg-gradient-to-br from-sky-400 via-cyan-300 to-violet-400 text-4xl shadow-inner">
                  <span className="drop-shadow-[0_4px_8px_rgba(255,255,255,0.55)]">
                    {game.emoji}
                  </span>
                </div>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {game.badge}
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
              {game.title}
            </h3>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-sky-50 px-3 py-1.5 font-semibold text-sky-700">
                {game.age}
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-700">
                {game.time}
              </span>
              <span className="rounded-full bg-violet-50 px-3 py-1.5 font-semibold text-violet-700">
                {game.category}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {game.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {game.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <Link
                href={`/games/${game.page}`}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl hover:shadow-sky-200"
              >
                {game.status === 'ready' ? 'Bắt đầu chơi' : 'Xem chi tiết'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}