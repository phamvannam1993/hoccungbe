'use client';

/* eslint-disable @next/next/no-img-element -- ảnh giao diện tĩnh, nhỏ */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { AnswerState, Lesson, Question } from '../lib/types';
import { img } from '../lib/assets';
import { isSoundEnabled, playSfx, setSoundEnabled, speak, stopSpeak } from '../lib/sound';
import { saveStars } from '../lib/progress';
import QuestionView, { QUESTION_TYPE_LABEL } from './questions/QuestionView';
import { ShopHeader } from './ShopView';
import { withClocks } from './Clock';
import { questionSpeech } from '../lib/speech';
import Visual from './Visual';
import TheoryView, { theorySpeech } from './TheoryView';

type Props = {
  courseSlug: string;
  courseTitle: string;
  subject: string;
  lesson: Lesson;
  lessonNumber: number;
  totalLessons: number;
  nextLesson: { id: string; title: string; locked: boolean } | null;
};

type Result = 'correct' | 'wrong' | 'timeout';

const POINTS = 10;

/** Thời gian làm cả bài (giây): một đồng hồ chung cho tất cả các câu. */
export const LESSON_TIME_SEC = 5 * 60;

function starsFor(correct: number, total: number) {
  const r = total ? correct / total : 0;
  return r >= 0.9 ? 3 : r >= 0.6 ? 2 : r >= 0.3 ? 1 : 0;
}

