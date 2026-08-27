// "Đố vui khám phá" — câu hỏi kiến thức tổng quát cho bé (ngoài chương trình), mỗi câu
// có giải thích ngắn gọn dễ hiểu. Nội dung đã kiểm tra chính xác, phù hợp trẻ 5–10 tuổi.

export type KhamPhaQ = {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

export type KhamPhaTopic = {
  slug: string;
  label: string;
  emoji: string;
  questions: KhamPhaQ[];
};

export const KHAM_PHA_TOPICS: KhamPhaTopic[] = [
  {
    slug: 'dong-vat',
    label: 'Thế giới động vật',
    emoji: '🦁',
    questions: [
      { question: 'Con vật nào lớn nhất thế giới?', options: ['Voi', 'Cá voi xanh', 'Khủng long', 'Hươu cao cổ'], correct_index: 1, explanation: 'Cá voi xanh là động vật lớn nhất từng sống trên Trái Đất, dài tới 30 mét — bằng khoảng 3 chiếc xe buýt nối đuôi nhau!' },
      { question: 'Con vật nào có thể đổi màu da để nguỵ trang?', options: ['Tắc kè hoa', 'Con thỏ', 'Con gà', 'Con bò'], correct_index: 0, explanation: 'Tắc kè hoa đổi màu da để hoà lẫn vào môi trường, giúp trốn kẻ thù và rình mồi.' },
      { question: 'Ong chăm chỉ làm ra thứ gì ngọt ngào?', options: ['Sữa', 'Mật ong', 'Đường', 'Kẹo'], correct_index: 1, explanation: 'Ong hút mật hoa rồi biến thành mật ong dự trữ trong tổ. Mỗi giọt mật là công sức của rất nhiều chú ong.' },
      { question: 'Con vật nào ngủ trong tư thế đứng?', options: ['Con mèo', 'Con ngựa', 'Con chó', 'Con lợn'], correct_index: 1, explanation: 'Ngựa có thể ngủ khi đang đứng nhờ khoá được các khớp chân, để sẵn sàng chạy trốn khi có nguy hiểm.' },
      { question: 'Loài chim nào biết bơi nhưng không biết bay?', options: ['Chim sẻ', 'Chim bồ câu', 'Chim cánh cụt', 'Chim én'], correct_index: 2, explanation: 'Chim cánh cụt dùng cánh như mái chèo để bơi rất giỏi dưới nước, nhưng không thể bay lên trời.' },
      { question: 'Con tằm nhả tơ để làm gì?', options: ['Làm tổ kén', 'Bắt mồi', 'Uống nước', 'Bay lên'], correct_index: 0, explanation: 'Tằm nhả tơ quấn quanh mình thành kén để hoá thành bướm. Tơ tằm được người ta dệt thành lụa.' },
      { question: 'Con vật nào chịu khát rất giỏi ở sa mạc?', options: ['Lạc đà', 'Cá heo', 'Gấu trắng', 'Chim cánh cụt'], correct_index: 0, explanation: 'Lạc đà tích trữ mỡ trong bướu và uống được rất nhiều nước một lúc, nên đi lâu trên sa mạc không cần uống.' },
      { question: 'Cá thở dưới nước bằng bộ phận nào?', options: ['Phổi', 'Mũi', 'Mang', 'Miệng'], correct_index: 2, explanation: 'Cá thở bằng mang — bộ phận lọc khí ô-xy hoà tan trong nước, nên cá sống được dưới nước.' },
      { question: 'Con vật nào được gọi là "chúa sơn lâm"?', options: ['Con hổ', 'Con mèo', 'Con sói', 'Con nai'], correct_index: 0, explanation: 'Hổ được gọi là "chúa sơn lâm" vì to khoẻ, oai vệ và là kẻ săn mồi mạnh nhất trong rừng.' },
      { question: 'Con vật nào có chiếc cổ dài nhất?', options: ['Hươu cao cổ', 'Con ngựa', 'Con lạc đà', 'Con voi'], correct_index: 0, explanation: 'Hươu cao cổ có cổ rất dài để ăn lá trên ngọn cây cao mà con vật khác không với tới.' },
      { question: 'Con voi dùng bộ phận nào để hút nước và lấy thức ăn?', options: ['Vòi', 'Tai', 'Đuôi', 'Chân'], correct_index: 0, explanation: 'Voi có chiếc vòi dài linh hoạt để hút nước, tắm và cuốn thức ăn đưa vào miệng.' },
      { question: 'Con vật nào gáy "ò ó o" báo hiệu trời sáng?', options: ['Gà trống', 'Con vịt', 'Con chó', 'Con mèo'], correct_index: 0, explanation: 'Gà trống thường gáy vào sáng sớm, như chiếc đồng hồ báo thức của làng quê.' },
    ],
  },
  {
    slug: 'co-the',
    label: 'Cơ thể con người',
    emoji: '🧠',
    questions: [
      { question: 'Cơ quan nào bơm máu đi khắp cơ thể?', options: ['Phổi', 'Tim', 'Dạ dày', 'Gan'], correct_index: 1, explanation: 'Tim là chiếc "máy bơm" đập suốt ngày đêm để đưa máu mang ô-xy và chất bổ đi nuôi cơ thể.' },
      { question: 'Ta thở bằng cơ quan nào?', options: ['Phổi', 'Tim', 'Ruột', 'Thận'], correct_index: 0, explanation: 'Hai lá phổi hít khí ô-xy vào và thải khí các-bô-níc ra. Bé thử đặt tay lên ngực khi hít thở sâu nhé!' },
      { question: 'Bộ phận nào giúp ta suy nghĩ và ghi nhớ?', options: ['Não', 'Tay', 'Chân', 'Bụng'], correct_index: 0, explanation: 'Não là "tổng chỉ huy" điều khiển mọi hoạt động: suy nghĩ, nhớ, nói, cử động… Học nhiều giúp não thông minh hơn.' },
      { question: 'Cơ thể người lớn có khoảng bao nhiêu chiếc xương?', options: ['26', '106', '206', '600'], correct_index: 2, explanation: 'Người lớn có khoảng 206 chiếc xương ghép lại thành bộ khung nâng đỡ cơ thể. Em bé mới sinh còn nhiều xương hơn!' },
      { question: 'Ta dùng gì để nếm được vị ngọt, chua, mặn?', options: ['Lưỡi', 'Mũi', 'Tai', 'Mắt'], correct_index: 0, explanation: 'Trên lưỡi có nhiều nụ vị giác giúp ta cảm nhận vị ngọt, mặn, chua, đắng của thức ăn.' },
      { question: 'Vì sao ta cần đánh răng mỗi ngày?', options: ['Cho đẹp', 'Để răng chắc khoẻ, không sâu', 'Cho vui', 'Không cần thiết'], correct_index: 1, explanation: 'Đánh răng loại bỏ mảng bám và vi khuẩn, giúp răng chắc khoẻ và tránh sâu răng. Nên đánh răng sáng và tối.' },
      { question: 'Bộ phận nào giúp ta nghe được âm thanh?', options: ['Mắt', 'Tai', 'Mũi', 'Tay'], correct_index: 1, explanation: 'Tai thu nhận âm thanh rồi truyền tín hiệu lên não để ta nghe được tiếng nói, tiếng nhạc.' },
      { question: 'Ăn nhiều rau và trái cây giúp cơ thể thế nào?', options: ['Yếu đi', 'Khoẻ mạnh, đủ vitamin', 'Buồn ngủ', 'Không sao'], correct_index: 1, explanation: 'Rau và trái cây cung cấp vitamin và chất xơ giúp cơ thể khoẻ mạnh, mắt sáng và ít ốm.' },
      { question: 'Máu trong cơ thể chúng ta có màu gì?', options: ['Màu xanh', 'Màu đỏ', 'Màu vàng', 'Màu trắng'], correct_index: 1, explanation: 'Máu có màu đỏ vì chứa chất mang ô-xy đi nuôi cơ thể. Khi bị đứt tay, ta thấy máu đỏ chảy ra.' },
      { question: 'Cơ quan nào nghiền và tiêu hoá thức ăn ta ăn vào?', options: ['Dạ dày', 'Phổi', 'Tim', 'Não'], correct_index: 0, explanation: 'Thức ăn xuống dạ dày được nhào trộn và tiêu hoá, rồi chất bổ được ruột hấp thụ nuôi cơ thể.' },
      { question: 'Vì sao cần rửa tay trước khi ăn?', options: ['Cho tay thơm', 'Loại bỏ vi khuẩn, tránh bệnh', 'Cho vui', 'Không cần'], correct_index: 1, explanation: 'Tay cầm nắm nhiều thứ nên bám vi khuẩn. Rửa tay bằng xà phòng giúp tránh đau bụng và bệnh tật.' },
      { question: 'Làn da bao bọc bên ngoài giúp cơ thể điều gì?', options: ['Bảo vệ và cảm nhận nóng lạnh', 'Để nhìn', 'Để nghe', 'Để thở'], correct_index: 0, explanation: 'Da bảo vệ cơ thể khỏi bụi bẩn, vi khuẩn và giúp ta cảm nhận nóng, lạnh, đau khi chạm vào vật.' },
    ],
  },
  {
    slug: 'thien-nhien',
    label: 'Thiên nhiên & thời tiết',
    emoji: '🌈',
    questions: [
      { question: 'Vì sao trời có mưa?', options: ['Do mây khóc', 'Hơi nước bốc lên tạo mây, mây nặng rơi xuống', 'Do gió thổi', 'Do trời tối'], correct_index: 1, explanation: 'Mặt Trời làm nước bốc hơi bay lên trời tạo thành mây. Khi mây chứa nhiều nước và nặng, nước rơi xuống thành mưa.' },
      { question: 'Cầu vồng thường có mấy màu?', options: ['3 màu', '5 màu', '7 màu', '10 màu'], correct_index: 2, explanation: 'Cầu vồng có 7 màu: đỏ, cam, vàng, lục, lam, chàm, tím — xuất hiện khi ánh nắng chiếu qua những giọt mưa.' },
      { question: 'Cây xanh ban ngày nhả ra khí gì giúp ta thở?', options: ['Khí ô-xy', 'Khói', 'Hơi nước', 'Khí độc'], correct_index: 0, explanation: 'Ban ngày, cây quang hợp và nhả ra khí ô-xy — thứ khí ta cần để thở. Vì vậy trồng cây giúp không khí trong lành.' },
      { question: 'Mặt Trời mọc ở hướng nào?', options: ['Hướng Tây', 'Hướng Đông', 'Hướng Bắc', 'Hướng Nam'], correct_index: 1, explanation: 'Mặt Trời mọc ở hướng Đông vào buổi sáng và lặn ở hướng Tây vào buổi chiều.' },
      { question: 'Nước biển có vị gì?', options: ['Ngọt', 'Mặn', 'Chua', 'Không có vị'], correct_index: 1, explanation: 'Nước biển mặn vì có hoà tan rất nhiều muối. Vì vậy ta không uống nước biển được.' },
      { question: 'Sấm sét thường xuất hiện khi nào?', options: ['Trời nắng đẹp', 'Trời mưa dông', 'Ban đêm yên tĩnh', 'Mùa xuân'], correct_index: 1, explanation: 'Sét là tia lửa điện khổng lồ trong mây dông; sau tia chớp ta nghe tiếng sấm. Khi có sấm sét nên vào nhà trú.' },
      { question: 'Ba trạng thái của nước là gì?', options: ['Rắn, lỏng, khí', 'Nóng, ấm, lạnh', 'To, nhỏ, vừa', 'Xanh, đỏ, vàng'], correct_index: 0, explanation: 'Nước có thể ở thể lỏng (nước uống), thể rắn (nước đá) và thể khí (hơi nước). Thật kỳ diệu phải không?' },
      { question: 'Ong và bướm giúp cây bằng cách nào?', options: ['Ăn lá', 'Thụ phấn cho hoa', 'Bẻ cành', 'Không giúp gì'], correct_index: 1, explanation: 'Khi hút mật, ong bướm mang phấn hoa từ bông này sang bông khác, giúp hoa kết trái. Đó gọi là thụ phấn.' },
      { question: 'Cây xanh cần những gì để sống và lớn lên?', options: ['Ánh nắng, nước và không khí', 'Chỉ cần bóng tối', 'Chỉ cần đá', 'Không cần gì'], correct_index: 0, explanation: 'Cây cần ánh nắng, nước và không khí để tạo thức ăn và lớn lên. Vì vậy ta nhớ tưới cây nhé!' },
      { question: 'Vì sao lá cây thường có màu xanh?', options: ['Do chất diệp lục', 'Do sơn màu', 'Do nước mưa', 'Do ánh trăng'], correct_index: 0, explanation: 'Trong lá có chất diệp lục màu xanh, giúp cây hấp thụ ánh nắng để tự tạo thức ăn.' },
      { question: 'Nước từ các con sông cuối cùng chảy ra đâu?', options: ['Ra biển', 'Lên trời', 'Vào nhà', 'Xuống hang'], correct_index: 0, explanation: 'Sông gom nước rồi chảy ra biển. Từ biển nước lại bốc hơi tạo mây và mưa — một vòng tuần hoàn kỳ diệu.' },
      { question: 'Núi lửa khi phun trào tuôn ra thứ gì rất nóng?', options: ['Dung nham', 'Nước đá', 'Kẹo', 'Bông'], correct_index: 0, explanation: 'Núi lửa phun ra dung nham (đá nóng chảy) đỏ rực và rất nóng, cùng tro bụi bốc cao lên trời.' },
    ],
  },
  {
    slug: 'vu-tru',
    label: 'Vũ trụ kỳ thú',
    emoji: '🚀',
    questions: [
      { question: 'Trái Đất quay quanh thiên thể nào?', options: ['Mặt Trăng', 'Mặt Trời', 'Ngôi sao', 'Sao Hoả'], correct_index: 1, explanation: 'Trái Đất quay quanh Mặt Trời, mất khoảng 365 ngày cho một vòng — đó chính là một năm.' },
      { question: 'Ban đêm ta thường thấy gì sáng trên bầu trời?', options: ['Mặt Trời', 'Mặt Trăng và các ngôi sao', 'Cầu vồng', 'Máy bay'], correct_index: 1, explanation: 'Ban đêm ta thấy Mặt Trăng và hàng nghìn ngôi sao lấp lánh — chúng ở rất xa Trái Đất.' },
      { question: 'Ngôi sao gần Trái Đất nhất là gì?', options: ['Mặt Trăng', 'Sao Kim', 'Mặt Trời', 'Sao Bắc Đẩu'], correct_index: 2, explanation: 'Mặt Trời chính là một ngôi sao — ngôi sao gần chúng ta nhất, mang lại ánh sáng và hơi ấm cho Trái Đất.' },
      { question: 'Người bay ra ngoài vũ trụ được gọi là gì?', options: ['Phi công', 'Phi hành gia', 'Thợ lặn', 'Bác sĩ'], correct_index: 1, explanation: 'Phi hành gia (nhà du hành vũ trụ) mặc bộ đồ đặc biệt để bay lên vũ trụ khám phá các hành tinh.' },
      { question: 'Trái Đất có dạng hình gì?', options: ['Hình vuông', 'Hình tròn dẹt', 'Hình cầu', 'Hình tam giác'], correct_index: 2, explanation: 'Trái Đất hình cầu (như quả bóng hơi dẹt ở hai cực). Vì vậy nhìn từ vũ trụ, Trái Đất tròn và xanh.' },
      { question: 'Vì sao ban ngày trời sáng?', options: ['Do đèn', 'Do Mặt Trời chiếu sáng', 'Do Mặt Trăng', 'Do sao'], correct_index: 1, explanation: 'Ban ngày phần Trái Đất của ta hướng về Mặt Trời nên được chiếu sáng. Khi quay đi, ta bước vào ban đêm.' },
      { question: 'Hành tinh nào được gọi là "hành tinh đỏ"?', options: ['Sao Hoả', 'Sao Kim', 'Sao Thổ', 'Trái Đất'], correct_index: 0, explanation: 'Sao Hoả có bề mặt màu đỏ cam do đất đá chứa nhiều sắt gỉ, nên được gọi là "hành tinh đỏ".' },
      { question: 'Hệ Mặt Trời của chúng ta có bao nhiêu hành tinh?', options: ['5', '8', '12', '100'], correct_index: 1, explanation: 'Có 8 hành tinh quay quanh Mặt Trời. Trái Đất là hành tinh duy nhất ta biết có sự sống.' },
      { question: 'Vì sao phi hành gia phải mang bình dưỡng khí?', options: ['Vì vũ trụ không có không khí', 'Cho đẹp', 'Để nhẹ hơn', 'Để bay nhanh'], correct_index: 0, explanation: 'Ngoài vũ trụ không có không khí để thở, nên phi hành gia phải mang bình dưỡng khí bên mình.' },
      { question: 'Vật gì quay quanh Trái Đất và sáng lên vào ban đêm?', options: ['Mặt Trăng', 'Sao Hoả', 'Mặt Trời', 'Đám mây'], correct_index: 0, explanation: 'Mặt Trăng quay quanh Trái Đất. Nó không tự phát sáng mà phản chiếu ánh nắng Mặt Trời.' },
      { question: 'Sao chổi bay trong vũ trụ có đặc điểm gì nổi bật?', options: ['Có đuôi dài sáng', 'Hình vuông', 'Biết hát', 'Màu đen'], correct_index: 0, explanation: 'Sao chổi làm từ băng và bụi; khi đến gần Mặt Trời, nó tạo ra chiếc đuôi sáng dài rất đẹp.' },
      { question: 'Trái Đất tự quay một vòng quanh mình hết khoảng bao lâu?', options: ['1 ngày', '1 giờ', '1 tháng', '1 năm'], correct_index: 0, explanation: 'Trái Đất tự quay một vòng hết khoảng 24 giờ (1 ngày), tạo ra ngày và đêm luân phiên.' },
    ],
  },
  {
    slug: 'viet-nam-the-gioi',
    label: 'Việt Nam & thế giới',
    emoji: '🌏',
    questions: [
      { question: 'Thủ đô của Việt Nam là thành phố nào?', options: ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Huế'], correct_index: 1, explanation: 'Hà Nội là thủ đô của Việt Nam, nơi có Hồ Gươm, Lăng Bác và Văn Miếu.' },
      { question: 'Bản đồ đất nước Việt Nam có hình chữ gì?', options: ['Chữ O', 'Chữ S', 'Chữ V', 'Chữ L'], correct_index: 1, explanation: 'Đất liền Việt Nam cong cong như hình chữ S, trải dài từ Bắc vào Nam bên bờ Biển Đông.' },
      { question: 'Trang phục truyền thống của Việt Nam là gì?', options: ['Áo dài', 'Kimono', 'Váy xoè', 'Áo choàng'], correct_index: 0, explanation: 'Áo dài là trang phục truyền thống duyên dáng của người Việt, thường mặc trong dịp lễ Tết.' },
      { question: 'Đại dương nào lớn nhất thế giới?', options: ['Đại Tây Dương', 'Ấn Độ Dương', 'Thái Bình Dương', 'Bắc Băng Dương'], correct_index: 2, explanation: 'Thái Bình Dương là đại dương lớn nhất và sâu nhất, rộng hơn cả tất cả lục địa cộng lại.' },
      { question: 'Sa mạc nóng lớn nhất thế giới tên là gì?', options: ['Sahara', 'Gobi', 'Kalahari', 'Ả Rập'], correct_index: 0, explanation: 'Sahara ở châu Phi là sa mạc nóng lớn nhất thế giới, rộng gần bằng cả nước Mỹ, đầy cát và rất ít mưa.' },
      { question: 'Loài vật nào được xem là biểu tượng của nước Úc?', options: ['Sư tử', 'Chuột túi (kangaroo)', 'Gấu trúc', 'Hổ'], correct_index: 1, explanation: 'Chuột túi (kangaroo) là biểu tượng của nước Úc — chúng nhảy bằng hai chân sau và nuôi con trong túi trước bụng.' },
      { question: 'Kim tự tháp nổi tiếng nằm ở đất nước nào?', options: ['Ai Cập', 'Nhật Bản', 'Pháp', 'Brazil'], correct_index: 0, explanation: 'Những kim tự tháp khổng lồ bằng đá nằm ở Ai Cập, được xây từ hàng nghìn năm trước.' },
      { question: 'Ngọn núi cao nhất Việt Nam tên là gì?', options: ['Fansipan', 'Núi Bà Đen', 'Ba Vì', 'Yên Tử'], correct_index: 0, explanation: 'Fansipan ở Lào Cai cao 3.143 mét, được gọi là "nóc nhà Đông Dương".' },
      { question: 'Vịnh nổi tiếng với hàng nghìn hòn đảo đá ở Quảng Ninh là?', options: ['Vịnh Hạ Long', 'Vịnh Cam Ranh', 'Vịnh Vân Phong', 'Vịnh Xuân Đài'], correct_index: 0, explanation: 'Vịnh Hạ Long là di sản thiên nhiên thế giới với hàng nghìn đảo đá muôn hình muôn vẻ.' },
      { question: 'Châu lục nào lớn nhất và đông dân nhất thế giới?', options: ['Châu Á', 'Châu Âu', 'Châu Phi', 'Châu Úc'], correct_index: 0, explanation: 'Châu Á là châu lục lớn nhất, đông dân nhất — và Việt Nam chúng ta cũng nằm ở châu Á.' },
      { question: 'Tháp Eiffel nổi tiếng nằm ở thủ đô nước nào?', options: ['Pa-ri (Pháp)', 'Luân Đôn (Anh)', 'Tô-ky-ô (Nhật)', 'Rô-ma (Ý)'], correct_index: 0, explanation: 'Tháp Eiffel bằng thép cao hơn 300 mét, là biểu tượng của thủ đô Pa-ri nước Pháp.' },
      { question: 'Đất nước nào được gọi là "xứ sở hoa anh đào"?', options: ['Nhật Bản', 'Hàn Quốc', 'Thái Lan', 'Ấn Độ'], correct_index: 0, explanation: 'Nhật Bản nổi tiếng với hoa anh đào nở rộ mỗi mùa xuân, hồng cả bầu trời.' },
    ],
  },
  {
    slug: 'lich-su-danh-nhan',
    label: 'Lịch sử & danh nhân Việt Nam',
    emoji: '🏛️',
    questions: [
      { question: 'Theo truyền thuyết, ai là những vị vua đầu tiên dựng nước ta?', options: ['Các Vua Hùng', 'Vua Quang Trung', 'Vua Lê Lợi', 'Vua Tự Đức'], correct_index: 0, explanation: 'Các Vua Hùng có công dựng nên nước Văn Lang — nhà nước đầu tiên của người Việt. Ngày Giỗ Tổ là 10/3 âm lịch.' },
      { question: 'Hai Bà Trưng nổi tiếng trong lịch sử vì điều gì?', options: ['Khởi nghĩa đánh giặc, giành lại đất nước', 'Làm thơ', 'Vẽ tranh', 'Buôn bán'], correct_index: 0, explanation: 'Hai Bà Trưng (Trưng Trắc, Trưng Nhị) đã lãnh đạo nhân dân khởi nghĩa đánh đuổi giặc ngoại xâm.' },
      { question: 'Trong truyền thuyết, Thánh Gióng vươn vai lớn nhanh để đánh giặc nào?', options: ['Giặc Ân', 'Giặc Minh', 'Giặc Nguyên', 'Giặc Tống'], correct_index: 0, explanation: 'Thánh Gióng nhổ tre đánh tan giặc Ân, thể hiện tinh thần yêu nước của dân tộc ta từ thuở xưa.' },
      { question: 'Vị vua nào đã dời đô về Thăng Long (Hà Nội ngày nay)?', options: ['Lý Thái Tổ', 'Ngô Quyền', 'Trần Nhân Tông', 'Lê Thánh Tông'], correct_index: 0, explanation: 'Năm 1010, vua Lý Thái Tổ (Lý Công Uẩn) dời đô về Thăng Long — nay là thủ đô Hà Nội.' },
      { question: 'Trần Hưng Đạo nổi tiếng vì ba lần đánh thắng quân xâm lược nào?', options: ['Quân Nguyên - Mông', 'Quân Thanh', 'Quân Pháp', 'Quân Minh'], correct_index: 0, explanation: 'Trần Hưng Đạo lãnh đạo quân dân nhà Trần ba lần đánh bại quân Nguyên - Mông hùng mạnh.' },
      { question: 'Truyền thuyết Hồ Gươm kể vua Lê Lợi trả lại vật gì cho Rùa Vàng?', options: ['Thanh gươm thần', 'Chiếc mũ', 'Cuốn sách', 'Viên ngọc'], correct_index: 0, explanation: 'Sau khi đánh thắng giặc Minh, vua Lê Lợi trả gươm thần cho Rùa Vàng ở hồ — nên hồ có tên Hồ Gươm (Hoàn Kiếm).' },
      { question: 'Ai là người đọc Tuyên ngôn Độc lập khai sinh nước Việt Nam?', options: ['Bác Hồ (Hồ Chí Minh)', 'Vua Bảo Đại', 'Trần Hưng Đạo', 'Quang Trung'], correct_index: 0, explanation: 'Ngày 2/9/1945, Bác Hồ đọc bản Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hoà.' },
      { question: 'Ngày Quốc khánh của Việt Nam là ngày nào?', options: ['2 tháng 9', '1 tháng 1', '30 tháng 4', '20 tháng 11'], correct_index: 0, explanation: 'Ngày 2 tháng 9 là Quốc khánh Việt Nam, kỷ niệm ngày Bác Hồ đọc Tuyên ngôn Độc lập năm 1945.' },
    ],
  },
  {
    slug: 'nghe-nghiep',
    label: 'Nghề nghiệp quanh ta',
    emoji: '👩‍🚒',
    questions: [
      { question: 'Ai là người khám và chữa bệnh cho chúng ta?', options: ['Bác sĩ', 'Ca sĩ', 'Tài xế', 'Thợ may'], correct_index: 0, explanation: 'Bác sĩ khám bệnh, kê thuốc và chăm sóc để chúng ta khoẻ lại. Khi ốm, ta nên đi khám bác sĩ.' },
      { question: 'Ai dạy các bé học chữ, học toán ở trường?', options: ['Thầy, cô giáo', 'Đầu bếp', 'Nông dân', 'Phi công'], correct_index: 0, explanation: 'Thầy cô giáo dạy bé kiến thức và điều hay lẽ phải. Bé nhớ lễ phép và biết ơn thầy cô nhé!' },
      { question: 'Ai là người dũng cảm dập lửa khi có đám cháy?', options: ['Lính cứu hoả', 'Bác sĩ', 'Thợ mộc', 'Người đưa thư'], correct_index: 0, explanation: 'Lính cứu hoả (lính chữa cháy) dùng vòi nước và xe thang để dập lửa, cứu người khỏi đám cháy.' },
      { question: 'Ai là người lái máy bay chở khách?', options: ['Phi công', 'Thuỷ thủ', 'Bác sĩ', 'Giáo viên'], correct_index: 0, explanation: 'Phi công điều khiển máy bay bay trên bầu trời, đưa hành khách đến nơi an toàn.' },
      { question: 'Ai giữ gìn trật tự, bắt kẻ xấu để mọi người bình yên?', options: ['Chú công an', 'Ca sĩ', 'Hoạ sĩ', 'Đầu bếp'], correct_index: 0, explanation: 'Công an (cảnh sát) giữ gìn an ninh trật tự và giúp đỡ mọi người. Khi gặp khó, bé có thể nhờ chú công an.' },
      { question: 'Ai vất vả trồng lúa để làm ra hạt gạo ta ăn?', options: ['Bác nông dân', 'Phi công', 'Bác sĩ', 'Ca sĩ'], correct_index: 0, explanation: 'Bác nông dân cày cấy, chăm bón để làm ra lúa gạo. Vì vậy ta nhớ ăn hết cơm, không bỏ phí.' },
      { question: 'Ai là người nấu các món ăn ngon ở nhà hàng?', options: ['Đầu bếp', 'Tài xế', 'Thợ điện', 'Bác sĩ'], correct_index: 0, explanation: 'Đầu bếp chế biến và nấu những món ăn thơm ngon cho thực khách thưởng thức.' },
      { question: 'Ai là người khám và chữa bệnh cho các con vật?', options: ['Bác sĩ thú y', 'Nông dân', 'Phi công', 'Thợ may'], correct_index: 0, explanation: 'Bác sĩ thú y chăm sóc, tiêm phòng và chữa bệnh cho vật nuôi như chó, mèo, trâu, bò.' },
    ],
  },
  {
    slug: 'an-toan',
    label: 'An toàn & kỹ năng sống',
    emoji: '🦺',
    questions: [
      { question: 'Đèn giao thông màu ĐỎ nghĩa là gì?', options: ['Dừng lại', 'Được đi', 'Đi nhanh', 'Rẽ trái'], correct_index: 0, explanation: 'Đèn đỏ là phải dừng lại, đèn xanh mới được đi, đèn vàng thì đi chậm và chuẩn bị dừng.' },
      { question: 'Khi qua đường, bé nên làm gì cho an toàn?', options: ['Nhìn hai bên, nắm tay người lớn, đi vạch kẻ', 'Chạy thật nhanh', 'Vừa đi vừa xem điện thoại', 'Qua ở chỗ đông xe'], correct_index: 0, explanation: 'Bé hãy đi trên vạch kẻ dành cho người đi bộ, nhìn kỹ hai bên và nắm tay người lớn khi qua đường.' },
      { question: 'Số điện thoại gọi lính cứu hoả (chữa cháy) ở Việt Nam là?', options: ['114', '100', '911', '123'], correct_index: 0, explanation: 'Ở Việt Nam: gọi 114 khi có cháy, 115 khi cần cấp cứu y tế, 113 khi cần công an. Bé nên nhớ nhé!' },
      { question: 'Số nào gọi xe cấp cứu khi có người bị thương, ốm nặng?', options: ['115', '114', '113', '116'], correct_index: 0, explanation: 'Gọi 115 để xe cấp cứu đến chở người bệnh tới bệnh viện kịp thời.' },
      { question: 'Khi người lạ cho quà và rủ đi cùng, bé nên làm gì?', options: ['Từ chối và báo ngay cho bố mẹ', 'Đi theo lấy quà', 'Giữ bí mật', 'Lên xe người lạ'], correct_index: 0, explanation: 'Bé hãy lễ phép từ chối, không đi theo người lạ và kể ngay cho bố mẹ hoặc thầy cô biết.' },
      { question: 'Nếu bị lạc ở nơi đông người, bé nên làm gì?', options: ['Đứng yên, nhờ chú công an hoặc người lớn đáng tin giúp', 'Chạy đi tìm khắp nơi', 'Khóc và đi theo người lạ', 'Trốn vào góc'], correct_index: 0, explanation: 'Bé hãy bình tĩnh đứng yên tại chỗ hoặc tìm chú công an, chú bảo vệ để nhờ gọi bố mẹ.' },
      { question: 'Khi ngồi trên xe máy, bé cần đội gì để bảo vệ đầu?', options: ['Mũ bảo hiểm', 'Mũ len', 'Nón lá', 'Không cần'], correct_index: 0, explanation: 'Đội mũ bảo hiểm đúng cách giúp bảo vệ đầu khi đi xe máy, xe đạp — rất quan trọng cho an toàn.' },
      { question: 'Ổ điện và phích cắm điện thì bé nên làm gì?', options: ['Không sờ hay chọc tay vào', 'Chọc ngón tay vào cho vui', 'Cắm đồ chơi vào', 'Đổ nước vào'], correct_index: 0, explanation: 'Điện rất nguy hiểm. Bé tuyệt đối không chọc tay hay đồ vật vào ổ điện, và tránh xa dây điện bị hở.' },
    ],
  },
  {
    slug: 'phat-minh',
    label: 'Phát minh & công nghệ',
    emoji: '💡',
    questions: [
      { question: 'Ông Thomas Edison nổi tiếng vì phát minh ra thứ gì thắp sáng?', options: ['Bóng đèn điện', 'Xe đạp', 'Điện thoại', 'Ti vi'], correct_index: 0, explanation: 'Thomas Edison đã cải tiến bóng đèn điện, giúp con người có ánh sáng vào ban đêm mà không cần đèn dầu.' },
      { question: 'Thiết bị nhỏ gọn nào giúp ta gọi và nhắn tin cho nhau từ xa?', options: ['Điện thoại', 'Cái quạt', 'Cái ghế', 'Cái bút'], correct_index: 0, explanation: 'Điện thoại giúp mọi người liên lạc dù ở rất xa. Điện thoại thông minh còn chụp ảnh, xem phim được.' },
      { question: 'Máy nào giúp ta học online, xem phim và lướt web?', options: ['Máy tính', 'Máy giặt', 'Máy xay', 'Máy sấy'], correct_index: 0, explanation: 'Máy tính xử lý thông tin, giúp học tập, làm việc và giải trí. Nhớ dùng máy tính có giờ giấc hợp lý nhé!' },
      { question: 'Anh em nhà Wright được ghi nhận chế tạo ra phương tiện nào?', options: ['Máy bay', 'Tàu ngầm', 'Xe hơi', 'Tên lửa'], correct_index: 0, explanation: 'Hai anh em nhà Wright đã chế tạo và bay thử chiếc máy bay đầu tiên, mở ra thời đại con người bay lên trời.' },
      { question: 'Thiết bị nào giữ thức ăn lạnh và tươi lâu?', options: ['Tủ lạnh', 'Lò nướng', 'Cái nồi', 'Cái chảo'], correct_index: 0, explanation: 'Tủ lạnh làm lạnh bên trong để thức ăn không bị hỏng, giữ rau quả tươi lâu hơn.' },
      { question: '"Mạng" gì giúp máy tính khắp thế giới kết nối để tìm thông tin?', options: ['Internet', 'Mạng nhện', 'Lưới cá', 'Mạng lưới điện'], correct_index: 0, explanation: 'Internet nối các máy tính trên toàn thế giới, giúp ta tìm kiếm, học tập và trò chuyện với người ở xa.' },
      { question: 'Vật nào ta xem hằng ngày để biết mấy giờ?', options: ['Đồng hồ', 'Cái gương', 'Quyển sách', 'Cái ô'], correct_index: 0, explanation: 'Đồng hồ cho ta biết thời gian để đi học, ăn cơm và đi ngủ đúng giờ.' },
      { question: 'Robot là gì?', options: ['Máy móc được lập trình để làm việc thay người', 'Một loài thú', 'Một loại cây', 'Một món ăn'], correct_index: 0, explanation: 'Robot là máy được lập trình để làm những công việc như lau nhà, lắp ráp, thậm chí trò chuyện.' },
    ],
  },
  {
    slug: 'cay-coi',
    label: 'Cây cối & thực vật',
    emoji: '🌱',
    questions: [
      { question: 'Bộ phận nào của cây hút nước và chất dinh dưỡng từ đất?', options: ['Rễ', 'Hoa', 'Lá', 'Quả'], correct_index: 0, explanation: 'Rễ cây cắm sâu trong đất để hút nước và chất dinh dưỡng, đồng thời giữ cho cây đứng vững.' },
      { question: 'Cây lớn lên bắt đầu từ cái gì nhỏ xíu ta gieo xuống đất?', options: ['Hạt giống', 'Viên đá', 'Cái lá', 'Giọt nước'], correct_index: 0, explanation: 'Từ một hạt giống nhỏ, khi có đủ nước và nắng, hạt nảy mầm và lớn dần thành cây.' },
      { question: 'Bộ phận nào của cây thường màu xanh và quang hợp tạo thức ăn?', options: ['Lá', 'Rễ', 'Thân', 'Quả'], correct_index: 0, explanation: 'Lá cây chứa chất diệp lục màu xanh, hấp thụ ánh nắng để tạo thức ăn nuôi cây.' },
      { question: 'Cây nào cho ta hạt gạo để nấu cơm ăn hằng ngày?', options: ['Cây lúa', 'Cây tre', 'Cây bàng', 'Cây phượng'], correct_index: 0, explanation: 'Cây lúa cho ta hạt thóc, xay ra thành gạo để nấu cơm — lương thực chính của người Việt.' },
      { question: 'Loài hoa nào mọc trong bùn mà vẫn thơm, gắn với hình ảnh Việt Nam?', options: ['Hoa sen', 'Hoa hồng', 'Hoa cúc', 'Hoa mai'], correct_index: 0, explanation: 'Hoa sen mọc từ bùn nhưng vẫn thơm ngát và thanh cao, thường được xem là biểu tượng đẹp của Việt Nam.' },
      { question: 'Cây xanh giúp bầu không khí như thế nào?', options: ['Trong lành hơn (nhả khí ô-xy)', 'Bẩn hơn', 'Nóng hơn', 'Không ảnh hưởng'], correct_index: 0, explanation: 'Ban ngày cây nhả khí ô-xy và hút bớt bụi, giúp không khí trong lành. Vì vậy hãy trồng và bảo vệ cây xanh.' },
      { question: 'Xương rồng sống được ở sa mạc khô cằn nhờ điều gì?', options: ['Trữ nước trong thân', 'Ăn cát', 'Uống nắng', 'Không cần gì'], correct_index: 0, explanation: 'Xương rồng trữ nước trong thân mọng và có gai thay lá để ít mất nước, nên sống được nơi khô hạn.' },
      { question: 'Mùa xuân, loài hoa vàng nào thường nở ngày Tết ở miền Nam?', options: ['Hoa mai', 'Hoa đào', 'Hoa loa kèn', 'Hoa cẩm chướng'], correct_index: 0, explanation: 'Miền Nam chưng hoa mai vàng ngày Tết, còn miền Bắc thường chưng hoa đào hồng.' },
    ],
  },
  {
    slug: 'giao-thong',
    label: 'Phương tiện giao thông',
    emoji: '🚦',
    questions: [
      { question: 'Phương tiện nào chạy trên đường ray sắt?', options: ['Tàu hoả', 'Ô tô', 'Xe đạp', 'Thuyền'], correct_index: 0, explanation: 'Tàu hoả (xe lửa) chạy trên hai đường ray sắt, chở được rất nhiều người và hàng hoá.' },
      { question: 'Phương tiện nào bay được trên bầu trời?', options: ['Máy bay', 'Tàu thuỷ', 'Xe máy', 'Tàu hoả'], correct_index: 0, explanation: 'Máy bay bay trên trời nhờ đôi cánh và động cơ mạnh, đưa ta đi xa rất nhanh.' },
      { question: 'Phương tiện nào di chuyển trên mặt nước?', options: ['Tàu thuỷ', 'Máy bay', 'Ô tô', 'Xe đạp'], correct_index: 0, explanation: 'Tàu thuỷ và thuyền nổi và đi trên mặt nước, chở người và hàng qua sông, qua biển.' },
      { question: 'Phương tiện nào có hai bánh và ta đạp bằng chân?', options: ['Xe đạp', 'Ô tô', 'Tàu hoả', 'Máy bay'], correct_index: 0, explanation: 'Xe đạp có hai bánh, ta đạp bàn đạp để đi. Đạp xe vừa khoẻ người vừa không gây khói bụi.' },
      { question: 'Xe màu đỏ hú còi đi chữa cháy là xe gì?', options: ['Xe cứu hoả', 'Xe buýt', 'Xe rác', 'Xe đạp'], correct_index: 0, explanation: 'Xe cứu hoả chở nước và thang để lính cứu hoả dập lửa. Khi nghe còi hú, các xe khác nhường đường.' },
      { question: 'Khi ngồi trong ô tô, bé nên thắt gì để an toàn?', options: ['Dây an toàn', 'Khăn quàng', 'Dây giày', 'Không cần gì'], correct_index: 0, explanation: 'Thắt dây an toàn giữ bé không bị lao về phía trước khi xe phanh gấp — rất quan trọng.' },
      { question: 'Người đi bộ nên đi ở đâu cho an toàn?', options: ['Trên vỉa hè / lề đường', 'Giữa lòng đường', 'Nơi nhiều xe', 'Đường ray'], correct_index: 0, explanation: 'Người đi bộ đi trên vỉa hè hoặc sát lề đường, và qua đường ở vạch kẻ dành cho người đi bộ.' },
      { question: 'Còi xe dùng để làm gì?', options: ['Báo hiệu cho người khác biết', 'Cho vui tai', 'Để hát', 'Không có tác dụng'], correct_index: 0, explanation: 'Còi xe báo hiệu để mọi người chú ý, tránh va chạm. Nhưng không nên bấm còi bừa bãi gây ồn ào.' },
    ],
  },
];
