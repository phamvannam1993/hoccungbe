import { gamesData } from './gamesData';

export type LearningCategory = {
  icon: string;
  title: string;
  desc: string;
  href: string;
  bg: string;
};

export type HowItWorksStep = {
  step: string;
  title: string;
  desc: string;
};

export type ParentResource = {
  title: string;
  desc: string;
  href: string;
};

export type FeaturedGame = {
  title: string;
  desc: string;
  age: string;
  href: string;
};

export const learningCategories: LearningCategory[] = [
  {
    icon: '🔤',
    title: 'Làm quen mặt chữ',
    desc: 'Bé nhận diện chữ, âm và từ đơn giản qua hình ảnh trực quan.',
    href: '/courses/lam-quen-mat-chu',
    bg: 'bg-sky-50',
  },
  {
    icon: '🔢',
    title: 'Toán vui mỗi ngày',
    desc: 'Học đếm số, so sánh, cộng trừ cơ bản bằng trò chơi ngắn.',
    href: '/courses/toan-vui-moi-ngay',
    bg: 'bg-violet-50',
  },
  {
    icon: '🧠',
    title: 'Phản xạ và ghi nhớ',
    desc: 'Rèn khả năng quan sát, ghi nhớ và suy luận theo độ tuổi.',
    href: '/courses/phan-xa-va-ghi-nho',
    bg: 'bg-pink-50',
  },
  {
    icon: '🇬🇧',
    title: 'Tiếng Anh đầu đời',
    desc: 'Bé học từ vựng tiếng Anh cơ bản qua hình ảnh, âm thanh, flashcard và trò chơi tương tác ngắn.',
    href: '/courses/tieng-anh-dau-doi',
    bg: 'bg-emerald-50',
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: '01',
    title: 'Chọn độ tuổi phù hợp',
    desc: 'Phụ huynh chọn nhóm tuổi hoặc năng lực hiện tại để bé bắt đầu đúng mức.',
  },
  {
    step: '02',
    title: 'Bé học qua trò chơi ngắn',
    desc: 'Mỗi hoạt động chỉ vài phút, trực quan và dễ bắt đầu nên bé không bị áp lực.',
  },
  {
    step: '03',
    title: 'Theo dõi kết quả rõ ràng',
    desc: 'Hệ thống ghi nhận tiến độ để phụ huynh biết bé đang tiến bộ ở đâu.',
  },
];

export const parentResources: ParentResource[] = [
  {
    title: '5 cách giúp bé tập trung hơn khi học tại nhà',
    desc: 'Những thay đổi nhỏ nhưng rất hiệu quả để bé vào nhịp học tốt hơn mỗi ngày.',
    href: '/blog/giup-be-tap-trung-khi-hoc',
  },
  {
    title: 'Nên cho trẻ 3–6 tuổi học bao lâu mỗi lần',
    desc: 'Thời lượng học phù hợp giúp bé hứng thú và không bị quá tải.',
    href: '/blog/thoi-luong-hoc-phu-hop-cho-tre',
  },
  {
    title: 'Gợi ý góc học tập đơn giản cho bé',
    desc: 'Một không gian học đúng sẽ giúp bé tập trung và chủ động hơn.',
    href: '/blog/goc-hoc-tap-cho-be',
  },
];

const FEATURED_GAME_SLUGS = [
  'match-word',
  'math-fun',
  'english-vocab',
  'mini-maze',
] as const;

export const featuredGames: FeaturedGame[] = FEATURED_GAME_SLUGS.map((pageKey) => {
  const game = gamesData.find((g) => g.page === pageKey);
  if (!game) {
    throw new Error(`Featured game with page="${pageKey}" not found in gamesData`);
  }
  return {
    title: game.title,
    desc: game.description,
    age: game.age,
    href: `/games/${game.page}`,
  };
});
