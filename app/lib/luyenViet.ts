// Bộ "Luyện viết chữ đẹp" — sinh phiếu tập viết in ra giấy A4.
//
// ĐƠN VỊ ĐO: mọi kích thước trong file này tính bằng Ô LI (1 ô li = 5mm, đúng
// khổ vở ô li lớp 1). Nhờ vậy mã nguồn đọc giống cách cô giáo nói với bé
// ("chữ b cao 5 ô li") thay vì đầy số mm lẻ.
//
// CHỮ MẪU: dùng font Andika (SIL) đã nạp sẵn ở layout — đây là mẫu CHỮ IN
// THƯỜNG, kiểu bé nhận mặt chữ khi tập đọc. Mẫu CHỮ VIẾT THƯỜNG (có nét khuyết,
// nét móc, viết liền tay) cần một font chữ viết riêng có bản quyền; phần NÉT CƠ
// BẢN dưới đây được vẽ tay bằng path nên vẫn đúng kiểu chữ viết.

import { BE_NGANG_CHU, BE_NGANG_MAC_DINH } from './luyenVietBeNgang';

export const O_LI_MM = 5;

/** Khổ A4 và lề, tính bằng mm. Lề 12mm đủ cho mọi máy in phun/laser phổ thông. */
export const TRANG = { rong: 210, cao: 297, le: 12 } as const;

/* ------------------------------------------------------------------ */
/* Độ cao chuẩn của chữ viết thường (Mẫu chữ viết trong trường tiểu học) */
/* ------------------------------------------------------------------ */

/**
 * Độ cao từng chữ cái tính bằng Ô LI, theo mẫu chữ viết hiện hành:
 *   – 2 ô li  : a ă â c e ê i m n o ô ơ u ư v x
 *   – 2,5 ô li: r s
 *   – 3 ô li  : t
 *   – 4 ô li  : d đ p q
 *   – 5 ô li  : b g h k l y
 * `duoi` là phần THÒ XUỐNG dưới dòng kẻ (g, y, p, q).
 */
export type DoCao = { tren: number; duoi: number };

const CAO_2: DoCao = { tren: 2, duoi: 0 };
const CAO_25: DoCao = { tren: 2.5, duoi: 0 };
const CAO_3: DoCao = { tren: 3, duoi: 0 };
const CAO_4: DoCao = { tren: 4, duoi: 0 };
const CAO_5: DoCao = { tren: 5, duoi: 0 };

export const DO_CAO_THUONG: Record<string, DoCao> = {
  a: CAO_2, ă: CAO_2, â: CAO_2, c: CAO_2, e: CAO_2, ê: CAO_2, i: CAO_2,
  m: CAO_2, n: CAO_2, o: CAO_2, ô: CAO_2, ơ: CAO_2, u: CAO_2, ư: CAO_2,
  v: CAO_2, x: CAO_2,
  r: CAO_25, s: CAO_25,
  t: CAO_3,
  d: CAO_4, đ: CAO_4,
  p: { tren: 2, duoi: 2 }, q: { tren: 2, duoi: 2 },
  b: CAO_5, h: CAO_5, k: CAO_5, l: CAO_5,
  g: { tren: 2, duoi: 3 }, y: { tren: 2, duoi: 3 },
};

/** Chữ hoa trong mẫu chữ viết đều cao 5 ô li (riêng G, Y có nét thò xuống). */
export const DO_CAO_HOA: Record<string, DoCao> = {
  G: { tren: 5, duoi: 2 }, Y: { tren: 5, duoi: 2 },
};
export const doCaoHoa = (c: string): DoCao => DO_CAO_HOA[c] ?? CAO_5;

/** Bảng chữ cái tiếng Việt, 29 chữ, đúng thứ tự sách giáo khoa. */
export const CHU_CAI = [
  'a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm',
  'n', 'o', 'ô', 'ơ', 'p', 'q', 'r', 's', 't', 'u', 'ư', 'v', 'x', 'y',
] as const;

export const doCaoThuong = (c: string): DoCao => DO_CAO_THUONG[c] ?? CAO_2;

/**
 * Tổng độ cao của chữ, tính cả phần thò xuống — đây là con số cô giáo nói khi
 * dạy ("chữ g cao 5 ô li"), chứ không phải riêng phần nằm trên dòng kẻ.
 */
export const tongDoCao = (c: string, hoa = false): number => {
  const d = hoa ? doCaoHoa(c) : doCaoThuong(c);
  return d.tren + d.duoi;
};

