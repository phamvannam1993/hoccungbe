import Link from 'next/link';

type ChildProfile = {
    name: string;
    avatar: string;
  };
  
  type Props = {
    childProfile: ChildProfile;
    studyStreakDays: number;
    selectedLevelTitle: string;
    currentThemeLabel?: string;
    currentStars: number;
    score: number;
    totalQuestions: number;
    highScore: number;
    bestCombo: number;
    wrongQuestionsCount: number;
    onRetryWrong: () => void;
    onRestart: () => void;
    onBackLevels: () => void;
    isQuickMode?: boolean;
  };
  
  export default function EnglishResultCard({
    childProfile,
    studyStreakDays,
    selectedLevelTitle,
    currentThemeLabel,
    currentStars,
    score,
    totalQuestions,
    highScore,
    bestCombo,
    wrongQuestionsCount,
    onRetryWrong,
    onRestart,
    onBackLevels,
    isQuickMode = false,
  }: Props) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
          {currentStars === 3 && (
            <>
              <div className="pointer-events-none absolute left-6 top-6 text-3xl animate-bounce">🎉</div>
              <div className="pointer-events-none absolute right-8 top-10 text-2xl animate-pulse">✨</div>
              <div className="pointer-events-none absolute left-1/4 top-16 text-2xl animate-bounce">🎊</div>
              <div className="pointer-events-none absolute right-1/4 top-20 text-3xl animate-pulse">⭐</div>
            </>
          )}
  
          <div className="mx-auto mb-6 flex w-full max-w-md items-center gap-4 rounded-3xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
              {childProfile.avatar}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-emerald-700">Hồ sơ bé</p>
              <p className="text-xl font-black text-slate-900">{childProfile.name}</p>
              <p className="text-sm text-slate-600">Chuỗi học: {studyStreakDays} ngày</p>
            </div>
          </div>
  
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-sky-100 text-5xl shadow-sm">
            {currentStars === 3 ? '👑' : currentStars === 2 ? '🏅' : currentStars === 1 ? '🌟' : '💛'}
          </div>
  
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Hoàn thành màn học
          </p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">
            {selectedLevelTitle}
          </h2>
          <p className="mt-3 text-slate-600">
            Chủ đề màn này: <span className="font-bold">{currentThemeLabel ?? 'Không rõ'}</span>
          </p>
  
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Điểm đạt được</p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {isQuickMode ? score : `${score}/${totalQuestions}`}
              </p>
            </div>
  
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Số sao</p>
              <p className="mt-2 text-3xl">
                {[1, 2, 3].map((star) => (
                  <span key={star}>{star <= currentStars ? '⭐' : '☆'}</span>
                ))}
              </p>
            </div>
  
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Điểm cao nhất</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{highScore}</p>
            </div>
  
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Combo tốt nhất</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{bestCombo}</p>
            </div>
          </div>
  
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-sky-50 p-5 text-left">
              <p className="text-sm font-semibold text-sky-700">Điểm nổi bật</p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {currentStars === 3
                  ? '🎉 Bé làm rất xuất sắc'
                  : currentStars === 2
                  ? '👏 Bé làm rất tốt'
                  : '🌱 Bé đang tiến bộ'}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Bé đúng {score} / {totalQuestions} câu.
              </p>
            </div>
  
            <div className="rounded-3xl bg-violet-50 p-5 text-left">
              <p className="text-sm font-semibold text-violet-700">Chuỗi tốt nhất</p>
              <p className="mt-2 text-lg font-black text-slate-900">🔥 {bestCombo} câu liên tiếp</p>
              <p className="mt-1 text-sm text-slate-600">
                Bé đang xây phản xạ tiếng Anh rất tốt.
              </p>
            </div>
          </div>
  
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {wrongQuestionsCount > 0 && (
              <button
                onClick={onRetryWrong}
                className="mt-6 inline-flex rounded-full bg-sky-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-600"
              >
                Học lại từ sai
              </button>
            )}
  
            <button
              onClick={onRestart}
              className="mt-6 inline-flex rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              Chơi lại
            </button>
  
            <button
              onClick={onBackLevels}
              className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Về danh sách màn
            </button>
  
            <Link
                href="/games"
                className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                Xem chi tiết trò chơi
            </Link>
          </div>
        </div>
      </section>
    );
  }