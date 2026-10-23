// Âm ghép & nhóm âm tiếng Anh cho bé — 4 danh mục, xếp từ dễ đến khó:
//   • Phụ âm ghép (digraph): 2–3 chữ đọc thành MỘT âm — sh, ch, th… rồi qu, tch, dge, wr, kn, mb, gh
//   • Nguyên âm ghép (vowel team): ai, ay, ee, ea, oa, ow, ie, igh… rồi oo, ou, oi, oy, au, aw, ew, ue
//   • Âm có R (r-controlled): ar, or, er, ir, ur
//   • Blends: phụ âm KẾT HỢP — mỗi chữ vẫn giữ âm riêng, đọc nối nhanh (bl = b + l)
// Mỗi từ = một thẻ hình (ảnh nền /assets/images/bg-card-2.webp) + một câu ví dụ ngắn.
//
// PHÁT ÂM: một nhóm có thể có hơn một cách đọc (th: /θ/ three – /ð/ this; wh: /w/ whale – /h/ who;
// ow: /oʊ/ snow – /aʊ/ cow…). `sound` của nhóm liệt kê mọi cách đọc; từ nào đọc khác cách đầu tiên
// thì ghi `ipa` riêng để thẻ hiện đúng âm của từ đó — không dạy bé đọc mọi từ wh là /w/.

export type DigraphWord = {
  word: string;
  vi: string;
  emoji: string;
  ex: string; // câu ví dụ ngắn có chứa từ
  exVi: string;
  ipa?: string; // âm của chữ ghép TRONG từ này, khi khác âm chính của nhóm
};

export type DigraphCategory = 'digraph' | 'vowel' | 'r' | 'blend';

export type Digraph = {
  letters: string;
  category: DigraphCategory;
  level: string; // hàng con trong danh mục (Cơ bản / Mở rộng / Blends với l…)
  sound: string; // mọi cách đọc, cách phổ biến đứng đầu
  note?: string;
  words: DigraphWord[];
};

export const DIGRAPH_CATEGORIES: { id: DigraphCategory; label: string; desc: string }[] = [
  { id: 'digraph', label: 'Phụ âm ghép', desc: '2–3 chữ cái phụ âm đọc thành MỘT âm mới (sh trong ship).' },
  { id: 'vowel', label: 'Nguyên âm ghép', desc: 'Hai nguyên âm (hoặc nguyên âm + w/y/gh) đứng cạnh nhau, đọc thành một âm (ai trong rain).' },
  { id: 'r', label: 'Âm có R', desc: 'Nguyên âm đứng trước r bị đổi cách đọc (ar trong car, ir trong bird).' },
  { id: 'blend', label: 'Blends', desc: 'Phụ âm KẾT HỢP: mỗi chữ vẫn giữ âm của nó, bé đọc nối thật nhanh (bl = b + l trong blue).' },
];

const w = (word: string, vi: string, emoji: string, ex: string, exVi: string, ipa?: string): DigraphWord => ({
  word, vi, emoji, ex, exVi, ...(ipa ? { ipa } : {}),
});