/** Nhóm bảng chữ cái theo tổng độ cao, để dựng bảng tra cho ba mẹ. */
export function nhomTheoDoCao(): { cao: number; chu: string[] }[] {
  const map = new Map<number, string[]>();
  for (const c of CHU_CAI) {
    const k = tongDoCao(c);
    map.set(k, [...(map.get(k) ?? []), c]);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([cao, chu]) => ({ cao, chu }));
}

/** Câu mô tả độ cao cho ba mẹ nhắc bé: "Chữ b cao 5 ô li". */
export function moTaDoCao(c: string, hoa = false): string {
  const d = hoa ? doCaoHoa(c) : doCaoThuong(c);
  const so = (n: number) => String(n).replace('.', ',');
  const ten = hoa ? `Chữ ${c} hoa` : `Chữ ${c}`;
  return d.duoi
    ? `${ten} cao ${so(d.tren)} ô li, thò xuống ${so(d.duoi)} ô li`
    : `${ten} cao ${so(d.tren)} ô li`;
}

/* ------------------------------------------------------------------ */
/* Nét cơ bản — vẽ tay bằng path SVG                                    */
/* ------------------------------------------------------------------ */

/**
 * Hệ toạ độ của path: gốc (0,0) nằm trên DÒNG KẺ (đường bé đặt bút viết),
 * x tăng sang phải, **y tăng xuống dưới** (như mọi SVG). Vì vậy phần thân chữ
 * nằm ở y ÂM. Đơn vị là ô li.
 *
 * `rong` là bề ngang ô chứa nét, dùng để xếp các nét cách đều nhau.
 */
export type Net = { ma: string; ten: string; rong: number; d: string };

export const NET_CO_BAN: Net[] = [
  { ma: 'thang-dung', ten: 'Nét thẳng đứng', rong: 1.2, d: 'M 0.6 -2 L 0.6 0' },
  { ma: 'thang-ngang', ten: 'Nét thẳng ngang', rong: 2, d: 'M 0.2 -1 L 1.8 -1' },
  // Nét xiên TRÁI ngả đỉnh sang trái ( \ ), nét xiên PHẢI ngả đỉnh sang phải ( / ).
  // Ghi kèm hình trong tên để không ai phải đoán, vì hai nét này rất dễ lẫn.
  { ma: 'xien-trai', ten: 'Nét xiên trái ( \ )', rong: 1.6, d: 'M 0.3 -2 L 1.3 0' },
  { ma: 'xien-phai', ten: 'Nét xiên phải ( / )', rong: 1.6, d: 'M 1.3 -2 L 0.3 0' },
  {
    ma: 'moc-xuoi', ten: 'Nét móc xuôi', rong: 1.8,
    d: 'M 0.3 -1.5 C 0.3 -2 1.3 -2 1.3 -1.5 L 1.3 0',
  },
  {
    ma: 'moc-nguoc', ten: 'Nét móc ngược', rong: 1.8,
    d: 'M 0.3 -2 L 0.3 -0.5 C 0.3 0 1.3 0 1.3 -0.5',
  },
  {
    // Móc ở CẢ HAI đầu: đầu trên móc sang trái, chân dưới hất sang phải. Nối
    // hai đầu vào nhau sẽ thành vòng khép kín — sai hẳn nét.
    ma: 'moc-hai-dau', ten: 'Nét móc hai đầu', rong: 2.1,
    d: 'M 0.25 -1.4 C 0.25 -2.05 1.05 -2.05 1.05 -1.45 L 1.05 -0.5 C 1.05 -0.02 1.6 0.02 1.85 -0.4',
  },
  {
    ma: 'cong-ho-phai', ten: 'Nét cong hở phải', rong: 1.8,
    d: 'M 1.45 -1.6 C 1.3 -2 0.3 -2.1 0.3 -1 C 0.3 0.1 1.3 0 1.45 -0.4',
  },
  {
    ma: 'cong-ho-trai', ten: 'Nét cong hở trái', rong: 1.8,
    d: 'M 0.35 -1.6 C 0.5 -2 1.5 -2.1 1.5 -1 C 1.5 0.1 0.5 0 0.35 -0.4',
  },
  {
    ma: 'cong-kin', ten: 'Nét cong kín', rong: 1.8,
    d: 'M 0.9 -2 C 0.35 -2 0.25 -1.5 0.25 -1 C 0.25 -0.5 0.35 0 0.9 0 C 1.45 0 1.55 -0.5 1.55 -1 C 1.55 -1.5 1.45 -2 0.9 -2 Z',
  },
  {
    ma: 'khuyet-tren', ten: 'Nét khuyết trên', rong: 1.6,
    d: 'M 1.1 0 L 1.1 -3.6 C 1.1 -5 0.25 -5 0.25 -4.1 C 0.25 -3.3 1.1 -2.6 1.1 0',
  },
  {
    ma: 'khuyet-duoi', ten: 'Nét khuyết dưới', rong: 1.6,
    d: 'M 1.1 -2 L 1.1 1.6 C 1.1 3 0.25 3 0.25 2.1 C 0.25 1.3 1.1 0.6 1.1 -2',
  },
  {
    ma: 'net-that', ten: 'Nét thắt', rong: 2,
    d: 'M 0.3 -0.8 C 0.8 -1 1.6 -1.4 1.6 -1.8 C 1.6 -2.2 1.0 -2.1 1.0 -1.4 C 1.0 -0.6 1.4 -0.2 1.8 -0.1',
  },
];

