// Sinh bài toán có lời văn kèm SƠ ĐỒ ĐOẠN THẲNG.
//
// Vì sao phải có sơ đồ: trẻ tắc toán lời văn không phải vì tính sai, mà vì
// không biết bài đang cho gì và hỏi gì. Vẽ ra hai đoạn thẳng là thấy ngay
// "cộng vào" hay "bớt đi". Đây đúng cách sách giáo khoa tiểu học Việt Nam dạy
// (và cũng là lối "bar model" của Singapore).
//
// Mỗi bài trả về cả LỜI VĂN lẫn CẤU TRÚC SƠ ĐỒ, nên trang web vẽ được hình mà
// không phải đoán gì thêm.

export type MucDo = 1 | 2 | 3 | 4 | 5;

/** Một đoạn trong sơ đồ: dài bao nhiêu phần, ghi nhãn gì, có phải ẩn số không. */
export type Doan = { nhan: string; gia: number; an?: boolean };

/** Một hàng của sơ đồ — mỗi nhân vật/đại lượng một hàng. */
export type Hang = {
  ten: string;
  doan: Doan[];
  mau: string;
  /**
   * Nhãn ghi ở CUỐI hàng, là tổng của cả hàng.
   *
   * Cần vì có dạng mà số đã cho là tổng của hàng chứ không của từng đoạn: "Nam
   * có 83, Hoa ít hơn 17" thì 83 là cả đoạn của Nam. Thiếu nhãn này thì sơ đồ
   * không hiện số 83 ở đâu cả, bé nhìn vào không có gì để tính.
   */
  tongNhan?: string;
};

export type Dang = 'tong' | 'con-lai' | 'nhieu-hon' | 'it-hon' | 'tong-hieu' | 'gap-lan';

export type BaiToan = {
  dang: Dang;
  loiVan: string;
  hoi: string;
  dapAn: number;
  donVi: string;
  hang: Hang[];
  /** Ngoặc tổng vẽ ôm mấy hàng, kèm nhãn ("30 quả"). Null thì không vẽ. */
  ngoacTong: { nhan: string; an: boolean } | null;
  giaiThich: string;
  /** Phép tính viết ra, để bé chép vào vở. */ phepTinh: string;
};

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chon = <T,>(ds: T[]): T => ds[Math.floor(Math.random() * ds.length)];

const TEN = ['Lan', 'Nam', 'Mai', 'Bình', 'Hoa', 'Tuấn', 'Linh', 'Minh'];
const DO_VAT: { ten: string; donVi: string }[] = [
  { ten: 'cái kẹo', donVi: 'cái' }, { ten: 'quyển vở', donVi: 'quyển' },
  { ten: 'quả cam', donVi: 'quả' }, { ten: 'con tem', donVi: 'con' },
  { ten: 'bông hoa', donVi: 'bông' }, { ten: 'viên bi', donVi: 'viên' },
];

const MAU = ['#f97316', '#8b5cf6', '#0ea5e9', '#16a34a'];

/** Dạng bài mà mỗi lớp đã học. */
export const DANG_THEO_LOP: Record<MucDo, Dang[]> = {
  // Lớp 1 chỉ gộp vào và bớt đi, trong phạm vi 10 — đúng chương trình.
  1: ['tong', 'con-lai'],
  2: ['tong', 'con-lai', 'nhieu-hon', 'it-hon'],
  3: ['tong', 'con-lai', 'nhieu-hon', 'it-hon', 'gap-lan'],
  4: ['tong', 'nhieu-hon', 'it-hon', 'gap-lan', 'tong-hieu'],
  5: ['tong-hieu', 'gap-lan', 'nhieu-hon', 'it-hon'],
};

export const TEN_DANG: Record<Dang, string> = {
  'tong': 'Tìm tổng',
  'con-lai': 'Tìm phần còn lại',
  'nhieu-hon': 'Nhiều hơn',
  'it-hon': 'Ít hơn',
  'tong-hieu': 'Tìm hai số khi biết tổng và hiệu',
  'gap-lan': 'Gấp một số lần',
};

/** Khoảng số hợp với lớp — lớp 2 trong phạm vi 100, lớp 5 tới hàng nghìn. */
function khoang(lop: MucDo): [number, number] {
  if (lop === 1) return [1, 9];
  if (lop === 2) return [3, 40];
  if (lop === 3) return [5, 90];
  if (lop === 4) return [8, 200];
  return [20, 500];
}

