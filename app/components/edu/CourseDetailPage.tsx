'use client';

import Link from 'next/link';
import Image from 'next/image';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ApiCourse, ApiLesson, ApiVolume, ApiTopic } from '../../lib/api';
import { childHistory, getCurrentChildId } from '../../lib/childData';
import { topicSlug } from '../../lib/topicSlug';

// Trạng thái đã-học của từng bài (theo bé đang chọn) — truyền xuống LessonRow.
type DoneInfo = { stars: number; bestScore: number };
const DoneLessonsContext = createContext<Map<number, DoneInfo>>(new Map());
function starsForScore(s: number) {
  if (s >= 90) return 3;
  if (s >= 70) return 2;
  if (s >= 50) return 1;
  return 0;
}

const COLORS = [
  { c: '#FF6B9D', bg: 'linear-gradient(135deg, #FFE5F1 0%, #FFD6E8 100%)' },
  { c: '#4ECDC4', bg: 'linear-gradient(135deg, #C9F0FF 0%, #B3E5DC 100%)' },
  { c: '#A06CD5', bg: 'linear-gradient(135deg, #EBD8FF 0%, #DDC3FF 100%)' },
  { c: '#FF9F45', bg: 'linear-gradient(135deg, #FFF4D6 0%, #FFE5B4 100%)' },
  { c: '#6BCB77', bg: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)' },
];

const LESSON_EMOJIS = ['📘', '📗', '📙', '📕', '📒', '📓', '📔', '🌟', '🎈', '🚀'];

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname.includes('youtu.be')) {
      videoId = u.pathname.slice(1);
    } else if (u.hostname.includes('youtube.com')) {
      videoId = u.searchParams.get('v');
      if (!videoId && u.pathname.startsWith('/embed/')) {
        videoId = u.pathname.split('/embed/')[1];
      }
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  } catch {
    return null;
  }
}

interface CourseDetailProps {
  slug: string;
  initial: {
    course: ApiCourse;
    lessons: ApiLesson[];
    volumes: ApiVolume[];
    topics: ApiTopic[];
  };
}

