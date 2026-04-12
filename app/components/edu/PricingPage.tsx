import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Dùng thử',
      price: '0đ',
      desc: 'Phù hợp để phụ huynh trải nghiệm trước với một số trò chơi mẫu.',
      features: ['5 trò chơi mẫu', 'Báo cáo cơ bản', 'Không giới hạn thiết bị xem'],
      primary: false,
    },
    {
      name: 'Gia đình',
      price: '199.000đ/tháng',
      desc: 'Gói phù hợp nhất để bé học đều mỗi ngày và phụ huynh theo dõi tiến độ rõ ràng.',
      features: ['Toàn bộ thư viện trò chơi', 'Lộ trình theo độ tuổi', 'Báo cáo chi tiết', 'Gợi ý bài học mỗi ngày'],
      primary: true,
    },
    {
      name: 'Trường học',
      price: 'Liên hệ',
      desc: 'Dành cho lớp học, trung tâm và trường học muốn triển khai đồng bộ.',
      features: ['Quản lý nhiều học sinh', 'Dashboard giáo viên', 'Báo cáo theo lớp', 'Tùy chỉnh nội dung'],
      primary: false,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Bảng giá</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">Gói học tập đơn giản, dễ hiểu và dễ bắt đầu</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
          Phụ huynh có thể bắt đầu bằng bản dùng thử, sau đó mở khóa gói phù hợp để bé có lộ trình học tập xuyên suốt và ổn định hơn.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-[32px] p-6 shadow-sm ring-1 transition ${
              plan.primary
                ? 'bg-slate-900 text-white ring-slate-900 shadow-2xl'
                : 'bg-white text-slate-900 ring-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
              {plan.primary && <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">Đề xuất</span>}
            </div>
            <div className="mt-4 text-3xl font-black">{plan.price}</div>
            <p className={`mt-4 text-sm leading-7 ${plan.primary ? 'text-slate-300' : 'text-slate-600'}`}>{plan.desc}</p>
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                    plan.primary ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  {feature}
                </div>
              ))}
            </div>
            <Link
              href="/login"
              className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
            {plan.name === 'Trường học' ? 'Liên hệ tư vấn' : 'Chọn gói này'}
          </Link>
          </div>
        ))}
      </div>
    </section>
  );
}