/* ------------------------------------------------------------------ */
/* Nội dung tập viết                                                    */
/* ------------------------------------------------------------------ */

export const CHU_SO = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export const CHU_HOA = CHU_CAI.map((c) => c.toUpperCase());

/**
 * Vần thông dụng lớp 1, xếp theo âm cuối. Mỗi nhóm ĐÚNG 8 vần để vừa khít một
 * trang — nhóm 10 vần thì trang thứ hai chỉ có 2 dòng, nhìn như phiếu lỗi.
 */
export const VAN: { nhom: string; ds: string[] }[] = [
  { nhom: 'Vần có âm cuối n', ds: ['an', 'ăn', 'ân', 'en', 'ên', 'in', 'on', 'ôn'] },
  { nhom: 'Vần có âm cuối ng', ds: ['ang', 'ăng', 'âng', 'ong', 'ông', 'ung', 'ưng', 'iêng'] },
  { nhom: 'Vần có âm cuối m', ds: ['am', 'ăm', 'âm', 'em', 'êm', 'im', 'om', 'ôm'] },
  { nhom: 'Vần có âm cuối t', ds: ['at', 'ăt', 'ât', 'et', 'êt', 'it', 'ot', 'ôt'] },
  { nhom: 'Vần có âm cuối c, ch', ds: ['ac', 'ăc', 'oc', 'ôc', 'uc', 'ach', 'êch', 'ich'] },
  { nhom: 'Vần có âm cuối i, y', ds: ['ai', 'ôi', 'ơi', 'ui', 'ay', 'ây', 'oi', 'uôi'] },
  { nhom: 'Vần có âm cuối o, u', ds: ['ao', 'eo', 'êu', 'iu', 'au', 'âu', 'iêu', 'yêu'] },
];

/** Từ tập viết theo chủ đề — chọn từ quen thuộc, dễ hiểu nghĩa với bé. */
export const TU_NGU: { nhom: string; ds: string[] }[] = [
  { nhom: 'Gia đình', ds: ['bố mẹ', 'ông bà', 'anh chị', 'em bé', 'cô chú', 'gia đình', 'chị gái', 'em trai'] },
  { nhom: 'Đồ dùng học tập', ds: ['bút chì', 'quyển vở', 'cặp sách', 'thước kẻ', 'cục tẩy', 'hộp bút', 'bảng con', 'viên phấn'] },
  { nhom: 'Con vật', ds: ['con mèo', 'con chó', 'con gà', 'con cá', 'con chim', 'con voi', 'con trâu', 'con bướm'] },
  { nhom: 'Cây cối', ds: ['cây xanh', 'bông hoa', 'quả cam', 'lá cây', 'vườn rau', 'hạt đỗ', 'cành đào', 'quả khế'] },
  { nhom: 'Trường lớp', ds: ['lớp học', 'cô giáo', 'bạn bè', 'sân trường', 'bảng đen', 'giờ ra chơi', 'trống trường', 'giờ học'] },
  { nhom: 'Quê hương', ds: ['dòng sông', 'cánh đồng', 'ngôi nhà', 'con đường', 'biển xanh', 'núi cao', 'luỹ tre', 'bến đò'] },
];

/** Câu ngắn để bé luyện viết cả câu: có chữ hoa đầu câu và dấu chấm cuối câu. */
export const CAU_NGAN: string[] = [
  'Bé yêu mẹ.',
  'Em đi học.',
  'Bà kể chuyện cho bé nghe.',
  'Con mèo nằm ngủ trên ghế.',
  'Sáng nay trời nắng đẹp.',
  'Em giúp mẹ quét nhà.',
  'Cây bàng toả bóng mát.',
  'Bạn Lan học rất giỏi.',
  'Đàn chim bay về tổ.',
  'Em chào cô giáo.',
];

