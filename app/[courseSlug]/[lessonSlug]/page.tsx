import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import LessonDetailPage from '../../components/edu/LessonDetailPage';
import QuizPlayPage from '../../components/edu/QuizPlayPage';
import { parseExerciseParam } from '../../lib/quiz-slug';

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com').replace(/\/$/, '');

// Route 2 cấp gộp:
//   /{courseSlug}/{lessonSlug}             → trang bài học (SEO).
//   /{lessonSlug}/{lessonSlug}-{diff}.html → trang làm bài (quiz) — giữ nguyên như cũ.
// Phân biệt bằng đuôi ".html" của segment thứ 2.
type Props = { params: Promise<{ courseSlug: string; lessonSlug: string }> };

// Quiz sau khi rewrite bỏ ".html": /{lessonSlug}/{lessonSlug}-{diff}.
// Nhận diện: segment 2 tách được đuôi -de/-trung-binh/-nang-cao VÀ phần gốc == segment 1.
function normalizeSlug(value: string): string {
  try {
    return decodeURIComponent(value).replace(/\.html$/i, '').replace(/^\/+|\/+$/g, '');
  } catch {
    return value.replace(/\.html$/i, '').replace(/^\/+|\/+$/g, '');
  }
}

function parseQuizRoute(seg1: string, seg2: string) {
  const lessonSegment = normalizeSlug(seg1);
  const exerciseSegment = normalizeSlug(seg2);
  const parsed = parseExerciseParam(exerciseSegment);
  return parsed && normalizeSlug(parsed.lessonSlug) === lessonSegment
    ? { ...parsed, lessonSlug: lessonSegment }
    : null;
}


const DIFF_LABEL: Record<string, string> = {
  easy: 'Bài tập cơ bản', medium: 'Bài tập trung bình', hard: 'Bài tập nâng cao',
};
// Ánh xạ mức độ → slug phiếu bài tập in được (/phieu-bai-tap/{slug}/{muc}).
const WORKSHEET_MUC: { diff: string; muc: string; label: string; emoji: string }[] = [
  { diff: 'easy', muc: 'de', label: 'Cơ bản', emoji: '🌱' },
  { diff: 'medium', muc: 'trung-binh', label: 'Trung bình', emoji: '🌿' },
  { diff: 'hard', muc: 'nang-cao', label: 'Nâng cao', emoji: '🌳' },
];

type Lesson = {
  id: number; title: string; slug: string; courseId?: number; topicId?: number;
  shortDescription?: string; description?: string; content?: string; seoDescription?: string;
  topicName?: string; volume?: string; durationMinutes?: number; videoUrl?: string;
  course?: {
    id?: number; title: string; slug: string; courseType?: string;
    shortDescription?: string; description?: string;
    targetAgeMin?: number; targetAgeMax?: number;
  };
};
type Sibling = { id: number; slug: string; title: string; sortOrder?: number; topicId?: number; isPublished?: boolean };

