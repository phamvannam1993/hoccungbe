/**
 * Tên tiếng Việt để GIỌNG ĐỌC đọc emoji trong đề (🐰 → "con thỏ", 🔺 → "hình tam giác đỏ").
 * Có sẵn từ chỉ loại (quả, con, cái…) để "3 🍎" đọc thành "3 quả táo". Khóa = emoji đã bỏ ký tự FE0F.
 * Emoji không có trong bảng thì giọng đọc bỏ qua.
 */
export const EMOJI_NAMES: Record<string, string> = {
  // Hình, màu
  '🔵': 'hình tròn xanh dương', '🔴': 'hình tròn đỏ', '🟡': 'hình tròn vàng', '🟢': 'hình tròn xanh lá', '🟠': 'hình tròn cam',
  '🟣': 'hình tròn tím', '⚪': 'hình tròn trắng', '⚫': 'hình tròn đen',
  '🟦': 'hình vuông xanh dương', '🟩': 'hình vuông xanh lá', '🟥': 'hình vuông đỏ', '🟨': 'hình vuông vàng', '⬜': 'hình vuông trắng',
  '⬛': 'hình vuông đen', '🟫': 'hình vuông nâu', '🟧': 'hình vuông cam', '🟪': 'hình vuông tím',
  '🔺': 'hình tam giác đỏ', '🔻': 'hình tam giác ngược', '🔼': 'hình tam giác hướng lên', '🔽': 'hình tam giác hướng xuống',
  '🔷': 'hình thoi xanh', '⭐': 'ngôi sao', '✡': 'ngôi sao sáu cánh', '❤': 'trái tim', '🌙': 'mặt trăng', '🌕': 'mặt trăng tròn',
  '☐': 'ô trống', '❓': 'dấu hỏi', '❔': 'dấu hỏi',
  // Mũi tên, dấu
  '→': 'sang', '➡': 'sang phải', '⬅': 'sang trái', '⬆': 'lên trên', '⬇': 'xuống dưới', '↑': 'lên', '↓': 'xuống', '←': 'sang trái',
  '↔': 'hai chiều', '↗': 'chéo lên bên phải', '↖': 'chéo lên bên trái', '↘': 'chéo xuống bên phải', '↙': 'chéo xuống bên trái',
  '🔁': 'lặp lại', '🔄': 'quay vòng', '🔙': 'quay lại', '⏩': 'tua tới', '⏪': 'tua lùi',
  '✔': 'dấu tích', '✅': 'dấu tích', '✓': 'dấu tích', '❌': 'dấu gạch chéo', '✘': 'dấu gạch chéo', '✖': 'dấu gạch chéo', '🚫': 'cấm',
  '➕': 'cộng', '➖': 'trừ', '➗': 'chia',
  '0⃣': '0', '1⃣': '1', '2⃣': '2', '3⃣': '3', '6⃣': '6', '7⃣': '7', '🔟': '10', '🔢': 'các số', '🅰': 'A', '🅱': 'B',
  '⚠': 'chú ý', '💥': 'bùm', '⚡': 'tia chớp', '🎯': 'mục tiêu', '💡': 'mẹo',
  // Con vật
  '🐟': 'con cá', '🐠': 'con cá', '🐱': 'con mèo', '🐈': 'con mèo', '🐶': 'con chó', '🐕': 'con chó', '🐰': 'con thỏ', '🐇': 'con thỏ',
  '🐔': 'con gà', '🐓': 'con gà trống', '🐤': 'gà con', '🐥': 'gà con', '🐣': 'gà con', '🦆': 'con vịt', '🐸': 'con ếch', '🐝': 'con ong',
  '🐢': 'con rùa', '🐻': 'con gấu', '🐷': 'con lợn', '🐦': 'con chim', '🐼': 'con gấu trúc', '🐭': 'con chuột', '🐵': 'con khỉ',
  '🐞': 'con bọ rùa', '🦊': 'con cáo', '🐙': 'con bạch tuộc', '🐘': 'con voi', '🐄': 'con bò', '🐮': 'con bò', '🐛': 'con sâu',
  '🐜': 'con kiến', '🐌': 'con ốc sên', '🐳': 'con cá voi', '🦋': 'con bướm', '🐃': 'con trâu', '🐐': 'con dê', '🐧': 'con chim cánh cụt',
  '🦘': 'con chuột túi', '🐹': 'con chuột hamster', '🐴': 'con ngựa', '🐍': 'con rắn', '🦉': 'con cú', '🦐': 'con tôm', '🦀': 'con cua',
  '🐊': 'con cá sấu', '🦴': 'khúc xương', '🪶': 'chiếc lông',
  // Quả, đồ ăn
  '🍎': 'quả táo', '🍏': 'quả táo xanh', '🍊': 'quả cam', '🍌': 'quả chuối', '🍇': 'chùm nho', '🍓': 'quả dâu', '🍋': 'quả chanh',
  '🍐': 'quả lê', '🍉': 'quả dưa hấu', '🍒': 'quả anh đào', '🍍': 'quả dứa', '🥕': 'củ cà rốt', '🌽': 'bắp ngô', '🥦': 'cây súp lơ',
  '🍬': 'cái kẹo', '🍭': 'cây kẹo mút', '🍫': 'thanh sô cô la', '🍪': 'cái bánh quy', '🍩': 'cái bánh vòng', '🧁': 'cái bánh nướng nhỏ',
  '🍰': 'miếng bánh kem', '🎂': 'cái bánh sinh nhật', '🍦': 'cây kem', '🥛': 'cốc sữa', '🥤': 'cốc nước', '🧃': 'hộp nước',
  '🍵': 'chén trà', '🍶': 'chai nước', '🍯': 'hũ mật ong', '🍞': 'ổ bánh mì', '🥖': 'ổ bánh mì', '🧀': 'miếng phô mai', '🥚': 'quả trứng',
  '🍗': 'cái đùi gà', '🍚': 'bát cơm', '🍜': 'bát mì', '🍲': 'nồi canh', '🍱': 'hộp cơm', '🥣': 'cái bát', '🍳': 'chảo trứng',
  '🍽': 'đĩa ăn', '🍴': 'dao dĩa', '🥄': 'cái thìa', '🥢': 'đôi đũa',
  // Cây, hoa, trời
  '🌸': 'bông hoa anh đào', '🌼': 'bông hoa', '🌻': 'bông hoa hướng dương', '🌷': 'bông hoa tulip', '🌹': 'bông hoa hồng', '💐': 'bó hoa',
  '🌳': 'cái cây', '🌱': 'mầm cây', '🌿': 'cành lá', '🍀': 'cỏ bốn lá', '🍃': 'chiếc lá', '🌾': 'bông lúa', '🪴': 'chậu cây',
  '🌞': 'mặt trời', '☀': 'mặt trời', '🌅': 'bình minh', '🌇': 'hoàng hôn', '🌃': 'đêm', '🌉': 'cây cầu', '🌧': 'mưa', '❄': 'bông tuyết',
  '🌈': 'cầu vồng', '🌊': 'sóng nước', '🌀': 'cơn lốc', '💧': 'giọt nước', '🪨': 'hòn đá', '🏞': 'công viên',
  // Người
  '🧒': 'bạn nhỏ', '👦': 'bạn trai', '👧': 'bạn gái', '🧑': 'người lớn', '🧍': 'người đứng', '👩': 'cô', '👨': 'chú', '👶': 'em bé',
  '👵': 'bà', '👴': 'ông', '👫': 'hai bạn', '👪': 'gia đình', '🚶': 'người đi bộ', '🏃': 'người chạy', '🏊': 'người bơi',
  '🏋': 'người nâng tạ', '💃': 'người nhảy múa', '🙋': 'bạn giơ tay', '🙌': 'hoan hô', '🕵': 'thám tử', '🤔': 'suy nghĩ',
  '🧐': 'quan sát', '😴': 'ngủ', '😟': 'lo lắng', '🙂': 'mỉm cười', '😊': 'vui vẻ', '😢': 'khóc', '👀': 'đôi mắt', '🧠': 'bộ não',
  '✌': 'hai ngón tay', '🖐': 'bàn tay', '🤝': 'bắt tay', '🦶': 'bàn chân', '👣': 'dấu chân', '🤖': 'người máy', '👾': 'quái vật',
  // Đồ vật, đồ chơi
  '🧱': 'viên gạch', '🎈': 'quả bóng bay', '✏': 'cái bút chì', '🖍': 'cây bút sáp', '🖊': 'cái bút bi', '🖌': 'cây cọ vẽ',
  '📏': 'cái thước', '📐': 'thước ê ke', '🧸': 'con gấu bông', '👟': 'đôi giày', '⚽': 'quả bóng đá', '🏀': 'quả bóng rổ',
  '👕': 'cái áo', '👖': 'cái quần', '🧦': 'đôi tất', '🧢': 'cái mũ', '🎩': 'cái mũ', '👒': 'cái mũ', '🧣': 'cái khăn', '👛': 'cái ví',
  '🎒': 'cái cặp', '📕': 'quyển sách', '📗': 'quyển sách', '📘': 'quyển sách', '📒': 'quyển vở', '📖': 'quyển sách', '📚': 'chồng sách',
  '📝': 'tờ giấy', '📋': 'tấm bảng', '📅': 'tờ lịch', '📦': 'cái hộp', '🎁': 'hộp quà', '🧩': 'mảnh ghép', '🪁': 'con diều',
  '🎲': 'con xúc xắc', '🃏': 'lá bài', '♟': 'quân cờ', '🪀': 'con quay yo yo', '🪆': 'búp bê', '🎀': 'cái nơ', '🏆': 'chiếc cúp',
  '🥉': 'huy chương đồng', '🏁': 'vạch đích', '🎨': 'bảng màu', '🎤': 'cái micro', '🎹': 'đàn phím', '🎉': 'chúc mừng', '🎃': 'quả bí ngô',
  '🏮': 'cái đèn lồng', '🕯': 'cây nến', '💿': 'cái đĩa', '📺': 'cái ti vi', '✉': 'lá thư', '📮': 'hòm thư', '🏷': 'nhãn giá',
  '🔑': 'chìa khóa', '📎': 'cái kẹp giấy', '📍': 'điểm đánh dấu', '🗺': 'bản đồ', '🧭': 'la bàn', '🔍': 'kính lúp', '🔎': 'kính lúp',
  '⚖': 'cái cân', '🧮': 'bàn tính', '⏰': 'đồng hồ báo thức', '⏱': 'đồng hồ bấm giờ', '🕰': 'đồng hồ', '📈': 'biểu đồ', '📉': 'biểu đồ',
  '📊': 'biểu đồ cột', '📶': 'cột sóng', '✂': 'cái kéo', '🧵': 'cuộn chỉ', '🪑': 'cái ghế', '🛏': 'cái giường', '🛌': 'cái giường',
  '🚪': 'cánh cửa', '🪟': 'cửa sổ', '🪜': 'cái thang', '🛁': 'bồn tắm', '🧼': 'bánh xà phòng', '🧽': 'miếng bọt biển',
  '🧹': 'cái chổi', '🧺': 'cái giỏ', '🪣': 'cái xô', '🗑': 'thùng rác', '🪥': 'bàn chải đánh răng', '🛒': 'xe đẩy hàng',
  '💵': 'tờ tiền', '💰': 'túi tiền', '🪙': 'đồng xu',
  // Xe, nơi chốn
  '🚗': 'xe ô tô', '🚌': 'xe buýt', '🚂': 'tàu hỏa', '🚲': 'xe đạp', '🛵': 'xe máy', '⛵': 'thuyền buồm', '🚢': 'con tàu',
  '✈': 'máy bay', '🚁': 'máy bay trực thăng', '🚀': 'tên lửa', '🚜': 'máy cày', '🛣': 'con đường', '🎢': 'tàu lượn', '🎡': 'vòng đu quay',
  '🏠': 'ngôi nhà', '🏡': 'ngôi nhà', '🏪': 'cửa hàng', '🏬': 'siêu thị', '🏫': 'trường học',
};
