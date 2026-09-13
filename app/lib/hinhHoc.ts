// Hình học: nhận biết hình phẳng, vẽ đối xứng, và khối 3D.
//
// 408 câu hình học trong kho đang hoàn toàn bằng chữ. Mà hình học là phần
// TRỰC QUAN NHẤT của toán tiểu học — bắt bé đọc chữ để hình dung hình thì
// khó gấp đôi. Ba dạng dưới đây đều cho bé nhìn hình và tự làm.

export type MucDo = 1 | 2 | 3 | 4 | 5;

/* ─────────── 1. HÌNH PHẲNG ─────────── */

export type TenHinh =
  | 'tam-giac' | 'vuong' | 'chu-nhat' | 'tron' | 'tu-giac'
  | 'thoi' | 'binh-hanh' | 'thang' | 'ngu-giac' | 'luc-giac';

export type HinhPhang = {
  ma: TenHinh;
  ten: string;
  /** Lớp bắt đầu học hình này. */ tuLop: MucDo;
  soCanh: number;
  /** Mô tả đặc điểm, dùng cho lời giải. */ dacDiem: string;
};

export const HINH_PHANG: HinhPhang[] = [
  { ma: 'tron', ten: 'Hình tròn', tuLop: 1, soCanh: 0, dacDiem: 'không có cạnh thẳng, mọi điểm cách tâm một khoảng bằng nhau' },
  { ma: 'tam-giac', ten: 'Hình tam giác', tuLop: 1, soCanh: 3, dacDiem: 'có 3 cạnh và 3 góc' },
  { ma: 'vuong', ten: 'Hình vuông', tuLop: 1, soCanh: 4, dacDiem: 'có 4 cạnh BẰNG NHAU và 4 góc vuông' },
  { ma: 'chu-nhat', ten: 'Hình chữ nhật', tuLop: 1, soCanh: 4, dacDiem: 'có 4 góc vuông, hai cạnh dài bằng nhau và hai cạnh ngắn bằng nhau' },
  { ma: 'tu-giac', ten: 'Hình tứ giác', tuLop: 2, soCanh: 4, dacDiem: 'có 4 cạnh, các góc không nhất thiết vuông' },
  { ma: 'ngu-giac', ten: 'Hình ngũ giác', tuLop: 3, soCanh: 5, dacDiem: 'có 5 cạnh' },
  { ma: 'luc-giac', ten: 'Hình lục giác', tuLop: 3, soCanh: 6, dacDiem: 'có 6 cạnh' },
  { ma: 'binh-hanh', ten: 'Hình bình hành', tuLop: 4, soCanh: 4, dacDiem: 'hai cặp cạnh đối song song và bằng nhau, góc không vuông' },
  { ma: 'thoi', ten: 'Hình thoi', tuLop: 4, soCanh: 4, dacDiem: 'có 4 cạnh bằng nhau, hai đường chéo vuông góc với nhau' },
  { ma: 'thang', ten: 'Hình thang', tuLop: 5, soCanh: 4, dacDiem: 'chỉ có MỘT cặp cạnh đối song song' },
];

/* ─────────── 2. KHỐI 3D ─────────── */

export type Khoi = {
  ma: string; ten: string; tuLop: MucDo;
  mat: number; canh: number; dinh: number;
  /** Để trống khi khối có mặt cong — không đếm cạnh/đỉnh như khối đa diện. */
  cong?: boolean;
  viDu: string;
};

export const KHOI: Khoi[] = [
  { ma: 'lap-phuong', ten: 'Khối lập phương', tuLop: 1, mat: 6, canh: 12, dinh: 8, viDu: 'con xúc xắc' },
  { ma: 'hop-chu-nhat', ten: 'Khối hộp chữ nhật', tuLop: 1, mat: 6, canh: 12, dinh: 8, viDu: 'hộp bánh' },
  { ma: 'cau', ten: 'Khối cầu', tuLop: 1, mat: 1, canh: 0, dinh: 0, cong: true, viDu: 'quả bóng' },
  { ma: 'tru', ten: 'Khối trụ', tuLop: 1, mat: 3, canh: 2, dinh: 0, cong: true, viDu: 'lon nước' },
  { ma: 'non', ten: 'Khối nón', tuLop: 3, mat: 2, canh: 1, dinh: 1, cong: true, viDu: 'cái nón lá' },
  { ma: 'chop-tu-giac', ten: 'Khối chóp tứ giác', tuLop: 5, mat: 5, canh: 8, dinh: 5, viDu: 'kim tự tháp' },
];

