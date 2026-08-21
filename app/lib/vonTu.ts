// Mở rộng vốn từ tiếng Việt cho bé — từ ngữ theo chủ đề, kèm nghĩa dễ hiểu và ví dụ.
// Nghe từ / nghe ví dụ bằng giọng Việt (proxy tl=vi). Giúp bé hiểu và dùng từ đúng.

export type VonTuWord = { tu: string; emoji: string; nghia: string; vd: string };
export type VonTuTopic = { slug: string; emoji: string; title: string; words: VonTuWord[] };

export const VON_TU_TOPICS: VonTuTopic[] = [
  {
    slug: 'con-vat', emoji: '🐾', title: 'Con vật',
    words: [
      { tu: 'hươu cao cổ', emoji: '🦒', nghia: 'con vật có cái cổ rất dài, thích ăn lá cây trên cao.', vd: 'Hươu cao cổ vươn cổ ăn lá.' },
      { tu: 'cá heo', emoji: '🐬', nghia: 'con vật sống dưới biển, thông minh và thích nhảy.', vd: 'Cá heo bơi lượn dưới biển.' },
      { tu: 'kiến', emoji: '🐜', nghia: 'con vật rất nhỏ, chăm chỉ, sống thành đàn.', vd: 'Đàn kiến tha mồi về tổ.' },
      { tu: 'gấu trúc', emoji: '🐼', nghia: 'con vật lông đen trắng, thích ăn tre trúc.', vd: 'Gấu trúc đang ăn măng.' },
      { tu: 'cú mèo', emoji: '🦉', nghia: 'loài chim thức vào ban đêm, có đôi mắt to.', vd: 'Cú mèo kêu trong đêm.' },
      { tu: 'sư tử', emoji: '🦁', nghia: 'con vật to khỏe, được gọi là chúa tể rừng xanh.', vd: 'Sư tử có bờm rất đẹp.' },
      { tu: 'chuồn chuồn', emoji: '🦗', nghia: 'con vật có cánh mỏng, hay bay là là mặt nước.', vd: 'Chuồn chuồn bay khi trời sắp mưa.' },
      { tu: 'ốc sên', emoji: '🐌', nghia: 'con vật bò rất chậm, mang chiếc vỏ trên lưng.', vd: 'Ốc sên bò chậm trên lá.' },
    ],
  },
  {
    slug: 'nghe-nghiep', emoji: '👷', title: 'Nghề nghiệp',
    words: [
      { tu: 'bác sĩ', emoji: '👨‍⚕️', nghia: 'người khám và chữa bệnh cho mọi người.', vd: 'Bác sĩ khám bệnh cho em.' },
      { tu: 'giáo viên', emoji: '👩‍🏫', nghia: 'người dạy học cho học sinh.', vd: 'Giáo viên dạy em tập đọc.' },
      { tu: 'lính cứu hỏa', emoji: '🧑‍🚒', nghia: 'người dập lửa và cứu người khi có cháy.', vd: 'Lính cứu hỏa dập tắt đám cháy.' },
      { tu: 'phi công', emoji: '✈️', nghia: 'người lái máy bay.', vd: 'Phi công lái máy bay lên trời.' },
      { tu: 'nông dân', emoji: '👨‍🌾', nghia: 'người trồng lúa, làm ruộng, nuôi cây trồng.', vd: 'Bác nông dân đang cấy lúa.' },
      { tu: 'đầu bếp', emoji: '👨‍🍳', nghia: 'người nấu các món ăn ngon.', vd: 'Đầu bếp nấu món phở thơm phức.' },
      { tu: 'cảnh sát', emoji: '👮', nghia: 'người giữ gìn trật tự, bảo vệ mọi người.', vd: 'Chú cảnh sát chỉ đường cho em.' },
      { tu: 'kỹ sư', emoji: '👷', nghia: 'người thiết kế, xây dựng máy móc hoặc nhà cửa.', vd: 'Kỹ sư xây một cây cầu lớn.' },
    ],
  },
  {
    slug: 'thien-nhien', emoji: '🌈', title: 'Thiên nhiên',
    words: [
      { tu: 'cầu vồng', emoji: '🌈', nghia: 'dải bảy màu hiện trên trời sau cơn mưa.', vd: 'Cầu vồng hiện ra sau mưa.' },
      { tu: 'sấm sét', emoji: '⛈️', nghia: 'tiếng nổ lớn và tia lửa khi trời mưa to.', vd: 'Sấm sét làm em giật mình.' },
      { tu: 'sương mù', emoji: '🌫️', nghia: 'làn hơi nước mờ vào buổi sáng sớm.', vd: 'Sáng sớm có sương mù giăng khắp.' },
      { tu: 'thác nước', emoji: '🏞️', nghia: 'dòng nước đổ mạnh từ trên cao xuống.', vd: 'Thác nước chảy ào ào.' },
      { tu: 'núi lửa', emoji: '🌋', nghia: 'ngọn núi phun ra lửa và tro nóng.', vd: 'Núi lửa phun trào dữ dội.' },
      { tu: 'hoàng hôn', emoji: '🌇', nghia: 'lúc mặt trời lặn vào buổi chiều tối.', vd: 'Hoàng hôn nhuộm đỏ bầu trời.' },
      { tu: 'bình minh', emoji: '🌅', nghia: 'lúc mặt trời mọc vào buổi sáng sớm.', vd: 'Bình minh lên, gà gáy vang.' },
      { tu: 'tuyết', emoji: '❄️', nghia: 'những bông trắng rơi xuống khi trời rất lạnh.', vd: 'Tuyết rơi phủ trắng mặt đất.' },
    ],
  },
  {
    slug: 'cam-xuc', emoji: '😊', title: 'Cảm xúc',
    words: [
      { tu: 'vui vẻ', emoji: '😄', nghia: 'cảm thấy vui, thoải mái trong lòng.', vd: 'Em rất vui vẻ khi được đi chơi.' },
      { tu: 'buồn bã', emoji: '😢', nghia: 'cảm thấy buồn, không vui.', vd: 'Nam buồn bã vì làm mất đồ chơi.' },
      { tu: 'tức giận', emoji: '😠', nghia: 'cảm thấy khó chịu, nổi nóng.', vd: 'Đừng tức giận, hãy bình tĩnh nhé.' },
      { tu: 'sợ hãi', emoji: '😨', nghia: 'cảm thấy sợ, lo lắng trước điều gì đó.', vd: 'Bé sợ hãi khi nghe tiếng sấm.' },
      { tu: 'ngạc nhiên', emoji: '😲', nghia: 'thấy bất ngờ trước điều lạ.', vd: 'Em ngạc nhiên khi thấy món quà.' },
      { tu: 'xấu hổ', emoji: '😳', nghia: 'thấy ngượng ngùng, e thẹn.', vd: 'Bé xấu hổ khi bị khen trước lớp.' },
      { tu: 'hồi hộp', emoji: '😬', nghia: 'lo lắng, chờ đợi điều sắp xảy ra.', vd: 'Em hồi hộp trước giờ thi.' },
      { tu: 'tự hào', emoji: '😌', nghia: 'thấy hãnh diện vì điều tốt mình làm được.', vd: 'Em tự hào vì được điểm mười.' },
    ],
  },
  {
    slug: 'do-dung', emoji: '🏠', title: 'Đồ dùng trong nhà',
    words: [
      { tu: 'tủ lạnh', emoji: '🧊', nghia: 'đồ dùng giữ thức ăn được mát và tươi lâu.', vd: 'Mẹ để sữa trong tủ lạnh.' },
      { tu: 'quạt máy', emoji: '🌀', nghia: 'đồ dùng tạo gió cho mát.', vd: 'Trời nóng, em bật quạt máy.' },
      { tu: 'nồi cơm điện', emoji: '🍚', nghia: 'đồ dùng để nấu cơm bằng điện.', vd: 'Nồi cơm điện nấu cơm chín thơm.' },
      { tu: 'đồng hồ', emoji: '🕐', nghia: 'đồ dùng để xem giờ.', vd: 'Đồng hồ chỉ đúng bảy giờ.' },
      { tu: 'gương', emoji: '🪞', nghia: 'đồ dùng để soi, nhìn thấy chính mình.', vd: 'Em soi gương chải tóc.' },
      { tu: 'chổi', emoji: '🧹', nghia: 'đồ dùng để quét dọn nhà cửa.', vd: 'Em cầm chổi quét nhà.' },
      { tu: 'bàn là', emoji: '♨️', nghia: 'đồ dùng làm phẳng quần áo cho thẳng.', vd: 'Mẹ là quần áo cho phẳng.' },
      { tu: 'ấm đun nước', emoji: '🫖', nghia: 'đồ dùng để đun nước cho sôi.', vd: 'Ấm đun nước kêu reo khi sôi.' },
    ],
  },
  {
    slug: 'giao-thong', emoji: '🚗', title: 'Phương tiện giao thông',
    words: [
      { tu: 'xe cứu thương', emoji: '🚑', nghia: 'xe chở người bệnh đến bệnh viện.', vd: 'Xe cứu thương hú còi chạy nhanh.' },
      { tu: 'tàu hỏa', emoji: '🚂', nghia: 'đoàn xe dài chạy trên đường ray.', vd: 'Tàu hỏa chạy trên đường ray.' },
      { tu: 'tàu thủy', emoji: '🚢', nghia: 'phương tiện to chạy trên biển.', vd: 'Tàu thủy chở hàng qua biển.' },
      { tu: 'trực thăng', emoji: '🚁', nghia: 'máy bay có cánh quạt quay trên đầu.', vd: 'Trực thăng bay lên thẳng đứng.' },
      { tu: 'xe cứu hỏa', emoji: '🚒', nghia: 'xe chở nước và lính cứu hỏa đi dập lửa.', vd: 'Xe cứu hỏa đến dập đám cháy.' },
      { tu: 'khinh khí cầu', emoji: '🎈', nghia: 'quả cầu to bay lên nhờ khí nóng.', vd: 'Khinh khí cầu bay cao trên trời.' },
      { tu: 'xe buýt', emoji: '🚌', nghia: 'xe to chở nhiều người trong thành phố.', vd: 'Em đi học bằng xe buýt.' },
      { tu: 'thuyền buồm', emoji: '⛵', nghia: 'thuyền chạy nhờ gió thổi vào cánh buồm.', vd: 'Thuyền buồm lướt trên mặt nước.' },
    ],
  },
];

export const totalVonTu = () => VON_TU_TOPICS.reduce((n, t) => n + t.words.length, 0);
