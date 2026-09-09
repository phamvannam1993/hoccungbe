// RA ĐỀ CHO CÁC GAME LUYỆN NGHE — dùng chung cho mọi game nghe.
//
// Gom về một chỗ vì mọi game nghe đều cần đúng một thứ: lấy N từ CÙNG MỘT CHỦ ĐỀ
// trong phạm vi một lớp, một từ đúng và phần còn lại làm nhiễu.
//
// Vì sao nhiễu phải cùng chủ đề: trộn lung tung (một con vật, một màu, một cái
// bàn) thì bé loại trừ được mà không cần nghe — thành bài nhìn hình chứ không
// phải bài nghe. Cùng chủ đề thì buộc phải nghe ra đúng từ.

import { chuDeTheoLop, type Lop } from './vongTuVung';
import type { VocabTopic, VocabWord } from './vocab';

export type CauNghe = {
  dung: VocabWord;
  chuDe: VocabTopic;
  /** Các lựa chọn, đã xáo — gồm cả từ đúng. */
  dapAn: VocabWord[];
};

export function xao<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Các chủ đề của một lớp, gộp hết từ, chỉ giữ chủ đề đủ từ để dựng lựa chọn. */
export function khoTheoLop(lop: Lop, soDapAn: number) {
  return chuDeTheoLop(lop)
    .map((c) => ({ chuDe: c.chuDe, tu: c.vong.flatMap((v) => v.tu) }))
    .filter((c) => c.tu.length >= soDapAn);
}

/**
 * Ra `soCau` câu cho một lớp. Xoay vòng qua các chủ đề để một ván không dồn hết
 * vào một chủ đề, và không hỏi lại từ đã hỏi trong cùng ván.
 */
export function raDeNghe(lop: Lop, soCau: number, soDapAn: number): CauNghe[] {
  const kho = khoTheoLop(lop, soDapAn);
  if (!kho.length) return [];
  const cau: CauNghe[] = [];
  const daRa = new Set<string>();
  const vong = xao(kho);
  // Chặn trên số lần thử để không lặp vô hạn khi lớp có quá ít từ.
  for (let i = 0; cau.length < soCau && i < vong.length * 8; i++) {
    const c = vong[i % vong.length];
    const con = c.tu.filter((w) => !daRa.has(w.en));
    if (!con.length) continue;
    const dung = con[Math.floor(Math.random() * con.length)];
    const sai = xao(c.tu.filter((w) => w.en !== dung.en)).slice(0, soDapAn - 1);
    if (sai.length < soDapAn - 1) continue;
    daRa.add(dung.en);
    cau.push({ dung, chuDe: c.chuDe, dapAn: xao([dung, ...sai]) });
  }
  return cau;
}

/** Màu chủ đạo theo lớp — mỗi lớp một tông để bé nhận ra mình đang ở đâu. */
export const MAU_LOP: Record<Lop, string> = {
  1: '#ef4444', 2: '#f97316', 3: '#22c55e', 4: '#0ea5e9', 5: '#8b5cf6',
};