const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function LessonPlayer({ courseSlug, courseTitle, subject, lesson, lessonNumber, totalLessons, nextLesson }: Props) {
  const questions = lesson.questions;
  const total = questions.length;
  const mapHref = `/khoa-hoc-iq/${courseSlug}`;

  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [introTab, setIntroTab] = useState<'home' | 'read'>('home');
  const [focusOpen, setFocusOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [attempt, setAttempt] = useState(0);
  // Câu trả lời đang làm của từng câu (quay lại câu trước vẫn giữ nguyên).
  const [answers, setAnswers] = useState<AnswerState[]>(() => questions.map(() => ({ complete: false, correct: false })));
  // Câu xa nhất đã mở: các câu từ 0 đến đây được giữ trên trang (ẩn đi) để không mất thao tác của bé.
  const [maxIdx, setMaxIdx] = useState(0);
  const [results, setResults] = useState<(Result | null)[]>(() => questions.map(() => null));
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [sound, setSound] = useState(() => isSoundEnabled());
  // Số mili-giây còn lại lúc tạm dừng (mở menu / gợi ý); null = đang chạy.
  const [pausedMs, setPausedMs] = useState<number | null>(null);
  const [timeUp, setTimeUp] = useState(false);

  const q = questions[idx];
  const checked = results[idx] !== null;
  const answer = answers[idx];
  const correctCount = results.filter((r) => r === 'correct').length;
  const score = correctCount * POINTS;
  const timeLeft = Math.max(0, Math.ceil((pausedMs ?? deadline - now) / 1000));
  const paused = menuOpen || confirmSubmit || showHint;

  // Dừng đọc giọng khi rời trang bài học.
  useEffect(() => stopSpeak, []);

  const readQuestion = (question: Question) => speak(questionSpeech(question));

  const startQuestion = (i: number) => {
    // Tự đọc đề khi tới câu chưa làm (gọi trong lúc bấm nút nên trình duyệt cho phát tiếng).
    if (results[i] === null) readQuestion(questions[i]);
    else stopSpeak();
    setIdx(i);
    setMaxIdx((m) => Math.max(m, i));
    setShowHint(false);
  };

  const onPrev = () => {
    if (idx > 0) startQuestion(idx - 1);
  };

  const check = (state: AnswerState, timeout = false) => {
    if (results[idx] !== null) return;
    stopSpeak();
    const result: Result = timeout ? 'timeout' : state.correct ? 'correct' : 'wrong';
    const next = results.map((r, i) => (i === idx ? result : r));
    // Giọng khen true01…06 / động viên false01…04 theo số câu đúng / sai đã có (giống app 3 Gốc).
    if (result === 'correct') playSfx('correct', next.filter((r) => r === 'correct').length);
    else playSfx('wrong', next.filter((r) => r && r !== 'correct').length);
    setResults(next);
  };

  // Mở menu / gợi ý: ghi lại chính xác thời gian còn lại. Đóng lại: hạn chót mới = bây giờ + phần còn lại.
  const pauseTimer = () => {
    if (pausedMs === null) setPausedMs(Math.max(0, deadline - Date.now()));
  };
  const resume = (close: () => void) => {
    const t = Date.now();
    setDeadline(t + (pausedMs ?? Math.max(0, deadline - t)));
    setNow(t);
    setPausedMs(null);
    close();
  };

  const onAnswerAt = (i: number, state: AnswerState) => {
    if (i !== idx) return;
    setAnswers((a) => a.map((x, j) => (j === i ? state : x)));
    if (state.auto && state.complete) check(state);
  };

  const begin = () => {
    const t = Date.now();
    stopSpeak();
    setResults(questions.map(() => null));
    setAnswers(questions.map(() => ({ complete: false, correct: false })));
    setMaxIdx(0);
    setTimeUp(false);
    setPausedMs(null);
    setNow(t);
    setDeadline(t + LESSON_TIME_SEC * 1000);
    setAttempt((a) => a + 1);
    setPhase('play');
    setMenuOpen(false);
    setConfirmSubmit(false);
    setFocusOpen(false);
    startQuestion(0);
  };

  const finish = (final: (Result | null)[]) => {
    const finalCorrect = final.filter((r) => r === 'correct').length;
    saveStars(courseSlug, lesson.id, starsFor(finalCorrect, total));
    playSfx('result', Math.round((finalCorrect / total) * 100));
    setMenuOpen(false);
    setConfirmSubmit(false);
    setPhase('result');
  };

  // Hết thời gian cả bài: câu đang làm và các câu chưa làm tính "hết giờ", rồi nộp bài.
  const timeOut = () => {
    stopSpeak();
    const final = results.map((r) => r ?? 'timeout');
    setResults(final);
    setTimeUp(true);
    finish(final);
  };

  // Đếm ngược chung cho cả bài. Tạm dừng khi mở menu / gợi ý / hộp nộp bài.
  useEffect(() => {
    if (phase !== 'play' || paused) return;
    const timer = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= deadline) timeOut();
    }, 250);
    return () => clearInterval(timer);
  });

  const onNext = () => {
    if (!checked) {
      if (answer.complete) check(answer);
      return;
    }
    if (idx + 1 < total) return startQuestion(idx + 1);
    finish(results);
  };

  const toggleSound = () => {
    const on = !isSoundEnabled();
    setSoundEnabled(on);
    setSound(on);
    if (on && phase === 'play' && !checked) readQuestion(q);
  };

  const header = (
    <ShopHeader title={`${courseTitle} › Bài ${lessonNumber}: ${lesson.title}`} backHref={mapHref}>
      <span className="hidden shrink-0 rounded-[28px] bg-white px-4 py-1 text-lg font-extrabold text-[#1d9bbd] sm:inline">
        BÀI {lessonNumber}/{totalLessons}
      </span>
    </ShopHeader>
  );

  if (total === 0) {
    return (
      <div className="min-h-screen bg-[#dff5ff]">
        {header}
        <div className="mx-auto max-w-md px-4 pt-16 text-center">
          <img src={img('loading.png')} alt="" className="mx-auto h-40" />
          <h1 className="mt-4 text-2xl font-black text-slate-800">Bài học đang được biên soạn</h1>
          <p className="mt-2 text-slate-500">Bé quay lại sau nhé!</p>
          <Link href={mapHref} className="khv-btn-active mt-6 inline-block px-8">
            Về bản đồ bài học
          </Link>
        </div>
      </div>
    );
  }

  // ── Màn bài học (giống Lession.vue: khung chính + menu NGHE / ĐỌC / LUYỆN TẬP) ──
  if (phase === 'intro') {
    const types = [...new Set(questions.map((x) => QUESTION_TYPE_LABEL[x.type]))];
    const story = lesson.theory
      ? theorySpeech(lesson.theory, `Bài ${lessonNumber}: ${lesson.title}`)
      : `Bài ${lessonNumber}: ${lesson.title}. ${lesson.description ?? ''} Bài có ${total} câu hỏi, làm trong ${LESSON_TIME_SEC / 60} phút.`;
    return (
      <div className="min-h-screen bg-white">
        {header}
        <div className={`mx-auto flex max-w-6xl flex-col items-stretch gap-5 px-4 py-8 md:flex-row md:py-14 ${introTab === 'read' ? 'md:items-start' : 'md:items-center'}`}>
          <div className="flex min-h-[340px] flex-1 items-center justify-center rounded-[20px] bg-[#e6e6e6] p-6 md:min-h-[400px]">
            {introTab === 'home' ? (
              <div className="text-center">
                <img src={img('icon_content.png')} alt="" className="khv-float mx-auto w-[180px]" />
                <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-[#1d9bbd]">{subject.replace('|', ' · ')}</p>
                <h1 className="mt-1 text-2xl font-black text-slate-800">
                  {withClocks(lesson.emoji)} Bài {lessonNumber}: {lesson.title}
                </h1>
              </div>
            ) : (
              <div className="w-full self-stretch rounded-[24px] border border-[#e5e5e5] bg-white p-4 text-[15px] leading-relaxed text-[#333] sm:p-5">
                {lesson.theory ? (
                  <TheoryView
                    theory={lesson.theory}
                    title={`Bài ${lessonNumber}: ${lesson.title}`}
                    emoji={lesson.emoji}
                    questionCount={total}
                    types={types}
                    onPractice={() => setFocusOpen(true)}
                  />
                ) : (
                  <>
                    <h2 className="text-xl font-black text-slate-800">
                      {withClocks(lesson.emoji)} {lesson.title}
                    </h2>
                    {lesson.description && <p className="mt-2">{lesson.description}</p>}
                    <p className="mt-3 font-bold">Bài có {total} câu, gồm các dạng:</p>
                    <ul className="mt-1 list-disc pl-5">
                      {types.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <p className="mt-3">Mỗi câu có đồng hồ đếm ngược. Trả lời đúng được {POINTS} sao, cuối bài nhận huy hiệu 1–3 sao.</p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="sticky bottom-3 z-10 grid grid-cols-3 gap-3 md:top-24 md:bottom-auto md:flex md:w-[170px] md:flex-col md:gap-[18px]">
            <IntroButton icon="icon_vol.png" label="NGHE" onClick={() => speak(story)} />
            <IntroButton icon="icon_read.png" label="ĐỌC" onClick={() => setIntroTab(introTab === 'read' ? 'home' : 'read')} />
            <IntroButton icon="icon_play.png" label="LUYỆN TẬP" onClick={() => setFocusOpen(true)} />
          </div>
        </div>

        {focusOpen && (
          <Overlay onClose={() => setFocusOpen(false)}>
            <div className="w-[320px] rounded-[18px] bg-white px-8 pb-9 pt-7 shadow-2xl">
              <div className="rounded-[30px] bg-[#1ea3cf] px-1 py-2 text-center text-sm font-extrabold text-white">TẬP TRUNG LÀM BÀI</div>
              <ol className="mb-6 mt-5 list-decimal space-y-1 pl-5 text-[14px] leading-relaxed text-[#333]">
                <li>ĐỌC KỸ ĐỀ — nhiều câu có bẫy</li>
                <li>LÀM {total} CÂU TRONG {LESSON_TIME_SEC / 60} PHÚT</li>
                <li>BẤM &quot;BÀI ĐỌC&quot; NẾU CẦN GỢI Ý</li>
                <li>NHẬN SAO THƯỞNG</li>
              </ol>
              <button
                type="button"
                onClick={begin}
                className="mx-auto block rounded-full bg-[#ffb63e] px-8 py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_#e19a21] active:translate-y-0.5 active:shadow-[0_3px_0_#e19a21]"
              >
                BẮT ĐẦU
              </button>
            </div>
          </Overlay>
        )}
      </div>
    );
  }

  // ── Màn kết quả ──
  if (phase === 'result') {
    const stars = starsFor(correctCount, total);
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#dff6ef] to-[#cfeee6]">
        {header}
        <div className="mx-auto max-w-md px-4 pb-10 pt-8">
          <div className="rounded-[22px] bg-white px-5 py-7 text-center shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
            <img src={img(stars >= 2 ? 'icon_tab3.png' : 'icon_question.png')} alt="" className="khv-float mx-auto h-36" />
            <h1 className="mt-2 text-2xl font-black text-slate-800">
              {stars === 3 ? 'Xuất sắc!' : stars === 2 ? 'Giỏi lắm!' : stars === 1 ? 'Khá lắm!' : 'Cố lên nào!'}
            </h1>
            <p className="mt-1 text-[#444]">
              Bài {lessonNumber}: {lesson.title}
            </p>
            {timeUp && <p className="mt-2 font-bold text-[#e64a4a]">⏰ Hết {LESSON_TIME_SEC / 60} phút rồi! Bài đã được nộp tự động.</p>}
            <div className="mt-4 flex justify-center gap-1">
              {[1, 2, 3].map((s) => (
                <img
                  key={s}
                  src={img(s <= stars ? 'star_1.png' : 'star_2.png')}
                  alt=""
                  className={`h-16 w-16 object-contain ${s <= stars ? 'khv-pop' : ''}`}
                  style={{ animationDelay: `${s * 180}ms` }}
                />
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Stat label="Câu đúng" value={`${correctCount}/${total}`} tone="text-[#43c35e] bg-[#ecfaef]" />
              <Stat label="Điểm" value={String(score)} tone="text-[#ffa621] bg-[#fff6e5]" />
              <Stat label="Hết giờ" value={String(results.filter((r) => r === 'timeout').length)} tone="text-[#e64a4a] bg-[#fdecec]" />
            </div>
            <div className="mt-5 flex justify-center">
              <StepBar results={results} current={-1} />
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {nextLesson && !nextLesson.locked && (
                <Link href={`/khoa-hoc-iq/${courseSlug}/${nextLesson.id}`} className="khv-btn-active">
                  BÀI TIẾP THEO: {nextLesson.title}
                </Link>
              )}
              {nextLesson?.locked && (
                <Link href={`${mapHref}?mo-khoa=1`} className="khv-btn-buy">
                  🔓 MỞ KHÓA ĐỂ HỌC TIẾP
                </Link>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={begin} className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#1ea7e1] py-3 font-bold text-white">
                  LÀM LẠI
                </button>
                <Link href={mapHref} className="flex flex-1 items-center justify-center rounded-[10px] bg-[#ffb533] py-3 font-bold text-white">
                  BẢN ĐỒ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Màn chơi (giống QuizQuestion.vue) ──
  const result = results[idx];
  const urgent = timeLeft <= 30;
  const unanswered = results.filter((r) => r === null).length;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#dff6ef] to-[#cfeee6]">
      <header className="flex items-center justify-between gap-2 px-3 pt-3 sm:px-6 sm:pt-[18px]">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <img src={img('icon_question_qz.png')} alt="" className="hidden h-14 w-auto shrink-0 sm:block" />
          <div
            className="relative flex h-[52px] min-w-0 flex-1 items-center bg-[length:100%_100%] bg-no-repeat pl-5 pr-14 sm:h-[64px] sm:max-w-[640px] sm:pl-8"
            style={{ backgroundImage: `url(${img('bg_question.png')})` }}
          >
            <span className="truncate text-sm font-semibold text-[#1b1b1b] sm:text-lg">
              Câu {idx + 1}/{total} · {QUESTION_TYPE_LABEL[q.type]}
            </span>
            <button type="button" onClick={() => readQuestion(q)} className="absolute right-1 top-1/2 -translate-y-1/2" aria-label="Nghe đọc đề">
              <img src={img('icon_volumn.png')} alt="" className="h-11 w-11 sm:h-[52px] sm:w-[52px]" />
            </button>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div
            className={`relative flex h-[44px] w-[96px] items-center bg-[length:100%_100%] bg-no-repeat sm:h-[53px] sm:w-[126px] ${urgent ? 'khv-pulse' : ''}`}
            style={{ backgroundImage: `url(${img('u_watch.png')})` }}
            aria-label="Thời gian còn lại"
          >
            <img src={img('icon_watch.png')} alt="" className="ml-0.5 h-9 w-9 sm:h-11 sm:w-11" />
            <span className={`flex-1 pr-2 text-center text-sm font-extrabold tabular-nums sm:text-xl ${urgent ? 'text-[#e64a4a]' : 'text-[#1b1b1b]'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div
            className="relative hidden h-[53px] w-[126px] items-center bg-[length:100%_100%] bg-no-repeat sm:flex"
            style={{ backgroundImage: `url(${img('u_star.png')})` }}
          >
            <img src={img('icon_star.png')} alt="" className="ml-1.5 h-10 w-10" />
            <span className="flex-1 pr-2 text-center text-xl font-extrabold text-[#1b1b1b]">{score}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              pauseTimer();
              setMenuOpen(true);
            }}
            aria-label="Menu"
          >
            <img src={img('icon_menu.png')} alt="" className="h-11 w-11 sm:h-[60px] sm:w-[56px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1060px] flex-1 px-4 pb-6 pt-5 sm:px-10">
        <div className="relative flex items-start gap-3">
          <p className="min-h-[50px] flex-1 whitespace-pre-line text-lg font-semibold leading-relaxed text-[#1b1b1b] sm:text-xl">{withClocks(q.prompt, 40)}</p>
        </div>
        {q.visual && <Visual visual={q.visual} />}
        <div className="mb-5 mt-3 h-px w-full bg-[#4d4d4d]/60" />
        {questions.slice(0, maxIdx + 1).map((qq, i) => (
          <div key={`${qq.id}-${attempt}`} hidden={i !== idx}>
            <QuestionView q={qq} done={results[i] !== null} verdict={results[i]} onChange={(st) => onAnswerAt(i, st)} />
          </div>
        ))}

        {checked && (
          <div className={`mx-auto mt-6 max-w-3xl rounded-[18px] border-[3px] bg-white p-4 shadow ${result === 'correct' ? 'border-[#85cc31]' : 'border-[#ff7e89]'}`}>
            <div className="mb-3 flex justify-center">
              <StepBar results={results} current={idx} />
            </div>
            <p className={`text-lg font-black ${result === 'correct' ? 'text-[#43c35e]' : 'text-[#e64a4a]'}`}>
              {result === 'correct' ? `Chính xác! +${POINTS} sao` : result === 'timeout' ? 'Hết giờ rồi!' : 'Chưa đúng rồi!'}
            </p>
            {q.method && (
              <p className="mt-1 text-[15px] text-[#333]">
                <b>Cách làm:</b> {withClocks(q.method, 26)}
              </p>
            )}
            {q.explanation && (
              <p className="mt-1 whitespace-pre-line text-[15px] text-[#333]">
                <b>Lời giải:</b> {withClocks(q.explanation, 26)}
              </p>
            )}
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-[#cfeee6] via-[#cfeee6]/90 to-transparent px-3 pb-3 pt-4 sm:px-7">
        <button type="button" onClick={onPrev} disabled={idx === 0} className="shrink-0 transition disabled:opacity-40" aria-label="Câu trước">
          <img src={img('icon_prev.png')} alt="" className="h-12 w-auto sm:h-[58px]" />
        </button>
        {q.method && !checked ? (
          <button
            type="button"
            onClick={() => {
              pauseTimer();
              setShowHint(true);
            }}
            aria-label="Gợi ý cách làm"
          >
            <img src={img('icon_read_2.png')} alt="" className="h-12 w-12 sm:h-[59px] sm:w-[56px]" />
          </button>
        ) : (
          <span className="w-12 sm:w-14" />
        )}
        <p className="min-w-0 flex-1 truncate text-center text-sm font-medium text-[#1b1b1b] sm:text-lg">
          Bài {lessonNumber} - {lesson.title} - Câu {idx + 1}/{total}
        </p>
        <button
          type="button"
          onClick={onNext}
          disabled={!checked && !answer.complete}
          className="shrink-0 transition disabled:opacity-40"
          aria-label={checked ? (idx + 1 < total ? 'Câu tiếp' : 'Xem kết quả') : 'Kiểm tra'}
        >
          <img src={img('icon_next.png')} alt="" className="h-[60px] w-auto sm:h-[79px]" />
        </button>
      </footer>

      {showHint && (
        <Overlay onClose={() => resume(() => setShowHint(false))}>
          <div
            className="relative w-[min(92vw,560px)] bg-[length:100%_100%] bg-no-repeat px-8 py-10"
            style={{ backgroundImage: `url(${img('bg_read.png')})` }}
          >
            <button type="button" onClick={() => resume(() => setShowHint(false))} className="absolute -right-3 -top-3" aria-label="Đóng">
              <img src={img('icon_close_menu.png')} alt="" className="h-10 w-10" />
            </button>
            <p className="text-center text-sm font-extrabold uppercase tracking-widest text-[#1d9bbd]">Gợi ý cách làm</p>
            <p className="mt-3 text-center text-lg font-semibold text-[#1b1b1b]">{withClocks(q.method ?? "", 32)}</p>
          </div>
        </Overlay>
      )}

      {menuOpen && (
        <Overlay onClose={() => resume(() => setMenuOpen(false))}>
          <div className="relative rounded-[94px] bg-white px-6 pb-3 pt-6 shadow-[0_10px_40px_rgba(0,0,0,0.15)] sm:px-[60px]">
            <button type="button" onClick={() => resume(() => setMenuOpen(false))} className="absolute -right-2 -top-3" aria-label="Đóng">
              <img src={img('icon_close_menu.png')} alt="" className="h-10 w-10" />
            </button>
            <div className="flex items-center gap-4 sm:gap-7">
              <MenuAction icon="icon_retry.png" label="Làm lại" onClick={begin} />
              <MenuAction icon={sound ? 'icon_audio.png' : 'icon_audio_2.png'} label="Âm thanh" onClick={toggleSound} />
              <MenuAction
                icon="icon_submit.png"
                label="Nộp bài"
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmSubmit(true);
                }}
              />
              <MenuAction icon="icon_exit.png" label="Thoát" href={mapHref} />
            </div>
          </div>
        </Overlay>
      )}

      {confirmSubmit && (
        <Overlay onClose={() => resume(() => setConfirmSubmit(false))}>
          <div className="w-[320px] rounded-[22px] bg-white px-5 py-7 text-center shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
            <img src={img('icon_modal_sb.png')} alt="" className="mx-auto mb-3" />
            <p className="mb-6 text-[#444]">
              {unanswered > 0 ? `Bé còn ${unanswered} câu chưa làm. ` : ''}Bạn có chắc chắn muốn nộp bài không?
            </p>
            <div className="flex justify-center gap-3">
              <button type="button" onClick={() => resume(() => setConfirmSubmit(false))} className="rounded-[10px] bg-[#1ea7e1] px-5 py-3 text-[15px] font-semibold text-white">
                LÀM TIẾP
              </button>
              <button type="button" onClick={() => finish(results)} className="rounded-[10px] bg-[#ffb533] px-5 py-3 text-[15px] font-semibold text-white">
                NỘP BÀI
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function Overlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function IntroButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 whitespace-nowrap rounded-[14px] bg-[#cfeaff] px-3 py-3.5 text-sm font-semibold text-[#00678d] shadow-[0_4px_0_#9ec8f0] hover:bg-[#b7dfff] md:justify-start md:px-4 md:text-base"
    >
      <img src={img(icon)} alt="" className="h-6 w-6 object-contain" />
      {label}
    </button>
  );
}

function MenuAction({ icon, label, onClick, href }: { icon: string; label: string; onClick?: () => void; href?: string }) {
  const body = (
    <>
      <img src={img(icon)} alt="" className="mx-auto h-14 w-14 sm:h-[79px] sm:w-[79px]" />
      <p className="mt-2 text-sm sm:text-lg">{label}</p>
    </>
  );
  return href ? (
    <Link href={href} className="text-center">
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className="text-center">
      {body}
    </button>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-2xl py-3 ${tone}`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}

/** Thanh ô số đúng/sai có mũi tên cam ở câu hiện tại (giống ProgressModal.vue). */
function StepBar({ results, current }: { results: (Result | null)[]; current: number }) {
  return (
    <div className="relative flex max-w-full flex-wrap items-center justify-center gap-2 rounded-[30px] bg-white px-4 py-2.5 shadow-[0_0_8px_rgba(0,0,0,0.15)]">
      <img src={img('icon_page.png')} alt="" className="h-9 w-9" />
      {results.map((r, i) => (
        <span
          key={i}
          className={`relative flex h-[32px] w-[32px] items-center justify-center rounded-md text-sm font-bold ${
            r === 'correct' ? 'bg-[#43c35e] text-white' : r ? 'bg-[#e64a4a] text-white' : 'bg-[#dcdcdc] text-[#666]'
          }`}
        >
          {i + 1}
          {i === current && (
            <span className="absolute -top-4 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[14px] border-x-transparent border-t-orange-400" />
          )}
        </span>
      ))}
    </div>
  );
}

