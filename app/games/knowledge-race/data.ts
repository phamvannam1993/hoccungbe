export type GradeLevel = '1' | '2' | '3' | '4' | '5';

export type RaceObstacle = 'rock' | 'cones' | 'oil' | 'crate';

export type RaceAnswer = {
  id: string;
  label: string;
  imageUrl?: string;
};

export type RaceQuestion = {
  id: string;
  prompt: string;
  imageUrl?: string;
  answers: RaceAnswer[];
  correctAnswerId: string;
  hint: string;
  skill: string;
  obstacle: RaceObstacle;
};

type RawQuestion = {
  id: string;
  prompt: string;
  correct: string;
  distractors: [string, string, string];
  hint: string;
  skill: string;
  obstacle: RaceObstacle;
};

export const GRADE_OPTIONS: { value: GradeLevel; label: string; subtitle: string }[] = [
  { value: '1', label: 'Lớp 1', subtitle: 'Số và cộng trừ trong phạm vi 20' },
  { value: '2', label: 'Lớp 2', subtitle: 'Cộng trừ trong phạm vi 100' },
  { value: '3', label: 'Lớp 3', subtitle: 'Nhân chia và số có ba chữ số' },
  { value: '4', label: 'Lớp 4', subtitle: 'Số lớn, phân số và hình học' },
  { value: '5', label: 'Lớp 5', subtitle: 'Số thập phân và phần trăm' },
];

