// Bảng phiên âm quốc tế IPA cho tiếng Anh — 44 âm.
//
// 12 nguyên âm đơn + 8 nguyên âm đôi + 24 phụ âm. Dùng bộ ký hiệu Anh - Anh
// (Received Pronunciation), đúng bộ mà sách giáo khoa và từ điển Oxford/
// Cambridge bản Anh dùng — cũng là bộ các trường ở Việt Nam đang dạy.
//
// Mỗi âm ghi đủ bốn thứ bé cần: đọc thế nào, miệng mở ra sao, lưỡi đặt đâu, và
// từ ví dụ để nghe. Phần `luuY` chỉ ghi lỗi NGƯỜI VIỆT hay mắc, không ghi lý
// thuyết chung chung.

export type NhomAm = 'don' | 'doi' | 'phuam';

export type ViDuIpa = {
  /** Từ tiếng Anh. */ en: string;
  /** Phiên âm của cả từ. */ ipa: string;
  /** Nghĩa tiếng Việt, để bé hiểu từ đang nghe. */ vi: string;
};

/**
 * Số đo khẩu hình để VẼ, không phải để đọc.
 *
 * Bốn con số 0–1 lấy từ chính bảng nguyên âm chuẩn của ngữ âm học: lưỡi cao
 * hay thấp, trước hay sau, môi tròn hay bẹt, miệng mở to hay nhỏ. Có số thì vẽ
 * được hình lưỡi ĐỘNG — chuyển mượt từ âm này sang âm kia, và nguyên âm đôi
 * chạy được từ vị trí đầu sang vị trí cuối, thứ mà ảnh tĩnh không làm được.
 */
export type KhauHinhSo = {
  /** 0 = lưỡi thấp (æ, ɑː) … 1 = lưỡi cao (iː, uː). */ cao: number;
  /** 0 = lưỡi lùi sau (uː, ɑː) … 1 = đưa ra trước (iː, æ). */ truoc: number;
  /** 0 = môi bẹt … 1 = môi tròn chúm. */ tron: number;
  /** 0 = miệng gần khép … 1 = mở to. */ mo: number;
};

/** Chỗ lưỡi/môi CHẶN hơi — chỉ dùng cho phụ âm, để vẽ điểm cản. */
export type DiemCan =
  | 'moi'        // hai môi: p b m w
  | 'moi-rang'   // môi dưới + răng trên: f v
  | 'rang'       // lưỡi giữa hai hàm răng: θ ð
  | 'loi'        // đầu lưỡi ở lợi: t d s z n l r
  | 'sau-loi'    // sau lợi: ʃ ʒ tʃ dʒ
  | 'vom-cung'   // vòm cứng: j
  | 'vom-mem'    // vòm mềm: k ɡ ŋ
  | 'hong';      // thanh hầu: h

export type AmIpa = {
  /** Ký hiệu IPA, không kèm dấu gạch chéo. */ am: string;
  nhom: NhomAm;
  /** Đọc gần giống tiếng Việt nào — chỗ bám đầu tiên của bé. */ cachDoc: string;
  /** Miệng, môi. */ khauHinh: string;
  /** Lưỡi (nguyên âm) hoặc cách tạo âm (phụ âm). */ luoi: string;
  /** Chỉ phụ âm: dây thanh có rung không. */ thanh?: 'huu' | 'vo';
  viDu: ViDuIpa[];
  luuY: string;
  /** Nguyên âm đơn + phụ âm: một vị trí. Nguyên âm đôi: [bắt đầu, kết thúc]. */
  hinh: KhauHinhSo | [KhauHinhSo, KhauHinhSo];
  /** Phụ âm: chặn hơi ở đâu. */ can?: DiemCan;
  /** Phụ âm: hơi đi ra bằng mũi (m, n, ŋ). */ mui?: boolean;
  /** Phụ âm: hơi bị chặn hẳn rồi bật ra (p b t d k ɡ). */ bat?: boolean;
};

/* ─────────────── 12 nguyên âm đơn ─────────────── */

