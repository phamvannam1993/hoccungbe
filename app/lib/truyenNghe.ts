// TRUYỆN NGHE TIẾNG ANH — nghe truyện rồi trả lời câu hỏi.
//
// Vì sao phải viết mới thay vì dùng lại kho từ vựng: nghe hiểu là kỹ năng khác
// hẳn nghe từ rời. Bé phải giữ được mạch chuyện qua vài câu rồi mới trả lời
// được — không có bộ truyện thì không luyện được cái đó.
//
// Nguyên tắc viết:
//  • Từ vựng nằm trong các chủ đề bé đã học ở `vocab.ts`, không thả từ lạ.
//  • Câu ngắn, mỗi câu một ý; lớp 1 khoảng 4 câu, lớp 5 khoảng 8 câu.
//  • Thì hiện tại đơn cho lớp 1–3; lớp 4–5 mới có quá khứ đơn.
//  • Câu hỏi trả lời được CHỈ BẰNG cách nghe, không cần suy luận ngoài truyện.
//  • Đáp án nhiễu lấy từ chính truyện, để bé không loại trừ được bằng cảm giác.

import type { Lop } from './vongTuVung';

export type CauTruyen = { en: string; vi: string };
export type HoiTruyen = {
  hoi: string;
  hoiVi: string;
  /** Đáp án, phần tử đầu LUÔN là đáp án đúng — trang chơi sẽ tự xáo. */
  dapAn: string[];
};
export type Truyen = {
  ma: string;
  lop: Lop;
  emoji: string;
  ten: string;
  tenVi: string;
  cau: CauTruyen[];
  hoi: HoiTruyen[];
};

