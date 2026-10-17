// Kiểu dữ liệu cho khu "Khóa học vui" — khu bán khóa Thử thách IQ, độc lập với phần cũ.
// Dữ liệu tạm nằm trong app/khoa-hoc-iq/data/*.json (chỉ đọc phía server).

export type Tile = {
  text?: string;
  emoji?: string;
  image?: string;
  /** Ảnh tờ tiền thật: một mệnh giá (vd 5000) hoặc nhiều tờ (vd [2000, 1000]). */
  money?: number | number[];
};

type QuestionBase = {
  id: string;
  /** Đề bài, có thể nhiều dòng (\n). */
  prompt: string;
  /** Câu đọc to khi bấm loa. Mặc định đọc `prompt`. */
  speak?: string;
  /** Cách làm — hiện khi bé bấm "Gợi ý" và sau khi trả lời. */
  method?: string;
  /** Lời giải — hiện sau khi trả lời. */
  explanation?: string;
  /** Thời gian đếm ngược (giây). Mặc định lấy theo bài học. */
  timeLimit?: number;
  /** Hình minh họa dưới đề bài: ma trận (ô "?" là ô cần tìm), ảnh, dòng emoji (emoji đồng hồ tự vẽ thành đồng hồ kim),
   *  `clock`: danh sách giờ cần vẽ đồng hồ, ví dụ ["7:15", "8:45"]; hoặc `money`: hàng ảnh tờ tiền thật,
   *  ví dụ [10000, "=", 5000, "+", 5000] (số là mệnh giá, chữ là ký hiệu chen giữa). */
  visual?: { grid?: string[][]; image?: string; emoji?: string; clock?: string[]; money?: (number | string)[] };
};

/** Bé tự gõ đáp án (thường là số). Chấp nhận nhiều cách viết trong `answers`. */
export type InputQuestion = QuestionBase & {
  type: 'input';
  answers: string[];
  unit?: string;
};

/** Chọn 1 đáp án đúng. */
export type ChoiceQuestion = QuestionBase & {
  type: 'choice';
  options: Tile[];
  answer: number;
};

/** Chọn tất cả đáp án đúng. */
export type MultiChoiceQuestion = QuestionBase & {
  type: 'multi_choice';
  options: Tile[];
  answers: number[];
};

/** Nối cặp tương ứng (trái ↔ phải hoặc trên ↔ dưới). */
export type MatchQuestion = QuestionBase & {
  type: 'match' | 'match_vertical';
  pairs: { left: Tile; right: Tile }[];
};

/** Nối mỗi ô bên phải vào đúng nhóm bên trái (một nhóm nhận nhiều ô). */
export type MatchMultiQuestion = QuestionBase & {
  type: 'match_multi';
  groups: Tile[];
  items: (Tile & { group: number })[];
};

/** Lật ô màu bên trái, ghép vào ô tương ứng bên phải. */
export type RevealMatchQuestion = QuestionBase & {
  type: 'reveal_match';
  pairs: { front: Tile; back: Tile }[];
};

/** Điền từ vào chỗ trống. Chỗ trống viết dạng [[đáp án]] trong `sentence`. */
export type FillBlankQuestion = QuestionBase & {
  type: 'fill_blank';
  sentence: string;
  choices: string[];
};

/** Kéo thả để sắp xếp đúng thứ tự (`items` là thứ tự đúng). */
export type OrderQuestion = QuestionBase & {
  type: 'order';
  items: Tile[];
};

/** Chọn lần lượt các ô để xếp thành câu/dãy đúng (`items` là thứ tự đúng). */
export type PickOrderQuestion = QuestionBase & {
  type: 'pick_order';
  items: string[];
  distractors?: string[];
};

/** Ghép ảnh từ các mảnh. */
export type PuzzleQuestion = QuestionBase & {
  type: 'puzzle';
  image: string;
  size?: number;
};

export type Question =
  | ChoiceQuestion
  | MultiChoiceQuestion
  | InputQuestion
  | MatchQuestion
  | MatchMultiQuestion
  | RevealMatchQuestion
  | FillBlankQuestion
  | OrderQuestion
  | PickOrderQuestion
  | PuzzleQuestion;

export type QuestionType = Question['type'];

/** Phần "ĐỌC" của bài: khái niệm, ví dụ trực quan, các bước làm, mẹo ghi nhớ. */
export type Theory = {
  concept: string;
  examples: { prompt: string; visual?: Question['visual']; answer: string }[];
  steps: string[];
  tips: string[];
};

export type Lesson = {
  id: string;
  title: string;
  emoji: string;
  description?: string;
  theory?: Theory;
  /** Thời gian mặc định cho mỗi câu (giây). */
  timeLimit?: number;
  questions: Question[];
};

export type Grade = {
  id: string;
  title: string;
  ageRange: string;
  /** false = chưa mở bán, hiện "Sắp ra mắt". */
  available: boolean;
};

export type Course = {
  slug: string;
  /** Lớp mà khóa thuộc về (Grade.id). */
  grade: string;
  /** Số thứ tự khóa trong lớp, ví dụ "01". */
  number: string;
  /** Nhãn môn hiển thị, ví dụ "THỬ THÁCH IQ|LỚP 2". */
  subject: string;
  title: string;
  subtitle: string;
  emoji: string;
  /** Ảnh bìa khóa (public/…), có thì hiện thay emoji trên thẻ khóa. */
  cover?: string;
  /** Hai màu gradient của thẻ khóa học. */
  colors: [string, string];
  price: number;
  oldPrice?: number;
  /** Tiền tố mã kích hoạt, ví dụ TVIET-XXXXXX-XXXXXX. */
  codePrefix: string;
  /** Số bài đầu tiên được học thử miễn phí. */
  freeLessons: number;
  highlights: string[];
};

/** Gói trọn bộ: mở khóa mọi khóa của một lớp. */
export type Combo = {
  grade: string;
  title: string;
  subtitle: string;
  price: number;
  oldPrice?: number;
  codePrefix: string;
};

export type ShopInfo = {
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  zalo: string;
  hotline: string;
};

/** Thông tin bài học gửi xuống client ở trang bản đồ (không kèm câu hỏi). */
export type LessonSummary = {
  id: string;
  title: string;
  emoji: string;
  description?: string;
  questionCount: number;
  free: boolean;
  locked: boolean;
};

/** Kết quả trả lời mà mỗi dạng câu hỏi báo lên khung chơi. */
export type AnswerState = {
  complete: boolean;
  correct: boolean;
  /** true = tự chấm ngay khi hoàn thành (không cần bấm "Kiểm tra"). */
  auto?: boolean;
};
