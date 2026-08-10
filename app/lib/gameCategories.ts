// Danh mục trò chơi cho các trang hub /tro-choi/{category}.
//
// Vì sao có file này: /tro-choi hiện là MỘT trang phẳng chứa cả 18 game, nên không
// trang nào nhắm được truy vấn cụ thể ("trò chơi toán học", "game cho bé 3 tuổi").
// Mỗi danh mục ở đây là một nhóm game thực sự khác nhau + một đoạn mô tả riêng.
//
// Nguyên tắc chọn danh mục — chỉ mở danh mục khi nó KHÁC BIỆT ĐỦ:
//   • ít nhất 3 game (dưới đó là trang mỏng),
//   • và không quá 70% tổng số game (trên đó là bản sao của /tro-choi).
// Vì thế KHÔNG có "cho bé 5 tuổi" (17/18 game ≈ trùng /tro-choi) và không có
// "tiếng Anh" (chưa có game nào thuộc nhóm này). Hàm assertCategories() ở cuối
// kiểm tra lại các ngưỡng này khi build, để danh mục không âm thầm thoái hoá
// khi kho game thay đổi.

import { gamesData, type GameItem } from '../components/edu/data/gamesData';

export type GameCategory = {
  slug: string;
  /** H1 + nhãn breadcrumb. */
  heading: string;
  /** Dùng cho <title>; giữ dưới ~60 ký tự kể cả brand. */
  title: string;
  description: string;
  /** Đoạn mở đầu riêng của từng danh mục — không tái sử dụng giữa các trang. */
  intro: string;
  match: (g: GameItem) => boolean;
};

const readyGames = (): GameItem[] => gamesData.filter((g) => g.status === 'ready');

/** '4-6' → [4, 6]; dùng để hỏi "game này có hợp bé N tuổi không". */
function ageRange(g: GameItem): [number, number] {
  const [lo, hi] = g.ageGroup.split('-').map(Number);
  return [lo, hi];
}

function fitsAge(g: GameItem, age: number): boolean {
  const [lo, hi] = ageRange(g);
  return age >= lo && age <= hi;
}