/* ------------------------------------------------------------------ */
/* Các bộ phiếu                                                         */
/* ------------------------------------------------------------------ */

export type KieuDong = 'net' | 'chu' | 'chuoi';

/** Một dòng trên phiếu: nội dung + kiểu hiển thị. */
export type Dong =
  | { kieu: 'net'; net: Net; ghiChu: string }
  | { kieu: 'chu'; chu: string; hoa: boolean; ghiChu: string }
  | { kieu: 'chuoi'; chuoi: string; ghiChu: string; toMo?: boolean };

export type Trang = { tieuDe: string; dongs: Dong[] };

export type Bo = {
  slug: string;
  ten: string;
  emoji: string;
  moTa: string;
  /** Lớp phù hợp, hiển thị trên thẻ chọn bộ. */
  lop: string;
  mau: string;
  /** Mô tả dài cho SEO của trang phiếu. */
  gioiThieu: string;
};

export const CAC_BO: Bo[] = [
  {
    slug: 'net-co-ban', ten: 'Nét cơ bản', emoji: '✏️', lop: 'Bắt đầu', mau: '#0ea5e9',
    moTa: '13 nét cơ bản: nét thẳng, nét xiên, nét móc, nét cong, nét khuyết',
    gioiThieu:
      'Trước khi viết được chữ, bé cần viết đúng 13 nét cơ bản. Mỗi nét được vẽ lớn trên khung ô li, bé tô theo nét mờ rồi tự viết lại.',
  },
  {
    slug: 'chu-thuong', ten: 'Chữ cái thường', emoji: '🔤', lop: 'Lớp 1', mau: '#16a34a',
    moTa: '29 chữ cái tiếng Việt, mỗi chữ một trang tô và viết',
    gioiThieu:
      'Mỗi chữ cái có một phiếu riêng, ghi rõ độ cao chuẩn theo ô li để ba mẹ nhắc bé viết đúng ly.',
  },
  {
    slug: 'chu-hoa', ten: 'Chữ cái hoa', emoji: '🅰️', lop: 'Lớp 1 – 2', mau: '#7c3aed',
    moTa: '29 chữ hoa cao 5 ô li, dùng viết tên riêng và đầu câu',
    gioiThieu:
      'Chữ hoa cao 5 ô li. Phiếu giúp bé quen độ cao và điểm đặt bút của từng chữ hoa.',
  },
  {
    slug: 'chu-so', ten: 'Chữ số 0 – 9', emoji: '🔢', lop: 'Lớp 1', mau: '#ea580c',
    moTa: 'Viết đúng chiều, đúng độ cao 2 ô li của mười chữ số',
    gioiThieu: 'Mười chữ số, mỗi số một trang, viết trên khung ô li 2 ly như vở tập viết.',
  },
  {
    slug: 'van', ten: 'Vần thông dụng', emoji: '🧩', lop: 'Lớp 1', mau: '#db2777',
    moTa: '70 vần hay gặp, chia 7 nhóm theo âm cuối',
    gioiThieu:
      'Luyện viết vần giúp bé nối chữ trôi chảy. Các vần được xếp theo âm cuối để bé thấy quy luật.',
  },
  {
    slug: 'tu-ngu', ten: 'Từ ngữ theo chủ đề', emoji: '🍎', lop: 'Lớp 1 – 2', mau: '#0d9488',
    moTa: 'Gia đình, đồ dùng học tập, con vật, cây cối, trường lớp, quê hương',
    gioiThieu: 'Bé viết từ có nghĩa quen thuộc, vừa luyện chữ vừa nhớ mặt chữ của từ.',
  },
  {
    slug: 'cau-ngan', ten: 'Câu ngắn', emoji: '📖', lop: 'Lớp 1 – 2', mau: '#b45309',
    moTa: 'Viết cả câu: chữ hoa đầu câu, khoảng cách chữ, dấu chấm cuối câu',
    gioiThieu:
      'Bước cuối của tập viết: viết trọn một câu, đúng chữ hoa đầu câu và dấu chấm kết thúc.',
  },
];

export const timBo = (slug: string) => CAC_BO.find((b) => b.slug === slug);

/* ------------------------------------------------------------------ */
/* Sinh nội dung từng trang                                             */
/* ------------------------------------------------------------------ */

/* Số đo khung trang, tính bằng Ô LI và MM. Để ở đây (không để trong component)
   để `kiemLuyenViet` soát được: sai một con số là cả 88 trang in ra bị tràn. */