export const TRUYEN_NGHE: Truyen[] = [
  // ── LỚP 1 — câu 4–5 từ, hiện tại đơn, chủ đề gia đình / con vật / màu ──────
  {
    ma: 'l1-cat', lop: 1, emoji: '🐱', ten: 'My Cat', tenVi: 'Con mèo của tôi',
    cau: [
      { en: 'I have a cat.', vi: 'Tôi có một con mèo.' },
      { en: 'My cat is white.', vi: 'Con mèo của tôi màu trắng.' },
      { en: 'It likes milk.', vi: 'Nó thích sữa.' },
      { en: 'It sleeps on my bed.', vi: 'Nó ngủ trên giường của tôi.' },
    ],
    hoi: [
      { hoi: 'What color is the cat?', hoiVi: 'Con mèo màu gì?', dapAn: ['White', 'Black', 'Orange'] },
      { hoi: 'What does the cat like?', hoiVi: 'Con mèo thích gì?', dapAn: ['Milk', 'Rice', 'Bread'] },
      { hoi: 'Where does it sleep?', hoiVi: 'Nó ngủ ở đâu?', dapAn: ['On the bed', 'In the box', 'Under the desk'] },
    ],
  },
  {
    ma: 'l1-family', lop: 1, emoji: '👨‍👩‍👧', ten: 'My Family', tenVi: 'Gia đình tôi',
    cau: [
      { en: 'This is my family.', vi: 'Đây là gia đình tôi.' },
      { en: 'My father is tall.', vi: 'Bố tôi cao.' },
      { en: 'My mother has long hair.', vi: 'Mẹ tôi có mái tóc dài.' },
      { en: 'I have one sister.', vi: 'Tôi có một em gái.' },
      { en: 'We are happy.', vi: 'Chúng tôi rất vui.' },
    ],
    hoi: [
      { hoi: 'Who is tall?', hoiVi: 'Ai cao?', dapAn: ['My father', 'My mother', 'My sister'] },
      { hoi: 'How many sisters?', hoiVi: 'Có mấy em gái?', dapAn: ['One', 'Two', 'Three'] },
      { hoi: 'Who has long hair?', hoiVi: 'Ai có tóc dài?', dapAn: ['My mother', 'My father', 'I'] },
    ],
  },
  {
    ma: 'l1-apple', lop: 1, emoji: '🍎', ten: 'A Red Apple', tenVi: 'Quả táo đỏ',
    cau: [
      { en: 'I see an apple.', vi: 'Tôi thấy một quả táo.' },
      { en: 'The apple is red.', vi: 'Quả táo màu đỏ.' },
      { en: 'It is on the table.', vi: 'Nó ở trên bàn.' },
      { en: 'I eat the apple. It is sweet.', vi: 'Tôi ăn quả táo. Nó ngọt.' },
    ],
    hoi: [
      { hoi: 'Where is the apple?', hoiVi: 'Quả táo ở đâu?', dapAn: ['On the table', 'In the bag', 'On the chair'] },
      { hoi: 'What color is it?', hoiVi: 'Nó màu gì?', dapAn: ['Red', 'Green', 'Yellow'] },
      { hoi: 'How does it taste?', hoiVi: 'Nó vị thế nào?', dapAn: ['Sweet', 'Sour', 'Salty'] },
    ],
  },

  // ── LỚP 2 — thêm giới từ nơi chốn, thời tiết, quần áo ─────────────────────
  {
    ma: 'l2-rain', lop: 2, emoji: '🌧️', ten: 'A Rainy Day', tenVi: 'Ngày mưa',
    cau: [
      { en: 'Today it is rainy.', vi: 'Hôm nay trời mưa.' },
      { en: 'Nam wears a yellow raincoat.', vi: 'Nam mặc áo mưa màu vàng.' },
      { en: 'He takes his blue umbrella.', vi: 'Bạn ấy cầm chiếc ô màu xanh.' },
      { en: 'He walks to school with his friend.', vi: 'Bạn ấy đi bộ tới trường cùng bạn.' },
      { en: 'They are not late.', vi: 'Hai bạn không bị muộn.' },
    ],
    hoi: [
      { hoi: 'What is the weather?', hoiVi: 'Thời tiết thế nào?', dapAn: ['Rainy', 'Sunny', 'Windy'] },
      { hoi: 'What color is the umbrella?', hoiVi: 'Chiếc ô màu gì?', dapAn: ['Blue', 'Yellow', 'Red'] },
      { hoi: 'How does Nam go to school?', hoiVi: 'Nam đi học bằng gì?', dapAn: ['He walks', 'By bus', 'By bike'] },
    ],
  },
  {
    ma: 'l2-room', lop: 2, emoji: '🛏️', ten: 'My Room', tenVi: 'Phòng của tôi',
    cau: [
      { en: 'This is my room.', vi: 'Đây là phòng của tôi.' },
      { en: 'There is a bed and a desk.', vi: 'Có một cái giường và một cái bàn học.' },
      { en: 'My books are on the desk.', vi: 'Sách của tôi ở trên bàn.' },
      { en: 'My teddy bear is under the bed.', vi: 'Gấu bông của tôi ở dưới gầm giường.' },
      { en: 'I like my room.', vi: 'Tôi thích căn phòng của mình.' },
    ],
    hoi: [
      { hoi: 'Where are the books?', hoiVi: 'Sách ở đâu?', dapAn: ['On the desk', 'Under the bed', 'In the bag'] },
      { hoi: 'Where is the teddy bear?', hoiVi: 'Gấu bông ở đâu?', dapAn: ['Under the bed', 'On the desk', 'On the chair'] },
      { hoi: 'What is in the room?', hoiVi: 'Trong phòng có gì?', dapAn: ['A bed and a desk', 'A car', 'A tree'] },
    ],
  },
  {
    ma: 'l2-farm', lop: 2, emoji: '🐄', ten: 'On the Farm', tenVi: 'Ở nông trại',
    cau: [
      { en: 'My grandfather has a farm.', vi: 'Ông tôi có một nông trại.' },
      { en: 'There are five cows and ten hens.', vi: 'Có năm con bò và mười con gà mái.' },
      { en: 'The cows eat grass.', vi: 'Những con bò ăn cỏ.' },
      { en: 'I give water to the hens.', vi: 'Tôi cho gà uống nước.' },
      { en: 'The farm is very big.', vi: 'Nông trại rất rộng.' },
    ],
    hoi: [
      { hoi: 'How many cows?', hoiVi: 'Có mấy con bò?', dapAn: ['Five', 'Ten', 'Two'] },
      { hoi: 'What do the cows eat?', hoiVi: 'Bò ăn gì?', dapAn: ['Grass', 'Rice', 'Fish'] },
      { hoi: 'Whose farm is it?', hoiVi: 'Nông trại của ai?', dapAn: ['My grandfather', 'My father', 'My uncle'] },
    ],
  },

  // ── LỚP 3 — sở thích, thể thao, cảm xúc; câu dài hơn ─────────────────────
  {
    ma: 'l3-hobby', lop: 3, emoji: '🎨', ten: 'Mai Likes Drawing', tenVi: 'Mai thích vẽ',
    cau: [
      { en: 'Mai is eight years old.', vi: 'Mai tám tuổi.' },
      { en: 'Her hobby is drawing.', vi: 'Sở thích của bạn ấy là vẽ.' },
      { en: 'She draws flowers and birds.', vi: 'Bạn ấy vẽ hoa và chim.' },
      { en: 'On Sunday she draws in the garden.', vi: 'Chủ nhật bạn ấy vẽ ở ngoài vườn.' },
      { en: 'Her brother plays football. He does not like drawing.', vi: 'Anh trai bạn ấy chơi bóng đá. Anh ấy không thích vẽ.' },
    ],
    hoi: [
      { hoi: "What is Mai's hobby?", hoiVi: 'Sở thích của Mai là gì?', dapAn: ['Drawing', 'Singing', 'Football'] },
      { hoi: 'What does she draw?', hoiVi: 'Bạn ấy vẽ gì?', dapAn: ['Flowers and birds', 'Cars and trains', 'Fish and cats'] },
      { hoi: 'What does her brother do?', hoiVi: 'Anh trai bạn ấy làm gì?', dapAn: ['He plays football', 'He draws', 'He sings'] },
      { hoi: 'When does she draw in the garden?', hoiVi: 'Khi nào bạn ấy vẽ ngoài vườn?', dapAn: ['On Sunday', 'On Monday', 'Every night'] },
    ],
  },
  {
    ma: 'l3-sea', lop: 3, emoji: '🐬', ten: 'At the Beach', tenVi: 'Ở bãi biển',
    cau: [
      { en: 'In summer my family goes to the beach.', vi: 'Mùa hè gia đình tôi đi biển.' },
      { en: 'The water is blue and warm.', vi: 'Nước biển xanh và ấm.' },
      { en: 'I swim with my father.', vi: 'Tôi bơi cùng bố.' },
      { en: 'My sister makes a sand castle.', vi: 'Em gái tôi xây lâu đài cát.' },
      { en: 'We see two dolphins. They are very fast.', vi: 'Chúng tôi thấy hai con cá heo. Chúng bơi rất nhanh.' },
    ],
    hoi: [
      { hoi: 'When does the family go?', hoiVi: 'Gia đình đi khi nào?', dapAn: ['In summer', 'In winter', 'In autumn'] },
      { hoi: 'What does the sister make?', hoiVi: 'Em gái làm gì?', dapAn: ['A sand castle', 'A boat', 'A kite'] },
      { hoi: 'What animals do they see?', hoiVi: 'Họ thấy con vật gì?', dapAn: ['Dolphins', 'Sharks', 'Turtles'] },
      { hoi: 'Who does the child swim with?', hoiVi: 'Bạn nhỏ bơi cùng ai?', dapAn: ['Father', 'Mother', 'Sister'] },
    ],
  },
  {
    ma: 'l3-sick', lop: 3, emoji: '🤒', ten: 'Nam Is Sick', tenVi: 'Nam bị ốm',
    cau: [
      { en: 'Today Nam does not go to school.', vi: 'Hôm nay Nam không đi học.' },
      { en: 'He is sick. He has a headache.', vi: 'Bạn ấy bị ốm. Bạn ấy bị đau đầu.' },
      { en: 'His mother gives him hot tea.', vi: 'Mẹ pha cho bạn ấy trà nóng.' },
      { en: 'He sleeps all morning.', vi: 'Bạn ấy ngủ cả buổi sáng.' },
      { en: 'In the evening he feels better.', vi: 'Buổi tối bạn ấy thấy đỡ hơn.' },
    ],
    hoi: [
      { hoi: 'Why does Nam stay home?', hoiVi: 'Vì sao Nam ở nhà?', dapAn: ['He is sick', 'It is Sunday', 'It is rainy'] },
      { hoi: 'What does his mother give him?', hoiVi: 'Mẹ đưa gì cho bạn ấy?', dapAn: ['Hot tea', 'Cold milk', 'Bread'] },
      { hoi: 'When does he feel better?', hoiVi: 'Khi nào bạn ấy thấy đỡ?', dapAn: ['In the evening', 'In the morning', 'At noon'] },
    ],
  },

  // ── LỚP 4 — quá khứ đơn, nghề nghiệp, nơi chốn ───────────────────────────
  {
    ma: 'l4-zoo', lop: 4, emoji: '🦁', ten: 'A Day at the Zoo', tenVi: 'Một ngày ở sở thú',
    cau: [
      { en: 'Last Saturday my class went to the zoo.', vi: 'Thứ Bảy tuần trước lớp tôi đi sở thú.' },
      { en: 'We went there by bus.', vi: 'Chúng tôi đi bằng xe buýt.' },
      { en: 'First we saw the lions. They were sleeping.', vi: 'Đầu tiên chúng tôi xem sư tử. Chúng đang ngủ.' },
      { en: 'Then we watched the monkeys. They were very funny.', vi: 'Sau đó chúng tôi xem khỉ. Chúng rất buồn cười.' },
      { en: 'I bought a small elephant toy for my sister.', vi: 'Tôi mua một con voi đồ chơi nhỏ cho em gái.' },
      { en: 'We came home at five o\'clock.', vi: 'Chúng tôi về nhà lúc năm giờ.' },
    ],
    hoi: [
      { hoi: 'When did the class go?', hoiVi: 'Lớp đi khi nào?', dapAn: ['Last Saturday', 'Last Sunday', 'Yesterday'] },
      { hoi: 'How did they go?', hoiVi: 'Họ đi bằng gì?', dapAn: ['By bus', 'By car', 'On foot'] },
      { hoi: 'What were the lions doing?', hoiVi: 'Sư tử đang làm gì?', dapAn: ['Sleeping', 'Eating', 'Running'] },
      { hoi: 'What did the child buy?', hoiVi: 'Bạn nhỏ mua gì?', dapAn: ['An elephant toy', 'A monkey toy', 'A book'] },
    ],
  },
  {
    ma: 'l4-job', lop: 4, emoji: '👩‍⚕️', ten: 'My Aunt the Doctor', tenVi: 'Cô tôi là bác sĩ',
    cau: [
      { en: 'My aunt is a doctor.', vi: 'Cô tôi là bác sĩ.' },
      { en: 'She works at a hospital in the city.', vi: 'Cô làm việc ở một bệnh viện trong thành phố.' },
      { en: 'She starts work at seven in the morning.', vi: 'Cô bắt đầu làm lúc bảy giờ sáng.' },
      { en: 'She helps sick children every day.', vi: 'Hằng ngày cô giúp các em nhỏ bị ốm.' },
      { en: 'Last week she gave me a new book about the body.', vi: 'Tuần trước cô tặng tôi một quyển sách về cơ thể người.' },
      { en: 'I want to be a doctor too.', vi: 'Tôi cũng muốn làm bác sĩ.' },
    ],
    hoi: [
      { hoi: "What is the aunt's job?", hoiVi: 'Cô làm nghề gì?', dapAn: ['A doctor', 'A teacher', 'A nurse'] },
      { hoi: 'Where does she work?', hoiVi: 'Cô làm việc ở đâu?', dapAn: ['At a hospital', 'At a school', 'At a farm'] },
      { hoi: 'What time does she start?', hoiVi: 'Cô bắt đầu lúc mấy giờ?', dapAn: ['Seven', 'Eight', 'Six'] },
      { hoi: 'What did she give the child?', hoiVi: 'Cô tặng bạn nhỏ gì?', dapAn: ['A book', 'A toy', 'A pen'] },
    ],
  },
  {
    ma: 'l4-lost', lop: 4, emoji: '🎒', ten: 'The Lost Bag', tenVi: 'Chiếc cặp bị mất',
    cau: [
      { en: 'Yesterday Lan lost her school bag.', vi: 'Hôm qua Lan làm mất cặp sách.' },
      { en: 'She looked under the desk. It was not there.', vi: 'Bạn ấy tìm dưới gầm bàn. Không có.' },
      { en: 'She asked her teacher for help.', vi: 'Bạn ấy nhờ cô giáo giúp.' },
      { en: 'They found the bag in the library.', vi: 'Hai cô trò tìm thấy chiếc cặp trong thư viện.' },
      { en: 'Lan was very happy. She said thank you.', vi: 'Lan rất vui. Bạn ấy nói cảm ơn.' },
    ],
    hoi: [
      { hoi: 'What did Lan lose?', hoiVi: 'Lan làm mất gì?', dapAn: ['Her school bag', 'Her book', 'Her pen'] },
      { hoi: 'Who helped her?', hoiVi: 'Ai giúp bạn ấy?', dapAn: ['Her teacher', 'Her mother', 'Her friend'] },
      { hoi: 'Where was the bag?', hoiVi: 'Chiếc cặp ở đâu?', dapAn: ['In the library', 'Under the desk', 'In the garden'] },
      { hoi: 'How did Lan feel at the end?', hoiVi: 'Cuối cùng Lan cảm thấy thế nào?', dapAn: ['Happy', 'Sad', 'Angry'] },
    ],
  },

  // ── LỚP 5 — câu ghép, chủ đề môi trường / công nghệ / du lịch ────────────
  {
    ma: 'l5-tree', lop: 5, emoji: '🌳', ten: 'The Tree in Our Yard', tenVi: 'Cái cây trong sân trường',
    cau: [
      { en: 'There is an old tree in our school yard.', vi: 'Trong sân trường tôi có một cái cây già.' },
      { en: 'My grandfather planted it many years ago.', vi: 'Ông tôi trồng nó từ nhiều năm trước.' },
      { en: 'In summer we sit under it because it is cool.', vi: 'Mùa hè chúng tôi ngồi dưới gốc cây vì ở đó mát.' },
      { en: 'Many birds build their nests in the tree.', vi: 'Nhiều con chim làm tổ trên cây.' },
      { en: 'Last month a storm broke one big branch.', vi: 'Tháng trước một cơn bão làm gãy một cành lớn.' },
      { en: 'Our class helped the gardener clean the yard.', vi: 'Lớp tôi giúp bác làm vườn dọn sân.' },
      { en: 'Now the tree is growing new leaves again.', vi: 'Giờ cái cây lại đang ra lá mới.' },
    ],
    hoi: [
      { hoi: 'Who planted the tree?', hoiVi: 'Ai trồng cái cây?', dapAn: ['The grandfather', 'The gardener', 'The class'] },
      { hoi: 'Why do they sit under it in summer?', hoiVi: 'Vì sao mùa hè họ ngồi dưới gốc cây?', dapAn: ['Because it is cool', 'Because it is warm', 'Because it is quiet'] },
      { hoi: 'What broke a branch?', hoiVi: 'Cái gì làm gãy cành?', dapAn: ['A storm', 'The birds', 'A car'] },
      { hoi: 'What is the tree doing now?', hoiVi: 'Cái cây giờ đang thế nào?', dapAn: ['Growing new leaves', 'Falling down', 'Losing all leaves'] },
    ],
  },
  {
    ma: 'l5-robot', lop: 5, emoji: '🤖', ten: 'A Robot at Home', tenVi: 'Con rô bốt trong nhà',
    cau: [
      { en: 'My uncle works with computers.', vi: 'Chú tôi làm việc với máy tính.' },
      { en: 'Last year he built a small robot.', vi: 'Năm ngoái chú làm một con rô bốt nhỏ.' },
      { en: 'The robot can clean the floor and carry light things.', vi: 'Con rô bốt biết lau sàn và mang đồ nhẹ.' },
      { en: 'It cannot cook, but it can turn on the lights.', vi: 'Nó không nấu ăn được, nhưng bật đèn được.' },
      { en: 'My little brother talks to it every evening.', vi: 'Em trai tôi nói chuyện với nó mỗi tối.' },
      { en: 'I think robots will help many families in the future.', vi: 'Tôi nghĩ rô bốt sẽ giúp nhiều gia đình trong tương lai.' },
    ],
    hoi: [
      { hoi: 'Who built the robot?', hoiVi: 'Ai làm ra con rô bốt?', dapAn: ['My uncle', 'My brother', 'My father'] },
      { hoi: 'What can the robot do?', hoiVi: 'Con rô bốt làm được gì?', dapAn: ['Clean the floor', 'Cook dinner', 'Drive a car'] },
      { hoi: 'What can it NOT do?', hoiVi: 'Nó KHÔNG làm được gì?', dapAn: ['Cook', 'Turn on the lights', 'Carry light things'] },
      { hoi: 'Who talks to the robot?', hoiVi: 'Ai nói chuyện với rô bốt?', dapAn: ['My little brother', 'My uncle', 'My mother'] },
    ],
  },
  {
    ma: 'l5-trip', lop: 5, emoji: '🚂', ten: 'A Trip to Da Lat', tenVi: 'Chuyến đi Đà Lạt',
    cau: [
      { en: 'Last summer my family travelled to Da Lat.', vi: 'Mùa hè năm ngoái gia đình tôi đi Đà Lạt.' },
      { en: 'The weather was cold in the morning.', vi: 'Buổi sáng trời lạnh.' },
      { en: 'We visited a flower garden and took many photos.', vi: 'Chúng tôi thăm một vườn hoa và chụp rất nhiều ảnh.' },
      { en: 'My mother bought some strawberries at the market.', vi: 'Mẹ mua ít dâu tây ở chợ.' },
      { en: 'On the second day we rode horses near the lake.', vi: 'Ngày thứ hai chúng tôi cưỡi ngựa gần hồ.' },
      { en: 'I did not want to go home.', vi: 'Tôi đã không muốn về nhà.' },
      { en: 'It was the best trip of the year.', vi: 'Đó là chuyến đi hay nhất trong năm.' },
    ],
    hoi: [
      { hoi: 'Where did the family go?', hoiVi: 'Gia đình đi đâu?', dapAn: ['Da Lat', 'Ha Noi', 'Hue'] },
      { hoi: 'What did the mother buy?', hoiVi: 'Mẹ mua gì?', dapAn: ['Strawberries', 'Flowers', 'Photos'] },
      { hoi: 'What did they do on the second day?', hoiVi: 'Ngày thứ hai họ làm gì?', dapAn: ['Rode horses', 'Visited a garden', 'Went to the market'] },
      { hoi: 'How was the weather in the morning?', hoiVi: 'Buổi sáng thời tiết thế nào?', dapAn: ['Cold', 'Hot', 'Rainy'] },
    ],
  },
];

