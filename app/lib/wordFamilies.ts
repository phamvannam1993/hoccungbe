// Word Family — "họ từ" cùng vần cuối (bed, red, fed… cùng họ -ed). Bé thay chữ đầu
// là đọc được từ mới → cách tập đọc phonics phổ biến sau từ CVC.
//
// Thẻ hoa có 5 cánh (ảnh nền /assets/images/bg-card.webp): 5 từ đầu lên cánh hoa; họ nào
// chỉ có 4 từ thông dụng thì cánh thứ 5 là ô "?" để bé tự tìm thêm từ. Toàn bộ từ của họ
// (4–6 từ) còn hiện thành thẻ từ vựng riêng (ảnh nền bg-card-2.webp) bên dưới.
// Từ nào cũng phải vẽ được bằng emoji rõ nghĩa để bé nhìn hình đoán từ.

export type FamilyWord = { word: string; vi: string; emoji: string };

export type FamilyGroup = 'a' | 'e' | 'i' | 'o' | 'u' | 'more';

export type WordFamily = {
  rime: string; // vần chung, vd 'ed'
  group: FamilyGroup;
  note?: string; // lưu ý phát âm riêng của họ (vd -ow đọc /oʊ/)
  words: FamilyWord[];
};

export const FAMILY_GROUPS: { id: FamilyGroup; label: string; hint: string }[] = [
  { id: 'a', label: 'Short A', hint: 'a ngắn /æ/ như cat' },
  { id: 'e', label: 'Short E', hint: 'e ngắn /ɛ/ như bed' },
  { id: 'i', label: 'Short I', hint: 'i ngắn /ɪ/ như pig' },
  { id: 'o', label: 'Short O', hint: 'o ngắn /ɑ/ như dog (Anh-Mỹ)' },
  { id: 'u', label: 'Short U', hint: 'u ngắn /ʌ/ như sun' },
  { id: 'more', label: 'Mở rộng', hint: 'vần dài & vần đặc biệt: -ake, -ain, -eep, -ight…' },
];

const w = (word: string, vi: string, emoji: string): FamilyWord => ({ word, vi, emoji });

