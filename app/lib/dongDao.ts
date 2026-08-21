// Đồng dao & ca dao dân gian cho bé (truyền thống, không bản quyền).
// Đọc từng câu / đọc cả bài bằng giọng Việt. Ca dao có thêm ý nghĩa cho ba mẹ giảng cho bé.

export type DongDaoBai = {
  slug: string;
  emoji: string;
  title: string;
  type: 'Đồng dao' | 'Ca dao';
  lines: string[];
  meaning?: string; // ý nghĩa (với ca dao)
};

export const DONG_DAO: DongDaoBai[] = [
  {
    slug: 'dung-dang-dung-de', emoji: '🤝', title: 'Dung dăng dung dẻ', type: 'Đồng dao',
    lines: [
      'Dung dăng dung dẻ,',
      'Dắt trẻ đi chơi,',
      'Đến cổng nhà trời,',
      'Lạy cậu lạy mợ,',
      'Cho cháu về quê,',
      'Cho dê đi học,',
      'Cho cóc ở nhà,',
      'Cho gà bới bếp,',
      'Ù à ù ập,',
      'Ngồi xập xuống đây!',
    ],
  },
  {
    slug: 'nu-na-nu-nong', emoji: '🦶', title: 'Nu na nu nống', type: 'Đồng dao',
    lines: [
      'Nu na nu nống,',
      'Cái cống nằm trong,',
      'Cái ong nằm ngoài,',
      'Củ khoai chấm mật,',
      'Bụt ngồi bụt khóc,',
      'Con cóc nhảy ra,',
      'Con gà ú ụ,',
      'Bà mụ thổi xôi,',
      'Nhà tôi nấu chè,',
      'Tè he chân rụt.',
    ],
  },
  {
    slug: 'keo-cua-lua-xe', emoji: '🪚', title: 'Kéo cưa lừa xẻ', type: 'Đồng dao',
    lines: [
      'Kéo cưa lừa xẻ,',
      'Ông thợ nào khỏe,',
      'Về ăn cơm vua,',
      'Ông thợ nào thua,',
      'Về bú tí mẹ.',
    ],
  },
  {
    slug: 'chi-chi-chanh-chanh', emoji: '✋', title: 'Chi chi chành chành', type: 'Đồng dao',
    lines: [
      'Chi chi chành chành,',
      'Cái đanh thổi lửa,',
      'Con ngựa chết trương,',
      'Ba vương ngũ đế,',
      'Chấp chế đi tìm,',
      'Ù à ù ập.',
    ],
  },
  {
    slug: 'con-co-ma-di-an-dem', emoji: '🐦', title: 'Con cò mà đi ăn đêm', type: 'Ca dao',
    lines: [
      'Con cò mà đi ăn đêm,',
      'Đậu phải cành mềm lộn cổ xuống ao.',
      'Ông ơi ông vớt tôi nao,',
      'Tôi có lòng nào ông hãy xáo măng.',
    ],
    meaning: 'Bài ca dao nói về con cò chăm chỉ, thà chết trong sạch chứ không làm điều xấu — dạy bé sống ngay thẳng, trong sạch.',
  },
  {
    slug: 'bau-oi-thuong-lay-bi-cung', emoji: '🥒', title: 'Bầu ơi thương lấy bí cùng', type: 'Ca dao',
    lines: [
      'Bầu ơi thương lấy bí cùng,',
      'Tuy rằng khác giống nhưng chung một giàn.',
    ],
    meaning: 'Khuyên mọi người sống trong cùng một cộng đồng thì phải biết yêu thương, đùm bọc lẫn nhau.',
  },
  {
    slug: 'cong-cha-nhu-nui-thai-son', emoji: '❤️', title: 'Công cha như núi Thái Sơn', type: 'Ca dao',
    lines: [
      'Công cha như núi Thái Sơn,',
      'Nghĩa mẹ như nước trong nguồn chảy ra.',
      'Một lòng thờ mẹ kính cha,',
      'Cho tròn chữ hiếu mới là đạo con.',
    ],
    meaning: 'Ca ngợi công lao to lớn của cha mẹ và nhắc nhở con cái phải hiếu thảo, kính yêu cha mẹ.',
  },
];

export const totalDongDaoLines = () => DONG_DAO.reduce((n, b) => n + b.lines.length, 0);
