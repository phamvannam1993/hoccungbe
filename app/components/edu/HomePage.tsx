import Link from 'next/link';

const learningCategories = [
  {
    icon: '🔤',
    title: 'Làm quen mặt chữ',
    desc: 'Bé nhận diện chữ, âm và từ đơn giản qua hình ảnh trực quan.',
    href: '/courses/lam-quen-mat-chu',
    bg: 'bg-sky-50',
  },
  {
    icon: '🔢',
    title: 'Toán vui mỗi ngày',
    desc: 'Học đếm số, so sánh, cộng trừ cơ bản bằng trò chơi ngắn.',
    href: '/courses/toan-vui-moi-ngay',
    bg: 'bg-violet-50',
  },
  {
    icon: '🧠',
    title: 'Phản xạ và ghi nhớ',
    desc: 'Rèn khả năng quan sát, ghi nhớ và suy luận theo độ tuổi.',
    href: '/courses/phan-xa-va-ghi-nho',
    bg: 'bg-pink-50',
  },
  {
    icon: '🇬🇧',
    title: 'Tiếng Anh đầu đời',
    desc: 'Bé học từ vựng tiếng Anh cơ bản qua hình ảnh, âm thanh, flashcard và trò chơi tương tác ngắn.',
    href: '/courses/tieng-anh-dau-doi',
    bg: 'bg-emerald-50',
  },
];

const featuredGames = [
  {
    title: 'Ghép chữ với hình',
    desc: 'Trò chơi giúp bé quan sát hình ảnh, liên kết từ ngữ với sự vật quen thuộc, từ đó tăng vốn từ vựng, ghi nhớ mặt chữ và phản xạ ngôn ngữ một cách tự nhiên.',
    age: '4-6 tuổi',
    href: '/games/match-word',
  },
  {
    title: 'Toán vui cộng trừ',
    desc: 'Bé thực hành các phép tính cộng trừ cơ bản với cách trình bày ngắn gọn, dễ hiểu, giúp tăng khả năng tư duy số học và làm quen với toán học sớm.',
    age: '5-7 tuổi',
    href: '/games/math-fun',
  },
  {
    title: 'Từ vựng tiếng Anh',
    desc: 'Bé học các từ vựng tiếng Anh quen thuộc như con vật, đồ vật, màu sắc và thực phẩm thông qua hình ảnh trực quan, dễ tiếp cận và dễ nhớ.',
    age: '6-8 tuổi',
    href: '/games/english-vocab',
  },
  {
    title: 'Mê cung vui nhộn',
    desc: 'Bé quan sát đường đi trong mê cung đơn giản và chọn hướng đúng để đưa nhân vật tới đích, qua đó phát triển định hướng không gian, kiên nhẫn và khả năng giải quyết vấn đề.',
    age: '5-7 tuổi',
    href: '/games/mini-maze',
  },
];

const steps = [
  {
    step: '01',
    title: 'Chọn độ tuổi phù hợp',
    desc: 'Phụ huynh chọn nhóm tuổi hoặc năng lực hiện tại để bé bắt đầu đúng mức.',
  },
  {
    step: '02',
    title: 'Bé học qua trò chơi ngắn',
    desc: 'Mỗi hoạt động chỉ vài phút, trực quan và dễ bắt đầu nên bé không bị áp lực.',
  },
  {
    step: '03',
    title: 'Theo dõi kết quả rõ ràng',
    desc: 'Hệ thống ghi nhận tiến độ để phụ huynh biết bé đang tiến bộ ở đâu.',
  },
];

const parentResources = [
  {
    title: '5 cách giúp bé tập trung hơn khi học tại nhà',
    desc: 'Những thay đổi nhỏ nhưng rất hiệu quả để bé vào nhịp học tốt hơn mỗi ngày.',
    href: '/blog/giup-be-tap-trung-khi-hoc',
  },
  {
    title: 'Nên cho trẻ 3–6 tuổi học bao lâu mỗi lần',
    desc: 'Thời lượng học phù hợp giúp bé hứng thú và không bị quá tải.',
    href: '/blog/thoi-luong-hoc-phu-hop-cho-tre',
  },
  {
    title: 'Gợi ý góc học tập đơn giản cho bé',
    desc: 'Một không gian học đúng sẽ giúp bé tập trung và chủ động hơn.',
    href: '/blog/goc-hoc-tap-cho-be',
  },
];

