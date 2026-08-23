// Tính nhanh theo lớp (1–5) — dạng bài dùng MẸO tính, có giải thích.
// question_speech/explanation_speech tùy chọn; nếu thiếu, client tự chuyển ký hiệu (× → nhân, : → chia…) để đọc.

export type TinhNhanhQ = {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  question_speech?: string;
  explanation_speech?: string;
};

export const GRADES = [1, 2, 3, 4, 5] as const;

export const TINH_NHANH_BY_GRADE: Record<number, TinhNhanhQ[]> = {
  1: [
    { id: 'l1-1', question: '7 + 0 = ?', options: ['0', '7', '8', '17'], correct_index: 1, explanation: 'Số nào cộng với 0 cũng bằng chính nó, nên 7 + 0 = 7.' },
    { id: 'l1-2', question: '6 + 4 = ?', options: ['9', '10', '11', '12'], correct_index: 1, explanation: '6 và 4 ghép lại vừa tròn 10, nên 6 + 4 = 10.' },
    { id: 'l1-3', question: '8 + 5 = ?', options: ['12', '13', '14', '15'], correct_index: 1, explanation: 'Tách 5 = 2 + 3. Lấy 8 + 2 = 10 (tròn chục), còn 3 → 10 + 3 = 13.' },
    { id: 'l1-4', question: '9 + 6 = ?', options: ['14', '15', '16', '17'], correct_index: 1, explanation: 'Lấy 9 + 1 = 10 (mượn 1 từ số 6), còn 5 → 10 + 5 = 15.' },
    { id: 'l1-5', question: '15 − 5 = ?', options: ['5', '10', '11', '20'], correct_index: 1, explanation: 'Bớt đúng phần lẻ 5 thì về tròn chục: 15 − 5 = 10.' },
    { id: 'l1-6', question: '13 − 4 = ?', options: ['8', '9', '10', '11'], correct_index: 1, explanation: 'Bớt 3 để về 10 trước, rồi bớt thêm 1 → 10 − 1 = 9.' },
    { id: 'l1-7', question: '5 + 5 = ?', options: ['5', '10', '11', '15'], correct_index: 1, explanation: 'Gấp đôi 5: 5 + 5 = 10.' },
    { id: 'l1-8', question: '10 − 7 = ?', options: ['2', '3', '4', '17'], correct_index: 1, explanation: '7 cần thêm 3 nữa mới đủ 10, nên 10 − 7 = 3.' },
  ],
  2: [
    { id: 'l2-1', question: '28 + 5 = ?', options: ['32', '33', '34', '35'], correct_index: 1, explanation: 'Lấy 28 + 2 = 30 (tròn chục), còn 3 → 30 + 3 = 33.' },
    { id: 'l2-2', question: '47 + 30 = ?', options: ['50', '67', '77', '87'], correct_index: 2, explanation: 'Cộng phần chục: 47 + 30 = 77.' },
    { id: 'l2-3', question: '62 − 9 = ?', options: ['51', '52', '53', '54'], correct_index: 2, explanation: 'Bớt 10 rồi cộng trả 1: 62 − 10 = 52, cộng 1 → 53.' },
    { id: 'l2-4', question: '25 + 25 = ?', options: ['40', '45', '50', '55'], correct_index: 2, explanation: 'Gấp đôi 25: 25 + 25 = 50.' },
    { id: 'l2-5', question: '36 + 19 = ?', options: ['45', '54', '55', '56'], correct_index: 2, explanation: 'Coi 19 = 20 − 1. Lấy 36 + 20 = 56, trừ 1 → 55.' },
    { id: 'l2-6', question: '2 × 6 = ?', options: ['8', '10', '12', '14'], correct_index: 2, explanation: 'Nhân 2 là gấp đôi: 6 + 6 = 12.' },
    { id: 'l2-7', question: '5 × 4 = ?', options: ['15', '20', '25', '40'], correct_index: 1, explanation: 'Nhân 5: 5 × 4 = 20 (kết quả tận cùng bằng 0 hoặc 5).' },
    { id: 'l2-8', question: '100 − 40 = ?', options: ['50', '60', '70', '140'], correct_index: 1, explanation: 'Bớt 40 chục khỏi 100: 100 − 40 = 60.' },
  ],
  3: [
    { id: 'l3-1', question: '7 × 8 = ?', options: ['54', '56', '58', '64'], correct_index: 1, explanation: 'Theo bảng nhân 7: 7 × 8 = 56.' },
    { id: 'l3-2', question: '9 × 6 = ?', options: ['45', '54', '56', '63'], correct_index: 1, explanation: 'Mẹo nhân 9: 9 × 6 = 10 × 6 − 6 = 60 − 6 = 54.' },
    { id: 'l3-3', question: '4 × 25 = ?', options: ['75', '90', '100', '125'], correct_index: 2, explanation: 'Cặp quen thuộc: 4 × 25 = 100 (một số tròn trăm).' },
    { id: 'l3-4', question: '15 × 10 = ?', options: ['105', '150', '155', '1 500'], correct_index: 1, explanation: 'Nhân 10: viết thêm một số 0 vào cuối → 150.' },
    { id: 'l3-5', question: '24 : 6 = ?', options: ['3', '4', '5', '6'], correct_index: 1, explanation: 'Chia là ngược của nhân: 24 : 6 = 4 vì 6 × 4 = 24.' },
    { id: 'l3-6', question: '63 : 9 = ?', options: ['6', '7', '8', '9'], correct_index: 1, explanation: '63 : 9 = 7 vì 9 × 7 = 63.' },
    { id: 'l3-7', question: '8 + 3 × 4 = ?', options: ['20', '24', '44', '56'], correct_index: 0, explanation: 'Nhân trước, cộng sau: 3 × 4 = 12, rồi 8 + 12 = 20.' },
    { id: 'l3-8', question: '6 × 5 = ?', options: ['25', '30', '35', '60'], correct_index: 1, explanation: 'Nhân 5: 6 × 5 = 30.' },
  ],
  4: [
    { id: 'tinh-nhanh-02', question: 'Tính giá trị biểu thức:\n8 + 2 × 5 − 4 = ?', options: ['6', '14', '26', '46'], correct_index: 1, explanation: 'Phải nhân chia trước, cộng trừ sau. Làm 2 × 5 = 10 trước, rồi 8 + 10 − 4 = 14. Ai tính lần lượt từ trái sang phải sẽ ra 46 và bị sai.', question_speech: 'Tính giá trị biểu thức: tám cộng hai nhân năm trừ bốn bằng bao nhiêu?', explanation_speech: 'Phải nhân chia trước, cộng trừ sau. Làm hai nhân năm bằng mười trước, rồi tám cộng mười trừ bốn bằng mười bốn. Ai tính lần lượt từ trái sang phải sẽ ra bốn mươi sáu và bị sai.' },
    { id: 'tinh-nhanh-09', question: 'Tính nhanh:\n47 × 8 + 53 × 8 = ?', options: ['376', '424', '800', '1 600'], correct_index: 2, explanation: 'Cả hai tích đều có thừa số 8 nên gộp lại: (47 + 53) × 8. Trong ngoặc là 100, nên kết quả là 100 × 8 = 800.', question_speech: 'Tính nhanh: bốn mươi bảy nhân tám cộng năm mươi ba nhân tám bằng bao nhiêu?', explanation_speech: 'Cả hai tích đều có thừa số tám nên gộp lại thành bốn mươi bảy cộng năm mươi ba, tất cả nhân tám. Trong ngoặc là một trăm, nên kết quả là tám trăm.' },
    { id: 'tinh-nhanh-01', question: 'Tính nhanh:\n25 × 36 = ?', options: ['180', '640', '900', '1 800'], correct_index: 2, explanation: 'Tách 36 = 4 × 9. Ta có 25 × 4 = 100, rồi 100 × 9 = 900. Cứ thấy số 25 thì tìm cách ghép với 4 để ra số tròn trăm.', question_speech: 'Tính nhanh: hai mươi lăm nhân ba mươi sáu bằng bao nhiêu?', explanation_speech: 'Tách ba mươi sáu bằng bốn nhân chín. Hai mươi lăm nhân bốn bằng một trăm, rồi một trăm nhân chín bằng chín trăm.' },
    { id: 'tinh-nhanh-04', question: 'Tính nhanh:\n99 × 45 = ?', options: ['4 405', '4 455', '4 545', '4 950'], correct_index: 1, explanation: 'Coi 99 = 100 − 1. Ta có 100 × 45 = 4 500, rồi trừ đi 45: 4 500 − 45 = 4 455.', question_speech: 'Tính nhanh: chín mươi chín nhân bốn mươi lăm bằng bao nhiêu?', explanation_speech: 'Coi chín mươi chín bằng một trăm trừ một. Một trăm nhân bốn mươi lăm bằng bốn nghìn năm trăm, rồi trừ đi bốn mươi lăm được bốn nghìn bốn trăm năm mươi lăm.' },
    { id: 'l4-7', question: 'Tính nhanh:\n4 × 17 × 25 = ?', options: ['1 700', '1 750', '2 100', '6 800'], correct_index: 0, explanation: 'Ghép 4 × 25 = 100 trước, rồi 100 × 17 = 1 700.' },
    { id: 'l4-8', question: 'Tính nhanh:\n36 × 11 = ?', options: ['366', '396', '406', '3 636'], correct_index: 1, explanation: 'Mẹo nhân 11 với số có 2 chữ số: viết 3 và 6, chèn tổng 3 + 6 = 9 vào giữa → 396.' },
    { id: 'tinh-nhanh-10', question: 'Tính nhanh:\n2 000 − 999 − 99 − 9 = ?', options: ['883', '893', '903', '993'], correct_index: 1, explanation: 'Làm tròn: trừ đi 1 000 + 100 + 10 = 1 110 thì được 890. Nhưng trừ thừa mất 3 nên cộng trả lại: 890 + 3 = 893.', question_speech: 'Tính nhanh: hai nghìn trừ chín trăm chín mươi chín trừ chín mươi chín trừ chín bằng bao nhiêu?', explanation_speech: 'Làm tròn cho dễ. Trừ đi một nghìn một trăm mười thì được tám trăm chín mươi. Nhưng ta đã trừ thừa mất ba, nên phải cộng trả lại được tám trăm chín mươi ba.' },
  ],
  5: [
    { id: 'tinh-nhanh-03', question: 'Tính nhanh:\n45 × 5 = ?', options: ['205', '215', '225', '250'], correct_index: 2, explanation: 'Nhân với 5 chính là nhân 10 rồi chia đôi. Ta có 45 × 10 = 450, rồi 450 : 2 = 225.', question_speech: 'Tính nhanh: bốn mươi lăm nhân năm bằng bao nhiêu?', explanation_speech: 'Nhân với năm chính là nhân mười rồi chia đôi. Bốn mươi lăm nhân mười bằng bốn trăm năm mươi, chia đôi bằng hai trăm hai mươi lăm.' },
    { id: 'tinh-nhanh-06', question: 'Tính nhanh:\n35 × 35 = ?', options: ['925', '1 025', '1 125', '1 225'], correct_index: 3, explanation: 'Mẹo với số tận cùng bằng 5: lấy chữ số đầu nhân với số liền sau nó rồi viết 25 vào cuối. 3 × 4 = 12, viết thêm 25 → 1 225.', question_speech: 'Tính nhanh: ba mươi lăm nhân ba mươi lăm bằng bao nhiêu?', explanation_speech: 'Mẹo với số tận cùng bằng năm: lấy chữ số đầu nhân với số liền sau nó rồi viết hai mươi lăm vào cuối. Ba nhân bốn bằng mười hai, viết thêm hai mươi lăm thành một nghìn hai trăm hai mươi lăm.' },
    { id: 'l5-3', question: 'Tính nhanh:\n65 × 65 = ?', options: ['3 625', '4 025', '4 225', '4 625'], correct_index: 2, explanation: 'Số tận cùng bằng 5: 6 × 7 = 42, viết thêm 25 vào cuối → 4 225.' },
    { id: 'tinh-nhanh-05', question: 'Tính nhanh:\n1 200 : 25 = ?', options: ['30', '48', '300', '480'], correct_index: 1, explanation: 'Nhân cả hai số với 4 thì thương không đổi: 1 200 × 4 = 4 800 và 25 × 4 = 100. Vậy phép tính thành 4 800 : 100 = 48.', question_speech: 'Tính nhanh: một nghìn hai trăm chia hai mươi lăm bằng bao nhiêu?', explanation_speech: 'Nhân cả hai số với bốn thì thương không đổi. Một nghìn hai trăm nhân bốn bằng bốn nghìn tám trăm, hai mươi lăm nhân bốn bằng một trăm. Vậy phép tính thành bốn nghìn tám trăm chia một trăm bằng bốn mươi tám.' },
    { id: 'l5-5', question: 'Tính nhanh:\n48 × 25 = ?', options: ['1 000', '1 200', '1 250', '2 400'], correct_index: 1, explanation: 'Nhân 25 là nhân 100 rồi chia 4: 48 : 4 = 12, rồi 12 × 100 = 1 200.' },
    { id: 'tinh-nhanh-08', question: 'Tính nhanh:\n125 × 8 × 7 = ?', options: ['5 600', '7 000', '7 500', '8 000'], correct_index: 1, explanation: 'Nhân 125 × 8 = 1 000 (số rất tròn) trước, rồi 1 000 × 7 = 7 000. Cặp 125 và 8 nên nhớ.', question_speech: 'Tính nhanh: một trăm hai mươi lăm nhân tám nhân bảy bằng bao nhiêu?', explanation_speech: 'Nhân một trăm hai mươi lăm với tám trước vì được một nghìn, một số rất tròn. Sau đó một nghìn nhân bảy bằng bảy nghìn.' },
    { id: 'l5-7', question: 'Tính nhanh:\n1 + 2 + 3 + ... + 10 = ?', options: ['45', '50', '55', '100'], correct_index: 2, explanation: 'Ghép cặp đầu–cuối: (1 + 10) = 11, (2 + 9) = 11… có 5 cặp, mỗi cặp 11 → 5 × 11 = 55.' },
    { id: 'tinh-nhanh-07', question: 'Tính nhanh:\n100 − 99 + 98 − 97 + ... + 2 − 1 = ?', options: ['0', '1', '50', '100'], correct_index: 2, explanation: 'Ghép từng cặp: (100 − 99) = 1, (98 − 97) = 1… Từ 1 đến 100 có 50 cặp nên kết quả là 50.', question_speech: 'Tính nhanh: một trăm trừ chín mươi chín cộng chín mươi tám trừ chín mươi bảy, cứ như vậy cho đến hai trừ một, bằng bao nhiêu?', explanation_speech: 'Ghép từng cặp. Một trăm trừ chín mươi chín bằng một, chín mươi tám trừ chín mươi bảy cũng bằng một. Từ một đến một trăm có năm mươi cặp như vậy nên kết quả là năm mươi.' },
  ],
};