const QUESTION_BANK: Record<GradeLevel, RawQuestion[]> = {
  '1': [
    { id: 'g1-01', prompt: '3 + 4 = ?', correct: '7', distractors: ['6', '8', '9'], hint: 'Đếm tiếp 4 số sau số 3.', skill: 'Phép cộng', obstacle: 'rock' },
    { id: 'g1-02', prompt: '9 - 5 = ?', correct: '4', distractors: ['3', '5', '6'], hint: 'Bớt 5 khỏi 9.', skill: 'Phép trừ', obstacle: 'cones' },
    { id: 'g1-03', prompt: 'Số nào lớn hơn 7?', correct: '9', distractors: ['4', '6', '7'], hint: 'Số lớn hơn nằm sau 7 trên tia số.', skill: 'So sánh số', obstacle: 'oil' },
    { id: 'g1-04', prompt: '6 + 2 = ?', correct: '8', distractors: ['7', '9', '10'], hint: 'Từ 6 đếm thêm 2 bước.', skill: 'Phép cộng', obstacle: 'crate' },
    { id: 'g1-05', prompt: '10 - 3 = ?', correct: '7', distractors: ['6', '8', '9'], hint: 'Bớt lần lượt 3 đơn vị khỏi 10.', skill: 'Phép trừ', obstacle: 'rock' },
    { id: 'g1-06', prompt: 'Số liền sau của 14 là?', correct: '15', distractors: ['13', '14', '16'], hint: 'Đếm thêm 1.', skill: 'Số liền sau', obstacle: 'cones' },
    { id: 'g1-07', prompt: '5 + 5 = ?', correct: '10', distractors: ['8', '9', '11'], hint: 'Hai nhóm 5 gộp lại.', skill: 'Phép cộng', obstacle: 'oil' },
    { id: 'g1-08', prompt: '12 - 2 = ?', correct: '10', distractors: ['9', '11', '14'], hint: 'Lùi 2 bước từ 12.', skill: 'Phép trừ', obstacle: 'crate' },
    { id: 'g1-09', prompt: 'Điền số: 16, 17, __, 19', correct: '18', distractors: ['15', '20', '21'], hint: 'Dãy số tăng thêm 1.', skill: 'Dãy số', obstacle: 'rock' },
    { id: 'g1-10', prompt: '8 + 7 = ?', correct: '15', distractors: ['14', '16', '17'], hint: 'Tách 7 thành 2 và 5 để làm tròn 10.', skill: 'Phép cộng', obstacle: 'cones' },
  ],
  '2': [
    { id: 'g2-01', prompt: '24 + 13 = ?', correct: '37', distractors: ['36', '38', '47'], hint: 'Cộng hàng đơn vị trước.', skill: 'Cộng có hai chữ số', obstacle: 'rock' },
    { id: 'g2-02', prompt: '56 - 21 = ?', correct: '35', distractors: ['34', '36', '45'], hint: 'Trừ hàng đơn vị rồi trừ hàng chục.', skill: 'Trừ có hai chữ số', obstacle: 'cones' },
    { id: 'g2-03', prompt: 'Số lớn nhất là số nào?', correct: '89', distractors: ['79', '80', '88'], hint: 'So sánh hàng chục trước.', skill: 'So sánh số', obstacle: 'oil' },
    { id: 'g2-04', prompt: '5 × 2 = ?', correct: '10', distractors: ['7', '8', '12'], hint: 'Có 2 nhóm, mỗi nhóm 5.', skill: 'Bảng nhân 2', obstacle: 'crate' },
    { id: 'g2-05', prompt: '18 : 2 = ?', correct: '9', distractors: ['8', '10', '16'], hint: 'Tìm số nhân với 2 được 18.', skill: 'Bảng chia 2', obstacle: 'rock' },
    { id: 'g2-06', prompt: '47 + 25 = ?', correct: '72', distractors: ['62', '71', '82'], hint: '7 + 5 bằng 12, nhớ 1 chục.', skill: 'Cộng có nhớ', obstacle: 'cones' },
    { id: 'g2-07', prompt: '80 - 36 = ?', correct: '44', distractors: ['46', '54', '56'], hint: 'Mượn 1 chục để trừ hàng đơn vị.', skill: 'Trừ có nhớ', obstacle: 'oil' },
    { id: 'g2-08', prompt: '1 giờ có bao nhiêu phút?', correct: '60', distractors: ['30', '50', '100'], hint: 'Một vòng đồng hồ đủ là 60 phút.', skill: 'Thời gian', obstacle: 'crate' },
    { id: 'g2-09', prompt: 'Điền số: 20, 25, 30, __', correct: '35', distractors: ['31', '34', '40'], hint: 'Mỗi số tăng thêm 5.', skill: 'Dãy số', obstacle: 'rock' },
    { id: 'g2-10', prompt: 'Có 4 túi, mỗi túi 5 viên bi. Có tất cả?', correct: '20', distractors: ['9', '15', '25'], hint: 'Tính 5 + 5 + 5 + 5.', skill: 'Phép nhân', obstacle: 'cones' },
  ],
  '3': [
    { id: 'g3-01', prompt: '6 × 7 = ?', correct: '42', distractors: ['36', '41', '48'], hint: 'Nhớ bảng nhân 6 hoặc bảng nhân 7.', skill: 'Phép nhân', obstacle: 'rock' },
    { id: 'g3-02', prompt: '48 : 6 = ?', correct: '8', distractors: ['6', '7', '9'], hint: 'Tìm số nhân với 6 được 48.', skill: 'Phép chia', obstacle: 'cones' },
    { id: 'g3-03', prompt: '235 + 147 = ?', correct: '382', distractors: ['372', '381', '392'], hint: 'Cộng lần lượt từ hàng đơn vị.', skill: 'Cộng số có ba chữ số', obstacle: 'oil' },
    { id: 'g3-04', prompt: '700 - 268 = ?', correct: '432', distractors: ['422', '438', '532'], hint: 'Đặt tính thẳng cột rồi trừ.', skill: 'Trừ số có ba chữ số', obstacle: 'crate' },
    { id: 'g3-05', prompt: 'Một hình vuông cạnh 5 cm có chu vi là?', correct: '20 cm', distractors: ['10 cm', '15 cm', '25 cm'], hint: 'Chu vi hình vuông bằng cạnh nhân 4.', skill: 'Chu vi', obstacle: 'rock' },
    { id: 'g3-06', prompt: '1 m bằng bao nhiêu cm?', correct: '100 cm', distractors: ['10 cm', '50 cm', '1000 cm'], hint: 'Một mét gồm 100 xăng-ti-mét.', skill: 'Đổi đơn vị', obstacle: 'cones' },
    { id: 'g3-07', prompt: '9 × 8 = ?', correct: '72', distractors: ['63', '71', '81'], hint: 'Có thể tính 10 × 8 rồi bớt 8.', skill: 'Phép nhân', obstacle: 'oil' },
    { id: 'g3-08', prompt: '96 : 8 = ?', correct: '12', distractors: ['10', '11', '14'], hint: '8 nhân mấy bằng 96?', skill: 'Phép chia', obstacle: 'crate' },
    { id: 'g3-09', prompt: 'Gấp 7 lên 4 lần được?', correct: '28', distractors: ['11', '21', '35'], hint: 'Gấp lên 4 lần nghĩa là nhân với 4.', skill: 'Gấp một số lên nhiều lần', obstacle: 'rock' },
    { id: 'g3-10', prompt: 'Một ngày có bao nhiêu giờ?', correct: '24 giờ', distractors: ['12 giờ', '18 giờ', '60 giờ'], hint: 'Từ nửa đêm này đến nửa đêm sau.', skill: 'Thời gian', obstacle: 'cones' },
  ],
  '4': [
    { id: 'g4-01', prompt: '2 345 + 1 678 = ?', correct: '4 023', distractors: ['3 923', '4 013', '4 123'], hint: 'Đặt tính theo từng hàng.', skill: 'Cộng số tự nhiên', obstacle: 'rock' },
    { id: 'g4-02', prompt: '5 000 - 2 475 = ?', correct: '2 525', distractors: ['2 425', '2 535', '3 525'], hint: 'Trừ từ hàng đơn vị và nhớ mượn.', skill: 'Trừ số tự nhiên', obstacle: 'cones' },
    { id: 'g4-03', prompt: '125 × 8 = ?', correct: '1 000', distractors: ['900', '980', '1 200'], hint: 'Tính 100 × 8 và 25 × 8.', skill: 'Phép nhân', obstacle: 'oil' },
    { id: 'g4-04', prompt: '936 : 9 = ?', correct: '104', distractors: ['94', '106', '114'], hint: 'Chia lần lượt từ hàng trăm.', skill: 'Phép chia', obstacle: 'crate' },
    { id: 'g4-05', prompt: 'Phân số nào bằng một nửa?', correct: '2/4', distractors: ['1/3', '2/3', '3/4'], hint: 'Tử số bằng một nửa mẫu số.', skill: 'Phân số', obstacle: 'rock' },
    { id: 'g4-06', prompt: 'Hình chữ nhật dài 8 cm, rộng 5 cm. Diện tích?', correct: '40 cm²', distractors: ['13 cm²', '26 cm²', '80 cm²'], hint: 'Diện tích bằng chiều dài nhân chiều rộng.', skill: 'Diện tích', obstacle: 'cones' },
    { id: 'g4-07', prompt: 'Trung bình cộng của 6, 8 và 10 là?', correct: '8', distractors: ['7', '9', '24'], hint: 'Cộng ba số rồi chia cho 3.', skill: 'Trung bình cộng', obstacle: 'oil' },
    { id: 'g4-08', prompt: '3 tấn bằng bao nhiêu ki-lô-gam?', correct: '3 000 kg', distractors: ['300 kg', '30 000 kg', '3 000 g'], hint: 'Một tấn bằng 1 000 kg.', skill: 'Đổi đơn vị', obstacle: 'crate' },
    { id: 'g4-09', prompt: 'Số nào chia hết cho cả 2 và 5?', correct: '30', distractors: ['21', '25', '42'], hint: 'Số đó phải có chữ số tận cùng là 0.', skill: 'Dấu hiệu chia hết', obstacle: 'rock' },
    { id: 'g4-10', prompt: 'Một góc vuông có số đo là?', correct: '90°', distractors: ['45°', '60°', '180°'], hint: 'Góc vuông là một phần tư vòng tròn.', skill: 'Góc', obstacle: 'cones' },
  ],
  '5': [
    { id: 'g5-01', prompt: '12,5 + 7,25 = ?', correct: '19,75', distractors: ['18,75', '19,5', '20,75'], hint: 'Đặt các dấu phẩy thẳng cột.', skill: 'Cộng số thập phân', obstacle: 'rock' },
    { id: 'g5-02', prompt: '30 - 12,75 = ?', correct: '17,25', distractors: ['16,25', '17,75', '18,25'], hint: 'Viết 30 thành 30,00 rồi trừ.', skill: 'Trừ số thập phân', obstacle: 'cones' },
    { id: 'g5-03', prompt: '2,4 × 5 = ?', correct: '12', distractors: ['7,4', '10', '14'], hint: 'Tính 24 × 5 rồi chia cho 10.', skill: 'Nhân số thập phân', obstacle: 'oil' },
    { id: 'g5-04', prompt: '18,6 : 3 = ?', correct: '6,2', distractors: ['5,2', '6,3', '7,2'], hint: 'Chia như số tự nhiên rồi đặt dấu phẩy.', skill: 'Chia số thập phân', obstacle: 'crate' },
    { id: 'g5-05', prompt: '25% của 80 là?', correct: '20', distractors: ['15', '25', '40'], hint: '25% bằng một phần tư.', skill: 'Tỉ số phần trăm', obstacle: 'rock' },
    { id: 'g5-06', prompt: '3/4 của 20 là?', correct: '15', distractors: ['5', '12', '16'], hint: 'Chia 20 cho 4 rồi nhân 3.', skill: 'Phân số của một số', obstacle: 'cones' },
    { id: 'g5-07', prompt: 'Hình tam giác có đáy 10 cm, cao 6 cm. Diện tích?', correct: '30 cm²', distractors: ['16 cm²', '60 cm²', '120 cm²'], hint: 'Lấy đáy nhân chiều cao rồi chia 2.', skill: 'Diện tích tam giác', obstacle: 'oil' },
    { id: 'g5-08', prompt: '2 giờ 15 phút + 45 phút = ?', correct: '3 giờ', distractors: ['2 giờ 50 phút', '3 giờ 15 phút', '3 giờ 45 phút'], hint: '15 phút + 45 phút bằng 60 phút.', skill: 'Thời gian', obstacle: 'crate' },
    { id: 'g5-09', prompt: 'Quãng đường 120 km đi trong 3 giờ. Vận tốc?', correct: '40 km/giờ', distractors: ['30 km/giờ', '60 km/giờ', '360 km/giờ'], hint: 'Vận tốc bằng quãng đường chia thời gian.', skill: 'Chuyển động đều', obstacle: 'rock' },
    { id: 'g5-10', prompt: '0,75 viết dưới dạng phần trăm là?', correct: '75%', distractors: ['7,5%', '0,75%', '750%'], hint: 'Nhân số thập phân với 100%.', skill: 'Tỉ số phần trăm', obstacle: 'cones' },
  ],
};

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }
  return next;
}