/**
 * Khung một dòng viết, khác nhau theo bộ.
 *
 * Bộ NÉT CƠ BẢN cần dòng cao hơn: nét khuyết trên vươn 5 ô li, nét khuyết dưới
 * thò 3 ô li — dùng chung khung với bộ chữ thì đuôi nét tràn xuống chân trang
 * (đã in thử và thấy đúng như vậy).
 */
export type KhungDong = { dongOLi: number; dayTuDinh: number; dongMoiTrang: number };

const KHUNG_CHU: KhungDong = { dongOLi: 6, dayTuDinh: 4.5, dongMoiTrang: 8 };
const KHUNG_NET: KhungDong = { dongOLi: 8, dayTuDinh: 5, dongMoiTrang: 6 };

export const khungDong = (slug: string): KhungDong => (slug === 'net-co-ban' ? KHUNG_NET : KHUNG_CHU);

export const DONG_O_LI = KHUNG_CHU.dongOLi;
export const DAY_TU_DINH = KHUNG_CHU.dayTuDinh;
/** Chỗ chừa cho tên bộ, ô Họ tên, tiêu đề trang (mm) và cho chân trang (mm). */
export const CAO_DAU_TRANG = 26;
export const CAO_CHAN = 4;

/** Bề ngang thật sự viết được trên một dòng (mm): trừ lề và chỗ thụt đầu dòng. */
export const LE_TRAI_VIET = 3;
export const RONG_VIET = TRANG.rong - TRANG.le * 2 - LE_TRAI_VIET;

/**
 * Cỡ chữ nhỏ nhất được phép co, tính theo tỉ lệ so với cỡ chuẩn. Nhỏ hơn nữa
 * thì chữ không còn khớp lưới ô li và bé viết theo cũng khó.
 */
export const CO_CHU_NHO_NHAT = 0.55;

/** Số dòng viết mỗi trang A4 của các bộ chữ — soát lại trong `kiemLuyenViet`. */
export const DONG_MOI_TRANG = KHUNG_CHU.dongMoiTrang;

/**
 * Số đo THẬT của font Andika, đo bằng Chrome (canvas TextMetrics, cỡ 100px):
 * thân chữ (x-height) 0,498em · nét vươn lên 0,781em · nét thò xuống 0,240em ·
 * bề ngang trung bình 0,52em. Cỡ chữ được tính từ đây để thân chữ cao ĐÚNG
 * 2 ô li.
 *
 * LƯU Ý: đây là mẫu CHỮ IN THƯỜNG. Ở mẫu CHỮ VIẾT THƯỜNG của trường, chữ b, h,
 * k, l cao 5 ô li; font in chỉ vươn lên khoảng 3,1 ô li. Bảng `DO_CAO_THUONG`
 * vẫn ghi đúng chuẩn để ba mẹ nhắc bé, còn khung dòng thì tính theo nét thật
 * được in ra — nếu tính theo 5 ô li thì mỗi trang chỉ còn 6 dòng mà phần trên
 * vẫn trống trơn.
 */
export const FONT = { than: 0.498, vuonLen: 0.781, thoXuong: 0.24 } as const;

/** Cỡ chữ (mm) để thân chữ thường cao đúng 2 ô li. */
export const CO_CHU = (2 * O_LI_MM) / FONT.than;

/** Bề ngang một chuỗi, tính bằng mm, cộng từ bề ngang THẬT của từng ký tự. */
export function beNgangChuoi(s: string, coChu: number): number {
  let em = 0;
  for (const c of s) em += BE_NGANG_CHU[c] ?? BE_NGANG_MAC_DINH;
  return em * coChu;
}

/** Chia một danh sách thành các trang vừa đúng số dòng cho phép. */
function chiaTrang<T>(ds: T[], moiTrang: number): T[][] {
  const ra: T[][] = [];
  for (let i = 0; i < ds.length; i += moiTrang) ra.push(ds.slice(i, i + moiTrang));
  return ra;
}

/**
 * Chia ĐỀU: cùng số trang như `chiaTrang` nhưng rải cho các trang xấp xỉ bằng
 * nhau. 13 nét chia 3 mỗi trang ra 3+3+3+3+1 — trang cuối một nét trông như in
 * lỗi; chia đều thành 3+3+3+2+2 thì trang nào cũng đầy đặn.
 */
