import { englishVocabularyLevels } from './data/englishVocabularyLevels';

type EnglishProgressMap = Record<
  string,
  {
    highScore: number;
    bestStars: number;
    playedCount: number;
    unlocked: boolean;
    bestCombo: number;
  }
>;

type Props = {
  progressMap: EnglishProgressMap;
};

export default function EnglishLeaderboard({ progressMap }: Props) {
  const leaderboard = englishVocabularyLevels
    .map((level) => ({
      level,
      progress: progressMap[level.id] ?? {
        highScore: 0,
        bestStars: 0,
        playedCount: 0,
        unlocked: false,
        bestCombo: 0,
      },
    }))
    .sort((a, b) => {
      if (b.progress.bestStars !== a.progress.bestStars) {
        return b.progress.bestStars - a.progress.bestStars;
      }
      return b.progress.highScore - a.progress.highScore;
    })
    .slice(0, 5);

  return (
    <div className="mb-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-2xl font-black text-slate-900">Mini bảng xếp hạng</h2>

      <div className="mt-4 space-y-3">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.level.id}
            className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-black text-slate-900 ring-1 ring-slate-200">
                {index + 1}
              </div>

              <div>
                <p className="font-black text-slate-900">{entry.level.title}</p>
                <p className="text-sm text-slate-500">
                  Điểm cao nhất: {entry.progress.highScore} • Combo: {entry.progress.bestCombo}
                </p>
              </div>
            </div>

            <div className="text-xl">
              {[1, 2, 3].map((star) => (
                <span key={star}>{star <= entry.progress.bestStars ? '⭐' : '☆'}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