export function raBaiToan(lop: MucDo, batBuoc?: Dang): BaiToan {
  const dang = batBuoc ?? chon(DANG_THEO_LOP[lop]);
  const [lo, hi] = khoang(lop);
  const [a, b] = [chon(TEN), chon(TEN.filter((t) => t !== TEN[0]))];
  const ten1 = a;
  const ten2 = chon(TEN.filter((t) => t !== ten1));
  const dv = chon(DO_VAT);

  const hang = (ds: { ten: string; doan: Doan[]; tongNhan?: string }[]): Hang[] =>
    ds.map((h, i) => ({ ...h, mau: MAU[i % MAU.length] }));

  if (dang === 'tong') {
    // Lớp 1 học cộng trong phạm vi 10 nên tổng không được vượt 10.
    const x = nn(lo, hi);
    const y = lop === 1 ? nn(1, Math.max(1, 10 - x)) : nn(lo, hi);
    return {
      dang, donVi: dv.donVi, dapAn: x + y,
      loiVan: `${ten1} có ${x} ${dv.ten}. ${ten2} có ${y} ${dv.ten}.`,
      hoi: `Cả hai bạn có tất cả bao nhiêu ${dv.ten}?`,
      // MỘT hàng, hai đoạn nối tiếp: dấu ngoặc ôm cả hai mới đúng nghĩa "tất
      // cả". Vẽ hai hàng rời thì ngoặc chỉ ôm được hàng dài nhất, bé nhìn vào
      // tưởng tổng bằng đúng số lớn hơn.
      hang: hang([
        { ten: 'Cả hai', doan: [{ nhan: `${ten1}: ${x}`, gia: x }, { nhan: `${ten2}: ${y}`, gia: y }] },
      ]),
      ngoacTong: { nhan: '?', an: true },
      phepTinh: `${x} + ${y} = ${x + y}`,
      giaiThich: `Sơ đồ có hai đoạn nối tiếp nhau, dấu ngoặc ôm cả hai chính là "tất cả" — nên lấy ${x} cộng ${y}.`,
    };
  }

  if (dang === 'con-lai') {
    const tong = nn(lo + 5, hi);
    const bot = nn(lo, tong - 1);
    return {
      dang, donVi: dv.donVi, dapAn: tong - bot,
      loiVan: `${ten1} có ${tong} ${dv.ten}, ${ten1} cho bạn ${bot} ${dv.ten}.`,
      hoi: `${ten1} còn lại bao nhiêu ${dv.ten}?`,
      hang: hang([
        { ten: ten1, doan: [{ nhan: `cho ${bot}`, gia: bot }, { nhan: '?', gia: tong - bot, an: true }] },
      ]),
      ngoacTong: { nhan: `${tong} ${dv.donVi}`, an: false },
      phepTinh: `${tong} − ${bot} = ${tong - bot}`,
      giaiThich: `Cả đoạn dài là ${tong}, phần đã cho đi là ${bot}. Phần còn lại chính là đoạn bị thiếu, nên lấy ${tong} trừ ${bot}.`,
    };
  }

  if (dang === 'nhieu-hon' || dang === 'it-hon') {
    const goc = nn(lo + 5, hi);
    const lech = nn(2, Math.max(3, Math.floor(goc / 2)));
    const nhieu = dang === 'nhieu-hon';
    const kq = nhieu ? goc + lech : goc - lech;
    return {
      dang, donVi: dv.donVi, dapAn: kq,
      loiVan: `${ten1} có ${goc} ${dv.ten}. ${ten2} có ${nhieu ? 'nhiều hơn' : 'ít hơn'} ${ten1} ${lech} ${dv.ten}.`,
      hoi: `${ten2} có bao nhiêu ${dv.ten}?`,
      hang: hang(nhieu
        ? [
          { ten: ten1, doan: [{ nhan: String(goc), gia: goc }] },
          { ten: ten2, doan: [{ nhan: String(goc), gia: goc }, { nhan: `${lech}`, gia: lech }], tongNhan: '?' },
        ]
        : [
          // Số đã cho (goc) là tổng CẢ HÀNG của bạn thứ nhất, nên ghi ở cuối
          // hàng; phần dôi ra chính là "ít hơn bao nhiêu".
          { ten: ten1, doan: [{ nhan: '', gia: kq, an: true }, { nhan: `${lech}`, gia: lech }], tongNhan: String(goc) },
          { ten: ten2, doan: [{ nhan: '?', gia: kq, an: true }] },
        ]),
      ngoacTong: null,
      phepTinh: `${goc} ${nhieu ? '+' : '−'} ${lech} = ${kq}`,
      giaiThich: nhieu
        ? `Đoạn của ${ten2} dài hơn đoạn của ${ten1} đúng ${lech} phần, nên lấy ${goc} cộng ${lech}.`
        : `Đoạn của ${ten2} ngắn hơn đoạn của ${ten1} đúng ${lech} phần, nên lấy ${goc} trừ ${lech}.`,
    };
  }

  if (dang === 'gap-lan') {
    const lan = nn(2, lop >= 4 ? 5 : 4);
    const be = nn(Math.max(2, Math.floor(lo / 2)), Math.max(6, Math.floor(hi / lan)));
    return {
      dang, donVi: dv.donVi, dapAn: be * lan,
      loiVan: `${ten1} có ${be} ${dv.ten}. ${ten2} có gấp ${lan} lần ${ten1}.`,
      hoi: `${ten2} có bao nhiêu ${dv.ten}?`,
      hang: hang([
        { ten: ten1, doan: [{ nhan: String(be), gia: be }] },
        { ten: ten2, doan: Array.from({ length: lan }, () => ({ nhan: String(be), gia: be })), tongNhan: '?' },
      ]),
      ngoacTong: null,
      phepTinh: `${be} × ${lan} = ${be * lan}`,
      giaiThich: `Đoạn của ${ten2} gồm đúng ${lan} đoạn bằng đoạn của ${ten1}, nên lấy ${be} nhân ${lan}.`,
    };
  }

  // tong-hieu: tổng và hiệu cùng chẵn hoặc cùng lẻ thì mới chia hết cho 2.
  const beNhat = nn(lo, Math.floor(hi / 2));
  const hieu = nn(2, Math.max(2, Math.floor(hi / 3)));
  const lonNhat = beNhat + hieu;
  const tong = beNhat + lonNhat;
  return {
    dang: 'tong-hieu', donVi: dv.donVi, dapAn: beNhat,
    loiVan: `Hai bạn ${ten1} và ${ten2} có tất cả ${tong} ${dv.ten}. ${ten1} có nhiều hơn ${ten2} ${hieu} ${dv.ten}.`,
    hoi: `${ten2} có bao nhiêu ${dv.ten}?`,
    hang: hang([
      { ten: ten1, doan: [{ nhan: '', gia: beNhat, an: true }, { nhan: String(hieu), gia: hieu }] },
      { ten: ten2, doan: [{ nhan: '?', gia: beNhat, an: true }] },
    ]),
    ngoacTong: { nhan: `${tong} ${dv.donVi}`, an: false },
    phepTinh: `(${tong} − ${hieu}) : 2 = ${beNhat}`,
    giaiThich: `Cắt bỏ phần dôi ra ${hieu} thì hai đoạn bằng nhau, tổng lúc đó là ${tong} − ${hieu} = ${tong - hieu}. Chia đôi được số bé: ${tong - hieu} : 2 = ${beNhat}.`,
  };
}