function chiaDeu<T>(ds: T[], toiDaMoiTrang: number): T[][] {
  const soTrang = Math.ceil(ds.length / toiDaMoiTrang);
  const ra: T[][] = Array.from({ length: soTrang }, () => []);
  ds.forEach((x, i) => ra[i % soTrang].push(x));
  return ra;
}

export function taoTrang(slug: string): Trang[] {
  switch (slug) {
    case 'net-co-ban': {
      const ra: Trang[] = [];
      // Mỗi nét chiếm 2 dòng (tô mẫu + viết lại) → mỗi trang chứa nửa số dòng.
      const netMoiTrang = Math.floor(KHUNG_NET.dongMoiTrang / 2);
      let dem = 0;
      for (const nhom of chiaDeu(NET_CO_BAN, netMoiTrang)) {
        const dau = dem + 1;
        dem += nhom.length;
        ra.push({
          tieuDe: `Nét cơ bản (${dau}–${dem})`,
          dongs: nhom.flatMap((net) => [
            { kieu: 'net' as const, net, ghiChu: net.ten },
            { kieu: 'net' as const, net, ghiChu: 'Viết lại' },
          ]),
        });
      }
      return ra;
    }
    case 'chu-thuong':
      return CHU_CAI.map((c) => ({
        tieuDe: `Chữ ${c}`,
        dongs: Array.from({ length: DONG_MOI_TRANG }, (_, i) => ({
          kieu: 'chu' as const,
          chu: c,
          hoa: false,
          ghiChu: i === 0 ? moTaDoCao(c) : '',
        })),
      }));
    case 'chu-hoa':
      return CHU_HOA.map((c) => ({
        tieuDe: `Chữ hoa ${c}`,
        dongs: Array.from({ length: DONG_MOI_TRANG }, (_, i) => ({
          kieu: 'chu' as const,
          chu: c,
          hoa: true,
          ghiChu: i === 0 ? moTaDoCao(c, true) : '',
        })),
      }));
    case 'chu-so':
      return CHU_SO.map((c) => ({
        tieuDe: `Chữ số ${c}`,
        dongs: Array.from({ length: DONG_MOI_TRANG }, (_, i) => ({
          kieu: 'chu' as const,
          chu: c,
          hoa: false,
          ghiChu: i === 0 ? `Chữ số ${c} cao 2 ô li` : '',
        })),
      }));
    // Vần và từ đều chia trang theo số dòng: nhóm nào dài hơn một trang thì
    // tràn sang trang sau, KHÔNG cắt bỏ phần dư (bản đầu cắt mất 2 vần mỗi nhóm).
    case 'van':
    case 'tu-ngu': {
      const nguon = slug === 'van' ? VAN : TU_NGU;
      return nguon.flatMap((n) => {
        const phan = chiaTrang(n.ds, DONG_MOI_TRANG);
        return phan.map((ds, i) => ({
          tieuDe: phan.length > 1 ? `${n.nhom} (${i + 1}/${phan.length})` : n.nhom,
          dongs: ds.map((v) => ({ kieu: 'chuoi' as const, chuoi: v, ghiChu: '' })),
        }));
      });
    }
    case 'cau-ngan': {
      const ra: Trang[] = [];
      for (let i = 0; i < CAU_NGAN.length; i += 4) {
        const nhom = CAU_NGAN.slice(i, i + 4);
        ra.push({
          tieuDe: `Câu ngắn (${i + 1}–${i + nhom.length})`,
          // Câu dài không xếp vừa hai lần trên một dòng, nên tách đôi:
          // dòng trên in đậm để bé đọc mẫu, dòng dưới in mờ để bé tô theo.
          dongs: nhom.flatMap((c) => [
            { kieu: 'chuoi' as const, chuoi: c, ghiChu: '' },
            { kieu: 'chuoi' as const, chuoi: c, ghiChu: '', toMo: true },
          ]),
        });
      }
      return ra;
    }
    default:
      return [];
  }
}

/* ------------------------------------------------------------------ */
/* Soát                                                                 */
/* ------------------------------------------------------------------ */

/**
 * Soát toàn bộ dữ liệu tập viết. Bắt các lỗi làm hỏng phiếu in:
 * trang quá dài tràn khổ A4, path nét sai cú pháp, chữ cái thiếu độ cao,
 * chuỗi quá dài làm chữ co lại không đọc được.
 */