const NGUYEN_AM_DON: AmIpa[] = [
  {
    am: 'iː', nhom: 'don', cachDoc: 'i dài, kéo hơi',
    khauHinh: 'miệng hơi bẹt sang hai bên như đang cười',
    luoi: 'lưỡi cao, đưa ra trước',
    viDu: [
      { en: 'sheep', ipa: '/ʃiːp/', vi: 'con cừu' },
      { en: 'green', ipa: '/ɡriːn/', vi: 'màu xanh lá' },
      { en: 'see', ipa: '/siː/', vi: 'nhìn thấy' },
    ],
    luuY: 'Phải kéo dài rõ, nếu đọc ngắn thì sheep (con cừu) thành ship (con tàu).',
    hinh: { cao: 1.00, truoc: 1.00, tron: 0.00, mo: 0.15 },
  },
  {
    am: 'ɪ', nhom: 'don', cachDoc: 'i ngắn, gọn',
    khauHinh: 'miệng hé nhẹ, không bẹt',
    luoi: 'lưỡi gần cao, trước',
    viDu: [
      { en: 'ship', ipa: '/ʃɪp/', vi: 'con tàu' },
      { en: 'sit', ipa: '/sɪt/', vi: 'ngồi' },
      { en: 'big', ipa: '/bɪɡ/', vi: 'to lớn' },
    ],
    luuY: 'Không phải “i” của tiếng Việt: nó nằm giữa “i” và “ê”, buông lỏng hơn.',
    hinh: { cao: 0.80, truoc: 0.85, tron: 0.00, mo: 0.30 },
  },
  {
    am: 'ʊ', nhom: 'don', cachDoc: 'u ngắn',
    khauHinh: 'môi tròn nhẹ, hơi chúm',
    luoi: 'lưỡi gần cao, lùi về sau',
    viDu: [
      { en: 'book', ipa: '/bʊk/', vi: 'quyển sách' },
      { en: 'good', ipa: '/ɡʊd/', vi: 'tốt' },
      { en: 'put', ipa: '/pʊt/', vi: 'đặt, để' },
    ],
    luuY: 'Ngắn và buông, đừng chúm môi chặt như “u” tiếng Việt.',
    hinh: { cao: 0.78, truoc: 0.25, tron: 0.65, mo: 0.30 },
  },
  {
    am: 'uː', nhom: 'don', cachDoc: 'u dài',
    khauHinh: 'môi tròn và chúm chặt',
    luoi: 'lưỡi cao, sau',
    viDu: [
      { en: 'food', ipa: '/fuːd/', vi: 'thức ăn' },
      { en: 'moon', ipa: '/muːn/', vi: 'mặt trăng' },
      { en: 'blue', ipa: '/bluː/', vi: 'màu xanh dương' },
    ],
    luuY: 'Kéo dài và giữ môi tròn suốt cả âm.',
    hinh: { cao: 1.00, truoc: 0.10, tron: 0.95, mo: 0.15 },
  },
  {
    am: 'e', nhom: 'don', cachDoc: 'e, gần “e” trong “tre”',
    khauHinh: 'miệng mở vừa',
    luoi: 'lưỡi giữa, trước',
    viDu: [
      { en: 'bed', ipa: '/bed/', vi: 'cái giường' },
      { en: 'pen', ipa: '/pen/', vi: 'cái bút' },
      { en: 'red', ipa: '/red/', vi: 'màu đỏ' },
    ],
    luuY: 'Âm ngắn, dứt khoát, không kéo dài.',
    hinh: { cao: 0.55, truoc: 0.90, tron: 0.00, mo: 0.45 },
  },
  {
    am: 'ə', nhom: 'don', cachDoc: 'ơ nhẹ, đọc lướt',
    khauHinh: 'miệng thả lỏng hoàn toàn',
    luoi: 'lưỡi ở giữa, trung tâm',
    viDu: [
      { en: 'teacher', ipa: '/ˈtiːtʃə/', vi: 'giáo viên' },
      { en: 'about', ipa: '/əˈbaʊt/', vi: 'về, khoảng' },
      { en: 'sofa', ipa: '/ˈsəʊfə/', vi: 'ghế sô pha' },
    ],
    luuY: 'Âm phổ biến nhất tiếng Anh, luôn nằm ở vần KHÔNG nhấn. Đọc thật nhẹ và nhanh.',
    hinh: { cao: 0.50, truoc: 0.50, tron: 0.10, mo: 0.45 },
  },
  {
    am: 'ɜː', nhom: 'don', cachDoc: 'ơ dài',
    khauHinh: 'miệng mở vừa, môi không tròn',
    luoi: 'lưỡi giữa, hơi sau',
    viDu: [
      { en: 'bird', ipa: '/bɜːd/', vi: 'con chim' },
      { en: 'learn', ipa: '/lɜːn/', vi: 'học' },
      { en: 'nurse', ipa: '/nɜːs/', vi: 'y tá' },
    ],
    luuY: 'Giống /ə/ nhưng kéo dài và nằm ở vần ĐƯỢC nhấn.',
    hinh: { cao: 0.50, truoc: 0.50, tron: 0.10, mo: 0.50 },
  },
  {
    am: 'æ', nhom: 'don', cachDoc: 'a bẹt, giữa “a” và “e”',
    khauHinh: 'miệng mở rộng, kéo bẹt sang hai bên',
    luoi: 'lưỡi thấp, trước',
    viDu: [
      { en: 'cat', ipa: '/kæt/', vi: 'con mèo' },
      { en: 'bag', ipa: '/bæɡ/', vi: 'cái túi' },
      { en: 'hat', ipa: '/hæt/', vi: 'cái mũ' },
    ],
    luuY: 'Đọc thành “e” là cat (mèo) hoá ket; tiếng Việt không có âm này nên phải tập riêng.',
    hinh: { cao: 0.15, truoc: 0.85, tron: 0.00, mo: 0.85 },
  },
  {
    am: 'ʌ', nhom: 'don', cachDoc: 'â ngắn, gọn',
    khauHinh: 'miệng mở nhỏ vừa',
    luoi: 'lưỡi thấp, giữa',
    viDu: [
      { en: 'cup', ipa: '/kʌp/', vi: 'cái cốc' },
      { en: 'run', ipa: '/rʌn/', vi: 'chạy' },
      { en: 'sun', ipa: '/sʌn/', vi: 'mặt trời' },
    ],
    luuY: 'Ngắn và mạnh, khác /ɑː/ (dài) và /ə/ (nhẹ, không nhấn).',
    hinh: { cao: 0.30, truoc: 0.45, tron: 0.05, mo: 0.60 },
  },
  {
    am: 'ɑː', nhom: 'don', cachDoc: 'a dài',
    khauHinh: 'miệng mở to nhất',
    luoi: 'lưỡi thấp, lùi sau',
    viDu: [
      { en: 'car', ipa: '/kɑː/', vi: 'xe hơi' },
      { en: 'far', ipa: '/fɑː/', vi: 'xa' },
      { en: 'calm', ipa: '/kɑːm/', vi: 'bình tĩnh' },
    ],
    luuY: 'Mở to và giữ lâu, như khi bác sĩ bảo há miệng nói “a”.',
    hinh: { cao: 0.05, truoc: 0.15, tron: 0.05, mo: 1.00 },
  },
  {
    am: 'ɒ', nhom: 'don', cachDoc: 'o ngắn',
    khauHinh: 'môi tròn, mở vừa',
    luoi: 'lưỡi thấp, sau',
    viDu: [
      { en: 'hot', ipa: '/hɒt/', vi: 'nóng' },
      { en: 'box', ipa: '/bɒks/', vi: 'cái hộp' },
      { en: 'dog', ipa: '/dɒɡ/', vi: 'con chó' },
    ],
    luuY: 'Ngắn và tròn môi. Giọng Mỹ đọc gần với /ɑː/ hơn.',
    hinh: { cao: 0.10, truoc: 0.15, tron: 0.55, mo: 0.80 },
  },
  {
    am: 'ɔː', nhom: 'don', cachDoc: 'o dài, tròn môi',
    khauHinh: 'môi tròn, mở vừa, giữ lâu',
    luoi: 'lưỡi giữa – thấp, sau',
    viDu: [
      { en: 'door', ipa: '/dɔː/', vi: 'cái cửa' },
      { en: 'four', ipa: '/fɔː/', vi: 'số bốn' },
      { en: 'ball', ipa: '/bɔːl/', vi: 'quả bóng' },
    ],
    luuY: 'Rất hay lẫn với /ɒ/: /ɔː/ dài hơn hẳn và môi tròn hơn.',
    hinh: { cao: 0.30, truoc: 0.12, tron: 0.80, mo: 0.60 },
  },
];

