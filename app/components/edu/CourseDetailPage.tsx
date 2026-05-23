'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { apiFetch, ApiCourse, ApiLesson, ApiVolume, ApiTopic } from '../../lib/api';

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

export default function CourseDetailPage({ slug }: { slug: string }) {
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [lessons, setLessons] = useState<ApiLesson[]>([]);
  const [volumes, setVolumes] = useState<ApiVolume[]>([]);
  const [topics, setTopics] = useState<ApiTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    apiFetch<ApiCourse>(`/courses/slug/${slug}`)
      .then(async (data) => {
        setCourse(data);
        const [lessonList, volList, topicList] = await Promise.all([
          apiFetch<ApiLesson[]>(`/lessons?courseId=${data.id}`),
          apiFetch<ApiVolume[]>(`/volumes?courseId=${data.id}`),
          apiFetch<ApiTopic[]>(`/topics?courseId=${data.id}`),
        ]);
        setLessons(Array.isArray(lessonList) ? lessonList : []);
        setVolumes(Array.isArray(volList) ? volList : []);
        setTopics(Array.isArray(topicList) ? topicList : []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl">📚</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Không tìm thấy khóa học</h1>
        <Link href="/khoa-hoc" className="mt-6 inline-block text-sky-600 hover:underline">← Quay lại thư viện</Link>
      </div>
    );
  }

  const embedUrl = course.videoUrl ? getYouTubeEmbedUrl(course.videoUrl) : null;

  // Sort volumes by sortOrder
  const sortedVolumes = [...volumes].sort((a, b) => a.sortOrder - b.sortOrder);
  const hasVolumes = sortedVolumes.length > 0;

  // Lessons with no volumeId
  const lessonsNoVolume = lessons.filter((l) => !l.volumeId);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-white/80">
          <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <span className="text-white/50">›</span>
          <Link href="/khoa-hoc" className="hover:text-white transition-colors">Khóa học</Link>
          <span className="text-white/50">›</span>
          <span className="text-white font-medium">{course.title}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {/* White content card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h1>

          {/* Description */}
          {(course.description || course.shortDescription) && (
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              {course.description || course.shortDescription}
            </p>
          )}

          {/* Video banner */}
          {(course.thumbnailUrl || course.videoUrl) && (
            <div
              className={`relative rounded-xl overflow-hidden mb-5 bg-gradient-to-r from-blue-600 to-blue-800 ${embedUrl ? 'cursor-pointer' : ''}`}
              onClick={() => embedUrl && setShowVideo(true)}
            >
              <div className="flex items-center h-36 sm:h-44">
                {course.thumbnailUrl ? (
                  <div className="relative h-full w-48 sm:w-64 shrink-0">
                    <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
                  </div>
                ) : null}
                <div className="flex-1 px-6">
                  <div className="flex items-center gap-2 text-white">
                    {embedUrl && (
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-5 h-5 fill-white ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    )}
                    <span className="text-sm sm:text-base font-semibold">Xem video bài giảng {course.title}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exam/test box */}
          {(() => {
            const slug = course.slug ?? '';
            const gradeMatch = slug.match(/lop-?(\d)/);
            const grade = gradeMatch ? gradeMatch[1] : '';
            const subject = slug.includes('toan') ? 'toan' : slug.includes('tieng-viet') ? 'tieng-viet' : slug.includes('tieng-anh') ? 'tieng-anh' : '';
            const href = subject && grade ? `/de-thi?subject=${subject}&grade=${grade}` : '/de-thi';
            return (
              <Link href={href} className="block rounded-xl border border-green-200 bg-green-50 p-4 hover:bg-green-100 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📝</div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-green-900 text-sm group-hover:underline">Đề kiểm tra {course.title}</h2>
                    <p className="text-xs text-green-700 mt-1">Các đề kiểm tra và bài tập ôn luyện theo chủ đề của khóa học.</p>
                  </div>
                  <span className="text-green-600 text-sm font-bold shrink-0 mt-0.5">→</span>
                </div>
              </Link>
            );
          })()}
        </div>

        {/* Lesson list */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          {hasVolumes ? (
            <div className={`grid gap-8 ${sortedVolumes.length >= 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
              {sortedVolumes.map((vol) => {
                const volLessons = lessons.filter((l) => Number(l.volumeId) === Number(vol.id));
                const volTopics = topics.filter((t) => Number(t.volumeId) === Number(vol.id));
                return (
                  <VolumeColumn
                    key={vol.id}
                    volumeTitle={vol.name}
                    lessons={volLessons}
                    topics={volTopics}
                    courseSlug={slug}
                  />
                );
              })}
              {lessonsNoVolume.length > 0 && (
                <div className="md:col-span-2">
                  <TopicGroup lessons={lessonsNoVolume} topics={topics.filter((t) => !t.volumeId)} courseSlug={slug} />
                </div>
              )}
            </div>
          ) : (
            <TopicGroup lessons={lessons} topics={topics} courseSlug={slug} />
          )}
        </div>
      </div>

      {/* YouTube Modal */}
      {showVideo && embedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowVideo(false)} className="absolute -top-10 right-0 text-white text-2xl font-bold">×</button>
            <div className="aspect-video w-full rounded-xl overflow-hidden">
              <iframe src={embedUrl} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function groupLessonsByTopic(lessons: ApiLesson[], topics: ApiTopic[]) {
  // Normalize ids to number to avoid bigint string mismatch from MySQL
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

function VolumeColumn({ volumeTitle, lessons, topics, courseSlug }: {
  volumeTitle: string; lessons: ApiLesson[]; topics: ApiTopic[]; courseSlug: string;
}) {
  const { byTopic, topicMap, orderedTopicIds } = groupLessonsByTopic(lessons, topics);

  return (
    <div>
      <h2 className="text-base font-bold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-2 mb-4">
        {volumeTitle}
      </h2>
      {orderedTopicIds.map((topicId) => (
        <TopicSection
          key={topicId ?? 'no-topic'}
          topicName={topicId !== null ? (topicMap.get(topicId)?.name ?? '') : ''}
          lessons={byTopic.get(topicId) ?? []}
          courseSlug={courseSlug}
        />
      ))}
    </div>
  );
}

function TopicGroup({ lessons, topics, courseSlug }: { lessons: ApiLesson[]; topics: ApiTopic[]; courseSlug: string }) {
  const { byTopic, topicMap, orderedTopicIds } = groupLessonsByTopic(lessons, topics);
  return (
    <>
      {orderedTopicIds.map((topicId) => (
        <TopicSection
          key={topicId ?? 'no-topic'}
          topicName={topicId !== null ? (topicMap.get(topicId)?.name ?? '') : ''}
          lessons={byTopic.get(topicId) ?? []}
          courseSlug={courseSlug}
        />
      ))}
    </>
  );
}

function TopicSection({ topicName, lessons, courseSlug }: { topicName: string; lessons: ApiLesson[]; courseSlug: string }) {
  return (
    <div className="mb-5">
      {topicName && (
        <h3 className="text-base font-bold text-gray-800 mb-2">{topicName}</h3>
      )}
      {lessons.map((lesson) => (
        <LessonRow key={lesson.id} lesson={lesson} courseSlug={courseSlug} />
      ))}
    </div>
  );
}

function LessonRow({ lesson }: { lesson: ApiLesson; courseSlug: string }) {
  const hasQuizzes = lesson.quizzes && lesson.quizzes.length > 0;
  const href = lesson.slug ? `/${lesson.slug}` : `/lessons/${lesson.id}`;

  return (
    <Link href={href} className="flex items-center gap-2.5 py-1.5 px-1 hover:bg-gray-50 rounded group">
      <svg className="w-5 h-5 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14v-4zM5 8h8a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2z" />
      </svg>
      <span className="flex-1 text-sm text-blue-700 group-hover:underline leading-snug">{lesson.title}</span>
      {hasQuizzes && (
        <span className="w-6 h-6 rounded-full bg-orange-400 text-white text-xs font-bold flex items-center justify-center shrink-0">?</span>
      )}
    </Link>
  );
}
