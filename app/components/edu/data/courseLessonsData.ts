export type CourseLesson = {
    id: string;
    title: string;
    description: string;
    duration: string;
    type: 'video' | 'game' | 'practice';
    isFree: boolean;
  };
  
  export type CourseDetail = {
    slug: string;
    title: string;
    description: string;
    tag: string;
    age: string;
    emoji: string;
    lessons: CourseLesson[];
  };
  
  export const courseLessonsData: CourseDetail[] = [
    {
      slug: 'lam-quen-mat-chu',
      title: 'Làm quen mặt chữ',
      description:
        'Chuỗi bài học giúp bé nhận biết chữ cái, âm đầu và hình ảnh minh họa cơ bản để xây nền tảng ngôn ngữ sớm.',
      tag: 'Ngôn ngữ',
      age: '3-5 tuổi',
      emoji: '🔤',
      lessons: [
        {
          id: 'lqmc-01',
          title: 'Nhận biết chữ A, Ă, Â',
          description: 'Bé làm quen hình dạng và âm đọc của nhóm chữ A.',
          duration: '8 phút',
          type: 'video',
          isFree: true,
        },
        {
          id: 'lqmc-02',
          title: 'Nhận biết chữ B, C, D',
          description: 'Học nhóm chữ đầu tiên qua hình ảnh và từ quen thuộc.',
          duration: '10 phút',
          type: 'video',
          isFree: true,
        },
        {
          id: 'lqmc-03',
          title: 'Ghép chữ với hình',
          description: 'Chọn chữ cái phù hợp với hình minh họa.',
          duration: '7 phút',
          type: 'game',
          isFree: true,
        },
        {
          id: 'lqmc-04',
          title: 'Chọn âm đầu giống nhau',
          description: 'Luyện nghe và phân biệt âm đầu cơ bản.',
          duration: '9 phút',
          type: 'practice',
          isFree: false,
        },
        {
          id: 'lqmc-05',
          title: 'Ôn tập mặt chữ tuần 1',
          description: 'Tổng hợp lại các chữ đã học bằng bài luyện ngắn.',
          duration: '6 phút',
          type: 'practice',
          isFree: false,
        },
      ],
    },
    {
      slug: 'toan-vui-moi-ngay',
      title: 'Toán vui mỗi ngày',
      description:
        'Nhóm bài học giúp bé làm quen với đếm số, nhận biết thứ tự, so sánh số lượng và các thao tác toán học cơ bản.',
      tag: 'Toán học',
      age: '4-6 tuổi',
      emoji: '🔢',
      lessons: [
        {
          id: 'tvmn-01',
          title: 'Đếm số từ 1 đến 5',
          description: 'Bé tập đếm số lượng đồ vật bằng hình ảnh trực quan.',
          duration: '8 phút',
          type: 'video',
          isFree: true,
        },
        {
          id: 'tvmn-02',
          title: 'Nối số theo thứ tự',
          description: 'Luyện nối số từ bé đến lớn qua trò chơi tương tác.',
          duration: '7 phút',
          type: 'game',
          isFree: true,
        },
        {
          id: 'tvmn-03',
          title: 'So sánh nhiều hơn và ít hơn',
          description: 'Làm quen với khái niệm nhiều, ít, bằng nhau.',
          duration: '9 phút',
          type: 'practice',
          isFree: true,
        },
        {
          id: 'tvmn-04',
          title: 'Tách gộp số đơn giản',
          description: 'Bé học cách chia và gộp nhóm số nhỏ.',
          duration: '10 phút',
          type: 'video',
          isFree: false,
        },
        {
          id: 'tvmn-05',
          title: 'Ôn tập toán học tuần 1',
          description: 'Tổng hợp bài tập nhanh về đếm và thứ tự số.',
          duration: '6 phút',
          type: 'practice',
          isFree: false,
        },
      ],
    },
    {
      slug: 'phan-xa-va-ghi-nho',
      title: 'Phản xạ và ghi nhớ',
      description:
        'Chuỗi nội dung ngắn giúp bé phát triển chú ý, ghi nhớ hình ảnh, nhớ thứ tự và phản xạ nhanh khi xử lý nhiệm vụ.',
      tag: 'Tư duy',
      age: '4-7 tuổi',
      emoji: '🧠',
      lessons: [
        {
          id: 'pxgn-01',
          title: 'Nhớ thứ tự xuất hiện',
          description: 'Bé quan sát chuỗi hình rồi bấm lại đúng thứ tự.',
          duration: '7 phút',
          type: 'game',
          isFree: true,
        },
        {
          id: 'pxgn-02',
          title: 'Ghi nhớ nhanh theo cặp',
          description: 'Tìm cặp hình giống nhau trong thời gian ngắn.',
          duration: '8 phút',
          type: 'game',
          isFree: true,
        },
        {
          id: 'pxgn-03',
          title: 'Nghe và làm theo',
          description: 'Tăng phản xạ nghe hiểu qua chỉ dẫn ngắn.',
          duration: '9 phút',
          type: 'practice',
          isFree: true,
        },
        {
          id: 'pxgn-04',
          title: 'Mê cung vui nhộn',
          description: 'Rèn tư duy không gian và khả năng tìm đường.',
          duration: '10 phút',
          type: 'game',
          isFree: false,
        },
        {
          id: 'pxgn-05',
          title: 'Ôn tập ghi nhớ tuần 1',
          description: 'Tổng hợp các bài phản xạ và chú ý ngắn.',
          duration: '6 phút',
          type: 'practice',
          isFree: false,
        },
      ],
    },
    {
      slug: 'tieng-anh-dau-doi',
      title: 'Tiếng Anh đầu đời',
      description:
        'Bé học từ vựng tiếng Anh cơ bản qua hình ảnh, âm thanh, flashcard và trò chơi tương tác ngắn.',
      tag: 'Ngoại ngữ',
      age: '3-6 tuổi',
      emoji: '🇬🇧',
      lessons: [
        {
          id: 'tadd-01',
          title: 'Từ vựng con vật quen thuộc',
          description: 'Học các từ tiếng Anh cơ bản về con vật.',
          duration: '8 phút',
          type: 'video',
          isFree: true,
        },
        {
          id: 'tadd-02',
          title: 'Từ vựng màu sắc',
          description: 'Bé làm quen với các màu sắc phổ biến bằng tiếng Anh.',
          duration: '7 phút',
          type: 'video',
          isFree: true,
        },
        {
          id: 'tadd-03',
          title: 'Flashcard tự học',
          description: 'Ôn từ vựng nhanh bằng thẻ học và giọng đọc.',
          duration: '6 phút',
          type: 'game',
          isFree: true,
        },
        {
          id: 'tadd-04',
          title: 'Nghe từ và chọn hình',
          description: 'Phản xạ nghe tiếng Anh và chọn đáp án đúng.',
          duration: '9 phút',
          type: 'practice',
          isFree: false,
        },
        {
          id: 'tadd-05',
          title: 'Ôn tập tiếng Anh tuần 1',
          description: 'Tổng hợp từ vựng đã học theo chủ đề.',
          duration: '6 phút',
          type: 'practice',
          isFree: false,
        },
      ],
    },
  ];
  
  export function getCourseBySlug(slug: string) {
    return courseLessonsData.find((course) => course.slug === slug);
  }
  