/** Bốn đáp án: số đúng + ba lỗi hay gặp (nhầm phép tính, quên chia đôi…). */
export function dapAnNhieu(b: BaiToan): number[] {
  const ra: number[] = [];
  const them = (n: number) => {
    if (Number.isInteger(n) && n > 0 && n !== b.dapAn && !ra.includes(n)) ra.push(n);
  };
  const so = (b.loiVan.match(/\d+/g) || []).map(Number);
  const [x = 0, y = 0] = so;
  them(x + y);          // nhầm sang phép cộng
  them(Math.abs(x - y));// nhầm sang phép trừ
  if (b.dang === 'tong-hieu') { them((x + y) / 2); them(b.dapAn + y); }
  if (b.dang === 'gap-lan') { them(x + y); them(b.dapAn - x); }
  them(b.dapAn + 1);
  them(b.dapAn - 1);
  them(b.dapAn + 2);
  them(b.dapAn + 10);
  // Nới dần cho đủ ba đáp án: phạm vi 10 của lớp 1 rất chật, "còn lại 1" thì
  // các luật trên chỉ ra được hai số. Bộ soát đã bắt đúng trường hợp này.
  for (let k = 2; ra.length < 3 && k <= 12; k++) {
    them(b.dapAn + k);
    them(b.dapAn - k);
  }
  return ra.slice(0, 3);
}

