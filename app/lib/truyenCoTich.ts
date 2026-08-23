// Truyện cổ tích Việt Nam cho bé — kể lại ngắn gọn (truyện dân gian, không bản quyền).
// Đọc từng câu / đọc cả truyện bằng giọng Việt (speakSequence). Mỗi câu ≤ ~180 ký tự để đọc trọn.

export type TruyenQuestion = { q: string; options: string[]; correct: number; explain: string };

export type Truyen = {
  slug: string;
  emoji: string;
  title: string;
  cau: string[]; // các câu trong truyện
  baiHoc: string; // bài học rút ra
  cauHoi: TruyenQuestion[]; // câu hỏi đọc hiểu
};

export const TRUYEN_CO_TICH: Truyen[] = [
  {
    slug: 'thanh-giong', emoji: '🐎', title: 'Thánh Gióng',
    cau: [
      'Ngày xưa, ở làng Gióng có hai vợ chồng già hiền lành mà mãi chưa có con.',
      'Một hôm, bà lão ra đồng thấy một vết chân rất to, liền ướm thử. Về nhà bà mang thai và sinh ra một cậu bé.',
      'Lạ thay, cậu bé lên ba vẫn không biết nói, biết cười, cũng chẳng biết đi.',
      'Bấy giờ giặc Ân sang xâm lược nước ta. Nhà vua sai sứ giả đi tìm người tài đánh giặc.',
      'Nghe tiếng sứ giả, cậu bé bỗng cất tiếng nói: "Mẹ mời sứ giả vào đây cho con!"',
      'Cậu bảo sứ giả về tâu vua rèn cho mình ngựa sắt, roi sắt và áo giáp sắt.',
      'Từ đó, cậu bé lớn nhanh như thổi, ăn bao nhiêu cũng không no, áo vừa mặc xong đã chật.',
      'Giặc đến, cậu bé vươn vai thành tráng sĩ, mặc giáp sắt, cưỡi ngựa sắt xông ra trận.',
      'Ngựa sắt phun lửa, tráng sĩ vung roi đánh tan quân giặc. Roi gãy, chàng nhổ tre bên đường quật vào giặc.',
      'Dẹp xong giặc, tráng sĩ cưỡi ngựa lên đỉnh núi Sóc, cởi áo giáp rồi cả người lẫn ngựa bay về trời.',
      'Nhớ ơn, vua phong là Phù Đổng Thiên Vương và lập đền thờ. Dân ta quen gọi là Thánh Gióng.',
    ],
    baiHoc: 'Lòng yêu nước và ý chí có thể làm nên điều phi thường. Ai cũng có thể góp sức bảo vệ quê hương.',
    cauHoi: [
      { q: 'Thánh Gióng lớn lên đánh giặc nào?', options: ['Giặc Ân', 'Giặc Minh', 'Giặc Nguyên'], correct: 0, explain: 'Truyện kể giặc Ân sang xâm lược nước ta.' },
      { q: 'Khi roi sắt gãy, Gióng dùng gì để đánh giặc?', options: ['Cây tre', 'Thanh gươm', 'Cung tên'], correct: 0, explain: 'Chàng nhổ tre bên đường quật vào giặc.' },
    ],
  },
  {
    slug: 'son-tinh-thuy-tinh', emoji: '⛰️', title: 'Sơn Tinh – Thủy Tinh',
    cau: [
      'Vua Hùng thứ mười tám có một người con gái xinh đẹp tên là Mị Nương.',
      'Vua muốn kén cho con một người chồng thật tài giỏi.',
      'Một hôm, có hai chàng trai cùng đến cầu hôn.',
      'Một người là Sơn Tinh, chúa vùng núi Tản Viên, vẫy tay là núi đồi mọc lên.',
      'Người kia là Thủy Tinh, chúa vùng nước thẳm, hô mưa gọi gió được.',
      'Cả hai đều tài giỏi nên vua ra điều kiện: ai mang lễ vật đến trước sẽ được cưới Mị Nương.',
      'Hôm sau, Sơn Tinh mang lễ vật đến trước và rước Mị Nương về núi.',
      'Thủy Tinh đến sau, không lấy được vợ, nổi giận đuổi theo.',
      'Thủy Tinh hô mưa gió, dâng nước lũ ngập cả ruộng đồng, nhà cửa.',
      'Sơn Tinh không hề nao núng, nước dâng cao bao nhiêu thì núi lại cao lên bấy nhiêu.',
      'Đánh mãi không thắng, Thủy Tinh đành rút quân.',
      'Từ đó, năm nào Thủy Tinh cũng dâng nước đánh Sơn Tinh, gây ra lũ lụt, nhưng lần nào cũng thua.',
    ],
    baiHoc: 'Truyện giải thích hiện tượng lũ lụt hằng năm và ca ngợi tinh thần bền bỉ chống thiên tai của ông cha ta.',
    cauHoi: [
      { q: 'Ai đã cưới được Mị Nương?', options: ['Sơn Tinh', 'Thủy Tinh', 'Không ai'], correct: 0, explain: 'Sơn Tinh mang lễ vật đến trước nên cưới được Mị Nương.' },
      { q: 'Vì sao hằng năm có lũ lụt (theo truyện)?', options: ['Thủy Tinh dâng nước đánh Sơn Tinh', 'Trời mưa nhiều', 'Sông đầy nước'], correct: 0, explain: 'Năm nào Thủy Tinh cũng dâng nước đánh Sơn Tinh để trả thù.' },
    ],
  },
  {
    slug: 'su-tich-ho-guom', emoji: '🗡️', title: 'Sự tích Hồ Gươm',
    cau: [
      'Thời giặc Minh đô hộ, ở vùng Lam Sơn có nghĩa quân do Lê Lợi đứng đầu nổi dậy chống giặc.',
      'Buổi đầu, nghĩa quân còn yếu, nhiều lần thua trận.',
      'Đức Long Quân quyết định cho nghĩa quân mượn thanh gươm thần để đánh giặc.',
      'Một người dân chài tên Lê Thận ba lần kéo lưới đều được một lưỡi gươm.',
      'Sau này, Lê Lợi tình cờ nhặt được một chuôi gươm nạm ngọc trên cây trong rừng.',
      'Lạ thay, lưỡi gươm của Lê Thận tra vào chuôi gươm ấy thì vừa khít.',
      'Có gươm thần, nghĩa quân đánh đâu thắng đó, cuối cùng đuổi sạch giặc Minh ra khỏi bờ cõi.',
      'Đất nước thanh bình, Lê Lợi lên làm vua.',
      'Một hôm, vua dạo thuyền trên hồ Tả Vọng thì một con rùa vàng nổi lên.',
      'Rùa vàng nói: "Xin bệ hạ trả gươm lại cho Long Quân!"',
      'Vua nâng gươm, rùa vàng đớp lấy rồi lặn xuống nước.',
      'Từ đó, hồ Tả Vọng được đổi tên thành Hồ Gươm (hay Hồ Hoàn Kiếm).',
    ],
    baiHoc: 'Truyện ca ngợi tinh thần đoàn kết đánh giặc cứu nước và giải thích tên gọi Hồ Hoàn Kiếm ở Hà Nội.',
    cauHoi: [
      { q: 'Ai lãnh đạo nghĩa quân đánh giặc Minh?', options: ['Lê Lợi', 'Lê Thận', 'Long Quân'], correct: 0, explain: 'Lê Lợi đứng đầu nghĩa quân Lam Sơn.' },
      { q: 'Vua trả gươm cho ai?', options: ['Long Quân (qua rùa vàng)', 'Lê Thận', 'Nhà vua giữ lại'], correct: 0, explain: 'Rùa vàng thay Long Quân đến đòi lại gươm thần.' },
    ],
  },
  {
    slug: 'cay-tre-tram-dot', emoji: '🎋', title: 'Cây tre trăm đốt',
    cau: [
      'Ngày xưa, có anh nông dân nghèo, khỏe mạnh, hiền lành đi ở cho một lão nhà giàu.',
      'Lão nhà giàu hứa: "Con làm cho ta ba năm, ta sẽ gả con gái cho."',
      'Anh chăm chỉ làm lụng suốt ba năm, mong đến ngày cưới vợ.',
      'Nhưng lão nhà giàu tham lam lại định gả con gái cho một nhà giàu khác.',
      'Lão lừa anh vào rừng tìm cây tre đủ trăm đốt thì mới cho cưới.',
      'Anh tìm mãi trong rừng, chặt bao nhiêu cây cũng không có cây tre nào đủ trăm đốt.',
      'Anh ngồi khóc thì Bụt hiện lên hỏi han và bày cách.',
      'Bụt bảo anh chặt lấy một trăm đốt tre, rồi đọc câu thần chú "Khắc nhập, khắc nhập!"',
      'Anh làm theo, một trăm đốt tre liền dính lại thành cây tre trăm đốt.',
      'Muốn tháo rời để mang về, anh đọc "Khắc xuất, khắc xuất!" thì các đốt tre lại rời ra.',
      'Về đến nơi, thấy lão nhà giàu đang mở tiệc cưới, anh đọc "Khắc nhập" khiến lão dính chặt vào cây tre.',
      'Lão sợ quá phải giữ đúng lời hứa, gả con gái cho anh. Anh đọc "Khắc xuất" thả lão ra.',
    ],
    baiHoc: 'Ở hiền gặp lành, chăm chỉ thật thà sẽ được đền đáp; còn tham lam lừa dối sẽ bị trừng phạt.',
    cauHoi: [
      { q: 'Ai đã giúp anh nông dân?', options: ['Bụt', 'Nhà vua', 'Rùa vàng'], correct: 0, explain: 'Bụt hiện lên bày cho anh câu thần chú.' },
      { q: 'Câu thần chú để các đốt tre dính lại là gì?', options: ['Khắc nhập, khắc nhập', 'Khắc xuất, khắc xuất', 'Vừng ơi mở ra'], correct: 0, explain: '"Khắc nhập" làm tre dính lại, "khắc xuất" làm tre rời ra.' },
    ],
  },
  {
    slug: 'su-tich-qua-dua-hau', emoji: '🍉', title: 'Sự tích quả dưa hấu',
    cau: [
      'Ngày xưa, vua Hùng có một người con nuôi tài giỏi tên là Mai An Tiêm.',
      'An Tiêm thường nói của cải làm ra là nhờ đôi bàn tay của mình.',
      'Vua nghe vậy cho là kiêu ngạo, liền đày cả gia đình An Tiêm ra một hòn đảo hoang.',
      'Trên đảo chẳng có gì, nhưng An Tiêm không hề nản chí.',
      'Một hôm, chàng thấy đàn chim ăn một loại hạt rồi nhả xuống, liền nhặt về gieo trồng.',
      'Ít lâu sau, những hạt ấy mọc thành cây, ra những quả to, vỏ xanh, ruột đỏ, ăn rất ngọt và mát.',
      'An Tiêm gọi đó là quả dưa hấu.',
      'Chàng khắc tên mình lên vỏ dưa rồi thả xuống biển cho trôi đi khắp nơi.',
      'Nhờ vậy, thuyền buôn tìm đến đảo đổi lấy dưa, gia đình chàng ngày càng khấm khá.',
      'Vua Hùng biết chuyện, hiểu ra tài năng và ý chí của An Tiêm, bèn cho đón cả nhà về.',
      'Từ đó, giống dưa hấu được trồng khắp nơi trên đất nước ta.',
    ],
    baiHoc: 'Có ý chí, cần cù và tự lực thì dù trong hoàn cảnh khó khăn nhất cũng làm nên thành quả.',
    cauHoi: [
      { q: 'Mai An Tiêm trồng được quả gì trên đảo?', options: ['Dưa hấu', 'Dưa lê', 'Bí đỏ'], correct: 0, explain: 'Chàng gieo hạt chim nhả và trồng được quả dưa hấu.' },
      { q: 'An Tiêm làm gì để mọi người biết đến quả dưa?', options: ['Khắc tên lên vỏ dưa thả trôi biển', 'Đem bán ở chợ', 'Tặng nhà vua'], correct: 0, explain: 'Chàng khắc tên rồi thả dưa xuống biển cho trôi đi khắp nơi.' },
    ],
  },
  {
    slug: 'cay-khe', emoji: '🐦', title: 'Cây khế (Ăn khế trả vàng)',
    cau: [
      'Ngày xưa có hai anh em, cha mẹ mất sớm để lại một ít ruộng vườn.',
      'Người anh tham lam chiếm hết gia tài, chỉ chia cho em một cây khế và một túp lều nhỏ.',
      'Người em hiền lành, ngày ngày chăm sóc cây khế, cây ra quả trĩu cành.',
      'Một hôm, có con chim lạ bay đến ăn khế.',
      'Người em than: "Chim ơi, cây khế là tất cả của nhà tôi!"',
      'Chim liền nói: "Ăn một quả, trả cục vàng, may túi ba gang, mang đi mà đựng."',
      'Người em may một chiếc túi ba gang. Chim chở anh ra đảo có rất nhiều vàng bạc.',
      'Anh chỉ lấy vừa đủ túi ba gang rồi trở về, từ đó sống sung túc.',
      'Người anh tham lam nghe chuyện, đòi đổi hết gia tài lấy cây khế.',
      'Khi chim đến, người anh may một chiếc túi thật to, tới mười hai gang.',
      'Ra đảo, anh ta tham lam nhét vàng đầy túi, còn giắt khắp người.',
      'Túi quá nặng, chim đuối sức, người anh tham lam rơi xuống biển.',
    ],
    baiHoc: 'Hiền lành, biết đủ thì được hưởng phúc; tham lam quá độ sẽ chuốc lấy tai họa.',
    cauHoi: [
      { q: 'Con chim hứa trả gì khi ăn khế?', options: ['Cục vàng', 'Hạt ngọc', 'Quả táo'], correct: 0, explain: 'Chim nói "Ăn một quả, trả cục vàng, may túi ba gang".' },
      { q: 'Vì sao người anh tham lam gặp nạn?', options: ['Lấy quá nhiều vàng, túi quá nặng', 'Đi lạc đường', 'Chim bỏ rơi'], correct: 0, explain: 'Anh ta tham lam nhét vàng quá nặng nên rơi xuống biển.' },
    ],
  },
];

export const totalTruyen = () => TRUYEN_CO_TICH.length;
