import Link from 'next/link';

export default function ProgressPage() {
  const progress = [
    { subject: 'Tiếng Việt', value: 82, color: 'bg-sky-500' },
    { subject: 'Toán vui', value: 74, color: 'bg-violet-500' },
    { subject: 'Tư duy logic', value: 88, color: 'bg-pink-500' },
    { subject: 'Tiếng Anh', value: 61, color: 'bg-emerald-500' },
  ];

  const activities = [
    'Hoàn thành 8/10 nhiệm vụ trong ngày',
    'Tăng 18% mức độ tập trung so với tuần trước',
    'Chơi tốt nhất ở nhóm trò nhận biết hình ảnh',
    'Phù hợp để thêm 1 bài tiếng Anh ngắn mỗi ngày',
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="mb-8 flex flex-col gap-4 rounded-[36px] bg-slate-900 p-6 text-white shadow-xl lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">Bảng theo dõi phụ huynh</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Theo dõi tiến độ của bé theo cách rõ ràng và nhẹ nhàng</h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-slate-300">
            Phụ huynh có thể xem môn nào bé đang mạnh, môn nào cần tăng cường và gợi ý học ngắn phù hợp với khả năng hiện tại.
          </p>
        </div>
        <Link
          href="/games"
          className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          Chọn thêm trò chơi
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Báo cáo của bé An</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Tuần này tiến bộ tốt</h2>
            </div>
            <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-700">+18%</div>
          </div>

          <div className="mt-8 space-y-5">
            {progress.map((item) => (
              <div key={item.subject}>
                <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                  <span>{item.subject}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200">
                  <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">Nhận xét tuần này</h3>
            <div className="mt-5 space-y-4">
              {activities.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ring-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] bg-amber-50 p-6 shadow-sm ring-1 ring-amber-100">
            <h3 className="text-2xl font-black tracking-tight text-amber-950">Gợi ý hôm nay</h3>
            <p className="mt-4 text-sm leading-8 text-amber-900">
              Hôm nay bé đang hợp với một bài ghép chữ 5 phút và một trò phản xạ 3 phút. Tần suất ngắn nhưng đều sẽ giúp duy trì niềm vui học tập tốt hơn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}