export const WORD_FAMILIES: WordFamily[] = [
  // ── Short A ──
  { rime: 'at', group: 'a', words: [w('cat', 'con mèo', '🐱'), w('hat', 'cái mũ', '🎩'), w('bat', 'con dơi', '🦇'), w('rat', 'con chuột', '🐀'), w('mat', 'tấm thảm', '🧘'), w('sat', 'đã ngồi', '🪑')] },
  { rime: 'an', group: 'a', words: [w('fan', 'cái quạt', '🪭'), w('can', 'cái lon', '🥫'), w('man', 'người đàn ông', '👨'), w('van', 'xe tải nhỏ', '🚐'), w('pan', 'cái chảo', '🍳')] },
  { rime: 'ap', group: 'a', words: [w('cap', 'mũ lưỡi trai', '🧢'), w('map', 'bản đồ', '🗺️'), w('nap', 'giấc ngủ ngắn', '😴'), w('tap', 'vòi nước', '🚰'), w('clap', 'vỗ tay', '👏')] },
  { rime: 'ad', group: 'a', words: [w('dad', 'bố', '👨'), w('sad', 'buồn', '😢'), w('mad', 'tức giận', '😠'), w('pad', 'tập giấy', '📝'), w('glad', 'vui mừng', '😊'), w('bad', 'tệ, xấu', '👎')] },
  { rime: 'ag', group: 'a', words: [w('bag', 'cái túi', '👜'), w('tag', 'nhãn mác', '🏷️'), w('flag', 'lá cờ', '🚩'), w('wag', 'vẫy đuôi', '🐕'), w('stag', 'hươu đực', '🦌')] },
  { rime: 'am', group: 'a', words: [w('jam', 'mứt', '🫙'), w('ham', 'thịt giăm bông', '🍖'), w('ram', 'cừu đực', '🐏'), w('yam', 'khoai lang', '🍠'), w('clam', 'con nghêu', '🦪')] },
  { rime: 'ax', group: 'a', words: [w('ax', 'cái rìu', '🪓'), w('fax', 'máy fax', '📠'), w('wax', 'sáp nến', '🕯️'), w('tax', 'tiền thuế', '💸'), w('relax', 'thư giãn', '😌')] },
  { rime: 'ash', group: 'a', words: [w('cash', 'tiền mặt', '💵'), w('trash', 'rác', '🗑️'), w('splash', 'té nước', '💦'), w('crash', 'đâm sầm', '💥'), w('flash', 'tia chớp', '⚡')] },
  { rime: 'ank', group: 'a', words: [w('bank', 'ngân hàng', '🏦'), w('tank', 'bồn chứa', '🛢️'), w('thank', 'cảm ơn', '🙏'), w('drank', 'đã uống', '🥤'), w('plank', 'tấm ván', '🪵')] },

  // ── Short E ──
  { rime: 'ed', group: 'e', words: [w('bed', 'cái giường', '🛏️'), w('red', 'màu đỏ', '🔴'), w('fed', 'cho ăn', '🍼'), w('sled', 'xe trượt tuyết', '🛷'), w('shed', 'nhà kho nhỏ', '🛖')] },
  { rime: 'en', group: 'e', words: [w('hen', 'gà mái', '🐔'), w('pen', 'cái bút', '🖊️'), w('ten', 'số mười', '🔟'), w('men', 'những người đàn ông', '👬'), w('den', 'hang thú', '🐻')] },
  { rime: 'et', group: 'e', words: [w('net', 'cái lưới', '🥅'), w('jet', 'máy bay phản lực', '✈️'), w('pet', 'thú cưng', '🐶'), w('wet', 'ướt', '💦'), w('vet', 'bác sĩ thú y', '🩺')] },
  { rime: 'eg', group: 'e', words: [w('leg', 'cái chân', '🦵'), w('peg', 'cái kẹp', '🧷'), w('beg', 'xin, năn nỉ', '🙏'), w('keg', 'thùng gỗ', '🛢️')] },
  { rime: 'em', group: 'e', words: [w('gem', 'viên ngọc', '💎'), w('hem', 'gấu áo', '🧵'), w('stem', 'cuống hoa', '🌷'), w('them', 'họ, chúng', '👫')] },
  { rime: 'est', group: 'e', words: [w('nest', 'cái tổ', '🪺'), w('vest', 'áo gi-lê', '🦺'), w('west', 'hướng tây', '🧭'), w('best', 'tốt nhất', '🥇'), w('test', 'bài kiểm tra', '📝')] },
  { rime: 'ell', group: 'e', words: [w('bell', 'cái chuông', '🔔'), w('shell', 'vỏ sò', '🐚'), w('well', 'cái giếng', '🪣'), w('smell', 'ngửi', '👃'), w('yell', 'la hét', '📢')] },

  // ── Short I ──
  { rime: 'in', group: 'i', words: [w('pin', 'cái ghim', '📌'), w('bin', 'thùng rác', '🗑️'), w('fin', 'vây cá', '🐟'), w('tin', 'hộp thiếc', '🥫'), w('win', 'chiến thắng', '🏆')] },
  { rime: 'ip', group: 'i', words: [w('lip', 'đôi môi', '👄'), w('ship', 'con tàu', '🚢'), w('zip', 'khóa kéo', '🤐'), w('chip', 'khoai tây chiên', '🍟'), w('drip', 'giọt nước nhỏ', '💧')] },
  { rime: 'it', group: 'i', words: [w('sit', 'ngồi', '🪑'), w('hit', 'đánh', '🏏'), w('kit', 'bộ dụng cụ', '🧰'), w('knit', 'đan len', '🧶'), w('fit', 'khỏe mạnh', '💪')] },
  { rime: 'id', group: 'i', words: [w('kid', 'đứa trẻ', '🧒'), w('lid', 'cái nắp', '🫙'), w('squid', 'con mực', '🦑'), w('hid', 'đã trốn', '🙈'), w('slid', 'đã trượt', '🛝')] },
  { rime: 'ig', group: 'i', words: [w('pig', 'con lợn', '🐷'), w('big', 'to lớn', '🐘'), w('dig', 'đào', '⛏️'), w('twig', 'cành cây nhỏ', '🌿'), w('gig', 'buổi biểu diễn', '🎸')] },
  { rime: 'ill', group: 'i', words: [w('hill', 'ngọn đồi', '⛰️'), w('pill', 'viên thuốc', '💊'), w('drill', 'máy khoan', '🛠️'), w('spill', 'làm đổ', '🫗'), w('chill', 'lạnh', '🥶')] },
  { rime: 'ick', group: 'i', words: [w('kick', 'đá bóng', '⚽'), w('sick', 'bị ốm', '🤒'), w('lick', 'liếm', '👅'), w('chick', 'gà con', '🐤'), w('brick', 'viên gạch', '🧱')] },
  { rime: 'ish', group: 'i', words: [w('fish', 'con cá', '🐟'), w('dish', 'cái đĩa', '🍽️'), w('wish', 'điều ước', '🌠'), w('jellyfish', 'con sứa', '🪼'), w('goldfish', 'cá vàng', '🐠')] },
  { rime: 'ink', group: 'i', words: [w('pink', 'màu hồng', '🩷'), w('drink', 'đồ uống', '🥤'), w('ink', 'mực viết', '🖋️'), w('wink', 'nháy mắt', '😉'), w('think', 'suy nghĩ', '🤔'), w('rink', 'sân trượt băng', '⛸️')] },
  { rime: 'ing', group: 'i', words: [w('king', 'nhà vua', '🤴'), w('ring', 'chiếc nhẫn', '💍'), w('wing', 'đôi cánh', '🪽'), w('sing', 'hát', '🎤'), w('swing', 'xích đu', '🛝')] },

  // ── Short O ──
  { rime: 'og', group: 'o', words: [w('dog', 'con chó', '🐶'), w('frog', 'con ếch', '🐸'), w('log', 'khúc gỗ', '🪵'), w('fog', 'sương mù', '🌫️'), w('jog', 'chạy bộ', '🏃')] },
  { rime: 'op', group: 'o', words: [w('mop', 'cây lau nhà', '🧹'), w('hop', 'nhảy lò cò', '🐇'), w('pop', 'nổ bụp', '🎈'), w('stop', 'dừng lại', '🛑'), w('shop', 'cửa hàng', '🏪')] },
  { rime: 'ot', group: 'o', words: [w('hot', 'nóng', '🔥'), w('pot', 'cái nồi', '🍲'), w('dot', 'dấu chấm', '⚫'), w('knot', 'nút thắt', '🪢'), w('spot', 'đốm', '🐆')] },
  { rime: 'ob', group: 'o', words: [w('job', 'công việc', '💼'), w('cob', 'bắp ngô', '🌽'), w('sob', 'khóc nức nở', '😭'), w('knob', 'tay nắm cửa', '🚪'), w('rob', 'ăn trộm', '🦹')] },
  { rime: 'od', group: 'o', words: [w('cod', 'cá tuyết', '🐟'), w('pod', 'vỏ đậu', '🫛'), w('rod', 'cần câu', '🎣'), w('nod', 'gật đầu', '🙂‍↕️')] },
  { rime: 'ox', group: 'o', words: [w('fox', 'con cáo', '🦊'), w('box', 'cái hộp', '📦'), w('ox', 'con bò đực', '🐂'), w('lunchbox', 'hộp cơm', '🍱'), w('mailbox', 'hộp thư', '📫')] },
  { rime: 'ock', group: 'o', words: [w('sock', 'chiếc tất', '🧦'), w('rock', 'hòn đá', '🪨'), w('clock', 'đồng hồ', '⏰'), w('lock', 'ổ khóa', '🔒'), w('block', 'khối gạch', '🧱')] },

  // ── Short U ──
  { rime: 'ug', group: 'u', words: [w('bug', 'con bọ', '🐛'), w('mug', 'cốc có quai', '☕'), w('hug', 'ôm', '🤗'), w('jug', 'bình rót', '🫗'), w('slug', 'con sên', '🐌')] },
  { rime: 'ub', group: 'u', words: [w('tub', 'bồn tắm', '🛁'), w('cub', 'gấu con', '🐻'), w('sub', 'bánh mì kẹp', '🥪'), w('rub', 'thoa, xoa', '🧴'), w('scrub', 'cọ rửa', '🧽')] },
  { rime: 'un', group: 'u', words: [w('sun', 'mặt trời', '☀️'), w('run', 'chạy', '🏃'), w('bun', 'bánh mì tròn', '🥯'), w('fun', 'vui vẻ', '🎉'), w('stun', 'choáng váng', '😵')] },
  { rime: 'ut', group: 'u', words: [w('nut', 'hạt', '🥜'), w('hut', 'túp lều', '🛖'), w('cut', 'cắt', '✂️'), w('shut', 'đóng lại', '🚪'), w('coconut', 'quả dừa', '🥥')] },
  { rime: 'ump', group: 'u', words: [w('jump', 'nhảy', '🤸'), w('hump', 'cái bướu', '🐫'), w('pump', 'bơm', '⛽'), w('stump', 'gốc cây', '🪵'), w('bump', 'cục u', '🤕')] },
  { rime: 'ush', group: 'u', words: [w('brush', 'bàn chải', '🪥'), w('blush', 'đỏ mặt', '😊'), w('flush', 'giật nước', '🚽'), w('hush', 'suỵt', '🤫'), w('push', 'đẩy', '🫸')] },

  // ── Mở rộng: vần dài & đặc biệt ──
  { rime: 'ake', group: 'more', words: [w('cake', 'cái bánh', '🎂'), w('snake', 'con rắn', '🐍'), w('lake', 'cái hồ', '🏞️'), w('bake', 'nướng bánh', '🧁'), w('shake', 'lắc', '🥤')] },
  { rime: 'ame', group: 'more', words: [w('game', 'trò chơi', '🎮'), w('name', 'tên', '📛'), w('frame', 'khung ảnh', '🖼️'), w('flame', 'ngọn lửa', '🔥'), w('same', 'giống nhau', '👯')] },
  { rime: 'ain', group: 'more', words: [w('rain', 'mưa', '🌧️'), w('train', 'tàu hỏa', '🚆'), w('chain', 'dây xích', '⛓️'), w('brain', 'bộ não', '🧠'), w('grain', 'hạt ngũ cốc', '🌾')] },
  { rime: 'ail', group: 'more', words: [w('snail', 'con ốc sên', '🐌'), w('mail', 'thư', '📬'), w('nail', 'móng tay', '💅'), w('sail', 'cánh buồm', '⛵'), w('pail', 'cái xô', '🪣')] },
  { rime: 'ay', group: 'more', words: [w('day', 'ban ngày', '🌞'), w('play', 'chơi', '🎮'), w('pay', 'trả tiền', '💳'), w('say', 'nói', '🗣️'), w('clay', 'đất sét', '🏺')] },
  { rime: 'eat', group: 'more', words: [w('eat', 'ăn', '🍽️'), w('seat', 'chỗ ngồi', '💺'), w('meat', 'thịt', '🥩'), w('wheat', 'lúa mì', '🌾'), w('heat', 'hơi nóng', '🌡️')] },
  { rime: 'eep', group: 'more', words: [w('sheep', 'con cừu', '🐑'), w('jeep', 'xe jeep', '🚙'), w('sleep', 'ngủ', '😴'), w('sweep', 'quét nhà', '🧹'), w('deep', 'sâu', '🌊')] },
  { rime: 'eed', group: 'more', words: [w('seed', 'hạt giống', '🌱'), w('feed', 'cho ăn', '🥣'), w('weed', 'cỏ dại', '🌿'), w('bleed', 'chảy máu', '🩸'), w('speed', 'tốc độ', '🏎️')] },
  { rime: 'ight', group: 'more', words: [w('night', 'ban đêm', '🌙'), w('light', 'bóng đèn', '💡'), w('right', 'bên phải', '👉'), w('flight', 'chuyến bay', '✈️'), w('fight', 'đánh nhau', '🥊')] },
  { rime: 'ook', group: 'more', words: [w('book', 'quyển sách', '📖'), w('cook', 'nấu ăn', '🧑‍🍳'), w('hook', 'cái móc', '🪝'), w('look', 'nhìn', '👀'), w('shook', 'đã lắc', '🫨')] },
  { rime: 'ool', group: 'more', words: [w('pool', 'bể bơi', '🏊'), w('school', 'trường học', '🏫'), w('tool', 'dụng cụ', '🔧'), w('stool', 'ghế đẩu', '🪑'), w('cool', 'ngầu, mát', '😎')] },
  { rime: 'oon', group: 'more', words: [w('moon', 'mặt trăng', '🌕'), w('spoon', 'cái thìa', '🥄'), w('balloon', 'bóng bay', '🎈'), w('raccoon', 'gấu mèo', '🦝'), w('noon', 'buổi trưa', '🕛')] },
  { rime: 'ow', group: 'more', note: '-ow ở đây đọc /oʊ/ như snow (còn cách đọc /aʊ/ như cow)', words: [w('snow', 'tuyết', '❄️'), w('bow', 'cái nơ', '🎀'), w('row', 'chèo thuyền', '🚣'), w('grow', 'lớn lên', '🌱'), w('blow', 'thổi', '🌬️')] },
  { rime: 'all', group: 'more', words: [w('ball', 'quả bóng', '⚽'), w('wall', 'bức tường', '🧱'), w('tall', 'cao', '🦒'), w('fall', 'mùa thu', '🍂'), w('mall', 'trung tâm mua sắm', '🏬')] },
];

export const totalFamilyWords = () => WORD_FAMILIES.reduce((n, f) => n + f.words.length, 0);
