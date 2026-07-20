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
    href: '/khoa-hoc/lam-quen-mat-chu',
    bg: 'bg-sky-50',
  },
  {
    icon: '🔢',
    title: 'Toán vui mỗi ngày',
    desc: 'Học đếm số, so sánh, cộng trừ cơ bản bằng trò chơi ngắn.',
    href: '/khoa-hoc/toan-vui-moi-ngay',
    bg: 'bg-violet-50',
  },
  {
    icon: '🧠',
    title: 'Phản xạ và ghi nhớ',
    desc: 'Rèn khả năng quan sát, ghi nhớ và suy luận theo độ tuổi.',
    href: '/khoa-hoc/phan-xa-va-ghi-nho',
    bg: 'bg-pink-50',
  },
  {
    icon: '🇬🇧',
    title: 'Tiếng Anh đầu đời',
    desc: 'Bé học từ vựng tiếng Anh cơ bản qua hình ảnh, âm thanh, flashcard và trò chơi tương tác ngắn.',
    href: '/khoa-hoc/tieng-anh-dau-doi',
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
    title: 'Phương pháp dạy trẻ đếm số từ 1 đến 100 hiệu quả',
    desc: 'Các bước giúp bé đếm số thành thạo, không nhầm lẫn khi học toán lớp 1.',
    href: '/bai-viet/phuong-phap-day-tre-dem-so-tu-1-den-100-hieu-qua',
  },
  {
    title: 'Mẹo dạy trẻ học bảng cộng trừ trong phạm vi 10 nhanh nhất',
    desc: 'Bí quyết giúp bé ghi nhớ bảng cộng, bảng trừ và tính nhẩm nhanh mỗi ngày.',
    href: '/bai-viet/meo-day-tre-hoc-bang-cong-tru-trong-pham-vi-10-nhanh-nhat',
  },
  {
    title: 'Cách giải toán có lời văn lớp 1 đơn giản cho bé',
    desc: 'Hướng dẫn từng bước giúp bé đọc hiểu đề và trình bày lời giải đúng.',
    href: '/bai-viet/cach-giai-toan-co-loi-van-lop-1-don-gian-cho-be',
  },
];

const FEATURED_GAME_SLUGS = [
  'tho-vao-hang',
  'tho-cap-ca-rot',
  'chim-bay-mat',
  'dem-chim',
] as const;

export const featuredGames: FeaturedGame[] = FEATURED_GAME_SLUGS.map((pageKey) => {
  const game = gamesData.find((g) => g.page === pageKey || g.slug === pageKey);
  if (!game) {
    throw new Error(`Featured game with page="${pageKey}" not found in gamesData`);
  }
  return {
    title: game.title,
    desc: game.description,
    age: game.age,
    href: `/tro-choi/${game.slug}`,
  };
});