export function createRaceQuestions(grade: GradeLevel): RaceQuestion[] {
  return QUESTION_BANK[grade].map((question) => {
    const answerLabels = shuffle([question.correct, ...question.distractors]);
    const answers = answerLabels.map((label, index) => ({
      id: `${question.id}-answer-${index}`,
      label,
    }));

    const correctAnswer = answers.find((answer) => answer.label === question.correct);

    if (!correctAnswer) {
      throw new Error(`Không tạo được đáp án đúng cho câu ${question.id}`);
    }

    return {
      id: question.id,
      prompt: question.prompt,
      answers,
      correctAnswerId: correctAnswer.id,
      hint: question.hint,
      skill: question.skill,
      obstacle: question.obstacle,
    };
  });
}

export const OBSTACLE_META: Record<RaceObstacle, { emoji: string; label: string }> = {
  rock: { emoji: '🪨', label: 'Đá chắn đường' },
  cones: { emoji: '🚧', label: 'Cọc tiêu' },
  oil: { emoji: '🛢️', label: 'Vũng dầu' },
  crate: { emoji: '📦', label: 'Thùng hàng' },
};

// ─── Dữ liệu thật từ DB: chơi theo từng bài học ─────────────────────────────
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/api`;

export type RaceCourse = { id: number; title: string };
export type RaceLesson = { id: number; title: string };

const OBSTACLE_CYCLE: RaceObstacle[] = ['rock', 'cones', 'oil', 'crate'];

function parseJson(value: unknown): unknown {
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return value; }
  }
  return value;
}

function normalizeCorrectKey(raw: unknown): string | null {
  const v = parseJson(raw);
  if (v == null) return null;
  if (Array.isArray(v)) return v.length ? String(v[0]) : null;
  if (typeof v === 'object') {
    const first = Object.values(v as Record<string, unknown>)[0];
    return first != null ? String(first) : null;
  }
  return String(v);
}

// Danh sách khóa học (đã xuất bản) để chọn trong màn intro.
export async function fetchRaceCourses(): Promise<RaceCourse[]> {
  try {
    const res = await fetch(`${API_BASE}/courses?limit=500`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    const list = Array.isArray(json) ? json : (json?.data ?? []);
    return list
      .filter((c: { id?: unknown; title?: unknown; isPublished?: boolean }) =>
        c?.id != null && !!c?.title && c?.isPublished !== false)
      .map((c: { id: number; title: string }) => ({ id: Number(c.id), title: String(c.title) }));
  } catch {
    return [];
  }
}

// Bài học của một khóa (chỉ bài đã có quiz).
export async function fetchRaceLessons(courseId: number): Promise<RaceLesson[]> {
  try {
    const res = await fetch(`${API_BASE}/lessons?courseId=${courseId}&slim=1`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    const list = Array.isArray(json) ? json : (json?.data ?? []);
    return list
      .filter((l: { id?: unknown; title?: unknown; quizCount?: number }) =>
        l?.id != null && !!l?.title && (l.quizCount == null || l.quizCount > 0))
      .map((l: { id: number; title: string }) => ({ id: Number(l.id), title: String(l.title) }));
  } catch {
    return [];
  }
}

// 10 câu single_choice ngẫu nhiên của một bài học, map sang RaceQuestion.
export async function fetchLessonRaceQuestions(lessonId: number, limit = 10): Promise<RaceQuestion[]> {
  const res = await fetch(`${API_BASE}/quizzes/exercises/${lessonId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không tải được câu hỏi của bài học.');
  const json = await res.json();
  const exercises: { quizzes?: unknown[] }[] = json?.exercises ?? [];
  const all = exercises.flatMap((e) => e?.quizzes ?? []) as Record<string, unknown>[];

  const singles = all.filter((q) => {
    const type = String(q?.questionType ?? '').toLowerCase();
    const opts = parseJson(q?.optionsJson);
    return type === 'single_choice' && Array.isArray(opts) && opts.length >= 2 && q?.isActive !== false;
  });

  return shuffle(singles).slice(0, limit).map((q, index) => {
    // Xáo trộn thứ tự đáp án (đáp án đúng nhận diện theo id/key nên không sai).
    const opts = shuffle(
      (parseJson(q.optionsJson) as { key: unknown; text: unknown; imageUrl?: unknown }[]).map((o) => ({
        id: String(o.key),
        label: o.text == null ? '' : String(o.text),
        imageUrl: o.imageUrl ? String(o.imageUrl) : undefined,
      })),
    );
    const correctAnswerId = normalizeCorrectKey(q.correctAnswerJson) ?? opts[0]?.id ?? '';
    const diff = String(q.difficultyLevel ?? 'easy');
    const skill = diff === 'hard' ? 'Nâng cao' : diff === 'medium' ? 'Trung bình' : 'Dễ';
    return {
      id: String(q.id ?? `q-${index}`),
      prompt: String(q.questionText ?? '').replace(/\[b\d+\]/g, '___').trim(),
      imageUrl: q.questionImageUrl ? String(q.questionImageUrl) : undefined,
      answers: opts,
      correctAnswerId,
      hint: String(q.explanation ?? 'Xem lại kiến thức trong bài học nhé.'),
      skill,
      obstacle: OBSTACLE_CYCLE[index % OBSTACLE_CYCLE.length],
    } satisfies RaceQuestion;
  });
}
