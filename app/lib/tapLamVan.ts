// Tập làm văn cho bé lớp 2–3 — đề bài + dàn ý gợi ý + từ gợi ý + bài văn mẫu.
// Bài mẫu đọc được bằng giọng Việt (speakSequence). Bé tự viết vào ô (lưu localStorage).

export type TapLamVanTopic = {
  slug: string;
  emoji: string;
  title: string; // đề bài
  danY: { moBai: string; thanBai: string[]; ketBai: string };
  tuGoiY: string[];
  baiMau: string[]; // các câu của bài văn mẫu
};

export const TAP_LAM_VAN: TapLamVanTopic[] = [
  {
    slug: 'ta-con-meo', emoji: '🐱', title: 'Tả con mèo nhà em',
    danY: {
      moBai: 'Giới thiệu con mèo (nhà em nuôi con mèo tên gì, từ bao giờ).',
      thanBai: [
        'Tả hình dáng: bộ lông, đôi mắt, cái đuôi, bốn chân.',
        'Tả hoạt động: mèo thích làm gì (bắt chuột, nằm sưởi nắng, chơi đùa).',
        'Nêu tình cảm khi chơi với mèo.',
      ],
      ketBai: 'Nêu cảm nghĩ: em yêu quý con mèo như thế nào.',
    },
    tuGoiY: ['lông mượt', 'mắt tròn xoe', 'đuôi dài', 'nhanh nhẹn', 'đáng yêu', 'meo meo', 'rình chuột'],
    baiMau: [
      'Nhà em nuôi một con mèo tên là Mun.',
      'Chú mèo có bộ lông vàng mượt, đôi mắt tròn xoe như hai hòn bi.',
      'Cái đuôi dài luôn ngoe nguẩy, bốn chân nhỏ bước đi rất nhẹ nhàng.',
      'Ban ngày, Mun thích nằm sưởi nắng ngoài hiên.',
      'Ban đêm, chú rình bắt chuột rất giỏi.',
      'Mỗi khi em đi học về, Mun lại chạy ra dụi đầu vào chân em.',
      'Em rất yêu quý chú mèo Mun của nhà mình.',
    ],
  },
  {
    slug: 'ta-cay-bang', emoji: '🌳', title: 'Tả cây bàng ở sân trường',
    danY: {
      moBai: 'Giới thiệu cây bàng (trồng ở đâu trong sân trường, đã lâu chưa).',
      thanBai: [
        'Tả thân cây, gốc cây, tán lá.',
        'Tả lá bàng thay đổi theo mùa (xanh mát, đỏ, rụng).',
        'Kể hoạt động của học sinh dưới gốc bàng.',
      ],
      ketBai: 'Nêu tình cảm với cây bàng, coi cây như người bạn.',
    },
    tuGoiY: ['sừng sững', 'tán lá rộng', 'bóng mát', 'xanh um', 'lá đỏ', 'vui chơi', 'thân quen'],
    baiMau: [
      'Giữa sân trường em có một cây bàng to lớn.',
      'Thân cây xù xì, hai người ôm mới xuể, tán lá xòe rộng như một chiếc ô khổng lồ.',
      'Mùa hè, lá bàng xanh um cho bóng mát rợp cả một góc sân.',
      'Sang mùa thu, lá chuyển dần sang màu đỏ rồi rụng đầy gốc.',
      'Mỗi giờ ra chơi, chúng em thường ngồi dưới gốc bàng đọc sách, trò chuyện.',
      'Cây bàng đã trở thành người bạn thân thiết của chúng em.',
    ],
  },
  {
    slug: 'ta-me', emoji: '👩', title: 'Tả mẹ của em',
    danY: {
      moBai: 'Giới thiệu về mẹ (mẹ tên gì, bao nhiêu tuổi, làm nghề gì).',
      thanBai: [
        'Tả ngoại hình: dáng người, khuôn mặt, mái tóc, nụ cười.',
        'Tả tính tình và việc mẹ làm hằng ngày.',
        'Kể một việc mẹ chăm sóc em.',
      ],
      ketBai: 'Nêu tình cảm và lời hứa của em với mẹ.',
    },
    tuGoiY: ['hiền hậu', 'dịu dàng', 'chăm chỉ', 'nụ cười ấm áp', 'đôi bàn tay', 'yêu thương', 'tần tảo'],
    baiMau: [
      'Người em yêu quý nhất là mẹ của em.',
      'Mẹ em năm nay ba mươi tuổi, dáng người nhỏ nhắn.',
      'Mẹ có khuôn mặt hiền hậu, mái tóc dài và nụ cười thật ấm áp.',
      'Mẹ rất chăm chỉ, ngày ngày lo cơm nước, dạy em học bài.',
      'Mỗi khi em ốm, mẹ thức cả đêm chăm sóc cho em.',
      'Em rất thương mẹ và hứa sẽ chăm ngoan, học giỏi để mẹ vui lòng.',
    ],
  },
  {
    slug: 'ta-cai-cap', emoji: '🎒', title: 'Tả cái cặp sách của em',
    danY: {
      moBai: 'Giới thiệu cái cặp (ai mua cho, vào dịp nào).',
      thanBai: [
        'Tả hình dáng, màu sắc, chất liệu, hình in trên cặp.',
        'Tả các ngăn cặp và công dụng.',
        'Kể cách em giữ gìn cặp.',
      ],
      ketBai: 'Nêu tình cảm với chiếc cặp — người bạn đến trường.',
    },
    tuGoiY: ['mới tinh', 'màu xanh', 'quai đeo', 'nhiều ngăn', 'chắc chắn', 'gọn gàng', 'người bạn'],
    baiMau: [
      'Đầu năm học, mẹ mua cho em một chiếc cặp sách mới.',
      'Chiếc cặp màu xanh da trời, in hình chú gấu trúc rất đáng yêu.',
      'Cặp có hai quai đeo êm ái và ba ngăn rộng rãi.',
      'Ngăn lớn em để sách vở, ngăn nhỏ đựng bút và hộp màu.',
      'Em luôn giữ cặp sạch sẽ, sắp xếp đồ dùng gọn gàng.',
      'Chiếc cặp như người bạn thân cùng em đến trường mỗi ngày.',
    ],
  },
  {
    slug: 'ke-ngay-dau-di-hoc', emoji: '🏫', title: 'Kể về ngày đầu tiên đi học',
    danY: {
      moBai: 'Giới thiệu ngày đầu tiên đến trường (buổi sáng hôm ấy).',
      thanBai: [
        'Kể tâm trạng: hồi hộp, lo lắng, mẹ dắt tay đến trường.',
        'Kể quang cảnh trường lớp, gặp cô giáo và các bạn.',
        'Kể việc diễn ra trong buổi học đầu tiên.',
      ],
      ketBai: 'Nêu cảm xúc: kỉ niệm khó quên.',
    },
    tuGoiY: ['bỡ ngỡ', 'hồi hộp', 'cô giáo', 'bạn mới', 'sân trường', 'kỉ niệm', 'vui vẻ'],
    baiMau: [
      'Em vẫn nhớ mãi ngày đầu tiên được đi học.',
      'Sáng hôm ấy, mẹ dắt tay em đến trường, lòng em vừa hồi hộp vừa bỡ ngỡ.',
      'Sân trường thật rộng và đông vui, cờ hoa rực rỡ.',
      'Cô giáo đón em với nụ cười dịu dàng và dắt em vào lớp.',
      'Em được làm quen với nhiều bạn mới và học bài học đầu tiên.',
      'Ngày đầu đi học là một kỉ niệm đẹp mà em không bao giờ quên.',
    ],
  },
  {
    slug: 'ta-con-ga-trong', emoji: '🐓', title: 'Tả con gà trống',
    danY: {
      moBai: 'Giới thiệu con gà trống (nhà em hay nhà bà nuôi).',
      thanBai: [
        'Tả hình dáng: bộ lông, mào đỏ, cựa, đuôi.',
        'Tả tiếng gáy và thói quen mỗi sáng.',
        'Kể ích lợi của con gà trống.',
      ],
      ketBai: 'Nêu tình cảm với con gà trống.',
    },
    tuGoiY: ['oai vệ', 'mào đỏ chót', 'lông sặc sỡ', 'gáy vang', 'ò ó o', 'cựa sắc', 'chăm chỉ'],
    baiMau: [
      'Nhà bà em nuôi một con gà trống rất đẹp.',
      'Chú gà khoác bộ lông sặc sỡ, chiếc mào đỏ chót trông thật oai vệ.',
      'Đuôi chú cong vút, đôi chân có cựa sắc nhọn.',
      'Mỗi sáng sớm, chú lại đứng trên đống rơm gáy vang: Ò ó o!',
      'Tiếng gáy của chú gọi mọi người thức dậy đón ngày mới.',
      'Em rất thích chú gà trống chăm chỉ của nhà bà.',
    ],
  },
];

export const totalTapLamVan = () => TAP_LAM_VAN.length;