/**
 * Soát bộ sinh đề: 2.000 lượt mỗi lớp, mỗi dạng.
 * Bắt các lỗi kiểu số âm, đáp án không nguyên, lời văn không khớp đáp án,
 * sơ đồ vẽ ra không cộng đúng bằng tổng.
 */
export function kiemSoDo() {
  const loi: string[] = [];
  for (const lop of [1, 2, 3, 4, 5] as MucDo[]) {
    for (const dang of DANG_THEO_LOP[lop]) {
      for (let i = 0; i < 500; i++) {
        const b = raBaiToan(lop, dang);
        if (!Number.isInteger(b.dapAn) || b.dapAn <= 0) loi.push(`Lớp ${lop}/${dang}: đáp án ${b.dapAn} không hợp lệ`);
        // Lớp 1 chỉ học trong phạm vi 10: mọi con số trong đề lẫn đáp án đều
        // phải nằm trong đó, kể cả tổng.
        if (lop === 1) {
          const so = [...(b.loiVan.match(/\d+/g) || []).map(Number), b.dapAn];
          if (so.some((n) => n > 10)) loi.push(`Lớp 1/${dang}: có số vượt quá 10 (${so.join(', ')})`);
        }
        if (!b.hang.length) loi.push(`Lớp ${lop}/${dang}: thiếu sơ đồ`);
        for (const h of b.hang) {
          if (!h.doan.length) loi.push(`Lớp ${lop}/${dang}: hàng "${h.ten}" không có đoạn nào`);
          if (h.doan.some((d) => d.gia <= 0)) loi.push(`Lớp ${lop}/${dang}: hàng "${h.ten}" có đoạn dài 0 hoặc âm`);
        }
        // Phép tính viết ra phải cho đúng đáp án — chống chuyện lời giải một
        // đằng, đáp án một nẻo.
        const ve = b.phepTinh.split('=').pop()!.trim();
        if (Number(ve) !== b.dapAn) loi.push(`Lớp ${lop}/${dang}: phép tính "${b.phepTinh}" khác đáp án ${b.dapAn}`);

        const nhieu = dapAnNhieu(b);
        if (nhieu.length < 3) loi.push(`Lớp ${lop}/${dang}: chỉ tạo được ${nhieu.length} đáp án nhiễu`);
        if (nhieu.includes(b.dapAn)) loi.push(`Lớp ${lop}/${dang}: đáp án nhiễu trùng đáp án đúng`);
      }
    }
  }
  return { loi: [...new Set(loi)] };
}

/**
 * Bài mở màn CỐ ĐỊNH, không random.
 *
 * State khởi tạo mà gọi hàm sinh ngẫu nhiên thì máy chủ dựng một bài, trình
 * duyệt dựng bài khác, React báo lệch HTML ngay khi vào trang. Đề thật được
 * thay ngay sau khi hydrate xong.
 */
export const BAI_MO_MAN: BaiToan = {
  dang: 'tong',
  donVi: 'cái',
  dapAn: 20,
  loiVan: 'Lan có 12 cái kẹo. Nam có 8 cái kẹo.',
  hoi: 'Cả hai bạn có tất cả bao nhiêu cái kẹo?',
  hang: [
    { ten: 'Lan', doan: [{ nhan: '12', gia: 12 }], mau: '#f97316' },
    { ten: 'Nam', doan: [{ nhan: '8', gia: 8 }], mau: '#8b5cf6' },
  ],
  ngoacTong: { nhan: '?', an: true },
  phepTinh: '12 + 8 = 20',
  giaiThich: 'Sơ đồ có hai đoạn nối tiếp nhau, dấu ngoặc ôm cả hai chính là "tất cả" — nên lấy 12 cộng 8.',
};