/* ─────────────── 8 nguyên âm đôi ─────────────── */

const NGUYEN_AM_DOI: AmIpa[] = [
  {
    am: 'ɪə', nhom: 'doi', cachDoc: 'i-ơ, trượt từ “i” về “ơ”',
    khauHinh: 'bắt đầu hé nhẹ, kết thúc thả lỏng',
    luoi: 'từ /ɪ/ (trước, cao) trượt về /ə/ (giữa, trung tâm)',
    viDu: [
      { en: 'here', ipa: '/hɪə/', vi: 'ở đây' },
      { en: 'near', ipa: '/nɪə/', vi: 'gần' },
      { en: 'ear', ipa: '/ɪə/', vi: 'cái tai' },
    ],
    luuY: 'Phần đầu ngắn, về /ə/ nhanh — không đọc tách rời thành hai âm.',
    hinh: [{ cao: 0.80, truoc: 0.85, tron: 0.00, mo: 0.30 }, { cao: 0.50, truoc: 0.50, tron: 0.10, mo: 0.45 }],
  },
  {
    am: 'eɪ', nhom: 'doi', cachDoc: 'ây',
    khauHinh: 'bắt đầu mở vừa, kết thúc hẹp lại',
    luoi: 'từ /e/ (trước, giữa) trượt lên /ɪ/ (trước, cao)',
    viDu: [
      { en: 'wait', ipa: '/weɪt/', vi: 'chờ đợi' },
      { en: 'day', ipa: '/deɪ/', vi: 'ngày' },
      { en: 'name', ipa: '/neɪm/', vi: 'tên' },
    ],
    luuY: 'Âm đầu rõ và dài hơn âm sau.',
    hinh: [{ cao: 0.55, truoc: 0.90, tron: 0.00, mo: 0.45 }, { cao: 0.80, truoc: 0.85, tron: 0.00, mo: 0.30 }],
  },
  {
    am: 'ʊə', nhom: 'doi', cachDoc: 'u-ơ',
    khauHinh: 'bắt đầu môi tròn, kết thúc thả lỏng',
    luoi: 'từ /ʊ/ (sau, tròn môi) trượt về /ə/',
    viDu: [
      { en: 'tourist', ipa: '/ˈtʊərɪst/', vi: 'khách du lịch' },
      { en: 'sure', ipa: '/ʃʊə/', vi: 'chắc chắn' },
      { en: 'poor', ipa: '/pʊə/', vi: 'nghèo' },
    ],
    luuY: 'Giữ môi tròn ở đầu rồi mới thả ra.',
    hinh: [{ cao: 0.78, truoc: 0.25, tron: 0.65, mo: 0.30 }, { cao: 0.50, truoc: 0.50, tron: 0.10, mo: 0.45 }],
  },
  {
    am: 'ɔɪ', nhom: 'doi', cachDoc: 'oi',
    khauHinh: 'bắt đầu tròn và mở, kết thúc hẹp',
    luoi: 'từ /ɔː/ (sau, mở) trượt lên /ɪ/',
    viDu: [
      { en: 'boy', ipa: '/bɔɪ/', vi: 'cậu bé' },
      { en: 'toy', ipa: '/tɔɪ/', vi: 'đồ chơi' },
      { en: 'coin', ipa: '/kɔɪn/', vi: 'đồng xu' },
    ],
    luuY: 'Trượt nhanh và gọn, đừng dừng giữa hai âm.',
    hinh: [{ cao: 0.30, truoc: 0.12, tron: 0.80, mo: 0.60 }, { cao: 0.80, truoc: 0.85, tron: 0.00, mo: 0.30 }],
  },
  {
    am: 'əʊ', nhom: 'doi', cachDoc: 'âu',
    khauHinh: 'bắt đầu hơi mở, kết thúc môi tròn',
    luoi: 'từ /ə/ (giữa) trượt về /ʊ/ (sau, tròn môi)',
    viDu: [
      { en: 'show', ipa: '/ʃəʊ/', vi: 'trình diễn, cho xem' },
      { en: 'go', ipa: '/ɡəʊ/', vi: 'đi' },
      { en: 'nose', ipa: '/nəʊz/', vi: 'cái mũi' },
    ],
    luuY: 'Kết thúc phải tròn môi rõ. Giọng Mỹ ghi là /oʊ/.',
    hinh: [{ cao: 0.50, truoc: 0.50, tron: 0.10, mo: 0.45 }, { cao: 0.78, truoc: 0.25, tron: 0.65, mo: 0.30 }],
  },
  {
    am: 'eə', nhom: 'doi', cachDoc: 'e-ơ',
    khauHinh: 'bắt đầu mở vừa, kết thúc thả lỏng',
    luoi: 'từ /e/ (trước, giữa) trượt về /ə/',
    viDu: [
      { en: 'hair', ipa: '/heə/', vi: 'tóc' },
      { en: 'care', ipa: '/keə/', vi: 'quan tâm' },
      { en: 'chair', ipa: '/tʃeə/', vi: 'cái ghế' },
    ],
    luuY: 'Âm sau ngắn, nhẹ và mở hơn âm đầu.',
    hinh: [{ cao: 0.55, truoc: 0.90, tron: 0.00, mo: 0.45 }, { cao: 0.50, truoc: 0.50, tron: 0.10, mo: 0.45 }],
  },
  {
    am: 'aɪ', nhom: 'doi', cachDoc: 'ai',
    khauHinh: 'bắt đầu mở rộng, kết thúc hẹp lại',
    luoi: 'từ /a/ (trước, thấp) trượt lên /ɪ/ (trước, cao)',
    viDu: [
      { en: 'my', ipa: '/maɪ/', vi: 'của tôi' },
      { en: 'five', ipa: '/faɪv/', vi: 'số năm' },
      { en: 'kite', ipa: '/kaɪt/', vi: 'cái diều' },
    ],
    luuY: 'Bắt đầu miệng mở thấp rồi nâng lưỡi lên cao.',
    hinh: [{ cao: 0.05, truoc: 0.70, tron: 0.00, mo: 1.00 }, { cao: 0.80, truoc: 0.85, tron: 0.00, mo: 0.30 }],
  },
  {
    am: 'aʊ', nhom: 'doi', cachDoc: 'ao',
    khauHinh: 'bắt đầu mở rộng, kết thúc môi tròn',
    luoi: 'từ /a/ (trước, thấp) trượt về /ʊ/ (sau, tròn môi)',
    viDu: [
      { en: 'cow', ipa: '/kaʊ/', vi: 'con bò' },
      { en: 'house', ipa: '/haʊs/', vi: 'ngôi nhà' },
      { en: 'down', ipa: '/daʊn/', vi: 'xuống' },
    ],
    luuY: 'Giữ âm /a/ rõ ở đầu rồi mới tròn môi dần.',
    hinh: [{ cao: 0.05, truoc: 0.70, tron: 0.00, mo: 1.00 }, { cao: 0.78, truoc: 0.25, tron: 0.65, mo: 0.30 }],
  },
];