export function kiemLuyenViet() {
  const loi: string[] = [];

  // 1. Bảng chữ cái đủ 29 chữ, không trùng, đều có độ cao.
  if (CHU_CAI.length !== 29) loi.push(`Bảng chữ cái có ${CHU_CAI.length} chữ, phải là 29`);
  if (new Set(CHU_CAI).size !== CHU_CAI.length) loi.push('Bảng chữ cái có chữ trùng nhau');
  for (const c of CHU_CAI) {
    if (!DO_CAO_THUONG[c]) loi.push(`Chữ "${c}" chưa khai độ cao`);
    const d = doCaoThuong(c);
    if (d.tren < 2 || d.tren > 5) loi.push(`Chữ "${c}": độ cao ${d.tren} ô li nằm ngoài 2–5`);
    if (d.duoi < 0 || d.duoi > 3) loi.push(`Chữ "${c}": phần thò xuống ${d.duoi} ô li không hợp lệ`);
  }
  // Nhóm độ cao phải khớp ĐÚNG mẫu chữ viết trong trường tiểu học. Bảng này
  // hiện lên trang cho ba mẹ tra, ghi sai là dạy sai bé.
  const CHUAN: Record<string, string> = {
    '2': 'aăâceêimnoôơuưvx',
    '2.5': 'rs',
    '3': 't',
    '4': 'dđpq',
    '5': 'bghkly',
  };
  for (const [cao, mong] of Object.entries(CHUAN)) {
    const thuc = CHU_CAI.filter((c) => tongDoCao(c) === Number(cao)).join('');
    if (thuc !== mong) loi.push(`Nhóm cao ${cao} ô li đang là "${thuc}", chuẩn là "${mong}"`);
  }

  // Chữ có nét thò xuống phải đúng 4 chữ g, y, p, q — sai bảng này là phiếu
  // cắt mất đuôi chữ khi in.
  const coDuoi = CHU_CAI.filter((c) => doCaoThuong(c).duoi > 0).join('');
  if (coDuoi !== 'gpqy') loi.push(`Chữ thò xuống dòng kẻ đang là "${coDuoi}", phải là "gpqy"`);

  // 2. Nét cơ bản: mã không trùng, path hợp lệ, nằm gọn trong ô chứa.
  const ma = new Set<string>();
  for (const n of NET_CO_BAN) {
    if (ma.has(n.ma)) loi.push(`Nét "${n.ma}" bị trùng mã`);
    ma.add(n.ma);
    if (!/^M\s/.test(n.d)) loi.push(`Nét "${n.ma}": path không bắt đầu bằng M`);
    const so = n.d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    if (so.length < 4 || so.length % 2 !== 0) loi.push(`Nét "${n.ma}": path có ${so.length} số, phải chẵn và ≥ 4`);
    for (let i = 0; i < so.length; i += 2) {
      const x = so[i], y = so[i + 1];
      if (x < 0 || x > n.rong) loi.push(`Nét "${n.ma}": điểm x=${x} vượt bề ngang ${n.rong} ô li`);
      if (y < -5.2 || y > 3.2) loi.push(`Nét "${n.ma}": điểm y=${y} nằm ngoài khung viết`);
    }
  }
  if (NET_CO_BAN.length !== 13) loi.push(`Có ${NET_CO_BAN.length} nét cơ bản, chương trình lớp 1 dạy 13 nét`);

  // 3. Mọi bộ đều sinh được trang, không trang nào rỗng hay quá dài.
  for (const bo of CAC_BO) {
    const trangs = taoTrang(bo.slug);
    if (!trangs.length) loi.push(`Bộ "${bo.slug}" không sinh được trang nào`);
    for (const t of trangs) {
      if (!t.dongs.length) loi.push(`Bộ "${bo.slug}" – trang "${t.tieuDe}" không có dòng nào`);
      const moiTrang = khungDong(bo.slug).dongMoiTrang;
      if (t.dongs.length * 2 < moiTrang) {
        // Trang lơ thơ vài dòng trông như phiếu in lỗi, và tốn một tờ giấy.
        loi.push(`Bộ "${bo.slug}" – trang "${t.tieuDe}" chỉ có ${t.dongs.length}/${moiTrang} dòng, quá thưa`);
      }
      if (t.dongs.length > moiTrang) {
        loi.push(`Bộ "${bo.slug}" – trang "${t.tieuDe}" có ${t.dongs.length} dòng, tràn khổ A4`);
      }
      for (const d of t.dongs) {
        if (d.kieu === 'chuoi' && d.chuoi) {
          // In thử đã thấy câu dài tràn khỏi mép phải tờ giấy → soát bằng bề
          // ngang thật, ở cỡ chữ NHỎ NHẤT được phép co.
          const rongNhoNhat = beNgangChuoi(d.chuoi, CO_CHU * CO_CHU_NHO_NHAT);
          if (rongNhoNhat > RONG_VIET) {
            loi.push(
              `Bộ "${bo.slug}": chuỗi "${d.chuoi}" rộng ${rongNhoNhat.toFixed(0)}mm dù đã co hết cỡ, ` +
              `mà dòng chỉ có ${RONG_VIET.toFixed(0)}mm`,
            );
          }
        }
        if (d.kieu === 'chu' && [...d.chu].length !== 1) {
          loi.push(`Bộ "${bo.slug}": ô chữ "${d.chu}" phải đúng một ký tự`);
        }
      }
    }
  }

  // 4. Khung trang từng bộ phải vừa khổ A4 và chứa lọt nét chữ in ra.
  const caoCoDuoc = TRANG.cao - TRANG.le * 2;
  const vuonLenOLi = (FONT.vuonLen * CO_CHU) / O_LI_MM;
  const thoXuongOLi = (FONT.thoXuong * CO_CHU) / O_LI_MM;

  for (const bo of CAC_BO) {
    const k = khungDong(bo.slug);
    const caoDung = CAO_DAU_TRANG + k.dongMoiTrang * k.dongOLi * O_LI_MM + CAO_CHAN;
    if (caoDung > caoCoDuoc) {
      loi.push(`Bộ "${bo.slug}": một trang cần ${caoDung}mm, khổ A4 trừ lề chỉ có ${caoCoDuoc}mm`);
    }
    if (k.dayTuDinh >= k.dongOLi) loi.push(`Bộ "${bo.slug}": dòng kẻ nằm ngoài dòng viết`);
    const choTren = k.dayTuDinh;
    const choDuoi = k.dongOLi - k.dayTuDinh;

    if (bo.slug === 'net-co-ban') {
      // Nét vẽ tay: soát biên thật của từng path.
      for (const n of NET_CO_BAN) {
        const so = n.d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
        const ys = so.filter((_, i) => i % 2 === 1);
        const tren = -Math.min(...ys);
        const duoi = Math.max(...ys);
        if (tren > choTren) loi.push(`Nét "${n.ma}" vươn lên ${tren} ô li, vượt ${choTren} ô li chừa phía trên`);
        if (duoi > choDuoi) loi.push(`Nét "${n.ma}" thò xuống ${duoi} ô li, vượt ${choDuoi} ô li chừa phía dưới`);
      }
    } else {
      if (vuonLenOLi > choTren) {
        loi.push(`Bộ "${bo.slug}": nét vươn lên ${vuonLenOLi.toFixed(2)} ô li, vượt ${choTren} ô li chừa phía trên dòng kẻ`);
      }
      if (thoXuongOLi > choDuoi) {
        loi.push(`Bộ "${bo.slug}": nét thò xuống ${thoXuongOLi.toFixed(2)} ô li, vượt ${choDuoi} ô li chừa phía dưới dòng kẻ`);
      }
    }
  }
  // Thân chữ phải cao đúng 2 ô li — sai là chữ không còn khớp lưới ô li.
  const thanOLi = (FONT.than * CO_CHU) / O_LI_MM;
  if (Math.abs(thanOLi - 2) > 0.01) loi.push(`Thân chữ cao ${thanOLi.toFixed(2)} ô li, phải là 2`);

  // 5. Slug bộ không trùng.
  const slug = new Set<string>();
  for (const b of CAC_BO) {
    if (slug.has(b.slug)) loi.push(`Bộ "${b.slug}" bị trùng slug`);
    slug.add(b.slug);
  }

  // 6. Nội dung chữ và câu đều là tiếng Việt có dấu hợp lệ (không lẫn ký tự lạ).
  const hopLe = /^[0-9A-Za-zÀ-ỹ\s.,'’-]+$/u;
  for (const n of [...VAN, ...TU_NGU]) {
    for (const x of n.ds) if (!hopLe.test(x)) loi.push(`Nội dung "${x}" có ký tự lạ`);
  }
  for (const c of CAU_NGAN) {
    if (!hopLe.test(c)) loi.push(`Câu "${c}" có ký tự lạ`);
    if (!/^[A-ZĐÀ-Ỹ]/u.test(c)) loi.push(`Câu "${c}" không viết hoa chữ đầu câu`);
    if (!c.endsWith('.')) loi.push(`Câu "${c}" thiếu dấu chấm cuối câu`);
  }

  const tongTrang = CAC_BO.reduce((s, b) => s + taoTrang(b.slug).length, 0);
  return { loi: [...new Set(loi)], tongTrang };
}