export const DIGRAPHS: Digraph[] = [
  // ════════ PHỤ ÂM GHÉP · CƠ BẢN ════════
  { letters: 'sh', category: 'digraph', level: 'Cơ bản', sound: '/ʃ/', words: [
    w('ship', 'con tàu', '🚢', 'I see a big ship.', 'Bé thấy một con tàu lớn.'),
    w('shell', 'vỏ sò', '🐚', 'I find a shell on the beach.', 'Bé nhặt được vỏ sò trên bãi biển.'),
    w('shoe', 'chiếc giày', '👟', 'Put on your shoe.', 'Con đi giày vào nhé.'),
    w('sheep', 'con cừu', '🐑', 'The sheep is white.', 'Con cừu màu trắng.'),
    w('fish', 'con cá', '🐟', 'The fish can swim.', 'Con cá biết bơi.'),
    w('brush', 'bàn chải', '🪥', 'This is my brush.', 'Đây là bàn chải của bé.'),
  ] },
  { letters: 'ch', category: 'digraph', level: 'Cơ bản', sound: '/tʃ/', words: [
    w('chair', 'cái ghế', '🪑', 'Sit on the chair.', 'Con ngồi lên ghế nhé.'),
    w('cheese', 'phô mai', '🧀', 'The mouse likes cheese.', 'Chú chuột thích phô mai.'),
    w('chick', 'gà con', '🐤', 'The chick is yellow.', 'Chú gà con màu vàng.'),
    w('chicken', 'con gà', '🐔', 'The chicken has an egg.', 'Con gà có một quả trứng.'),
    w('cherry', 'quả anh đào', '🍒', 'The cherry is red.', 'Quả anh đào màu đỏ.'),
    w('peach', 'quả đào', '🍑', 'I eat a peach.', 'Bé ăn một quả đào.'),
  ] },
  { letters: 'th', category: 'digraph', level: 'Cơ bản', sound: '/θ/, /ð/',
    note: 'th có 2 cách đọc: /θ/ đặt lưỡi giữa hai răng, thổi hơi, cổ KHÔNG rung (three, bath); /ð/ cũng đặt lưỡi như vậy nhưng cổ RUNG (this, mother)', words: [
    w('three', 'số ba', '3️⃣', 'I have three cats.', 'Bé có ba con mèo.'),
    w('thumb', 'ngón tay cái', '👍', 'Thumbs up!', 'Giơ ngón cái lên nào!'),
    w('teeth', 'hàm răng', '🦷', 'I brush my teeth.', 'Bé đánh răng.'),
    w('bath', 'bồn tắm', '🛁', 'I take a bath.', 'Bé đi tắm.'),
    w('this', 'cái này', '👇', 'This is my ball.', 'Đây là quả bóng của bé.', '/ð/'),
    w('mother', 'mẹ', '👩', 'I love my mother.', 'Bé yêu mẹ.', '/ð/'),
  ] },
  { letters: 'wh', category: 'digraph', level: 'Cơ bản', sound: '/w/, /h/',
    note: 'wh thường đọc /w/ (whale, wheel), nhưng trong who, whole lại đọc /h/', words: [
    w('whale', 'cá voi', '🐋', 'The whale is in the sea.', 'Cá voi sống dưới biển.'),
    w('wheel', 'bánh xe', '🛞', 'The car has a wheel.', 'Ô tô có bánh xe.'),
    w('white', 'màu trắng', '☁️', 'The cloud is white.', 'Đám mây màu trắng.'),
    w('wheat', 'lúa mì', '🌾', 'Bread is made from wheat.', 'Bánh mì làm từ lúa mì.'),
    w('whisper', 'thì thầm', '🤫', 'Whisper to me.', 'Thì thầm với tớ nhé.'),
    w('who', 'ai', '🙋', 'Who is it?', 'Ai đó?', '/h/'),
  ] },
  { letters: 'ph', category: 'digraph', level: 'Cơ bản', sound: '/f/', words: [
    w('phone', 'điện thoại', '📱', 'Mom has a phone.', 'Mẹ có một chiếc điện thoại.'),
    w('photo', 'bức ảnh', '📷', 'Let’s take a photo.', 'Mình chụp ảnh nào.'),
    w('dolphin', 'cá heo', '🐬', 'The dolphin can jump.', 'Cá heo biết nhảy.'),
    w('elephant', 'con voi', '🐘', 'The elephant is big.', 'Con voi rất to.'),
    w('trophy', 'chiếc cúp', '🏆', 'I win a trophy.', 'Bé giành được chiếc cúp.'),
    w('alphabet', 'bảng chữ cái', '🔤', 'I can sing the alphabet.', 'Bé hát được bảng chữ cái.'),
  ] },
  { letters: 'ck', category: 'digraph', level: 'Cơ bản', sound: '/k/', note: 'ck thường đứng cuối từ, ngay sau một nguyên âm ngắn', words: [
    w('duck', 'con vịt', '🦆', 'The duck can swim.', 'Con vịt biết bơi.'),
    w('sock', 'chiếc tất', '🧦', 'Where is my sock?', 'Chiếc tất của bé đâu rồi?'),
    w('clock', 'đồng hồ', '⏰', 'Look at the clock.', 'Nhìn đồng hồ nào.'),
    w('truck', 'xe tải', '🚚', 'The truck is big.', 'Chiếc xe tải rất to.'),
    w('rocket', 'tên lửa', '🚀', 'The rocket goes up.', 'Tên lửa bay lên.'),
    w('backpack', 'ba lô', '🎒', 'My backpack is blue.', 'Ba lô của bé màu xanh.'),
  ] },
  { letters: 'ng', category: 'digraph', level: 'Cơ bản', sound: '/ŋ/', words: [
    w('ring', 'chiếc nhẫn', '💍', 'Mom has a ring.', 'Mẹ có một chiếc nhẫn.'),
    w('king', 'nhà vua', '🤴', 'The king has a crown.', 'Nhà vua đội vương miện.'),
    w('wing', 'đôi cánh', '🪽', 'A bird has wings.', 'Con chim có đôi cánh.'),
    w('swing', 'xích đu', '🛝', 'I play on the swing.', 'Bé chơi xích đu.'),
    w('sing', 'hát', '🎤', 'I like to sing.', 'Bé thích hát.'),
    w('song', 'bài hát', '🎵', 'This is a happy song.', 'Đây là một bài hát vui.'),
  ] },

  // ════════ PHỤ ÂM GHÉP · MỞ RỘNG ════════
  { letters: 'qu', category: 'digraph', level: 'Mở rộng', sound: '/kw/', note: 'q gần như luôn đi với u, đọc /kw/', words: [
    w('queen', 'nữ hoàng', '👸', 'The queen is kind.', 'Nữ hoàng rất hiền.'),
    w('quack', 'tiếng vịt kêu', '🦆', 'The duck says quack.', 'Con vịt kêu quạc quạc.'),
    w('question', 'câu hỏi', '❓', 'I have a question.', 'Bé có một câu hỏi.'),
    w('quiet', 'yên lặng', '🤫', 'Please be quiet.', 'Con giữ trật tự nhé.'),
    w('squirrel', 'con sóc', '🐿️', 'The squirrel eats nuts.', 'Con sóc ăn hạt.'),
  ] },
  { letters: 'tch', category: 'digraph', level: 'Mở rộng', sound: '/tʃ/', note: 'tch đọc giống ch, hay đứng sau nguyên âm ngắn', words: [
    w('watch', 'đồng hồ đeo tay', '⌚', 'Dad has a watch.', 'Bố có một chiếc đồng hồ đeo tay.'),
    w('catch', 'bắt (bóng)', '⚾', 'Catch the ball!', 'Bắt bóng nào!'),
    w('witch', 'phù thủy', '🧙‍♀️', 'The witch has a hat.', 'Bà phù thủy đội mũ.'),
    w('hatch', 'nở (trứng)', '🐣', 'The egg will hatch.', 'Quả trứng sắp nở.'),
    w('kitchen', 'nhà bếp', '🍳', 'Mom cooks in the kitchen.', 'Mẹ nấu ăn trong bếp.'),
  ] },
  { letters: 'dge', category: 'digraph', level: 'Mở rộng', sound: '/dʒ/', note: 'dge đọc /dʒ/ (giống j), đứng cuối từ sau nguyên âm ngắn', words: [
    w('bridge', 'cây cầu', '🌉', 'We walk on the bridge.', 'Mình đi bộ trên cầu.'),
    w('badge', 'huy hiệu', '📛', 'I have a badge.', 'Bé có một chiếc huy hiệu.'),
    w('judge', 'thẩm phán', '🧑‍⚖️', 'The judge is fair.', 'Thẩm phán rất công bằng.'),
    w('fudge', 'kẹo mềm', '🍫', 'I like fudge.', 'Bé thích kẹo mềm.'),
    w('edge', 'mép, cạnh', '📏', 'Do not stand on the edge.', 'Đừng đứng ở mép nhé.'),
  ] },
  { letters: 'wr', category: 'digraph', level: 'Mở rộng', sound: '/r/', note: 'wr: chữ w câm, chỉ đọc /r/', words: [
    w('write', 'viết', '✍️', 'I write my name.', 'Bé viết tên mình.'),
    w('wrap', 'gói quà', '🎁', 'Wrap the gift.', 'Gói món quà lại nào.'),
    w('wrench', 'cờ lê', '🔧', 'Dad has a wrench.', 'Bố có một cái cờ lê.'),
    w('wrong', 'sai', '❌', 'Oops, that is wrong.', 'Ôi, sai mất rồi.'),
    w('wrist', 'cổ tay', '🫱', 'The watch is on my wrist.', 'Đồng hồ đeo trên cổ tay bé.'),
  ] },
  { letters: 'kn', category: 'digraph', level: 'Mở rộng', sound: '/n/', note: 'kn: chữ k câm, chỉ đọc /n/', words: [
    w('knee', 'đầu gối', '🦵', 'I hurt my knee.', 'Bé bị đau đầu gối.'),
    w('knife', 'con dao', '🔪', 'Be careful with the knife.', 'Cẩn thận với con dao nhé.'),
    w('knot', 'nút thắt', '🪢', 'Tie a knot.', 'Thắt một cái nút.'),
    w('knock', 'gõ cửa', '🚪', 'Knock on the door.', 'Gõ cửa nào.'),
    w('knit', 'đan len', '🧶', 'Grandma can knit.', 'Bà biết đan len.'),
  ] },
  { letters: 'mb', category: 'digraph', level: 'Mở rộng', sound: '/m/', note: 'mb ở cuối từ: chữ b câm, chỉ đọc /m/', words: [
    w('lamb', 'cừu non', '🐑', 'The lamb is soft.', 'Chú cừu non mềm mại.'),
    w('thumb', 'ngón tay cái', '👍', 'I have two thumbs.', 'Bé có hai ngón tay cái.'),
    w('comb', 'cái lược', '🪮', 'I comb my hair.', 'Bé chải tóc.'),
    w('climb', 'leo trèo', '🧗', 'I can climb.', 'Bé biết leo trèo.'),
    w('crumb', 'vụn bánh', '🍞', 'A crumb is on the table.', 'Có vụn bánh trên bàn.'),
  ] },
  { letters: 'gh', category: 'digraph', level: 'Mở rộng', sound: '/g/, /f/', note: 'gh ở đầu từ đọc /g/ (ghost); ở cuối từ có khi đọc /f/ (laugh)', words: [
    w('ghost', 'con ma', '👻', 'The ghost says boo!', 'Con ma kêu “hù”!'),
    w('spaghetti', 'mì Ý', '🍝', 'I love spaghetti.', 'Bé rất thích mì Ý.'),
    w('laugh', 'cười to', '😂', 'We laugh and play.', 'Chúng mình cười và chơi đùa.', '/f/'),
    w('cough', 'ho', '😷', 'I have a cough.', 'Bé bị ho.', '/f/'),
  ] },

  // ════════ NGUYÊN ÂM GHÉP · CƠ BẢN ════════
  { letters: 'ai', category: 'vowel', level: 'Cơ bản', sound: '/eɪ/', note: 'ai thường đứng giữa từ (rain), ay đứng cuối từ (day)', words: [
    w('rain', 'mưa', '🌧️', 'I like the rain.', 'Bé thích trời mưa.'),
    w('train', 'tàu hỏa', '🚆', 'The train is long.', 'Đoàn tàu rất dài.'),
    w('snail', 'ốc sên', '🐌', 'The snail is slow.', 'Ốc sên bò chậm.'),
    w('paint', 'vẽ màu', '🎨', 'I paint a flower.', 'Bé tô vẽ một bông hoa.'),
    w('mail', 'thư', '📬', 'We get mail.', 'Nhà mình nhận được thư.'),
  ] },
  { letters: 'ay', category: 'vowel', level: 'Cơ bản', sound: '/eɪ/', words: [
    w('day', 'ban ngày', '🌞', 'It is a sunny day.', 'Hôm nay trời nắng đẹp.'),
    w('play', 'chơi', '🧸', 'Let’s play!', 'Mình chơi nào!'),
    w('crayon', 'bút sáp màu', '🖍️', 'I draw with a crayon.', 'Bé vẽ bằng bút sáp.'),
    w('clay', 'đất nặn', '🏺', 'I make a pot with clay.', 'Bé nặn cái bình bằng đất.'),
    w('pray', 'cầu nguyện', '🙏', 'I pray at night.', 'Bé cầu nguyện mỗi tối.'),
  ] },
  { letters: 'ee', category: 'vowel', level: 'Cơ bản', sound: '/iː/', words: [
    w('tree', 'cái cây', '🌳', 'The tree is tall.', 'Cái cây rất cao.'),
    w('bee', 'con ong', '🐝', 'The bee likes flowers.', 'Con ong thích hoa.'),
    w('feet', 'bàn chân', '🦶', 'I have two feet.', 'Bé có hai bàn chân.'),
    w('sheep', 'con cừu', '🐑', 'The sheep says baa.', 'Con cừu kêu be be.'),
    w('queen', 'nữ hoàng', '👸', 'The queen has a crown.', 'Nữ hoàng đội vương miện.'),
  ] },
  { letters: 'ea', category: 'vowel', level: 'Cơ bản', sound: '/iː/, /e/', note: 'ea thường đọc /iː/ như sea; một số từ đọc /e/ như bread', words: [
    w('tea', 'trà', '🍵', 'Grandpa drinks tea.', 'Ông uống trà.'),
    w('sea', 'biển', '🌊', 'The sea is blue.', 'Biển màu xanh.'),
    w('leaf', 'chiếc lá', '🍃', 'The leaf is green.', 'Chiếc lá màu xanh lá.'),
    w('beach', 'bãi biển', '🏖️', 'We go to the beach.', 'Cả nhà đi biển.'),
    w('bread', 'bánh mì', '🍞', 'I eat bread.', 'Bé ăn bánh mì.', '/e/'),
  ] },
  { letters: 'oa', category: 'vowel', level: 'Cơ bản', sound: '/oʊ/', words: [
    w('boat', 'con thuyền', '⛵', 'The boat is on the lake.', 'Con thuyền trên mặt hồ.'),
    w('goat', 'con dê', '🐐', 'The goat eats grass.', 'Con dê ăn cỏ.'),
    w('coat', 'áo khoác', '🧥', 'Put on your coat.', 'Con mặc áo khoác vào nhé.'),
    w('soap', 'xà phòng', '🧼', 'Wash with soap.', 'Rửa tay bằng xà phòng nào.'),
    w('toast', 'bánh mì nướng', '🍞', 'I have toast.', 'Bé ăn bánh mì nướng.'),
  ] },
  { letters: 'ow', category: 'vowel', level: 'Cơ bản', sound: '/oʊ/, /aʊ/', note: 'ow có 2 cách đọc: /oʊ/ như snow, bowl và /aʊ/ như cow, owl', words: [
    w('snow', 'tuyết', '❄️', 'The snow is cold.', 'Tuyết rất lạnh.'),
    w('bow', 'cái nơ', '🎀', 'I have a pink bow.', 'Bé có chiếc nơ hồng.'),
    w('bowl', 'cái bát', '🥣', 'The bowl is hot.', 'Cái bát còn nóng.'),
    w('cow', 'con bò', '🐄', 'The cow says moo.', 'Con bò kêu ò ò.', '/aʊ/'),
    w('owl', 'con cú', '🦉', 'The owl can see at night.', 'Con cú nhìn được ban đêm.', '/aʊ/'),
    w('crown', 'vương miện', '👑', 'The king has a crown.', 'Nhà vua có vương miện.', '/aʊ/'),
  ] },
  { letters: 'ie', category: 'vowel', level: 'Cơ bản', sound: '/aɪ/', words: [
    w('pie', 'bánh nướng', '🥧', 'Mom makes a pie.', 'Mẹ làm bánh nướng.'),
    w('tie', 'cà vạt', '👔', 'Dad wears a tie.', 'Bố đeo cà vạt.'),
    w('fries', 'khoai tây chiên', '🍟', 'I like fries.', 'Bé thích khoai tây chiên.'),
    w('cried', 'đã khóc', '😢', 'The baby cried.', 'Em bé đã khóc.'),
  ] },
  { letters: 'igh', category: 'vowel', level: 'Cơ bản', sound: '/aɪ/', note: 'igh: chữ gh câm, cả nhóm đọc /aɪ/', words: [
    w('night', 'ban đêm', '🌙', 'Good night!', 'Chúc ngủ ngon!'),
    w('light', 'bóng đèn', '💡', 'Turn on the light.', 'Bật đèn lên nào.'),
    w('high', 'cao', '⬆️', 'The bird flies high.', 'Con chim bay cao.'),
    w('right', 'bên phải', '👉', 'Turn right.', 'Rẽ phải nhé.'),
    w('flight', 'chuyến bay', '✈️', 'We take a flight.', 'Cả nhà đi máy bay.'),
  ] },

  // ════════ NGUYÊN ÂM GHÉP · MỞ RỘNG ════════
  { letters: 'oo', category: 'vowel', level: 'Mở rộng', sound: '/uː/, /ʊ/', note: 'oo dài /uː/ như moon; oo ngắn /ʊ/ như book', words: [
    w('moon', 'mặt trăng', '🌕', 'The moon is round.', 'Mặt trăng tròn.'),
    w('spoon', 'cái thìa', '🥄', 'Eat with a spoon.', 'Ăn bằng thìa nhé.'),
    w('zoo', 'sở thú', '🦁', 'We go to the zoo.', 'Cả nhà đi sở thú.'),
    w('book', 'quyển sách', '📖', 'I read a book.', 'Bé đọc sách.', '/ʊ/'),
    w('foot', 'bàn chân', '🦶', 'Kick with your foot.', 'Đá bằng chân nào.', '/ʊ/'),
    w('cook', 'nấu ăn', '🧑‍🍳', 'Dad can cook.', 'Bố biết nấu ăn.', '/ʊ/'),
  ] },
  { letters: 'ou', category: 'vowel', level: 'Mở rộng', sound: '/aʊ/', words: [
    w('house', 'ngôi nhà', '🏠', 'This is my house.', 'Đây là nhà của bé.'),
    w('mouse', 'con chuột', '🐭', 'The mouse is small.', 'Chú chuột nhỏ xíu.'),
    w('cloud', 'đám mây', '☁️', 'I see a cloud.', 'Bé thấy một đám mây.'),
    w('mouth', 'cái miệng', '👄', 'Open your mouth.', 'Há miệng ra nào.'),
    w('count', 'đếm', '🔢', 'I can count to ten.', 'Bé đếm được đến mười.'),
  ] },
  { letters: 'oi', category: 'vowel', level: 'Mở rộng', sound: '/ɔɪ/', note: 'oi đứng giữa từ (coin), oy đứng cuối từ (boy)', words: [
    w('coin', 'đồng xu', '🪙', 'I have a coin.', 'Bé có một đồng xu.'),
    w('oil', 'dầu ăn', '🫒', 'Mom cooks with oil.', 'Mẹ nấu ăn bằng dầu.'),
    w('point', 'chỉ tay', '👉', 'Point to the cat.', 'Chỉ vào con mèo nào.'),
    w('toilet', 'nhà vệ sinh', '🚽', 'Where is the toilet?', 'Nhà vệ sinh ở đâu ạ?'),
    w('boil', 'đun sôi', '♨️', 'Boil the water.', 'Đun sôi nước.'),
  ] },
  { letters: 'oy', category: 'vowel', level: 'Mở rộng', sound: '/ɔɪ/', words: [
    w('boy', 'cậu bé', '👦', 'The boy is happy.', 'Cậu bé đang vui.'),
    w('toy', 'đồ chơi', '🧸', 'This is my toy.', 'Đây là đồ chơi của bé.'),
    w('joy', 'niềm vui', '😄', 'I jump for joy.', 'Bé nhảy lên vì vui.'),
    w('oyster', 'con hàu', '🦪', 'An oyster lives in the sea.', 'Con hàu sống dưới biển.'),
    w('enjoy', 'thích thú', '😋', 'I enjoy my lunch.', 'Bé ăn trưa ngon lành.'),
  ] },
  { letters: 'au', category: 'vowel', level: 'Mở rộng', sound: '/ɔː/', note: 'au và aw cùng đọc /ɔː/; aw hay đứng cuối từ', words: [
    w('autumn', 'mùa thu', '🍂', 'Leaves fall in autumn.', 'Lá rụng vào mùa thu.'),
    w('astronaut', 'phi hành gia', '🧑‍🚀', 'The astronaut goes to space.', 'Phi hành gia bay vào vũ trụ.'),
    w('launch', 'phóng lên', '🚀', 'Launch the rocket!', 'Phóng tên lửa nào!'),
    w('sauce', 'nước sốt', '🥫', 'I like tomato sauce.', 'Bé thích sốt cà chua.'),
    w('August', 'tháng Tám', '📅', 'My birthday is in August.', 'Sinh nhật bé vào tháng Tám.'),
  ] },
  { letters: 'aw', category: 'vowel', level: 'Mở rộng', sound: '/ɔː/', words: [
    w('paw', 'bàn chân thú', '🐾', 'The dog has a paw.', 'Chú chó có bàn chân nhỏ.'),
    w('saw', 'cái cưa', '🪚', 'Dad has a saw.', 'Bố có một cái cưa.'),
    w('straw', 'ống hút', '🥤', 'I drink with a straw.', 'Bé uống bằng ống hút.'),
    w('draw', 'vẽ', '✏️', 'I draw a cat.', 'Bé vẽ một con mèo.'),
    w('yawn', 'ngáp', '🥱', 'I yawn at night.', 'Buổi tối bé ngáp.'),
  ] },
  { letters: 'ew', category: 'vowel', level: 'Mở rộng', sound: '/uː/', note: 'ew và ue thường đọc /uː/', words: [
    w('new', 'mới', '🆕', 'I have a new toy.', 'Bé có đồ chơi mới.'),
    w('stew', 'món hầm', '🍲', 'Mom makes stew.', 'Mẹ nấu món hầm.'),
    w('screw', 'con ốc vít', '🔩', 'Dad has a screw.', 'Bố có một con ốc vít.'),
    w('chew', 'nhai', '😋', 'Chew your food.', 'Nhai kỹ thức ăn nhé.'),
    w('jewel', 'đá quý', '💎', 'The jewel is shiny.', 'Viên đá quý lấp lánh.'),
  ] },
  { letters: 'ue', category: 'vowel', level: 'Mở rộng', sound: '/uː/', words: [
    w('blue', 'màu xanh dương', '🔵', 'The sky is blue.', 'Bầu trời màu xanh.'),
    w('glue', 'keo dán', '🧴', 'I use glue.', 'Bé dùng keo dán.'),
    w('clue', 'manh mối', '🔍', 'Find the clue!', 'Tìm manh mối nào!'),
    w('true', 'đúng', '✅', 'That is true.', 'Điều đó đúng.'),
    w('statue', 'bức tượng', '🗽', 'Look at the statue.', 'Nhìn bức tượng kìa.'),
  ] },

  // ════════ ÂM CÓ R ════════
  { letters: 'ar', category: 'r', level: 'Âm có R', sound: '/ɑːr/', words: [
    w('car', 'ô tô', '🚗', 'The car is red.', 'Chiếc ô tô màu đỏ.'),
    w('star', 'ngôi sao', '⭐', 'I see a star.', 'Bé thấy một ngôi sao.'),
    w('farm', 'nông trại', '🚜', 'Cows live on a farm.', 'Bò sống ở nông trại.'),
    w('shark', 'cá mập', '🦈', 'The shark can swim fast.', 'Cá mập bơi rất nhanh.'),
    w('arm', 'cánh tay', '💪', 'I have two arms.', 'Bé có hai cánh tay.'),
  ] },
  { letters: 'or', category: 'r', level: 'Âm có R', sound: '/ɔːr/', words: [
    w('fork', 'cái nĩa', '🍴', 'Eat with a fork.', 'Ăn bằng nĩa nhé.'),
    w('horse', 'con ngựa', '🐴', 'The horse can run.', 'Con ngựa chạy được.'),
    w('corn', 'bắp ngô', '🌽', 'I like corn.', 'Bé thích ăn ngô.'),
    w('storm', 'cơn bão', '⛈️', 'The storm is loud.', 'Cơn bão rất to.'),
    w('horn', 'cái kèn', '📯', 'Blow the horn.', 'Thổi kèn nào.'),
  ] },
  { letters: 'er', category: 'r', level: 'Âm có R', sound: '/ɜːr/, /ər/', note: 'er, ir, ur cùng một âm /ɜːr/; er ở cuối từ đọc nhẹ /ər/ (tiger, water)', words: [
    w('her', 'cô ấy', '👩', 'This is her bag.', 'Đây là túi của cô ấy.'),
    w('fern', 'cây dương xỉ', '🌿', 'The fern is green.', 'Cây dương xỉ màu xanh.'),
    w('tiger', 'con hổ', '🐯', 'The tiger is strong.', 'Con hổ rất khỏe.', '/ər/'),
    w('water', 'nước', '💧', 'I drink water.', 'Bé uống nước.', '/ər/'),
    w('butterfly', 'con bướm', '🦋', 'The butterfly is pretty.', 'Con bướm thật đẹp.', '/ər/'),
  ] },
  { letters: 'ir', category: 'r', level: 'Âm có R', sound: '/ɜːr/', words: [
    w('bird', 'con chim', '🐦', 'The bird can fly.', 'Con chim biết bay.'),
    w('girl', 'cô bé', '👧', 'The girl is smiling.', 'Cô bé đang cười.'),
    w('shirt', 'áo sơ mi', '👕', 'My shirt is blue.', 'Áo của bé màu xanh.'),
    w('first', 'thứ nhất', '🥇', 'I am first!', 'Bé về nhất!'),
    w('circle', 'hình tròn', '⭕', 'Draw a circle.', 'Vẽ một hình tròn.'),
  ] },
  { letters: 'ur', category: 'r', level: 'Âm có R', sound: '/ɜːr/', words: [
    w('nurse', 'y tá', '🧑‍⚕️', 'The nurse is kind.', 'Cô y tá rất hiền.'),
    w('purple', 'màu tím', '🟣', 'I like purple.', 'Bé thích màu tím.'),
    w('turtle', 'con rùa', '🐢', 'The turtle is slow.', 'Con rùa bò chậm.'),
    w('burger', 'bánh hamburger', '🍔', 'I eat a burger.', 'Bé ăn bánh hamburger.'),
    w('purse', 'cái ví', '👛', 'Mom has a purse.', 'Mẹ có một cái ví.'),
  ] },

  // ════════ BLENDS · VỚI L ════════
  { letters: 'bl', category: 'blend', level: 'Blends với l', sound: '/bl/', words: [
    w('blue', 'màu xanh dương', '🔵', 'The sky is blue.', 'Bầu trời màu xanh.'),
    w('black', 'màu đen', '⚫', 'The cat is black.', 'Con mèo màu đen.'),
    w('block', 'khối gạch', '🧱', 'I build with blocks.', 'Bé xếp hình bằng khối gạch.'),
    w('blow', 'thổi', '🌬️', 'Blow out the candles.', 'Thổi nến nào.'),
  ] },
  { letters: 'cl', category: 'blend', level: 'Blends với l', sound: '/kl/', words: [
    w('clock', 'đồng hồ', '⏰', 'The clock says seven.', 'Đồng hồ chỉ bảy giờ.'),
    w('cloud', 'đám mây', '☁️', 'The cloud is white.', 'Đám mây màu trắng.'),
    w('clap', 'vỗ tay', '👏', 'Clap your hands.', 'Vỗ tay nào.'),
    w('clown', 'chú hề', '🤡', 'The clown is funny.', 'Chú hề thật vui nhộn.'),
    w('climb', 'leo trèo', '🧗', 'I climb the hill.', 'Bé leo lên đồi.'),
  ] },
  { letters: 'fl', category: 'blend', level: 'Blends với l', sound: '/fl/', words: [
    w('flag', 'lá cờ', '🚩', 'The flag is red.', 'Lá cờ màu đỏ.'),
    w('flower', 'bông hoa', '🌸', 'I smell the flower.', 'Bé ngửi bông hoa.'),
    w('fly', 'con ruồi', '🪰', 'A fly is on the cake.', 'Có con ruồi đậu trên bánh.'),
    w('flute', 'cây sáo', '🪈', 'I play the flute.', 'Bé thổi sáo.'),
    w('flame', 'ngọn lửa', '🔥', 'The flame is hot.', 'Ngọn lửa rất nóng.'),
  ] },
  { letters: 'gl', category: 'blend', level: 'Blends với l', sound: '/gl/', words: [
    w('glass', 'cái cốc', '🥛', 'A glass of milk.', 'Một cốc sữa.'),
    w('glove', 'găng tay', '🧤', 'Put on your gloves.', 'Đeo găng tay vào nhé.'),
    w('globe', 'quả địa cầu', '🌍', 'Look at the globe.', 'Nhìn quả địa cầu nào.'),
    w('glue', 'keo dán', '🧴', 'Glue the paper.', 'Dán tờ giấy lại.'),
  ] },
  { letters: 'pl', category: 'blend', level: 'Blends với l', sound: '/pl/', words: [
    w('plane', 'máy bay', '✈️', 'The plane is in the sky.', 'Máy bay trên bầu trời.'),
    w('plant', 'cây trồng', '🪴', 'Water the plant.', 'Tưới cây nào.'),
    w('plate', 'cái đĩa', '🍽️', 'Put it on the plate.', 'Đặt lên đĩa nhé.'),
    w('planet', 'hành tinh', '🪐', 'Earth is a planet.', 'Trái Đất là một hành tinh.'),
    w('play', 'chơi', '🧸', 'Let’s play together.', 'Mình cùng chơi nhé.'),
  ] },
  { letters: 'sl', category: 'blend', level: 'Blends với l', sound: '/sl/', words: [
    w('sled', 'xe trượt tuyết', '🛷', 'I ride a sled.', 'Bé đi xe trượt tuyết.'),
    w('slide', 'cầu trượt', '🛝', 'I go down the slide.', 'Bé chơi cầu trượt.'),
    w('sleep', 'ngủ', '😴', 'I sleep at night.', 'Bé ngủ vào ban đêm.'),
    w('slipper', 'dép đi trong nhà', '🩴', 'Where is my slipper?', 'Dép của bé đâu rồi?'),
    w('slug', 'con sên', '🐌', 'The slug is slow.', 'Con sên bò chậm.'),
  ] },

  // ════════ BLENDS · VỚI R ════════
  { letters: 'br', category: 'blend', level: 'Blends với r', sound: '/br/', words: [
    w('bread', 'bánh mì', '🍞', 'I eat bread.', 'Bé ăn bánh mì.'),
    w('bridge', 'cây cầu', '🌉', 'The bridge is long.', 'Cây cầu rất dài.'),
    w('broom', 'cái chổi', '🧹', 'Sweep with a broom.', 'Quét nhà bằng chổi.'),
    w('brick', 'viên gạch', '🧱', 'The wall is made of bricks.', 'Bức tường xây bằng gạch.'),
    w('brain', 'bộ não', '🧠', 'I use my brain.', 'Bé dùng bộ não để suy nghĩ.'),
  ] },
  { letters: 'cr', category: 'blend', level: 'Blends với r', sound: '/kr/', words: [
    w('crab', 'con cua', '🦀', 'The crab is red.', 'Con cua màu đỏ.'),
    w('crown', 'vương miện', '👑', 'The queen has a crown.', 'Nữ hoàng có vương miện.'),
    w('crayon', 'bút sáp màu', '🖍️', 'I have a crayon.', 'Bé có bút sáp màu.'),
    w('cry', 'khóc', '😭', 'Don’t cry.', 'Đừng khóc nhé.'),
    w('cricket', 'con dế', '🦗', 'The cricket can jump.', 'Con dế biết nhảy.'),
  ] },
  { letters: 'dr', category: 'blend', level: 'Blends với r', sound: '/dr/', words: [
    w('drum', 'cái trống', '🥁', 'I play the drum.', 'Bé đánh trống.'),
    w('dress', 'váy', '👗', 'I have a new dress.', 'Bé có váy mới.'),
    w('dragon', 'con rồng', '🐉', 'The dragon can fly.', 'Con rồng biết bay.'),
    w('drink', 'đồ uống', '🥤', 'I want a drink.', 'Bé muốn uống nước.'),
    w('drop', 'giọt nước', '💧', 'A drop of water.', 'Một giọt nước.'),
  ] },
  { letters: 'fr', category: 'blend', level: 'Blends với r', sound: '/fr/', words: [
    w('frog', 'con ếch', '🐸', 'The frog can jump.', 'Con ếch biết nhảy.'),
    w('fruit', 'trái cây', '🍎', 'I like fruit.', 'Bé thích trái cây.'),
    w('fries', 'khoai tây chiên', '🍟', 'I eat fries.', 'Bé ăn khoai tây chiên.'),
    w('friend', 'bạn bè', '🧑‍🤝‍🧑', 'You are my friend.', 'Cậu là bạn của tớ.'),
    w('frown', 'cau mày', '☹️', 'Don’t frown, smile!', 'Đừng cau mày, cười lên nào!'),
  ] },
  { letters: 'gr', category: 'blend', level: 'Blends với r', sound: '/gr/', words: [
    w('grapes', 'chùm nho', '🍇', 'I like grapes.', 'Bé thích ăn nho.'),
    w('grass', 'bãi cỏ', '🌱', 'The grass is green.', 'Cỏ màu xanh.'),
    w('green', 'màu xanh lá', '🟢', 'The frog is green.', 'Con ếch màu xanh lá.'),
    w('grandma', 'bà', '👵', 'I love my grandma.', 'Bé yêu bà.'),
    w('grin', 'cười toe', '😁', 'He has a big grin.', 'Bạn ấy cười toe toét.'),
  ] },
  { letters: 'pr', category: 'blend', level: 'Blends với r', sound: '/pr/', words: [
    w('prince', 'hoàng tử', '🤴', 'The prince is brave.', 'Hoàng tử rất dũng cảm.'),
    w('princess', 'công chúa', '👸', 'The princess is kind.', 'Công chúa rất hiền.'),
    w('present', 'món quà', '🎁', 'I get a present.', 'Bé được nhận quà.'),
    w('pretzel', 'bánh quy xoắn', '🥨', 'I eat a pretzel.', 'Bé ăn bánh quy xoắn.'),
    w('pray', 'cầu nguyện', '🙏', 'We pray together.', 'Cả nhà cùng cầu nguyện.'),
  ] },
  { letters: 'tr', category: 'blend', level: 'Blends với r', sound: '/tr/', words: [
    w('tree', 'cái cây', '🌳', 'A bird is in the tree.', 'Có con chim trên cây.'),
    w('train', 'tàu hỏa', '🚆', 'The train is fast.', 'Tàu hỏa chạy nhanh.'),
    w('truck', 'xe tải', '🚚', 'The truck is big.', 'Xe tải rất to.'),
    w('tractor', 'máy cày', '🚜', 'The tractor is on the farm.', 'Máy cày ở nông trại.'),
    w('trumpet', 'kèn trumpet', '🎺', 'I play the trumpet.', 'Bé thổi kèn.'),
  ] },

  // ════════ BLENDS · VỚI S ════════
  { letters: 'st', category: 'blend', level: 'Blends với s', sound: '/st/', note: 'st có thể đứng đầu từ (star) hoặc cuối từ (nest)', words: [
    w('star', 'ngôi sao', '⭐', 'Twinkle, little star.', 'Lấp lánh, ngôi sao nhỏ.'),
    w('stop', 'dừng lại', '🛑', 'Stop at the red light.', 'Dừng lại khi đèn đỏ.'),
    w('stone', 'hòn đá', '🪨', 'I find a stone.', 'Bé nhặt được hòn đá.'),
    w('steak', 'bít tết', '🥩', 'Dad eats steak.', 'Bố ăn bít tết.'),
    w('nest', 'cái tổ', '🪺', 'The bird is in the nest.', 'Con chim ở trong tổ.'),
  ] },
  { letters: 'sp', category: 'blend', level: 'Blends với s', sound: '/sp/', words: [
    w('spoon', 'cái thìa', '🥄', 'I eat with a spoon.', 'Bé ăn bằng thìa.'),
    w('spider', 'con nhện', '🕷️', 'The spider makes a web.', 'Con nhện giăng tơ.'),
    w('sponge', 'miếng bọt biển', '🧽', 'Wash with a sponge.', 'Rửa bằng miếng bọt biển.'),
    w('space', 'vũ trụ', '🌌', 'Stars are in space.', 'Các vì sao ở trong vũ trụ.'),
    w('spaghetti', 'mì Ý', '🍝', 'I eat spaghetti.', 'Bé ăn mì Ý.'),
  ] },
  { letters: 'sk', category: 'blend', level: 'Blends với s', sound: '/sk/', words: [
    w('skate', 'trượt băng', '⛸️', 'I can skate.', 'Bé biết trượt băng.'),
    w('ski', 'trượt tuyết', '🎿', 'We ski in winter.', 'Mùa đông mình đi trượt tuyết.'),
    w('skirt', 'chân váy', '👗', 'My skirt is pink.', 'Chân váy của bé màu hồng.'),
    w('skunk', 'chồn hôi', '🦨', 'The skunk smells bad.', 'Con chồn hôi rất hôi.'),
    w('sky', 'bầu trời', '🌤️', 'The sky is blue.', 'Bầu trời xanh.'),
  ] },
  { letters: 'sm', category: 'blend', level: 'Blends với s', sound: '/sm/', words: [
    w('smile', 'nụ cười', '😊', 'Smile, please!', 'Cười lên nào!'),
    w('smoke', 'khói', '💨', 'I see smoke.', 'Bé thấy khói.'),
    w('smell', 'ngửi', '👃', 'I smell the cake.', 'Bé ngửi thấy mùi bánh.'),
    w('small', 'nhỏ bé', '🐜', 'The ant is small.', 'Con kiến nhỏ xíu.'),
  ] },
  { letters: 'sn', category: 'blend', level: 'Blends với s', sound: '/sn/', words: [
    w('snake', 'con rắn', '🐍', 'The snake is long.', 'Con rắn rất dài.'),
    w('snail', 'ốc sên', '🐌', 'The snail has a shell.', 'Ốc sên có vỏ.'),
    w('snowman', 'người tuyết', '⛄', 'We make a snowman.', 'Mình đắp người tuyết.'),
    w('sneeze', 'hắt hơi', '🤧', 'Achoo! I sneeze.', 'Hắt xì! Bé hắt hơi.'),
    w('snack', 'đồ ăn vặt', '🍿', 'I want a snack.', 'Bé muốn ăn vặt.'),
  ] },
  { letters: 'sw', category: 'blend', level: 'Blends với s', sound: '/sw/', words: [
    w('swim', 'bơi', '🏊', 'I can swim.', 'Bé biết bơi.'),
    w('swan', 'thiên nga', '🦢', 'The swan is white.', 'Thiên nga màu trắng.'),
    w('swing', 'xích đu', '🛝', 'Push me on the swing.', 'Đẩy xích đu cho tớ với.'),
    w('sweet', 'ngọt', '🍬', 'The candy is sweet.', 'Viên kẹo ngọt.'),
    w('sweep', 'quét nhà', '🧹', 'I sweep the floor.', 'Bé quét nhà.'),
  ] },

  // ════════ BLENDS · TW & 3 CHỮ ════════
  { letters: 'tw', category: 'blend', level: 'tw & blends 3 chữ', sound: '/tw/', words: [
    w('twins', 'cặp sinh đôi', '👯', 'They are twins.', 'Hai bạn là sinh đôi.'),
    w('twelve', 'số mười hai', '🕛', 'I am twelve.', 'Tớ mười hai tuổi.'),
    w('tweet', 'tiếng chim hót', '🐦', 'The bird says tweet.', 'Con chim hót líu lo.'),
    w('twig', 'cành cây nhỏ', '🌿', 'I pick up a twig.', 'Bé nhặt một cành cây nhỏ.'),
    w('twinkle', 'lấp lánh', '✨', 'The stars twinkle.', 'Các vì sao lấp lánh.'),
  ] },
  { letters: 'str', category: 'blend', level: 'tw & blends 3 chữ', sound: '/str/', words: [
    w('strawberry', 'dâu tây', '🍓', 'The strawberry is red.', 'Quả dâu tây màu đỏ.'),
    w('street', 'đường phố', '🛣️', 'Look both ways on the street.', 'Nhìn hai bên khi qua đường.'),
    w('straw', 'ống hút', '🥤', 'I drink with a straw.', 'Bé uống bằng ống hút.'),
    w('string', 'sợi dây', '🧵', 'Pull the string.', 'Kéo sợi dây nào.'),
    w('stripe', 'sọc kẻ', '🦓', 'The zebra has stripes.', 'Ngựa vằn có sọc.'),
  ] },
  { letters: 'spr', category: 'blend', level: 'tw & blends 3 chữ', sound: '/spr/', words: [
    w('spring', 'mùa xuân', '🌸', 'Flowers grow in spring.', 'Hoa nở vào mùa xuân.'),
    w('spray', 'bình xịt', '🧴', 'Spray the plants.', 'Xịt nước cho cây.'),
    w('sprout', 'mầm cây', '🌱', 'A sprout comes up.', 'Một mầm cây nhú lên.'),
    w('sprinkles', 'cốm rắc bánh', '🍩', 'I like sprinkles.', 'Bé thích cốm rắc bánh.'),
  ] },
  { letters: 'scr', category: 'blend', level: 'tw & blends 3 chữ', sound: '/skr/', words: [
    w('scream', 'hét lên', '😱', 'Don’t scream!', 'Đừng hét lên nhé!'),
    w('screw', 'ốc vít', '🔩', 'Turn the screw.', 'Vặn con ốc vít.'),
    w('scroll', 'cuộn giấy', '📜', 'Open the scroll.', 'Mở cuộn giấy ra.'),
    w('scrub', 'cọ rửa', '🧽', 'Scrub the pot.', 'Cọ sạch cái nồi.'),
  ] },
];

export const totalDigraphWords = () => DIGRAPHS.reduce((n, d) => n + d.words.length, 0);