/* ─────────────── 24 phụ âm ─────────────── */

const PHU_AM: AmIpa[] = [
  {
    am: 'p', nhom: 'phuam', thanh: 'vo', cachDoc: 'p bật hơi mạnh',
    khauHinh: 'hai môi khép chặt rồi bật ra',
    luoi: 'chặn hơi ở hai môi rồi bung ra một tiếng nổ',
    viDu: [
      { en: 'pea', ipa: '/piː/', vi: 'hạt đậu' },
      { en: 'pen', ipa: '/pen/', vi: 'cái bút' },
      { en: 'happy', ipa: '/ˈhæpi/', vi: 'vui vẻ' },
    ],
    luuY: 'Đặt tờ giấy trước miệng: đọc đúng thì giấy rung. Người Việt hay quên bật hơi.',
    hinh: { cao: 0.30, truoc: 0.50, tron: 0.10, mo: 0.10 },
    can: 'moi',
    bat: true,
  },
  {
    am: 'b', nhom: 'phuam', thanh: 'huu', cachDoc: 'b, có rung cổ',
    khauHinh: 'hai môi khép rồi bật ra nhẹ',
    luoi: 'như /p/ nhưng dây thanh rung',
    viDu: [
      { en: 'ball', ipa: '/bɔːl/', vi: 'quả bóng' },
      { en: 'big', ipa: '/bɪɡ/', vi: 'to lớn' },
      { en: 'book', ipa: '/bʊk/', vi: 'quyển sách' },
    ],
    luuY: 'Đặt tay lên cổ, thấy rung mới đúng — đó là chỗ khác /p/.',
    hinh: { cao: 0.30, truoc: 0.50, tron: 0.10, mo: 0.10 },
    can: 'moi',
    bat: true,
  },
  {
    am: 't', nhom: 'phuam', thanh: 'vo', cachDoc: 't bật hơi',
    khauHinh: 'miệng hé, đầu lưỡi chạm lợi trên',
    luoi: 'đầu lưỡi chặn ở lợi trên rồi bật nhanh',
    viDu: [
      { en: 'tea', ipa: '/tiː/', vi: 'trà' },
      { en: 'ten', ipa: '/ten/', vi: 'số mười' },
      { en: 'cat', ipa: '/kæt/', vi: 'con mèo' },
    ],
    luuY: 'Phải bật hơi, khác hẳn “t” tiếng Việt vốn không bật.',
    hinh: { cao: 0.70, truoc: 0.95, tron: 0.00, mo: 0.25 },
    can: 'loi',
    bat: true,
  },
  {
    am: 'd', nhom: 'phuam', thanh: 'huu', cachDoc: 'đ, có rung cổ',
    khauHinh: 'miệng hé, đầu lưỡi chạm lợi trên',
    luoi: 'như /t/ nhưng dây thanh rung',
    viDu: [
      { en: 'day', ipa: '/deɪ/', vi: 'ngày' },
      { en: 'dog', ipa: '/dɒɡ/', vi: 'con chó' },
      { en: 'red', ipa: '/red/', vi: 'màu đỏ' },
    ],
    luuY: 'Gần “đ” tiếng Việt, nhưng lưỡi chạm lợi chứ không chạm răng.',
    hinh: { cao: 0.70, truoc: 0.95, tron: 0.00, mo: 0.25 },
    can: 'loi',
    bat: true,
  },
  {
    am: 'tʃ', nhom: 'phuam', thanh: 'vo', cachDoc: 'ch',
    khauHinh: 'môi hơi tròn, đẩy ra trước',
    luoi: 'đầu lưỡi chạm lợi rồi thả ra thành âm xát',
    viDu: [
      { en: 'chair', ipa: '/tʃeə/', vi: 'cái ghế' },
      { en: 'cheese', ipa: '/tʃiːz/', vi: 'phô mai' },
      { en: 'watch', ipa: '/wɒtʃ/', vi: 'đồng hồ đeo tay' },
    ],
    luuY: 'Bật hơi rõ, không rung cổ. “ch” tiếng Việt nhẹ hơn nhiều.',
    hinh: { cao: 0.75, truoc: 0.80, tron: 0.45, mo: 0.30 },
    can: 'sau-loi',
    bat: true,
  },
  {
    am: 'dʒ', nhom: 'phuam', thanh: 'huu', cachDoc: 'gi, có rung cổ',
    khauHinh: 'môi hơi tròn, đẩy ra trước',
    luoi: 'như /tʃ/ nhưng dây thanh rung',
    viDu: [
      { en: 'jam', ipa: '/dʒæm/', vi: 'mứt' },
      { en: 'judge', ipa: '/dʒʌdʒ/', vi: 'quan toà' },
      { en: 'June', ipa: '/dʒuːn/', vi: 'tháng Sáu' },
    ],
    luuY: 'Nặng và có rung, không đọc nhẹ như “d” tiếng Việt.',
    hinh: { cao: 0.75, truoc: 0.80, tron: 0.45, mo: 0.30 },
    can: 'sau-loi',
    bat: true,
  },
  {
    am: 'k', nhom: 'phuam', thanh: 'vo', cachDoc: 'c/k bật hơi mạnh',
    khauHinh: 'miệng hé tự nhiên',
    luoi: 'cuống lưỡi nâng chạm vòm mềm rồi bật ra',
    viDu: [
      { en: 'cat', ipa: '/kæt/', vi: 'con mèo' },
      { en: 'key', ipa: '/kiː/', vi: 'chìa khoá' },
      { en: 'car', ipa: '/kɑː/', vi: 'xe hơi' },
    ],
    luuY: 'Bật hơi rõ ở đầu từ, không rung cổ.',
    hinh: { cao: 0.85, truoc: 0.05, tron: 0.05, mo: 0.30 },
    can: 'vom-mem',
    bat: true,
  },
  {
    am: 'ɡ', nhom: 'phuam', thanh: 'huu', cachDoc: 'g, có rung cổ',
    khauHinh: 'miệng hé tự nhiên',
    luoi: 'như /k/ nhưng dây thanh rung',
    viDu: [
      { en: 'go', ipa: '/ɡəʊ/', vi: 'đi' },
      { en: 'green', ipa: '/ɡriːn/', vi: 'màu xanh lá' },
      { en: 'bag', ipa: '/bæɡ/', vi: 'cái túi' },
    ],
    luuY: 'Cảm nhận cổ rung là phân biệt được với /k/.',
    hinh: { cao: 0.85, truoc: 0.05, tron: 0.05, mo: 0.30 },
    can: 'vom-mem',
    bat: true,
  },
  {
    am: 'f', nhom: 'phuam', thanh: 'vo', cachDoc: 'ph',
    khauHinh: 'răng trên chạm nhẹ môi dưới',
    luoi: 'hơi thoát qua khe hẹp giữa răng và môi',
    viDu: [
      { en: 'fly', ipa: '/flaɪ/', vi: 'bay' },
      { en: 'coffee', ipa: '/ˈkɒfi/', vi: 'cà phê' },
      { en: 'fish', ipa: '/fɪʃ/', vi: 'con cá' },
    ],
    luuY: 'Chạm nhẹ thôi, đừng cắn môi.',
    hinh: { cao: 0.40, truoc: 0.60, tron: 0.00, mo: 0.20 },
    can: 'moi-rang',
  },
  {
    am: 'v', nhom: 'phuam', thanh: 'huu', cachDoc: 'v, có rung cổ',
    khauHinh: 'răng trên chạm nhẹ môi dưới',
    luoi: 'như /f/ nhưng dây thanh rung',
    viDu: [
      { en: 'video', ipa: '/ˈvɪdiəʊ/', vi: 'video' },
      { en: 'very', ipa: '/ˈveri/', vi: 'rất' },
      { en: 'five', ipa: '/faɪv/', vi: 'số năm' },
    ],
    luuY: '“v” tiếng Việt không chạm răng — đây là lỗi rất hay gặp.',
    hinh: { cao: 0.40, truoc: 0.60, tron: 0.00, mo: 0.20 },
    can: 'moi-rang',
  },
  {
    am: 'θ', nhom: 'phuam', thanh: 'vo', cachDoc: 'th, lưỡi giữa hai hàm răng',
    khauHinh: 'đầu lưỡi thò nhẹ ra giữa hai hàm răng',
    luoi: 'hơi thoát qua khe giữa lưỡi và răng, không rung cổ',
    viDu: [
      { en: 'think', ipa: '/θɪŋk/', vi: 'nghĩ' },
      { en: 'three', ipa: '/θriː/', vi: 'số ba' },
      { en: 'mouth', ipa: '/maʊθ/', vi: 'cái miệng' },
    ],
    luuY: 'Đặt lưỡi giữa răng, KHÔNG cắn. Đọc thành /t/ hay /s/ là sai.',
    hinh: { cao: 0.55, truoc: 1.00, tron: 0.00, mo: 0.25 },
    can: 'rang',
  },
  {
    am: 'ð', nhom: 'phuam', thanh: 'huu', cachDoc: 'th, có rung cổ',
    khauHinh: 'đầu lưỡi thò nhẹ ra giữa hai hàm răng',
    luoi: 'như /θ/ nhưng dây thanh rung',
    viDu: [
      { en: 'this', ipa: '/ðɪs/', vi: 'cái này' },
      { en: 'mother', ipa: '/ˈmʌðə/', vi: 'mẹ' },
      { en: 'they', ipa: '/ðeɪ/', vi: 'họ' },
    ],
    luuY: 'Cùng khẩu hình với /θ/, chỉ khác ở chỗ cổ rung.',
    hinh: { cao: 0.55, truoc: 1.00, tron: 0.00, mo: 0.25 },
    can: 'rang',
  },
  {
    am: 's', nhom: 'phuam', thanh: 'vo', cachDoc: 'x (xì)',
    khauHinh: 'răng gần khép, miệng hơi bẹt',
    luoi: 'đầu lưỡi gần lợi trên, hơi xì qua khe hẹp',
    viDu: [
      { en: 'see', ipa: '/siː/', vi: 'nhìn thấy' },
      { en: 'sun', ipa: '/sʌn/', vi: 'mặt trời' },
      { en: 'sit', ipa: '/sɪt/', vi: 'ngồi' },
    ],
    luuY: 'Lưỡi sát lợi nhưng KHÔNG chạm, để hơi xì ra liên tục.',
    hinh: { cao: 0.75, truoc: 0.90, tron: 0.00, mo: 0.20 },
    can: 'loi',
  },
  {
    am: 'z', nhom: 'phuam', thanh: 'huu', cachDoc: 'd kéo dài, có rung cổ',
    khauHinh: 'răng gần khép, miệng hơi bẹt',
    luoi: 'như /s/ nhưng dây thanh rung',
    viDu: [
      { en: 'zoo', ipa: '/zuː/', vi: 'sở thú' },
      { en: 'zero', ipa: '/ˈzɪərəʊ/', vi: 'số không' },
      { en: 'nose', ipa: '/nəʊz/', vi: 'cái mũi' },
    ],
    luuY: 'Rất hay bị đọc thành /s/ ở cuối từ — nhớ giữ rung cổ.',
    hinh: { cao: 0.75, truoc: 0.90, tron: 0.00, mo: 0.20 },
    can: 'loi',
  },
  {
    am: 'ʃ', nhom: 'phuam', thanh: 'vo', cachDoc: 'sờ nhẹ (suỵt)',
    khauHinh: 'môi hơi tròn, đẩy ra trước',
    luoi: 'lưỡi nâng gần vòm miệng phía sau, hơi xát qua khe',
    viDu: [
      { en: 'she', ipa: '/ʃiː/', vi: 'cô ấy' },
      { en: 'shop', ipa: '/ʃɒp/', vi: 'cửa hàng' },
      { en: 'fish', ipa: '/fɪʃ/', vi: 'con cá' },
    ],
    luuY: 'Giống tiếng “suỵt” khi bảo im lặng. Đẩy lưỡi lên nhưng không chạm vòm.',
    hinh: { cao: 0.75, truoc: 0.75, tron: 0.50, mo: 0.25 },
    can: 'sau-loi',
  },
  {
    am: 'ʒ', nhom: 'phuam', thanh: 'huu', cachDoc: 'gi kéo dài, có rung cổ',
    khauHinh: 'môi hơi tròn, đẩy ra trước',
    luoi: 'như /ʃ/ nhưng dây thanh rung',
    viDu: [
      { en: 'television', ipa: '/ˈtelɪvɪʒn/', vi: 'ti vi' },
      { en: 'vision', ipa: '/ˈvɪʒn/', vi: 'tầm nhìn' },
      { en: 'measure', ipa: '/ˈmeʒə/', vi: 'đo lường' },
    ],
    luuY: 'Âm hiếm nhất tiếng Anh, hầu như chỉ nằm giữa từ.',
    hinh: { cao: 0.75, truoc: 0.75, tron: 0.50, mo: 0.25 },
    can: 'sau-loi',
  },
  {
    am: 'h', nhom: 'phuam', thanh: 'vo', cachDoc: 'h, hơi nhẹ',
    khauHinh: 'miệng mở theo nguyên âm đứng sau',
    luoi: 'hơi thoát tự do, chỉ xát nhẹ ở họng',
    viDu: [
      { en: 'hat', ipa: '/hæt/', vi: 'cái mũ' },
      { en: 'house', ipa: '/haʊs/', vi: 'ngôi nhà' },
      { en: 'behind', ipa: '/bɪˈhaɪnd/', vi: 'phía sau' },
    ],
    luuY: 'Chỉ là một luồng hơi, đừng nặng như “h” tiếng Việt.',
    hinh: { cao: 0.40, truoc: 0.50, tron: 0.05, mo: 0.55 },
    can: 'hong',
  },
  {
    am: 'm', nhom: 'phuam', thanh: 'huu', cachDoc: 'm',
    khauHinh: 'hai môi khép lại',
    luoi: 'hơi đi ra bằng MŨI, dây thanh rung',
    viDu: [
      { en: 'man', ipa: '/mæn/', vi: 'người đàn ông' },
      { en: 'mat', ipa: '/mæt/', vi: 'tấm thảm' },
      { en: 'mountain', ipa: '/ˈmaʊntən/', vi: 'ngọn núi' },
    ],
    luuY: 'Dễ nhất với người Việt vì giống hệt “m” của mình.',
    hinh: { cao: 0.30, truoc: 0.50, tron: 0.10, mo: 0.05 },
    can: 'moi',
    mui: true,
  },
  {
    am: 'n', nhom: 'phuam', thanh: 'huu', cachDoc: 'n',
    khauHinh: 'miệng hé',
    luoi: 'đầu lưỡi chạm lợi trên, hơi đi ra bằng mũi',
    viDu: [
      { en: 'now', ipa: '/naʊ/', vi: 'bây giờ' },
      { en: 'not', ipa: '/nɒt/', vi: 'không' },
      { en: 'nine', ipa: '/naɪn/', vi: 'số chín' },
    ],
    luuY: 'Giữ đầu lưỡi chạm lợi cho tới hết âm.',
    hinh: { cao: 0.70, truoc: 0.95, tron: 0.00, mo: 0.20 },
    can: 'loi',
    mui: true,
  },
  {
    am: 'ŋ', nhom: 'phuam', thanh: 'huu', cachDoc: 'ng',
    khauHinh: 'miệng hé, không khép môi',
    luoi: 'cuống lưỡi nâng chạm vòm mềm, hơi đi ra bằng mũi',
    viDu: [
      { en: 'sing', ipa: '/sɪŋ/', vi: 'hát' },
      { en: 'long', ipa: '/lɒŋ/', vi: 'dài' },
      { en: 'thing', ipa: '/θɪŋ/', vi: 'đồ vật' },
    ],
    luuY: 'Chỉ đứng cuối vần, không bao giờ mở đầu từ tiếng Anh.',
    hinh: { cao: 0.85, truoc: 0.05, tron: 0.05, mo: 0.30 },
    can: 'vom-mem',
    mui: true,
  },
  {
    am: 'l', nhom: 'phuam', thanh: 'huu', cachDoc: 'l',
    khauHinh: 'miệng hé vừa',
    luoi: 'đầu lưỡi chạm lợi trên, hơi đi ra hai bên lưỡi',
    viDu: [
      { en: 'love', ipa: '/lʌv/', vi: 'yêu' },
      { en: 'leg', ipa: '/leɡ/', vi: 'cái chân' },
      { en: 'light', ipa: '/laɪt/', vi: 'ánh sáng' },
    ],
    luuY: 'Cuối từ (ball, well) lưỡi vẫn phải chạm lợi, đừng nuốt mất.',
    hinh: { cao: 0.70, truoc: 0.90, tron: 0.00, mo: 0.35 },
    can: 'loi',
  },
  {
    am: 'r', nhom: 'phuam', thanh: 'huu', cachDoc: 'r cong lưỡi (không rung)',
    khauHinh: 'môi hơi tròn',
    luoi: 'đầu lưỡi cong nhẹ lên phía lợi nhưng KHÔNG chạm',
    viDu: [
      { en: 'red', ipa: '/red/', vi: 'màu đỏ' },
      { en: 'right', ipa: '/raɪt/', vi: 'bên phải, đúng' },
      { en: 'run', ipa: '/rʌn/', vi: 'chạy' },
    ],
    luuY: 'Không rung lưỡi kiểu “rờ” tiếng Việt. Lưỡi cong và giữ yên.',
    hinh: { cao: 0.65, truoc: 0.70, tron: 0.35, mo: 0.35 },
    can: 'loi',
  },
  {
    am: 'w', nhom: 'phuam', thanh: 'huu', cachDoc: 'u-ơ lướt nhanh',
    khauHinh: 'môi tròn và chúm, rồi mở ra',
    luoi: 'lưỡi lùi về sau, lướt nhanh sang nguyên âm kế tiếp',
    viDu: [
      { en: 'wet', ipa: '/wet/', vi: 'ướt' },
      { en: 'we', ipa: '/wiː/', vi: 'chúng tôi' },
      { en: 'water', ipa: '/ˈwɔːtə/', vi: 'nước' },
    ],
    luuY: 'Là bán nguyên âm: bắt buộc phải chúm tròn môi ở đầu.',
    hinh: { cao: 0.85, truoc: 0.15, tron: 0.95, mo: 0.20 },
    can: 'moi',
  },
  {
    am: 'j', nhom: 'phuam', thanh: 'huu', cachDoc: 'i-a lướt nhanh (như “d” miền Nam)',
    khauHinh: 'miệng hé, môi bẹt nhẹ',
    luoi: 'phần trước lưỡi nâng lên gần vòm cứng, gần như không cản hơi',
    viDu: [
      { en: 'yes', ipa: '/jes/', vi: 'vâng, có' },
      { en: 'you', ipa: '/juː/', vi: 'bạn' },
      { en: 'use', ipa: '/juːz/', vi: 'sử dụng' },
    ],
    luuY: 'Ký hiệu /j/ đọc là “y” chứ không phải “gi” — chỗ này rất hay nhầm.',
    hinh: { cao: 0.90, truoc: 0.95, tron: 0.00, mo: 0.25 },
    can: 'vom-cung',
  },
];