export const GAME_CATEGORIES: GameCategory[] = [
  {
    slug: 'toan',
    heading: 'Trò chơi Toán học cho bé',
    title: 'Trò chơi Toán học cho bé – chơi online miễn phí',
    description:
      'Tuyển tập game toán cho bé mầm non và tiểu học: đếm số, cộng trừ, dãy số, so sánh. Chơi trực tiếp trên trình duyệt, không cần cài đặt, miễn phí.',
    intro:
      'Toán ở lứa tuổi này học nhanh nhất khi bé được nhìn thấy số lượng thay vì chỉ nhìn con số. Các trò chơi dưới đây đều gắn phép tính vào một tình huống cụ thể — hái táo, đếm chim, cho thỏ vào hang — nên bé hiểu ý nghĩa của phép cộng, phép trừ trước khi học thuộc bảng tính.',
    match: (g) => g.category === 'Toán học',
  },
  {
    slug: 'tieng-viet',
    heading: 'Trò chơi Tiếng Việt cho bé',
    title: 'Trò chơi Tiếng Việt cho bé – học chữ cái, ghép vần',
    description:
      'Game tiếng Việt cho bé: nhận diện chữ cái, ghép vần, tập viết, tìm chữ còn thiếu. Có phát âm mẫu, chơi online miễn phí trên điện thoại và máy tính.',
    intro:
      'Trước khi đọc trơn được một câu, bé cần nhận mặt chữ và nghe ra âm của từng vần. Nhóm trò chơi này đi đúng thứ tự đó: nhận diện chữ cái, rồi ghép chữ thành vần, rồi tập viết theo nét. Mỗi game đều có phát âm mẫu để bé đối chiếu khi đọc sai.',
    match: (g) => g.category === 'Ngôn ngữ',
  },
  {
    slug: 'dem-so',
    heading: 'Trò chơi đếm số và số lượng',
    title: 'Trò chơi đếm số cho bé mầm non – miễn phí',
    description:
      'Game đếm số cho bé 3–6 tuổi: đếm đồ vật, nhận biết số lượng, so sánh nhiều hơn – ít hơn. Chơi online miễn phí, phù hợp bé chưa biết đọc.',
    intro:
      'Đây là nhóm dành cho bé mới bắt đầu làm quen với số. Bé chỉ cần nhìn và đếm, không phải đọc đề, nên chơi được cả khi chưa biết chữ. Chơi xong nhóm này, bé đã sẵn sàng cho các trò chơi cộng trừ và dãy số.',
    match: (g) => g.groupKey === 'math-counting',
  },
  {
    slug: 'tu-duy-logic',
    heading: 'Trò chơi tư duy logic cho bé',
    title: 'Trò chơi tư duy logic cho bé tiểu học',
    description:
      'Game rèn tư duy logic cho bé: tìm quy luật dãy số, sắp xếp thứ tự, trả lời nhanh. Dành cho bé 5–10 tuổi, chơi online miễn phí.',
    intro:
      'Khác với nhóm đếm số, các trò chơi ở đây yêu cầu bé nhận ra một quy luật rồi áp dụng nó — số tiếp theo trong dãy là gì, cột nào cần kéo lên. Đây là bước chuyển từ tính đúng sang nghĩ nhanh, hợp với bé đã vững cộng trừ.',
    match: (g) => g.groupKey === 'math-logic',
  },
  {
    slug: 'cho-be-3-tuoi',
    heading: 'Trò chơi cho bé 3 tuổi',
    title: 'Trò chơi cho bé 3 tuổi – đơn giản, miễn phí',
    description:
      'Trò chơi giáo dục cho bé 3 tuổi: thao tác đơn giản, hình to, có âm thanh hướng dẫn, không cần biết đọc. Chơi online miễn phí trên điện thoại.',
    intro:
      'Bé 3 tuổi chưa đọc được đề bài và tay còn chưa thật khéo, nên các trò chơi ở đây đều dùng hình lớn, một thao tác chạm duy nhất và có giọng đọc hướng dẫn. Mỗi lượt chơi ngắn để bé không mất tập trung giữa chừng.',
    match: (g) => fitsAge(g, 3),
  },
  {
    slug: 'cho-be-4-tuoi',
    heading: 'Trò chơi cho bé 4 tuổi',
    title: 'Trò chơi cho bé 4 tuổi – học chữ và số',
    description:
      'Trò chơi giáo dục cho bé 4 tuổi: làm quen chữ cái, đếm số lượng, ghi nhớ và quan sát. Chơi online miễn phí, không quảng cáo.',
    intro:
      'Đây là giai đoạn bé bắt đầu nhớ được mặt chữ và đếm đúng tới 10. Nhóm trò chơi này trộn cả chữ và số ở mức dễ, để bé làm quen với cả hai mà chưa cần học theo chương trình lớp 1.',
    match: (g) => fitsAge(g, 4),
  },
  {
    slug: 'cho-be-lop-1',
    heading: 'Trò chơi cho bé lớp 1',
    title: 'Trò chơi cho bé lớp 1 – ôn Toán và Tiếng Việt',
    description:
      'Trò chơi học tập cho học sinh lớp 1: cộng trừ trong phạm vi 10 và 100, ghép vần, tập viết. Bám chương trình lớp 1, chơi online miễn phí.',
    intro:
      'Nhóm này chọn các trò chơi có nội dung trùng với chương trình lớp 1, nên bé có thể chơi để ôn ngay phần vừa học trên lớp. Nếu bé cần luyện kỹ hơn theo từng chủ đề, hãy dùng kèm phần bài tập theo chủ đề.',
    match: (g) => fitsAge(g, 6),
  },
];

export function findCategory(slug: string): GameCategory | null {
  return GAME_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function gamesInCategory(category: GameCategory): GameItem[] {
  return readyGames().filter(category.match);
}

const MIN_GAMES = 3;
const MAX_SHARE = 0.7;

/**
 * Chặn danh mục thoái hoá thành trang mỏng hoặc bản sao của /tro-choi khi kho game
 * thay đổi. Trả về danh sách cảnh báo (rỗng = ổn) — trang hub gọi hàm này để tự
 * loại danh mục hỏng thay vì xuất bản một URL kém chất lượng.
 */
export function categoryWarnings(): string[] {
  const total = readyGames().length;
  const out: string[] = [];
  for (const c of GAME_CATEGORIES) {
    const n = gamesInCategory(c).length;
    if (n < MIN_GAMES) out.push(`${c.slug}: chỉ ${n} game (<${MIN_GAMES}) → trang mỏng`);
    else if (n / total > MAX_SHARE) out.push(`${c.slug}: ${n}/${total} game (>${MAX_SHARE * 100}%) → gần trùng /tro-choi`);
  }
  return out;
}

/** Danh mục đủ chất lượng để xuất bản (dùng cho sitemap và link nội bộ). */
export function publishableCategories(): GameCategory[] {
  const total = readyGames().length;
  return GAME_CATEGORIES.filter((c) => {
    const n = gamesInCategory(c).length;
    return n >= MIN_GAMES && n / total <= MAX_SHARE;
  });
}
