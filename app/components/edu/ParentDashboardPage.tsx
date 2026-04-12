import Link from 'next/link';

const summaryCards = [
  {
    title: 'Bài học hoàn thành',
    value: '28',
    sub: 'Trong 7 ngày gần nhất',
  },
  {
    title: 'Thời gian học',
    value: '3h 20p',
    sub: 'Trung bình mỗi tuần',
  },
  {
    title: 'Mức độ tập trung',
    value: 'Tốt',
    sub: 'Tăng 12% so với tuần trước',
  },
  {
    title: 'Gợi ý hôm nay',
    value: '2 bài',
    sub: '1 ngôn ngữ, 1 phản xạ',
  },
] as const;

const skillProgress = [
  { label: 'Nhận biết mặt chữ', value: 86 },
  { label: 'Tư duy logic', value: 79 },
  { label: 'Ghi nhớ hình ảnh', value: 91 },
  { label: 'Từ vựng tiếng Anh', value: 65 },
] as const;

const todayTasks = [
  'Cho bé chơi 1 trò ghép chữ trong 5 phút.',
  'Thêm 1 bài phản xạ ngắn trước giờ ngủ.',
  'Ôn lại 5 từ vựng tiếng Anh đã học hôm qua.',
] as const;

export default function ParentDashboardPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="overflow-hidden rounded-[36px] bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-xl lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
          Dashboard phụ huynh
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
          Nhìn nhanh toàn bộ hành trình học tập của bé
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
          Từ kết quả học tập, thời lượng sử dụng, kỹ năng nổi bật đến gợi ý nội dung nên học tiếp,
          mọi thứ đều được gom lại để phụ huynh dễ theo dõi, đánh giá và đồng hành cùng bé mỗi ngày.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-slate-500">{card.title}</p>
            <div className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              {card.value}
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-600">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Kỹ năng đang phát triển tốt
              </h2>
              <p className="mt-1 text-sm leading-7 text-slate-500">
                Các chỉ số dưới đây phản ánh mức độ tiến bộ gần đây của bé theo từng nhóm kỹ năng.
              </p>
            </div>

            <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
              Cập nhật tuần này
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {skillProgress.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm font-semibold text-slate-700">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-500"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Việc nên làm hôm nay
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              Gợi ý ngắn gọn để phụ huynh duy trì nhịp học đều và nhẹ nhàng cho bé.
            </p>

            <div className="mt-5 space-y-4">
              {todayTasks.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] bg-sky-50 p-6 shadow-sm ring-1 ring-sky-100 lg:p-7">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Hành động nhanh
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Đi thẳng tới phần phụ huynh cần dùng nhiều nhất chỉ với một chạm.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/games"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl hover:shadow-sky-200"
              >
                Mở kho trò chơi
              </Link>

              <Link
                href="/progress"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md"
              >
                Xem báo cáo chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}