export const IPA: AmIpa[] = [...NGUYEN_AM_DON, ...NGUYEN_AM_DOI, ...PHU_AM];

export const NHOM_IPA: { id: NhomAm; ten: string; emoji: string; moTa: string }[] = [
  { id: 'don', ten: 'Nguyên âm đơn', emoji: '🅰️', moTa: '12 âm — một vị trí lưỡi duy nhất từ đầu đến cuối.' },
  { id: 'doi', ten: 'Nguyên âm đôi', emoji: '🔀', moTa: '8 âm — trượt từ vị trí này sang vị trí khác, đọc liền một hơi.' },
  { id: 'phuam', ten: 'Phụ âm', emoji: '🅱️', moTa: '24 âm — luồng hơi bị cản một phần hoặc hoàn toàn.' },
];

export const amTheoNhom = (nhom: NhomAm) => IPA.filter((a) => a.nhom === nhom);

/** Các cặp chỉ khác nhau ở chỗ rung cổ — học theo cặp thì nhớ nhanh hơn. */
export const CAP_THANH: [string, string][] = [
  ['p', 'b'], ['t', 'd'], ['tʃ', 'dʒ'], ['k', 'ɡ'],
  ['f', 'v'], ['θ', 'ð'], ['s', 'z'], ['ʃ', 'ʒ'],
];

