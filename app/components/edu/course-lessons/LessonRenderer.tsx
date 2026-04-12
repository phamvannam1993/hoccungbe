import Link from 'next/link';

type LessonRendererProps = {
  courseSlug: string;
  lessonId: string;
};

function LetterCard({
  letter,
  example,
  emoji,
}: {
  letter: string;
  example: string;
  emoji: string;
}) {
  return (
    <div className="rounded-[28px] bg-white p-5 text-center shadow-sm ring-1 ring-slate-100">
      <div className="text-5xl font-black text-sky-700">{letter}</div>
      <div className="mt-4 text-4xl">{emoji}</div>
      <p className="mt-3 text-sm font-semibold text-slate-700">{example}</p>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">{desc}</p>
    </div>
  );
}

function LessonLQMC01() {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Bài 1"
        title="Nhận biết chữ A, Ă, Â"
        desc="Bé làm quen với ba chữ cái đầu tiên trong nhóm A. Phụ huynh có thể cho bé nhìn chữ, đọc theo và liên hệ với hình minh họa quen thuộc."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <LetterCard letter="A" example="A - quả táo" emoji="🍎" />
        <LetterCard letter="Ă" example="Ă - mặt trăng" emoji="🌙" />
        <LetterCard letter="Â" example="Â - cái ấm" emoji="🫖" />
      </div>

      <div className="rounded-[30px] bg-sky-50 p-6 ring-1 ring-sky-100">
        <h3 className="text-2xl font-black text-slate-900">Cách học cùng bé</h3>
        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
          <p>Cho bé nhìn từng chữ trong 3 đến 5 giây, sau đó đọc mẫu chậm và rõ.</p>
          <p>Khuyến khích bé nhắc lại chữ và chỉ vào hình minh họa tương ứng.</p>
          <p>Ôn lại theo vòng lặp A → Ă → Â rồi đảo thứ tự để tăng ghi nhớ.</p>
        </div>
      </div>
    </div>
  );
}

function LessonLQMC02() {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Bài 2"
        title="Nhận biết chữ B, C, D"
        desc="Bé tiếp tục mở rộng nhóm phụ âm cơ bản thông qua hình ảnh gần gũi và cách đọc ngắn gọn, dễ nhớ."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <LetterCard letter="B" example="B - bút" emoji="✏️" />
        <LetterCard letter="C" example="C - cá" emoji="🐟" />
        <LetterCard letter="D" example="D - dưa" emoji="🍉" />
      </div>

      <div className="rounded-[30px] bg-violet-50 p-6 ring-1 ring-violet-100">
        <h3 className="text-2xl font-black text-slate-900">Gợi ý luyện tập</h3>
        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
          <p>Cho bé chỉ đúng chữ khi phụ huynh đọc âm đầu.</p>
          <p>Đặt câu hỏi đơn giản như: “Bút bắt đầu bằng chữ gì?”</p>
          <p>Trộn 6 chữ đã học để bé phân biệt giữa nhóm A và nhóm B, C, D.</p>
        </div>
      </div>
    </div>
  );
}

function LessonLQMC03() {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Bài 3"
        title="Ghép chữ với hình"
        desc="Bé thực hành nối chữ cái với hình minh họa phù hợp để củng cố trí nhớ và tăng phản xạ nhận diện mặt chữ."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {[
          { letter: 'A', emoji: '🍎', word: 'Táo' },
          { letter: 'B', emoji: '✏️', word: 'Bút' },
          { letter: 'C', emoji: '🐟', word: 'Cá' },
        ].map((item) => (
          <div
            key={item.letter}
            className="rounded-[28px] bg-white p-6 text-center shadow-sm ring-1 ring-slate-100"
          >
            <div className="text-5xl font-black text-sky-700">{item.letter}</div>
            <div className="mt-4 text-4xl">{item.emoji}</div>
            <p className="mt-3 text-sm font-semibold text-slate-700">{item.word}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[30px] bg-emerald-50 p-6 ring-1 ring-emerald-100">
        <h3 className="text-2xl font-black text-slate-900">Mục tiêu bài học</h3>
        <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
          <p>Bé nhận ra chữ cái không đứng riêng lẻ mà gắn với từ và hình ảnh.</p>
          <p>Tăng khả năng liên kết giữa âm, chữ và nghĩa.</p>
          <p>Chuẩn bị nền tảng cho các trò chơi ghép chữ, chọn âm đầu và đọc từ.</p>
        </div>
      </div>
    </div>
  );
}

function LessonTVMN01() {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Bài học toán"
        title="Đếm số từ 1 đến 5"
        desc="Bé làm quen với số lượng cơ bản qua hình ảnh trực quan và nhịp đếm chậm, rõ ràng."
      />

      <div className="grid gap-5 md:grid-cols-5">
        {[1, 2, 3, 4, 5].map((num) => (
          <div
            key={num}
            className="rounded-[24px] bg-white p-5 text-center shadow-sm ring-1 ring-slate-100"
          >
            <div className="text-4xl font-black text-violet-700">{num}</div>
            <div className="mt-3 text-3xl">{'🍎'.repeat(num)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DefaultLesson({ lessonId }: { lessonId: string }) {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
        Nội dung đang cập nhật
      </p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
        Bài học {lessonId}
      </h2>
      <p className="mt-3 text-base leading-8 text-slate-600">
        Phần nội dung chi tiết cho bài học này chưa được gắn riêng. Bạn có thể tiếp tục bổ sung video, bài đọc, trò chơi hoặc phần luyện tập tùy theo nhu cầu.
      </p>
    </div>
  );
}

export default function LessonRenderer({
  courseSlug,
  lessonId,
}: LessonRendererProps) {
  const lessonKey = `${courseSlug}:${lessonId}`;

  switch (lessonKey) {
    case 'lam-quen-mat-chu:lqmc-01':
      return <LessonLQMC01 />;
    case 'lam-quen-mat-chu:lqmc-02':
      return <LessonLQMC02 />;
    case 'lam-quen-mat-chu:lqmc-03':
      return <LessonLQMC03 />;
    case 'toan-vui-moi-ngay:tvmn-01':
      return <LessonTVMN01 />;
    default:
      return <DefaultLesson lessonId={lessonId} />;
  }
}