async function fetchLesson(slug: string): Promise<Lesson | null> {
  try {
    const res = await fetch(`${API}/api/lessons/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as Lesson;
  } catch { return null; }
}
async function fetchSiblings(courseId?: number): Promise<Sibling[]> {
  if (!courseId) return [];
  try {
    const res = await fetch(`${API}/api/lessons?courseId=${courseId}&slim=1`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json: unknown = await res.json();
    const list = Array.isArray(json)
      ? json
      : (json && typeof json === 'object' && Array.isArray((json as { data?: unknown[] }).data)
        ? (json as { data: Sibling[] }).data
        : []);
    return (list as Sibling[])
      .filter((l) => l.isPublished !== false)
      .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER) || a.id - b.id);
  } catch { return []; }
}

// ── Nội dung RIÊNG từng bài: lấy câu hỏi luyện tập thật của chính bài (chống trùng template) ──
const QTYPE_LABEL: Record<string, string> = {
  fill_blank: 'điền vào chỗ trống',
  multiple_choice: 'trắc nghiệm nhiều lựa chọn',
  multiple_select: 'chọn nhiều đáp án',
  single_choice: 'trắc nghiệm',
  matching: 'nối',
  ordering: 'sắp xếp thứ tự',
  sorting: 'sắp xếp',
  counting: 'đếm hình',
  true_false: 'đúng / sai',
  drag_drop: 'kéo thả',
};

type QuizSample = { q: string; explanation?: string };

function stripHtml(value?: string): string {
  return (value || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanQuestionText(t?: string): string {
  return stripHtml(t)
    .replace(/\[b\d+\]|\[blank\]|\[_+\]/gi, '___') // marker chỗ trống → ___
    .replace(/\s*\n\s*/g, ' ')
    .trim();
}

function serializeJsonLd(value: unknown): string {
  // Prevent user/API text containing "</script>" from breaking out of the JSON-LD script tag.
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

async function fetchQuizSamples(lessonId?: number): Promise<{ samples: QuizSample[]; typeLabels: string[]; difficulties: string[] }> {
  if (!lessonId) return { samples: [], typeLabels: [], difficulties: [] };
  try {
    // limit=200: lấy hết câu của bài (mặc định API chỉ trả 20/trang → dễ dính câu cũ).
    const res = await fetch(`${API}/api/quizzes?lessonId=${lessonId}&limit=200`, { next: { revalidate: 3600 } });
    if (!res.ok) return { samples: [], typeLabels: [], difficulties: [] };
    const json: unknown = await res.json();
    const list = (
      Array.isArray(json)
        ? json
        : json && typeof json === 'object'
          ? (
              Array.isArray((json as { data?: unknown }).data)
                ? (json as { data: unknown[] }).data
                : Array.isArray((json as { items?: unknown }).items)
                  ? (json as { items: unknown[] }).items
                  : []
            )
          : []
    ) as {
      questionText?: string; explanation?: string; questionType?: string; difficultyLevel?: string; isActive?: boolean | number;
    }[];

    // CHỈ dùng câu đã xuất bản (isActive). Câu cũ (isActive=0) hay lệch chủ đề → không được làm mẫu.
    const active = list.filter((q) => q.isActive === true || q.isActive === 1);

    const typeLabels = [...new Set(active.map((q) => q.questionType).filter(Boolean) as string[])]
      .map((t) => QTYPE_LABEL[t]).filter(Boolean);
    // Mức độ có câu hỏi thật (để chỉ hiện phiếu tương ứng, không tạo link 404).
    const present = new Set(active.map((q) => q.difficultyLevel).filter(Boolean) as string[]);
    const difficulties = ['easy', 'medium', 'hard'].filter((d) => present.has(d));

    // Ưu tiên mỗi dạng bài 1 câu (đa dạng), câu có chữ rõ ràng, tránh trùng.
    const seen = new Set<string>();
    const byType = new Map<string, QuizSample>();
    for (const q of active) {
      const text = cleanQuestionText(q.questionText);
      if (text.length < 6 || seen.has(text)) continue;
      seen.add(text);
      const key = q.questionType || 'x';
      if (!byType.has(key)) byType.set(key, { q: text, explanation: stripHtml(q.explanation) || undefined });
    }
    const samples = [...byType.values()];
    // Bổ sung cho đủ ~4 câu nếu ít dạng.
    for (const q of active) {
      if (samples.length >= 4) break;
      const text = cleanQuestionText(q.questionText);
      if (text.length < 6 || samples.some((s) => s.q === text)) continue;
      samples.push({ q: text, explanation: stripHtml(q.explanation) || undefined });
    }
    return { samples: samples.slice(0, 4), typeLabels, difficulties };
  } catch {
    return { samples: [], typeLabels: [], difficulties: [] };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;

  // ── QUIZ (segment 2 kết thúc .html) ──
  const quizRoute = parseQuizRoute(courseSlug, lessonSlug);
  if (quizRoute) {
    const parsed = quizRoute;
    const lesson = await fetchLesson(courseSlug); // ở URL quiz, segment 1 chính là lessonSlug
    const diffLabel = parsed ? DIFF_LABEL[parsed.difficulty] ?? 'Bài tập' : 'Bài tập';
    const lessonTitle = lesson?.title ?? courseSlug;
    const title = `${diffLabel} - ${lessonTitle}`;
    const description = `Luyện tập ${diffLabel.toLowerCase()} cho bài "${lessonTitle}" với các câu hỏi tương tác vui nhộn dành cho bé tại Bé Hay Học.`;
    const url = `${SITE}/${courseSlug}/${lessonSlug}`;
    return {
      title, description, alternates: { canonical: url }, robots: { index: false },
      openGraph: { title, description, url, siteName: 'Bé Hay Học', locale: 'vi_VN', images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630 }] },
    };
  }

  // ── LESSON DETAIL ──
  const lesson = await fetchLesson(normalizeSlug(lessonSlug));
  if (!lesson) {
    return {
      title: 'Không tìm thấy bài học',
      description: 'Bài học không tồn tại hoặc đã được chuyển sang địa chỉ khác.',
      robots: { index: false, follow: false },
    };
  }
  // Layout gốc đã có template "%s | Bé Hay Học" → KHÔNG thêm brand vào title (tránh lặp).
  // Kết quả <title>: "Bài 1: Các số 0 đến 5 – Toán lớp 1 | Bé Hay Học".
  const title = `${lesson.title}${lesson.course ? ` – ${lesson.course.title}` : ''}`;
  const ogTitle = `${title} | Bé Hay Học`; // OG/Twitter là tag riêng, template không áp → thêm brand ở đây.
  const rawDesc = lesson.seoDescription || lesson.shortDescription || lesson.description
    || `Luyện tập bài "${lesson.title}" với bài tập tương tác và trò chơi giáo dục dành cho bé tại Bé Hay Học.`;
  const cleanDesc = stripHtml(rawDesc);
  // Meta description gọn ~160 ký tự (seoDescription trong DB thường dài 300–450 ký tự).
  const description = cleanDesc.length > 160 ? `${cleanDesc.slice(0, 157)}…` : cleanDesc;
  const canonicalCourseSlug = lesson.course?.slug || normalizeSlug(courseSlug);
  const canonicalLessonSlug = lesson.slug || normalizeSlug(lessonSlug);
  const url = `${SITE}/${canonicalCourseSlug}/${canonicalLessonSlug}`;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title: ogTitle, description, url, type: 'article', siteName: 'Bé Hay Học', locale: 'vi_VN', images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630, alt: ogTitle }] },
    twitter: { card: 'summary_large_image', title: ogTitle, description, images: [`${SITE}/og-home.jpg`] },
  };
}

function buildSeo(lesson: Lesson, typeLabels: string[] = []) {
  const t = lesson.title;
  const course = lesson.course;
  const ageMin = course?.targetAgeMin;
  const ageMax = course?.targetAgeMax;
  const dur = lesson.durationMinutes || 15;
  const ageText = ageMin && ageMax ? `bé ${ageMin}–${ageMax} tuổi` : 'bé tiểu học';
  const gradeMatch = course?.title?.match(/lớp\s*(\d+)/i);
  const gradeText = gradeMatch ? `lớp ${gradeMatch[1]}` : '';
  // KHÔNG đổ nguyên lesson.content (có thể là cả bài văn dài → lặp nội dung ở intro).
  // Chỉ dùng content làm fallback dạng đoạn dẫn ngắn (~200 ký tự) khi thiếu mọi mô tả.
  const contentLead = lesson.content ? stripHtml(lesson.content).slice(0, 200).trim() : '';
  const intro = stripHtml(
    lesson.seoDescription || lesson.shortDescription || lesson.description
      || (contentLead
        ? `${contentLead}${contentLead.length >= 200 ? '…' : ''}`
        : `${t} là bài học tương tác dành cho ${ageText}${course ? `, thuộc khóa ${course.title}` : ''} tại Bé Hay Học.`)
  );
  const typesPhrase = typeLabels.length
    ? typeLabels.slice(0, 5).join(', ')
    : 'trắc nghiệm, điền vào chỗ trống, nối từ và sắp xếp câu';
  // KHÔNG dùng lesson.content trực tiếp (tránh nhét cả bài văn vào mục tiêu học tập).
  const willLearn = [
    `Hiểu và nắm vững kiến thức trọng tâm của bài "${t}".`,
    `Luyện tập với các dạng bài có trong bài này: ${typesPhrase} — có phản hồi đúng/sai tức thì.`,
    `Biết vận dụng kiến thức của bài để trả lời câu hỏi và ôn lại những câu làm sai để nhớ lâu hơn.`,
  ];
  const faqs = [
    { q: `Bài "${t}" dành cho bé lớp mấy?`, a: `Bài học phù hợp với ${ageText}${gradeText ? `, tương ứng ${gradeText}` : ''}${course ? `, nằm trong khóa "${course.title}"${course.shortDescription ? ` — ${course.shortDescription}` : ''}` : ''}.` },
    { q: `Học bài "${t}" mất bao lâu?`, a: `Bài học kéo dài khoảng ${dur} phút, chia thành 3 mức độ từ dễ đến nâng cao. Bé có thể học lại nhiều lần hoàn toàn miễn phí để nắm chắc kiến thức.` },
    { q: `Bài "${t}" có những dạng bài tập nào?`, a: `${typeLabels.length ? `Bài gồm các dạng bài tập tương tác: ${typeLabels.slice(0, 6).join(', ')}.` : 'Bài gồm nhiều dạng bài tập tương tác như trắc nghiệm, điền vào chỗ trống, nối từ và sắp xếp câu.'} Sau khi làm, bé được xem đáp án đúng, giải thích và ôn lại những câu còn sai.` },
  ];
  return { intro, willLearn, faqs, dur, ageText };
}

// ── "Lỗi bé thường mắc" + "Gợi ý cho cha mẹ" — chọn theo DẠNG KỸ NĂNG thật của bài,
//    không name-swap. Phân loại từ tiêu đề + nội dung + tên khóa. ──────────────────
function buildGuide(lesson: Lesson): { mistakes: string[]; tips: string[] } {
  const s = `${lesson.title} ${lesson.content ?? ''} ${lesson.course?.title ?? ''}`.toLowerCase();
  const has = (...ks: string[]) => ks.some((k) => s.includes(k));

  // ----- Tiếng Việt -----
  if (has('chính tả')) return {
    mistakes: ['Lẫn các âm/vần gần giống khi viết: s/x, ch/tr, d/gi/r, dấu hỏi/dấu ngã.', 'Viết thiếu hoặc sai dấu thanh khiến từ đổi nghĩa.', 'Nghe đúng nhưng viết sai do chưa quen mặt chữ.'],
    tips: ['Đọc thật rõ từng tiếng cho bé nghe rồi mới viết; nhấn vào chỗ dễ sai.', 'Cho bé viết lại 2–3 lần những từ hay nhầm, kèm một câu ví dụ.', 'Biến thành trò "đọc – viết – kiểm tra": bố mẹ đọc, bé viết, cùng soát lỗi.'],
  };
  if (has('vần')) return {
    mistakes: ['Nhầm các vần gần giống nhau (an/ăn/ân, on/ôn/ơn, ai/ay/ây…).', 'Đọc thiếu dấu thanh hoặc ghép sai âm đầu với vần.', 'Nhận ra vần khi đọc nhưng lúng túng khi tự ghép thành từ.'],
    tips: ['Cho bé đọc to, tay chỉ vào từng chữ để mắt và tai đi cùng nhau.', 'Tìm thêm 3–4 từ quen thuộc chứa vần vừa học để bé liên hệ.', 'So sánh cặp vần dễ lẫn cạnh nhau (an – ăn) để bé thấy khác biệt.'],
  };
  if (has('chữ cái', 'bảng chữ', 'âm ', 'tập viết', 'nét')) return {
    mistakes: ['Lẫn các chữ hình gần giống: b/d, p/q, m/n.', 'Viết sai thứ tự nét hoặc chữ to nhỏ không đều.', 'Nhớ mặt chữ nhưng chưa nhớ âm đọc tương ứng.'],
    tips: ['Cho bé tô/viết theo nét mẫu, vừa viết vừa đọc thành tiếng.', 'Dùng thẻ chữ, chỉ nhanh để bé gọi tên — chơi 5 phút mỗi ngày.', 'Gắn mỗi chữ với một hình quen thuộc (a – quả táo) để bé nhớ lâu.'],
  };
  if (has('bài đọc', 'văn bản', 'kể chuyện', 'đọc hiểu', 'câu chuyện', 'bài thơ', 'đọc bài')) return {
    mistakes: ['Đọc quá nhanh nên bỏ sót chi tiết, không nắm ý chính.', 'Trả lời theo cảm tính, chưa dựa vào nội dung bài.', 'Chưa quen kể lại truyện theo đúng trình tự.'],
    tips: ['Cho bé đọc chậm, dừng lại hỏi "điều gì vừa xảy ra?".', 'Hỏi 2–3 câu về nhân vật, sự việc để bé đọc lại và tìm câu trả lời.', 'Khuyến khích bé kể lại bài bằng lời của mình sau khi đọc.'],
  };

  // ----- Toán -----
  // Bảng nhân/chia đặt TRƯỚC để không bị nhánh cộng/trừ/số bắt nhầm.
  if (has('bảng nhân', 'bảng chia', 'phép nhân', 'phép chia')) return {
    mistakes: [
      'Nhầm kết quả giữa các bảng nhân gần nhau.',
      'Thuộc phép nhân nhưng chưa liên hệ được với phép chia tương ứng.',
      'Đổi vị trí số bị chia và số chia khi làm phép tính.',
    ],
    tips: [
      'Cho bé đọc từng cặp phép tính liên quan: 6 × 4 = 24, 24 : 6 = 4.',
      'Luyện theo nhóm nhỏ 3–4 phép tính thay vì học cả bảng một lần.',
      'Dùng que tính hoặc nhóm đồ vật để bé hiểu bản chất nhân và chia.',
    ],
  };
  if (has('cộng', 'phép cộng')) return {
    mistakes: ['Đếm nhầm hoặc đếm lặp khi cộng.', 'Quên "nhớ" hoặc cộng thiếu một số hạng.', 'Nhầm phép cộng với phép trừ khi nhìn dấu vội.'],
    tips: ['Dùng đồ vật thật (kẹo, que tính) để bé cộng bằng tay trước.', 'Cho bé đọc to phép tính và chỉ vào dấu "+" trước khi làm.', 'Luyện các phép quen thuộc đến khi bé nhẩm nhanh, rồi mới tăng độ khó.'],
  };
  if (has('trừ', 'phép trừ')) return {
    mistakes: ['Đếm ngược bị nhầm hoặc trừ ngược thứ tự số.', 'Nhầm dấu "−" với dấu "+".', 'Lúng túng khi số bị trừ nhỏ hơn số trừ.'],
    tips: ['Cho bé bớt đồ vật thật để "thấy" phép trừ.', 'Nhắc bé đọc kỹ dấu và số lớn – số nhỏ trước khi tính.', 'Gắn với tình huống thật: "có 5 quả, ăn 2 quả, còn mấy?".'],
  };
  if (has('so sánh', 'lớn hơn', 'bé hơn', 'nhiều hơn', 'ít hơn')) return {
    mistakes: ['Nhầm chiều của dấu lớn hơn (>) và bé hơn (<).', 'So sánh sai khi hai số gần nhau.', 'Đọc "lớn hơn/bé hơn" nhưng chọn dấu ngược lại.'],
    tips: ['Mẹo "miệng cá sấu" há về phía số lớn hơn để bé nhớ dấu.', 'Cho bé so sánh số lượng đồ vật thật trước khi so sánh số.', 'Đọc to cả câu "3 bé hơn 5" để khớp lời với dấu.'],
  };
  if (has('số', 'đếm', 'chữ số')) return {
    mistakes: ['Đếm bỏ sót hoặc đếm lặp một vật.', 'Nhầm mặt số gần giống (6/9, 2/5).', 'Đọc được số nhưng chưa gắn với đúng số lượng.'],
    tips: ['Cho bé chỉ tay vào từng vật khi đếm, đếm chậm và rõ.', 'Luyện nhận mặt số qua thẻ số và đồ vật hằng ngày.', 'Chơi "đếm quanh nhà" (mấy cái ghế, mấy đôi dép?) để số gắn với thực tế.'],
  };
  if (has('hình', 'tam giác', 'hình tròn', 'hình vuông', 'khối')) return {
    mistakes: ['Lẫn các hình gần giống (vuông – chữ nhật).', 'Đếm nhầm số cạnh, số góc của hình.', 'Chỉ nhận ra hình ở một hướng đặt quen thuộc.'],
    tips: ['Tìm hình trong đồ vật quanh nhà (cửa sổ vuông, đồng hồ tròn).', 'Cho bé sờ và đếm cạnh/góc của vật thật.', 'Xoay hình ở nhiều hướng để bé nhận ra dù đặt khác nhau.'],
  };

  // ----- Tiếng Anh -----
  if (has('tiếng anh', 'lớp 1 - unit', 'unit ', 'drinks', 'colour', 'color')) return {
    mistakes: ['Phát âm chưa chuẩn hoặc nhầm nghĩa từ mới.', 'Nhớ mặt chữ nhưng chưa nghe – nói được từ.', 'Nhầm trật tự từ trong mẫu câu ngắn.'],
    tips: ['Cho bé nghe và nhắc lại theo audio, mỗi từ vài lần.', 'Ôn từ qua thẻ hình và trò "chỉ vào đồ vật – gọi tên tiếng Anh".', 'Luyện mẫu câu bằng hội thoại vui giữa bố mẹ và bé.'],
  };

  // ----- Mặc định (ôn tập / bài chung) -----
  return {
    mistakes: ['Làm nhanh nên bỏ sót yêu cầu của đề.', 'Nhớ chưa chắc kiến thức của bài trước nên dễ nhầm.', 'Nản khi gặp câu khó thay vì thử lại.'],
    tips: ['Nhắc bé đọc kỹ đề, làm chậm ở những câu dễ nhầm.', 'Cùng bé xem lại các câu làm sai và giải thích ngắn gọn.', 'Khen ngợi nỗ lực để bé giữ hứng thú, học lại nhiều lần miễn phí.'],
  };
}

export default async function Page({ params }: Props) {
  const { courseSlug, lessonSlug } = await params;

  // ── QUIZ ──
  const quizRoute = parseQuizRoute(courseSlug, lessonSlug);
  if (quizRoute) {
    return (
      <QuizPlayPage
        lessonSlug={quizRoute.lessonSlug}
        difficulty={quizRoute.difficulty as 'easy' | 'medium' | 'hard'}
      />
    );
  }

  // ── LESSON DETAIL ──
  const normalizedLessonSlug = normalizeSlug(lessonSlug);
  const lesson = await fetchLesson(normalizedLessonSlug);
  if (!lesson) notFound();

  // Sai khóa trong URL → 301 về đúng /{course}/{lesson}
  const courseSeg = lesson.course?.slug;
  if (courseSeg && courseSeg !== courseSlug) permanentRedirect(`/${courseSeg}/${lesson.slug}`);

  const cSlug = courseSeg || courseSlug;
  const url = `${SITE}/${cSlug}/${lesson.slug}`;
  const lessonHref = (s: string) => `/${cSlug}/${s}`;

  const resolvedCourseId = lesson.courseId ?? lesson.course?.id;
  const [quiz, siblings] = await Promise.all([
    fetchQuizSamples(lesson.id),
    fetchSiblings(resolvedCourseId),
  ]);
  const seo = buildSeo(lesson, quiz.typeLabels);
  const guide = buildGuide(lesson);
  const idx = siblings.findIndex((s) => s.slug === lesson.slug);
  const prevLesson = idx > 0 ? siblings[idx - 1] : null;
  const nextLesson = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;
  const navSlugs = new Set([lesson.slug, prevLesson?.slug, nextLesson?.slug].filter(Boolean));
  const related = siblings
    .filter((s) => !navSlugs.has(s.slug) && lesson.topicId != null && s.topicId === lesson.topicId)
    .slice(0, 4);

  const learningLd = {
    '@context': 'https://schema.org', '@type': 'LearningResource',
    name: lesson.title, description: lesson.seoDescription || lesson.description || seo.intro,
    url, inLanguage: 'vi-VN', educationalLevel: 'Tiểu học', timeRequired: `PT${seo.dur}M`,
    isPartOf: lesson.course ? { '@type': 'Course', name: lesson.course.title, url: `${SITE}/khoa-hoc/${lesson.course.slug}` } : undefined,
    provider: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
  };
  // Không khai báo FAQPage schema: 3 câu FAQ dùng chung cấu trúc trên hàng trăm bài
  // → tránh rủi ro "generic FAQ schema at scale". FAQ vẫn hiển thị cho người đọc (text on-page).
  const videoLd = lesson.videoUrl ? {
    '@context': 'https://schema.org', '@type': 'VideoObject',
    name: lesson.title, description: seo.intro, contentUrl: lesson.videoUrl, embedUrl: lesson.videoUrl,
    thumbnailUrl: [`${SITE}/og-home.jpg`],
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(learningLd) }} />
      {videoLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(videoLd) }} />}

      <LessonDetailPage lessonSlug={lesson.slug} />

      <section className="mx-auto w-full max-w-3xl px-4 pb-16 pt-2">
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 px-6 py-4">
            <h1 className="text-lg font-black text-white flex items-center gap-2"><span>📖</span> {lesson.title}</h1>
            <p className="mt-0.5 text-sm text-white/90">Giới thiệu &amp; hướng dẫn học bài{lesson.course ? ` · ${lesson.course.title}` : ''}</p>
          </div>
          <div className="px-6 py-6 space-y-6 text-slate-700">
            <p className="text-[15px] leading-7">{seo.intro}</p>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><span>🎯</span> Bé sẽ học được gì?</h3>
              <ul className="space-y-2">
                {seo.willLearn.map((item, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-7">
                    <span className="shrink-0 mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {quiz.samples.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><span>✏️</span> Ví dụ câu hỏi trong bài</h3>
                <ul className="space-y-3">
                  {quiz.samples.map((s, i) => (
                    <li key={i} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                      <p className="text-[15px] leading-7 font-semibold text-slate-800">{s.q}</p>
                      {s.explanation && <p className="mt-1 text-sm leading-7 text-slate-500">💡 {s.explanation}</p>}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-slate-500">Và nhiều câu khác trong 3 mức độ — bé luyện trực tiếp ngay trong bài, hoàn toàn miễn phí.</p>
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><span>🪜</span> Ba mức độ luyện tập</h3>
              <ul className="space-y-2 text-[15px] leading-7">
                <li>🌱 <strong>Làm quen (Dễ):</strong> nhận biết và ghi nhớ kiến thức cơ bản của bài, câu hỏi nhẹ nhàng để bé tự tin bắt đầu.</li>
                <li>🌿 <strong>Luyện tập (Trung bình):</strong> vận dụng kiến thức vừa học vào nhiều dạng bài tập đa dạng hơn.</li>
                <li>🌳 <strong>Thử thách (Nâng cao):</strong> tổng hợp và mở rộng, giúp bé thành thạo và nhớ lâu.</li>
              </ul>
            </div>
            {quiz.difficulties.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2"><span>📄</span> Phiếu bài tập &amp; đáp án (in / tải PDF)</h3>
                <p className="text-sm text-slate-500 mb-3">Bấm để mở phiếu, rồi chọn <strong>🖨 In / Tải PDF</strong>. Mỗi mức có kèm bản đáp án cho cha mẹ.</p>
                <ul className="space-y-2">
                  {/* Phiếu gộp cả bài (toàn bộ 3 mức) — in một lần đủ cả bài */}
                  <li className="flex flex-wrap items-center gap-2 rounded-2xl bg-sky-50 px-4 py-3 ring-1 ring-sky-100">
                    <span className="text-[15px] font-semibold text-slate-800">📘 Phiếu cả bài <span className="font-normal text-slate-500">(đầy đủ 3 mức)</span></span>
                    <span className="flex-1" />
                    <Link href={`/phieu-bai-tap/${lesson.slug}/ca-bai`} className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-blue-700">📄 Tải phiếu</Link>
                    <Link href={`/phieu-bai-tap/${lesson.slug}/ca-bai?dapan=1`} className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100">✅ Đáp án</Link>
                  </li>
                  {WORKSHEET_MUC.filter((m) => quiz.difficulties.includes(m.diff)).map((m) => (
                    <li key={m.muc} className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                      <span className="text-[15px] font-semibold text-slate-800">{m.emoji} Phiếu {m.label}</span>
                      <span className="flex-1" />
                      <Link href={`/phieu-bai-tap/${lesson.slug}/${m.muc}`} className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-blue-700">📄 Tải phiếu</Link>
                      <Link href={`/phieu-bai-tap/${lesson.slug}/${m.muc}?dapan=1`} className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100">✅ Đáp án</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><span>⚠️</span> Lỗi bé thường mắc</h3>
              <ul className="space-y-2">
                {guide.mistakes.map((item, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-7">
                    <span className="shrink-0 mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">!</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-blue-50/60 px-5 py-4 ring-1 ring-blue-100">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><span>👨‍👩‍👧</span> Gợi ý cho cha mẹ</h3>
              <ul className="space-y-2">
                {guide.tips.map((item, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-7">
                    <span className="shrink-0 mt-1 text-blue-500">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><span>❓</span> Câu hỏi thường gặp</h3>
              <div className="space-y-3">
                {seo.faqs.map((f, i) => (
                  <details key={i} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                    <summary className="cursor-pointer font-semibold text-slate-900 list-none flex items-center justify-between gap-2"><span>{f.q}</span><span className="text-slate-400 text-sm">＋</span></summary>
                    <p className="mt-2 text-[15px] leading-7 text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
            {lesson.course && (
              <p className="text-sm text-slate-500 pt-2 border-t border-slate-100">
                Bài học nằm trong khóa{' '}
                <Link href={`/khoa-hoc/${lesson.course.slug}`} className="font-semibold text-blue-600 hover:underline">{lesson.course.title}</Link>{' '}
                — {seo.ageText}. Tất cả bài học tại Bé Hay Học đều miễn phí và học lại được nhiều lần.
              </p>
            )}
          </div>
        </div>

        {(prevLesson || nextLesson) && (
          <nav className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Điều hướng bài học">
            {prevLesson ? (
              <Link href={lessonHref(prevLesson.slug)} className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100 transition hover:ring-blue-200">
                <span className="shrink-0 text-xl text-blue-500 group-hover:-translate-x-0.5 transition">‹</span>
                <span className="min-w-0"><span className="block text-xs text-slate-400">Bài trước</span><span className="block truncate font-semibold text-slate-800">{prevLesson.title}</span></span>
              </Link>
            ) : <span className="hidden sm:block" />}
            {nextLesson && (
              <Link href={lessonHref(nextLesson.slug)} className="group flex items-center justify-end gap-3 rounded-2xl bg-white px-4 py-3 text-right shadow-sm ring-1 ring-slate-100 transition hover:ring-blue-200">
                <span className="min-w-0"><span className="block text-xs text-slate-400">Bài tiếp theo</span><span className="block truncate font-semibold text-slate-800">{nextLesson.title}</span></span>
                <span className="shrink-0 text-xl text-blue-500 group-hover:translate-x-0.5 transition">›</span>
              </Link>
            )}
          </nav>
        )}

        {related.length > 0 && (
          <div className="mt-5 rounded-3xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-3 text-base font-bold text-slate-900 flex items-center gap-2"><span>🔗</span> Bài học cùng chủ đề</h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={lessonHref(r.slug)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-[15px] text-slate-700 ring-1 ring-slate-100 transition hover:bg-blue-50 hover:text-blue-700">
                    <span className="text-blue-400">📄</span><span className="truncate">{r.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