/**
 * Soát dữ liệu. Bảng IPA có con số cố định (12 + 8 + 24 = 44) nên sai sót là
 * đếm ra được ngay, không phải đọc dò từng dòng.
 */
export function kiemIpa() {
  const loi: string[] = [];
  const dem = { don: amTheoNhom('don').length, doi: amTheoNhom('doi').length, phuam: amTheoNhom('phuam').length };
  if (dem.don !== 12) loi.push(`Nguyên âm đơn phải có 12 âm, đang có ${dem.don}`);
  if (dem.doi !== 8) loi.push(`Nguyên âm đôi phải có 8 âm, đang có ${dem.doi}`);
  if (dem.phuam !== 24) loi.push(`Phụ âm phải có 24 âm, đang có ${dem.phuam}`);

  const trong01 = (x: number) => Number.isFinite(x) && x >= 0 && x <= 1;
  const soDo = (h: KhauHinhSo) => trong01(h.cao) && trong01(h.truoc) && trong01(h.tron) && trong01(h.mo);

  const thay = new Set<string>();
  for (const a of IPA) {
    if (thay.has(a.am)) loi.push(`Ký hiệu trùng: /${a.am}/`);
    thay.add(a.am);
    if (a.viDu.length < 2) loi.push(`/${a.am}/ cần ít nhất 2 từ ví dụ`);
    if (a.nhom === 'phuam' && !a.thanh) loi.push(`/${a.am}/ thiếu thông tin hữu thanh / vô thanh`);
    if (a.nhom !== 'phuam' && a.thanh) loi.push(`/${a.am}/ là nguyên âm, không ghi hữu/vô thanh`);

    // Số đo khẩu hình: nguyên âm đôi phải có HAI mốc (đầu và cuối), các âm còn
    // lại đúng một. Sai chỗ này thì hình vẽ đứng im hoặc nhảy lung tung.
    const doi = Array.isArray(a.hinh);
    if (a.nhom === 'doi' && !doi) loi.push(`/${a.am}/ là nguyên âm đôi, cần 2 mốc khẩu hình`);
    if (a.nhom !== 'doi' && doi) loi.push(`/${a.am}/ không phải nguyên âm đôi, chỉ cần 1 mốc khẩu hình`);
    const mocs = (Array.isArray(a.hinh) ? a.hinh : [a.hinh]) as KhauHinhSo[];
    if (!mocs.every(soDo)) loi.push(`/${a.am}/ có số đo khẩu hình nằm ngoài 0–1`);
    if (doi) {
      const [d, c] = mocs;
      const xa = Math.abs(d.cao - c.cao) + Math.abs(d.truoc - c.truoc) + Math.abs(d.tron - c.tron);
      if (xa < 0.2) loi.push(`/${a.am}/ hai mốc khẩu hình gần trùng nhau — nhìn sẽ không thấy trượt`);
    }
    if (a.nhom === 'phuam' && !a.can) loi.push(`/${a.am}/ là phụ âm, thiếu điểm cản hơi`);
    if (a.nhom !== 'phuam' && a.can) loi.push(`/${a.am}/ là nguyên âm, không có điểm cản hơi`);
    for (const v of a.viDu) {
      if (!/^\/.+\/$/.test(v.ipa)) loi.push(`/${a.am}/ – phiên âm "${v.ipa}" của ${v.en} phải nằm giữa hai dấu /`);
      if (!v.vi.trim()) loi.push(`/${a.am}/ – từ ${v.en} thiếu nghĩa tiếng Việt`);
    }
  }
  for (const [vo, huu] of CAP_THANH) {
    const a = IPA.find((x) => x.am === vo);
    const b = IPA.find((x) => x.am === huu);
    if (!a || !b) { loi.push(`Cặp /${vo}/–/${huu}/ thiếu âm`); continue; }
    if (a.thanh !== 'vo' || b.thanh !== 'huu') loi.push(`Cặp /${vo}/–/${huu}/ ghi sai hữu/vô thanh`);
  }
  return { tong: IPA.length, ...dem, loi };
}