export default function CourseDetailPage({ slug, initial }: CourseDetailProps) {
  const { course, lessons, volumes, topics } = initial;
  const [showVideo, setShowVideo] = useState(false);

  // Nạp lịch sử của bé đang chọn → đánh dấu bài đã học (đăng nhập & khách đều được).
  const [doneMap, setDoneMap] = useState<Map<number, DoneInfo>>(new Map());
  useEffect(() => {
    (async () => {
      const cid = getCurrentChildId();
      if (!cid) return;
      try {
        const hist = await childHistory(cid, 500);
        const map = new Map<number, DoneInfo>();
        for (const h of hist) {
          const score = Number(h.score) || 0;
          const prev = map.get(h.lessonId);
          if (!prev || score > prev.bestScore) map.set(h.lessonId, { bestScore: score, stars: starsForScore(score) });
        }
        setDoneMap(map);
      } catch {
        /* bỏ qua */
      }
    })();
  }, []);

  const embedUrl = useMemo(
    () => (course.videoUrl ? getYouTubeEmbedUrl(course.videoUrl) : null),
    [course.videoUrl],
  );
  const sortedVolumes = useMemo(
    () => [...volumes].sort((a, b) => a.sortOrder - b.sortOrder),
    [volumes],
  );
  const hasVolumes = sortedVolumes.length > 0;
  const lessonsNoVolume = useMemo(
    () => lessons.filter((l) => !l.volumeId),
    [lessons],
  );
  const lessonsByVolume = useMemo(() => {
    const map = new Map<number, ApiLesson[]>();
    for (const l of lessons) {
      if (l.volumeId == null) continue;
      const k = Number(l.volumeId);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(l);
    }
    return map;
  }, [lessons]);
  const topicsByVolume = useMemo(() => {
    const map = new Map<number, ApiTopic[]>();
    const noVol: ApiTopic[] = [];
    for (const t of topics) {
      if (t.volumeId == null) { noVol.push(t); continue; }
      const k = Number(t.volumeId);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(t);
    }
    return { byVol: map, noVol };
  }, [topics]);

  return (
    <DoneLessonsContext.Provider value={doneMap}>
    <div className="kid-bg min-h-screen relative overflow-hidden">
      {/* Decorative emojis */}
      <span aria-hidden className="hidden sm:inline pointer-events-none select-none absolute top-10 left-4 text-4xl opacity-70" style={{ animation: 'wiggle 3s ease-in-out infinite' }}>⭐</span>
      <span aria-hidden className="hidden sm:inline pointer-events-none select-none absolute top-24 right-8 text-5xl opacity-70" style={{ animation: 'bounce-pop 2.4s ease-in-out infinite' }}>🎈</span>
      <span aria-hidden className="hidden sm:inline pointer-events-none select-none absolute top-96 left-6 text-3xl opacity-60" style={{ animation: 'wiggle 4s ease-in-out infinite' }}>🌈</span>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 relative">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm">
          <Link href="/" className="font-bold kid-display" style={{ color: '#A06CD5' }}>🏠 Trang chủ</Link>
          <span style={{ color: '#FF6B9D' }}>›</span>
          <Link href="/khoa-hoc" className="font-bold kid-display" style={{ color: '#A06CD5' }}>Khóa học</Link>
          <span style={{ color: '#FF6B9D' }}>›</span>
          <span className="font-black kid-display truncate" style={{ color: '#FF6B9D' }}>{course.title}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 relative">
        {/* Hero card */}
        <div
          className="bg-white rounded-[24px] sm:rounded-[32px] border-4 border-pink-200 p-4 sm:p-8 mb-4 sm:mb-6 kid-pop-in"
          style={{ boxShadow: '0 12px 40px rgba(255,107,157,0.20)' }}
        >
          <p className="text-[11px] sm:text-xs font-black uppercase tracking-widest mb-0.5 sm:mb-1 kid-display" style={{ color: '#FF6B9D' }}>
            🎓 Khóa học
          </p>
          <h1
            className="text-xl sm:text-4xl font-black kid-display leading-tight"
            style={{ background: 'linear-gradient(135deg, #FF6B9D, #FF9F45)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {course.title} 🌟
          </h1>

          {/* Description — thu gọn 3 dòng trên mobile */}
          {(course.description || course.shortDescription) && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-2 sm:mt-4 line-clamp-3 sm:line-clamp-none">
              {course.description || course.shortDescription}
            </p>
          )}

          {/* Video banner */}
          {(course.thumbnailUrl || course.videoUrl) && (
            <div
              className={`relative rounded-3xl overflow-hidden mt-3 sm:mt-5 kid-card-hover ${embedUrl ? 'cursor-pointer' : ''}`}
              style={{
                background: 'linear-gradient(135deg, #A06CD5, #4ECDC4)',
                border: '3px solid #A06CD5',
                boxShadow: '0 4px 0 #A06CD566',
              }}
              onClick={() => embedUrl && setShowVideo(true)}
            >
              <div className="flex items-center h-24 sm:h-44">
                {course.thumbnailUrl ? (
                  <div className="relative h-full w-48 sm:w-64 shrink-0">
                    <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
                  </div>
                ) : null}
                <div className="flex-1 px-6">
                  <div className="flex items-center gap-3 text-white">
                    {embedUrl && (
                      <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur flex items-center justify-center" style={{ boxShadow: '0 3px 0 rgba(0,0,0,0.15)' }}>
                        <svg className="w-6 h-6 fill-white ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    )}
                    <span className="text-base sm:text-lg font-black kid-display">🎬 Xem video bài giảng</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons — 1 hàng chia đôi trên mobile */}
          <div className="mt-4 sm:mt-6 flex gap-2.5 sm:gap-3">
            {lessons.length > 0 && (
              <Link
                href={lessons[0].slug ? `/${lessons[0].slug}` : `/lessons/${lessons[0].id}`}
                className="kid-btn-3d text-sm text-white flex-1 sm:flex-none text-center whitespace-nowrap !px-3 !py-2.5 sm:!px-8 sm:!py-3"
                style={{ background: 'linear-gradient(135deg, #FF6B9D, #FF9F45)', boxShadow: '0 6px 0 #c0392b' }}
              >
                🚀 Vào học ngay
              </Link>
            )}
            {(() => {
              const sl = course.slug ?? '';
              const gradeMatch = sl.match(/lop-?(\d)/);
              const grade = gradeMatch ? gradeMatch[1] : '';
              const subject = sl.includes('toan') ? 'toan' : sl.includes('tieng-viet') ? 'tieng-viet' : sl.includes('tieng-anh') ? 'tieng-anh' : '';
              const href = subject && grade ? `/de-thi?subject=${subject}&grade=${grade}` : '/de-thi';
              return (
                <Link
                  href={href}
                  className="kid-btn-3d text-sm text-white flex-1 sm:flex-none text-center whitespace-nowrap !px-3 !py-2.5 sm:!px-8 sm:!py-3"
                  style={{ background: 'linear-gradient(135deg, #6BCB77, #4ECDC4)', boxShadow: '0 6px 0 #0e7490' }}
                >
                  📝 Đề kiểm tra
                </Link>
              );
            })()}
          </div>
        </div>

        {/* Lesson list */}
        <div
          className="bg-white rounded-3xl border-4 border-pink-200 p-4 sm:p-8 mb-4 sm:mb-6"
          style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}
        >
          <p className="text-[11px] sm:text-xs font-black uppercase tracking-widest mb-0.5 sm:mb-1 kid-display" style={{ color: '#A06CD5' }}>
            📚 Danh sách bài học
          </p>
          <h2
            className="text-xl sm:text-3xl font-black kid-display mb-4 sm:mb-5"
            style={{ background: 'linear-gradient(135deg, #A06CD5, #4ECDC4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Hành trình học tập của bé 🎈
          </h2>

          {hasVolumes ? (
            <div className={`grid gap-6 ${sortedVolumes.length >= 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {sortedVolumes.map((vol, vIdx) => (
                <VolumeColumn
                  key={vol.id}
                  volumeTitle={vol.name}
                  lessons={lessonsByVolume.get(Number(vol.id)) ?? []}
                  topics={topicsByVolume.byVol.get(Number(vol.id)) ?? []}
                  courseSlug={slug}
                  colorIdx={vIdx}
                />
              ))}
              {lessonsNoVolume.length > 0 && (
                <div className="min-w-0 md:col-span-2">
                  <TopicGroup lessons={lessonsNoVolume} topics={topicsByVolume.noVol} courseSlug={slug} colorIdx={sortedVolumes.length} />
                </div>
              )}
            </div>
          ) : (
            <TopicGroup lessons={lessons} topics={topics} courseSlug={slug} colorIdx={0} />
          )}
        </div>
      </div>

      {/* YouTube Modal */}
      {showVideo && embedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowVideo(false)} className="absolute -top-10 right-0 text-white text-2xl font-bold">×</button>
            <div className="aspect-video w-full rounded-2xl overflow-hidden border-4 border-white">
              <iframe src={embedUrl} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen />
            </div>
          </div>
        </div>
      )}
    </div>
    </DoneLessonsContext.Provider>
  );
}

function groupLessonsByTopic(lessons: ApiLesson[], topics: ApiTopic[]) {
  const normTopics = topics.map((t) => ({ ...t, id: Number(t.id) }));
  const topicMap = new Map(normTopics.map((t) => [t.id, t]));
  const topicOrder = normTopics.map((t) => t.id);

  const byTopic: Map<number | null, ApiLesson[]> = new Map();
  for (const lesson of lessons) {
    const key = lesson.topicId != null ? Number(lesson.topicId) : null;
    if (!byTopic.has(key)) byTopic.set(key, []);
    byTopic.get(key)!.push(lesson);
  }

  const orderedTopicIds: (number | null)[] = [...topicOrder.filter((id) => byTopic.has(id))];
  if (byTopic.has(null)) orderedTopicIds.push(null);

  return { byTopic, topicMap, orderedTopicIds };
}

function VolumeColumn({ volumeTitle, lessons, topics, courseSlug, colorIdx }: {
  volumeTitle: string; lessons: ApiLesson[]; topics: ApiTopic[]; courseSlug: string; colorIdx: number;
}) {
  const { byTopic, topicMap, orderedTopicIds } = groupLessonsByTopic(lessons, topics);
  const color = COLORS[colorIdx % COLORS.length];

  return (
    <div
      className="min-w-0 rounded-3xl p-3 sm:p-5"
      style={{
        background: color.bg,
        border: `3px solid ${color.c}`,
        boxShadow: `0 4px 0 ${color.c}66`,
      }}
    >
      <h2
        className="text-base sm:text-lg font-black kid-display uppercase tracking-wide pb-2 sm:pb-3 mb-3 sm:mb-4 border-b-4"
        style={{ color: color.c, borderColor: color.c + '55' }}
      >
        📖 {volumeTitle}
      </h2>
      {orderedTopicIds.map((topicId, tIdx) => (
        <TopicSection
          key={topicId ?? 'no-topic'}
          topicName={topicId !== null ? (topicMap.get(topicId)?.name ?? '') : ''}
          lessons={byTopic.get(topicId) ?? []}
          courseSlug={courseSlug}
          colorIdx={colorIdx + tIdx}
        />
      ))}
    </div>
  );
}

function TopicGroup({ lessons, topics, courseSlug, colorIdx }: { lessons: ApiLesson[]; topics: ApiTopic[]; courseSlug: string; colorIdx: number }) {
  const { byTopic, topicMap, orderedTopicIds } = groupLessonsByTopic(lessons, topics);
  return (
    <>
      {orderedTopicIds.map((topicId, tIdx) => (
        <TopicSection
          key={topicId ?? 'no-topic'}
          topicName={topicId !== null ? (topicMap.get(topicId)?.name ?? '') : ''}
          lessons={byTopic.get(topicId) ?? []}
          courseSlug={courseSlug}
          colorIdx={colorIdx + tIdx}
        />
      ))}
    </>
  );
}

function TopicSection({ topicName, lessons, courseSlug, colorIdx }: { topicName: string; lessons: ApiLesson[]; courseSlug: string; colorIdx: number }) {
  const color = COLORS[colorIdx % COLORS.length];
  return (
    <div className="mb-5">
      {topicName && (
        <h3
          className="text-sm sm:text-base font-black kid-display leading-tight mb-2 sm:mb-3 block sm:inline-block max-w-full whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible px-3 py-1 rounded-full text-white"
          style={{ background: color.c }}
        >
          ✨ {topicName}
        </h3>
      )}
      {/* Link sang trang bài tập của chính chủ đề này — vừa tiện cho bé luyện thêm,
          vừa là internal link để Google crawl được cụm /bai-tap. */}
      {topicName && (
        <Link
          href={`/bai-tap/${courseSlug}/${topicSlug(topicName)}`}
          className="ml-0 sm:ml-2 mb-2 sm:mb-3 inline-block text-xs font-bold text-sky-700 hover:underline"
        >
          📝 Bài tập chủ đề này
        </Link>
      )}
      <div className="space-y-2">
        {lessons.map((lesson, lIdx) => (
          <LessonRow key={lesson.id} lesson={lesson} courseSlug={courseSlug} idx={lIdx} />
        ))}
      </div>
    </div>
  );
}

function LessonRow({ lesson, courseSlug, idx }: { lesson: ApiLesson; courseSlug: string; idx: number }) {
  const hasQuizzes = lesson.quizzes && lesson.quizzes.length > 0;
  const href = lesson.slug ? `/${courseSlug}/${lesson.slug}` : `/lessons/${lesson.id}`;
  const color = COLORS[idx % COLORS.length];
  const emoji = LESSON_EMOJIS[idx % LESSON_EMOJIS.length];
  const done = useContext(DoneLessonsContext).get(lesson.id);
  // Đã đạt (≥50 điểm) → xanh lá; đã làm nhưng chưa đạt → cam "ôn lại".
  const passed = done && done.bestScore >= 50;

  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl kid-card-hover bg-white group"
      style={{
        border: `3px solid ${color.c}`,
        boxShadow: `0 3px 0 ${color.c}55`,
      }}
    >
      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl shrink-0"
        style={{ background: color.bg, border: `2px solid ${color.c}` }}
      >
        {emoji}
      </div>
      <span className="flex-1 min-w-0 break-words text-sm font-bold kid-display leading-snug" style={{ color: color.c }}>
        {lesson.title}
      </span>
      {done ? (
        // Đã học rồi → hiện trạng thái (kể cả trên mobile).
        <span
          className="flex items-center gap-1 shrink-0 rounded-full px-2 py-1 text-xs font-black text-white kid-display"
          style={
            passed
              ? { background: 'linear-gradient(135deg, #6BCB77, #4ECDC4)', boxShadow: '0 2px 0 #0e7490' }
              : { background: 'linear-gradient(135deg, #FF9F45, #FFB84D)', boxShadow: '0 2px 0 #c0392b' }
          }
          title={`Đã học · ${Math.round(done.bestScore)} điểm`}
        >
          {passed ? (
            <>
              <span>✓</span>
              <span className="hidden sm:inline">{'★'.repeat(done.stars)}{'☆'.repeat(3 - done.stars)}</span>
            </>
          ) : (
            <>
              <span>↻</span>
              <span className="hidden sm:inline">Ôn lại</span>
            </>
          )}
        </span>
      ) : hasQuizzes ? (
        <span
          className="hidden sm:flex w-8 h-8 rounded-full text-white text-sm font-black items-center justify-center shrink-0 kid-display"
          style={{ background: 'linear-gradient(135deg, #FF9F45, #FFD93D)', boxShadow: '0 2px 0 #c0392b' }}
        >
          ?
        </span>
      ) : null}
      <span className="hidden sm:inline text-lg shrink-0 opacity-70 group-hover:translate-x-1 transition-transform" style={{ color: color.c }}>→</span>
    </Link>
  );
}