export const MUC_DO: { lop: MucDo; ten: string; moTa: string }[] = [
  { lop: 1, ten: 'Lớp 1', moTa: 'Hình tròn, tam giác, vuông, chữ nhật; khối lập phương, khối cầu' },
  { lop: 2, ten: 'Lớp 2', moTa: 'Thêm tứ giác, bắt đầu vẽ đối xứng đơn giản' },
  { lop: 3, ten: 'Lớp 3', moTa: 'Ngũ giác, lục giác, khối nón; đối xứng lưới lớn hơn' },
  { lop: 4, ten: 'Lớp 4', moTa: 'Hình bình hành, hình thoi; đếm mặt – cạnh – đỉnh' },
  { lop: 5, ten: 'Lớp 5', moTa: 'Hình thang, khối chóp; đối xứng hình phức tạp' },
];

const nn = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chon = <T,>(ds: T[]): T => ds[Math.floor(Math.random() * ds.length)];
function xao<T>(ds: T[]): T[] {
  const a = [...ds];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const hinhTheoLop = (lop: MucDo) => HINH_PHANG.filter((h) => h.tuLop <= lop);
export const khoiTheoLop = (lop: MucDo) => KHOI.filter((k) => k.tuLop <= lop);

export type BaiHinh = { hinh: HinhPhang; chon: HinhPhang[] };

export function raBaiHinh(lop: MucDo): BaiHinh {
  const ds = hinhTheoLop(lop);
  const h = chon(ds);
  // Đáp án nhiễu ưu tiên hình CÙNG SỐ CẠNH — vuông/chữ nhật/thoi/bình hành rất
  // dễ lẫn, mà lẫn ở đó mới là chỗ cần luyện.
  const gan = ds.filter((x) => x.ma !== h.ma && x.soCanh === h.soCanh);
  const xa = ds.filter((x) => x.ma !== h.ma && x.soCanh !== h.soCanh);
  const nhieu = [...xao(gan), ...xao(xa)].slice(0, 3);
  return { hinh: h, chon: xao([h, ...nhieu]) };
}

export type BaiKhoi = { khoi: Khoi; hoi: 'ten' | 'mat' | 'dinh'; dapAn: string; chon: string[] };

export function raBaiKhoi(lop: MucDo): BaiKhoi {
  const ds = khoiTheoLop(lop);
  const k = chon(ds);
  // Đếm mặt / đỉnh chỉ hỏi từ lớp 4, và chỉ với khối KHÔNG có mặt cong.
  const hoi: 'ten' | 'mat' | 'dinh' = lop >= 4 && !k.cong && Math.random() < 0.5
    ? (Math.random() < 0.5 ? 'mat' : 'dinh')
    : 'ten';
  if (hoi === 'ten') {
    const nhieu = xao(ds.filter((x) => x.ma !== k.ma)).slice(0, 3).map((x) => x.ten);
    return { khoi: k, hoi, dapAn: k.ten, chon: xao([k.ten, ...nhieu]) };
  }
  const so = hoi === 'mat' ? k.mat : k.dinh;
  const nhieu = new Set<number>();
  [so + 1, so - 1, so + 2, so === 6 ? 8 : 6, so === 8 ? 12 : 8, 12].forEach((n) => {
    if (n > 0 && n !== so) nhieu.add(n);
  });
  return {
    khoi: k, hoi, dapAn: String(so),
    chon: xao([String(so), ...[...nhieu].slice(0, 3).map(String)]),
  };
}

/* ─────────── 3. ĐỐI XỨNG ─────────── */

export type BaiDoiXung = {
  /** Kích thước lưới (n × n). */ n: number;
  /** Các ô ĐÃ TÔ SẴN ở nửa trái, ghi theo chỉ số hàng*n + cột. */ mau: number[];
  /** Các ô đúng mà bé phải tô ở nửa phải. */ dapAn: number[];
};

export function raBaiDoiXung(lop: MucDo): BaiDoiXung {
  const n = lop <= 2 ? 4 : lop <= 4 ? 6 : 8;
  const nua = n / 2;
  const soO = Math.max(3, Math.round((n * nua) * (lop <= 2 ? 0.4 : 0.3)));
  const mau = new Set<number>();
  while (mau.size < soO) mau.add(nn(0, n - 1) * n + nn(0, nua - 1));
  // Ô đối xứng qua trục dọc giữa lưới: cột c ↔ cột (n-1-c), cùng hàng.
  const dapAn = [...mau].map((i) => {
    const h = Math.floor(i / n);
    const c = i % n;
    return h * n + (n - 1 - c);
  });
  return { n, mau: [...mau], dapAn };
}

/**
 * Soát: 2.000 lượt mỗi lớp cho cả ba dạng. Bắt lỗi hình chưa học mà đã ra,
 * đáp án nhiễu trùng, ô đối xứng tính sai, và hỏi số mặt của khối mặt cong.
 */
export function kiemHinhHoc() {
  const loi: string[] = [];
  for (const { lop } of MUC_DO) {
    for (let i = 0; i < 2000; i++) {
      const h = raBaiHinh(lop);
      if (h.hinh.tuLop > lop) loi.push(`Lớp ${lop}: ra ${h.hinh.ten} là hình của lớp ${h.hinh.tuLop}`);
      if (h.chon.length !== 4) loi.push(`Lớp ${lop}: bài hình có ${h.chon.length} đáp án`);
      if (new Set(h.chon.map((x) => x.ma)).size !== h.chon.length) loi.push(`Lớp ${lop}: đáp án hình trùng nhau`);
      if (!h.chon.some((x) => x.ma === h.hinh.ma)) loi.push(`Lớp ${lop}: thiếu đáp án đúng`);
      if (h.chon.some((x) => x.tuLop > lop)) loi.push(`Lớp ${lop}: đáp án nhiễu dùng hình chưa học`);

      const k = raBaiKhoi(lop);
      if (k.khoi.tuLop > lop) loi.push(`Lớp ${lop}: ra ${k.khoi.ten} là khối của lớp ${k.khoi.tuLop}`);
      if (k.chon.length !== 4 || new Set(k.chon).size !== 4) loi.push(`Lớp ${lop}: đáp án khối trùng hoặc thiếu`);
      if (!k.chon.includes(k.dapAn)) loi.push(`Lớp ${lop}: bài khối thiếu đáp án đúng`);
      if (k.hoi !== 'ten' && k.khoi.cong) loi.push(`Lớp ${lop}: hỏi số mặt/đỉnh của khối có mặt cong (${k.khoi.ten})`);
      if (k.hoi !== 'ten' && lop < 4) loi.push(`Lớp ${lop} chưa học đếm mặt – đỉnh`);

      if (lop === 1) {
        const v = raBaiViTri();
        if (v.o.length !== 4) loi.push('Bài vị trí không có đủ 4 con vật');
        if (new Set(v.o.map((x) => x.vt)).size !== v.o.length) loi.push('Hai con vật đứng trùng ô');
        if (v.o.some((x) => x.vt < 0 || x.vt > 8)) loi.push('Con vật nằm ngoài lưới 3×3');
        if (!v.o.some((x) => x.vt === v.dapAn)) loi.push('Ô đáp án không có con vật nào');
        if (v.dapAn === v.moc) loi.push('Đáp án trùng với chính con vật làm mốc');
        if (!v.chon.includes(v.dapAn)) loi.push('Thiếu đáp án đúng ở bài vị trí');
        if (v.chon.includes(v.moc)) loi.push('Đáp án chứa luôn con vật làm mốc');
        // Ô đáp án phải đúng hướng so với mốc.
        const dung =
          v.huong === 'trai' ? v.moc - 1 : v.huong === 'phai' ? v.moc + 1
          : v.huong === 'tren' ? v.moc - 3 : v.moc + 3;
        if (v.dapAn !== dung) loi.push(`Bài vị trí: hướng ${v.huong} tính sai ô`);
      }

      const d = raBaiDoiXung(lop);
      if (d.mau.length !== d.dapAn.length) loi.push(`Lớp ${lop}: số ô đối xứng không khớp số ô mẫu`);
      if (new Set(d.dapAn).size !== d.dapAn.length) loi.push(`Lớp ${lop}: ô đối xứng bị trùng`);
      for (const o of d.mau) if (o % d.n >= d.n / 2) loi.push(`Lớp ${lop}: ô mẫu nằm sai nửa lưới`);
      for (const o of d.dapAn) if (o % d.n < d.n / 2) loi.push(`Lớp ${lop}: ô đáp án nằm sai nửa lưới`);
      for (const o of d.dapAn) if (o < 0 || o >= d.n * d.n) loi.push(`Lớp ${lop}: ô đáp án ngoài lưới`);
    }
  }
  return { loi: [...new Set(loi)] };
}

/* ─────────── 4. VỊ TRÍ, ĐỊNH HƯỚNG KHÔNG GIAN (lớp 1) ─────────── */

// Lớp 1 có 60 câu về trái – phải – trên – dưới – trước – sau mà toàn bằng chữ.
// Trẻ 6 tuổi chưa đọc trôi, bắt đọc đề để học phương hướng là ngược đời: phải
// cho bé NHÌN THẤY các con vật xếp trên lưới rồi chỉ.

export type ViTri = 'trai' | 'phai' | 'tren' | 'duoi' | 'giua';

export const TEN_VI_TRI: Record<ViTri, string> = {
  'trai': 'bên trái', 'phai': 'bên phải', 'tren': 'phía trên', 'duoi': 'phía dưới', 'giua': 'ở giữa',
};

export type BaiViTri = {
  /** Các con vật xếp trên lưới 3×3, ghi theo chỉ số 0…8. */
  o: { vt: number; emoji: string; ten: string }[];
  /** Con vật làm mốc. */ moc: number;
  huong: ViTri;
  /** Chỉ số ô là đáp án đúng. */ dapAn: number;
  chon: number[];
};

const CON_VAT = [
  { emoji: '🐱', ten: 'con mèo' }, { emoji: '🐶', ten: 'con chó' },
  { emoji: '🐰', ten: 'con thỏ' }, { emoji: '🐻', ten: 'con gấu' },
  { emoji: '🐦', ten: 'con chim' }, { emoji: '🐢', ten: 'con rùa' },
];

export function raBaiViTri(): BaiViTri {
  for (let lan = 0; lan < 100; lan++) {
    // Lưới 3×3, đặt 4 con vật vào 4 ô khác nhau.
    const oDung = xao([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 4);
    const vat = xao(CON_VAT).slice(0, 4);
    const o = oDung.map((vt, i) => ({ vt, emoji: vat[i].emoji, ten: vat[i].ten }));
    const moc = chon(o);
    const huong = chon(['trai', 'phai', 'tren', 'duoi'] as ViTri[]);
    const h = Math.floor(moc.vt / 3);
    const c = moc.vt % 3;
    // Ô cần tìm phải nằm TRONG lưới và phải có con vật đứng đó.
    const dich =
      huong === 'trai' ? (c > 0 ? moc.vt - 1 : -1)
      : huong === 'phai' ? (c < 2 ? moc.vt + 1 : -1)
      : huong === 'tren' ? (h > 0 ? moc.vt - 3 : -1)
      : (h < 2 ? moc.vt + 3 : -1);
    if (dich < 0) continue;
    const co = o.find((x) => x.vt === dich);
    if (!co) continue;
    return {
      o, moc: moc.vt, huong, dapAn: dich,
      chon: xao(o.filter((x) => x.vt !== moc.vt).map((x) => x.vt)),
    };
  }
  const o = [
    { vt: 3, emoji: '🐱', ten: 'con mèo' }, { vt: 4, emoji: '🐶', ten: 'con chó' },
    { vt: 5, emoji: '🐰', ten: 'con thỏ' }, { vt: 1, emoji: '🐻', ten: 'con gấu' },
  ];
  return { o, moc: 4, huong: 'trai', dapAn: 3, chon: xao([3, 5, 1]) };
}

export function giaiViTri(b: BaiViTri): string {
  const moc = b.o.find((x) => x.vt === b.moc)!;
  const dap = b.o.find((x) => x.vt === b.dapAn)!;
  const meo = b.huong === 'trai' || b.huong === 'phai'
    ? ' Mẹo: trái – phải tính theo hướng bé NHÌN VÀO hình, giống lúc bé giơ tay trái tay phải của chính mình.'
    : ' Mẹo: phía trên là hàng nằm cao hơn, phía dưới là hàng nằm thấp hơn.';
  return `Tìm ô nằm ngay ${TEN_VI_TRI[b.huong]} ${moc.ten} — đó là ${dap.ten}.${meo}`;
}
