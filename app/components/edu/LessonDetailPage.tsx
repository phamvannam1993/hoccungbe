import Link from 'next/link';

export default function LessonDetailPage() {
  const steps = [
    'Bé quan sát hình ảnh và nghe âm thanh gợi ý.',
    'Bé chọn đáp án đúng trong 3 lựa chọn trực quan.',
    'Hệ thống phản hồi ngay bằng hiệu ứng vui nhộn.',
    'Phụ huynh nhận được báo cáo ngắn sau khi hoàn thành.',
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100">
              4-6 tuổi
            </span>
            <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 ring-1 ring-violet-100">
              Ngôn ngữ
            </span>
            <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-100">
              5 phút
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Ghép chữ với hình
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Một bài học ngắn giúp trẻ nhận biết mặt chữ, kết nối chữ với hình ảnh
            quen thuộc và tăng khả năng ghi nhớ thông qua lựa chọn trực quan, âm
            thanh và phản hồi tích cực sau mỗi lượt chơi.
          </p>

          <div className="mt-8 rounded-[30px] bg-gradient-to-br from-sky-100 via-violet-50 to-pink-100 p-5">
            <div className="rounded-[24px] bg-white p-5 shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Demo màn chơi
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">
                    Hãy chọn đúng từ mô tả hình ảnh
                  </h3>
                </div>
                <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-700">
                  Câu 1/8
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center rounded-3xl bg-sky-50 p-6 text-center ring-1 ring-sky-100">
                <div className="text-7xl">🍎</div>
                <p className="mt-4 text-lg font-bold text-slate-700">
                  Bé hãy chọn từ đúng
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {['Táo', 'Mèo', 'Bàn'].map((option, index) => (
                  <button
                    key={option}
                    className={`rounded-2xl px-4 py-4 text-base font-bold shadow-sm ring-1 transition ${
                      index === 0
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Cách hoạt động
            </h3>
            <div className="mt-5 space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Kỹ năng đạt được
            </h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                'Nhận biết mặt chữ',
                'Ghi nhớ hình ảnh',
                'Tăng tập trung',
                'Phản xạ chọn đáp án',
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 ring-1 ring-sky-100"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              href="/pricing"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl"
            >
              Mở khóa toàn bộ bài học
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}