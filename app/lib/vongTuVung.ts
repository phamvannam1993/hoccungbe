// VÒNG TRÒN TỪ VỰNG TIẾNG ANH — chia theo LỚP và CHỦ ĐỀ.
//
// KHÔNG chép lại từ vựng: lấy thẳng 48 chủ đề / hơn 1.000 từ trong `vocab.ts`
// (đang dùng cho /tu-vung-tieng-anh). Ở đây chỉ thêm hai thứ mà bên kia chưa có:
// xếp chủ đề vào lớp, và cắt mỗi chủ đề thành các vòng 10 từ.
//
// Vì sao cần chia lớp: 48 chủ đề đổ ra một danh sách thì bé lớp 1 phải bơi giữa
// "đại từ & từ để hỏi" và "vũ trụ". Xếp theo lớp là để bé mở ra thấy đúng phần
// mình học được.

import { VOCAB_TOPICS, type VocabTopic, type VocabWord } from './vocab';

export type Lop = 1 | 2 | 3 | 4 | 5;

/**
 * Chủ đề nào cho lớp nào — bám chủ điểm của chương trình tiếng Anh tiểu học
 * (Chương trình GDPT 2018; đối chiếu mạch chủ điểm của bộ Global Success 1–5,
 * là bộ đang dùng phổ biến nhất).
 *
 * Mạch chủ điểm theo lớp:
 *  • Lớp 1–2 — làm quen: chào hỏi, màu, số, gia đình, đồ dùng học tập, cơ thể,
 *    đồ chơi, con vật quen thuộc, đồ ăn, quần áo, phòng trong nhà, thời tiết.
 *  • Lớp 3 — bản thân và xung quanh: sở thích, cảm xúc, thể thao, con vật mở
 *    rộng, cây cối, đồ dùng trong nhà.
 *  • Lớp 4 — thời gian và cộng đồng: nghề nghiệp, tháng, mùa, địa điểm, phương
 *    tiện, nhạc cụ, lễ hội, động từ chỉ hoạt động, tính từ, giới từ chỉ vị trí.
 *  • Lớp 5 — mở ra thế giới: thói quen hằng ngày, quốc gia, công nghệ, vũ trụ,
 *    và các nhóm từ cần vốn nền (đại từ/từ để hỏi, dụng cụ, gia vị, phụ kiện).
 *
 * Cả chủ đề thuộc MỘT lớp. Trong chủ đề, từ được xếp sẵn từ quen thuộc tới
 * hiếm gặp (dog → dinosaur; Vietnam → Tuvalu), nên vòng đầu luôn là phần bé
 * học trước — bé cứ chơi từ vòng 1 là gặp đúng từ cần biết.
 *
 * ĐÂY LÀ BẢN ĐỐI CHIẾU, không phải trích nguyên văn sách nào: mỗi bộ sách chia
 * hơi khác nhau, và `vocab.ts` gom từ theo chủ đề chứ không theo bài. Sửa lại
 * chỉ cần đổi bảng dưới; `kiemVongTuVung()` sẽ báo nếu khai sai hay bỏ sót.
 */
const THEO_LOP: Record<Lop, string[]> = {
  // Chào hỏi, màu, số, người thân, đồ dùng học tập, cơ thể, đồ chơi, con vật, đồ ăn.
  1: ['chao-hoi', 'mau-sac', 'con-so', 'gia-dinh', 'do-dung-hoc-tap',
      'co-the', 'do-choi', 'dong-vat', 'trai-cay', 'do-an'],
  // Ngôi nhà, quần áo, thời tiết, rau củ, đồ uống, hình khối, con vật nhỏ, ngày tháng.
  2: ['phong-trong-nha', 'do-trong-nha', 'quan-ao', 'thoi-tiet', 'rau-cu',
      'do-uong', 'hinh-khoi', 'con-trung', 'chim', 'ngay-thang'],
  // Sở thích, cảm xúc, thể thao, thiên nhiên, con vật mở rộng, đồ trong nhà.
  3: ['the-thao', 'so-thich', 'cam-xuc', 'thien-nhien', 'hoa',
      'dong-vat-bien', 'nong-trai', 'phong-bep', 'phong-tam', 'so-thu-tu'],
  // Nghề nghiệp, tháng, mùa, nơi chốn, phương tiện, nhạc cụ, lễ hội, từ loại.
  4: ['nghe-nghiep', 'thang-trong-nam', 'bon-mua', 'dia-diem', 'phuong-tien',
      'nhac-cu', 'le-hoi', 'hanh-dong', 'tinh-tu', 'vi-tri'],
  // Thói quen, thế giới, công nghệ, vũ trụ và các nhóm từ cần vốn nền.
  5: ['hoat-dong-hang-ngay', 'quoc-gia', 'cong-nghe', 'vu-tru',
      'dai-tu-tu-hoi', 'dung-cu', 'gia-vi', 'phu-kien'],
};