export default function HomePage() {
  return (
    <main className="bg-white text-slate-900">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Nền tảng học tập cho bé 3 đến 10 tuổi
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Học vui mỗi ngày, phụ huynh theo dõi dễ dàng
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
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

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                <p className="text-2xl font-black text-slate-900">100+</p>
                <p className="mt-1 text-sm text-slate-600">Hoạt động học tập ngắn</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                <p className="text-2xl font-black text-slate-900">3–10</p>
                <p className="mt-1 text-sm text-slate-600">Độ tuổi phù hợp</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                <p className="text-2xl font-black text-slate-900">1 tài khoản</p>
                <p className="mt-1 text-sm text-slate-600">Theo dõi nhiều bé</p>
              </div>
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

      {/* Benefits */}
      <section className="border-t border-slate-100 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Vì sao phụ huynh chọn Học Cùng Bé
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Thiết kế để bé học nhẹ nhàng, bố mẹ đồng hành dễ hơn
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="text-3xl">⏱️</div>
              <h3 className="mt-4 text-lg font-black">Bài học ngắn, dễ bắt đầu</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Mỗi hoạt động chỉ vài phút, phù hợp khả năng tập trung của trẻ nhỏ.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="text-3xl">🎯</div>
              <h3 className="mt-4 text-lg font-black">Nội dung theo độ tuổi</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Giúp bé học đúng mức, không quá khó cũng không quá đơn điệu.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="text-3xl">📊</div>
              <h3 className="mt-4 text-lg font-black">Theo dõi tiến bộ rõ ràng</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Bố mẹ xem được kỹ năng nào bé đang làm tốt và phần nào cần hỗ trợ thêm.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="text-3xl">💛</div>
              <h3 className="mt-4 text-lg font-black">Học tập thân thiện, không áp lực</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Trải nghiệm nhẹ nhàng giúp bé giữ hứng thú và tạo thói quen học tốt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning categories */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Danh mục học tập
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Các nhóm nội dung được bé yêu thích
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Bắt đầu từ những kỹ năng cơ bản và phát triển dần theo độ tuổi của trẻ.
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center font-bold text-sky-700 transition hover:text-sky-800"
          >
            Xem tất cả khóa học →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {learningCategories.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`group rounded-3xl p-6 shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-md ${item.bg}`}
            >
              <div className="text-4xl">{item.icon}</div>
              <h3 className="mt-4 text-xl font-black text-slate-900 group-hover:text-sky-700">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured games */}
      <section className="bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
                Kho trò chơi
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Trò chơi ngắn để bé vừa học vừa vui
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Nội dung trực quan, thao tác đơn giản và phù hợp cho từng nhóm tuổi.
              </p>
            </div>

            <Link
              href="/games"
              className="inline-flex items-center font-bold text-violet-700 transition hover:text-violet-800"
            >
              Xem toàn bộ trò chơi →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredGames.map((game) => (
              <div
                key={game.title}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
              >
                <div className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                  {game.age}
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-900">{game.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{game.desc}</p>
                <Link
                  href={game.href}
                  className="mt-5 inline-flex items-center font-bold text-violet-700 transition hover:text-violet-800"
                >
                  Chơi thử →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            Cách hoạt động
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Bắt đầu đơn giản chỉ với 3 bước
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-lg font-black text-sky-700">
                {item.step}
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Progress for parents */}
      <section className="bg-gradient-to-br from-sky-50 via-white to-violet-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Dành cho phụ huynh
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Theo dõi tiến độ rõ ràng để đồng hành cùng con tốt hơn
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Không chỉ là nơi để bé học, Học Cùng Bé còn giúp phụ huynh nhìn thấy
              quá trình phát triển của con theo từng kỹ năng, từng giai đoạn.
            </p>

            <ul className="mt-8 space-y-4 text-slate-700">
              <li className="flex gap-3">
                <span className="mt-1 text-sky-600">✓</span>
                <span>Xem số hoạt động bạn nhỏ đã hoàn thành</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-sky-600">✓</span>
                <span>Biết kỹ năng nào bé đang mạnh và phần nào cần rèn thêm</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-sky-600">✓</span>
                <span>Nhận gợi ý nội dung tiếp theo theo độ tuổi và tiến độ</span>
              </li>
            </ul>

            <div className="mt-8">
              <Link
                href="/progress"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
              >
                Xem trang tiến độ
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Tiến độ tuần này</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">Bé Minh An</p>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  Hoàn thành tốt
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">Ngôn ngữ</span>
                    <span className="text-slate-500">78%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200">
                    <div className="h-3 w-[78%] rounded-full bg-sky-500" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">Toán vui</span>
                    <span className="text-slate-500">64%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200">
                    <div className="h-3 w-[64%] rounded-full bg-violet-500" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">Logic</span>
                    <span className="text-slate-500">82%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200">
                    <div className="h-3 w-[82%] rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
                <p className="text-sm font-bold text-slate-900">Gợi ý hôm nay</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Bé đang làm tốt phần logic. Phụ huynh có thể cho bé chơi thêm một
                  trò toán vui ngắn để cân bằng kỹ năng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parent resources */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600">
              Góc phụ huynh
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Nội dung hữu ích để đồng hành cùng bé tốt hơn
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Không chỉ có trò chơi và bài học, phụ huynh còn có thể tham khảo thêm
              các bài viết ngắn, dễ áp dụng trong cuộc sống hằng ngày.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center font-bold text-pink-700 transition hover:text-pink-800"
          >
            Xem tất cả bài viết →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {parentResources.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700">
                Dành cho phụ huynh
              </div>
              <h3 className="mt-4 text-xl font-black text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p>
              <Link
                href={item.href}
                className="mt-5 inline-flex items-center font-bold text-pink-700 transition hover:text-pink-800"
              >
                Đọc tiếp →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[32px] bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-500 px-6 py-12 text-white shadow-lg sm:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
              Bắt đầu cùng bé hôm nay
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Cho bé một hành trình học tập vui vẻ, nhẹ nhàng và đều đặn mỗi ngày
            </h2>
            <p className="mt-4 text-base leading-8 text-white/90">
              Khám phá trò chơi giáo dục, bài học ngắn và công cụ theo dõi tiến độ
              để phụ huynh đồng hành cùng con dễ dàng hơn.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-sky-700 transition hover:bg-slate-100"
              >
                Đăng ký miễn phí
              </Link>
              <Link
                href="/games"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Xem trò chơi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