export const truyenTheoLop = (lop: Lop) => TRUYEN_NGHE.filter((t) => t.lop === lop);
export const timTruyen = (ma: string) => TRUYEN_NGHE.find((t) => t.ma === ma);

/**
 * Soát dữ liệu truyện. Dùng cho script kiểm, không gọi lúc chạy.
 * Bắt các lỗi hay mắc khi viết tay: trùng mã, thiếu câu hỏi, đáp án trùng nhau,
 * và câu hỏi không có chỗ dựa trong truyện.
 */
export function kiemTruyen() {
  const loi: string[] = [];
  const daThay = new Set<string>();
  for (const t of TRUYEN_NGHE) {
    if (daThay.has(t.ma)) loi.push(`${t.ma}: trùng mã`);
    daThay.add(t.ma);
    if (t.cau.length < 4) loi.push(`${t.ma}: chỉ có ${t.cau.length} câu`);
    if (t.hoi.length < 3) loi.push(`${t.ma}: chỉ có ${t.hoi.length} câu hỏi`);
    for (const c of t.cau) if (!c.en.trim() || !c.vi.trim()) loi.push(`${t.ma}: câu thiếu bản dịch`);
    for (const h of t.hoi) {
      if (h.dapAn.length < 3) loi.push(`${t.ma}: "${h.hoi}" chỉ có ${h.dapAn.length} đáp án`);
      if (new Set(h.dapAn.map((x) => x.toLowerCase())).size !== h.dapAn.length)
        loi.push(`${t.ma}: "${h.hoi}" có đáp án trùng nhau`);
      if (!h.hoi.trim().endsWith('?')) loi.push(`${t.ma}: "${h.hoi}" không phải câu hỏi`);
      if (!h.hoiVi.trim()) loi.push(`${t.ma}: "${h.hoi}" thiếu bản dịch`);
    }
  }
  return loi;
}