/** Mỗi vòng 10 từ — bằng vòng tròn âm vần, đủ để nhìn rõ trên một màn hình. */
export const TU_MOI_VONG = 10;

export type VongTu = {
  /** Mã vòng: "dong-vat-1". Dùng làm khoá lưu tiến độ và tham số trên URL. */
  ma: string;
  chuDe: VocabTopic;
  lop: Lop;
  /** Vòng thứ mấy trong chủ đề (từ 1). */
  thuTu: number;
  tongVong: number;
  tu: VocabWord[];
  mau: string;
};

/** Bảng màu xoay vòng, để hai chủ đề cạnh nhau không trùng màu. */
const MAU = [
  '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e',
];

function chiaVong(chuDe: VocabTopic, lop: Lop, mauIdx: number): VongTu[] {
  const tongVong = Math.ceil(chuDe.words.length / TU_MOI_VONG);
  return Array.from({ length: tongVong }, (_, i) => ({
    ma: `${chuDe.slug}-${i + 1}`,
    chuDe,
    lop,
    thuTu: i + 1,
    tongVong,
    tu: chuDe.words.slice(i * TU_MOI_VONG, (i + 1) * TU_MOI_VONG),
    mau: MAU[(mauIdx + i) % MAU.length],
  }));
}

/** Toàn bộ vòng, đã xếp theo lớp. */
export const VONG_TU_VUNG: VongTu[] = (() => {
  const theoSlug = new Map(VOCAB_TOPICS.map((t) => [t.slug, t]));
  const ra: VongTu[] = [];
  let mauIdx = 0;
  for (const lop of [1, 2, 3, 4, 5] as Lop[]) {
    for (const slug of THEO_LOP[lop]) {
      const chuDe = theoSlug.get(slug);
      // Bỏ qua trong im lặng nếu chủ đề bị đổi tên bên vocab.ts — thà thiếu một
      // chủ đề còn hơn cả trang sập. `kiemVongTuVung()` sẽ báo chỗ lệch.
      if (!chuDe) continue;
      ra.push(...chiaVong(chuDe, lop, mauIdx));
      mauIdx += 1;
    }
  }
  return ra;
})();

/** Các lớp thực sự có vòng. */
export const CAC_LOP: Lop[] = ([1, 2, 3, 4, 5] as Lop[]).filter(
  (l) => VONG_TU_VUNG.some((v) => v.lop === l),
);

export const vongTheoLop = (lop: Lop) => VONG_TU_VUNG.filter((v) => v.lop === lop);
export const timVongTu = (ma: string) => VONG_TU_VUNG.find((v) => v.ma === ma);

/** Chủ đề của một lớp (gộp các vòng cùng chủ đề). */
export function chuDeTheoLop(lop: Lop): { chuDe: VocabTopic; vong: VongTu[] }[] {
  const m = new Map<string, { chuDe: VocabTopic; vong: VongTu[] }>();
  for (const v of vongTheoLop(lop)) {
    const co = m.get(v.chuDe.slug);
    if (co) co.vong.push(v);
    else m.set(v.chuDe.slug, { chuDe: v.chuDe, vong: [v] });
  }
  return [...m.values()];
}

/**
 * Soát dữ liệu: chủ đề nào khai trong bảng lớp mà không có bên `vocab.ts`, và
 * chủ đề nào có bên đó mà chưa xếp lớp. Dùng cho script kiểm, không gọi lúc chạy.
 */
export function kiemVongTuVung() {
  const coThat = new Set(VOCAB_TOPICS.map((t) => t.slug));
  const daXep = new Set(Object.values(THEO_LOP).flat());
  return {
    khaiSai: Object.values(THEO_LOP).flat().filter((s) => !coThat.has(s)),
    chuaXepLop: [...coThat].filter((s) => !daXep.has(s)),
    trungLop: Object.values(THEO_LOP).flat().filter((s, i, a) => a.indexOf(s) !== i),
  };
}
