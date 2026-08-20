// Dữ liệu chuyên đề "Toán tư duy" lớp 1–5.
// CẤU TRÚC CHUẨN — câu hỏi thêm sau: chỉ cần đổ mảng vào `questions` của từng lớp,
// theo ĐÚNG format quiz đang dùng (question / options / correct_index / explanation +
// bản _speech cho TTS). Khi có câu hỏi, trang tự render + phát Quiz schema (hasPart).

export type TuDuyQuestion = {
  id: string;
  subject?: string;
  lesson?: string;
  question: string;
  question_speech?: string;
  options: string[];
  correct_index: number;
  countdown?: string[];
  explanation?: string;
  explanation_speech?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
};

export type TuDuyGrade = {
  grade: number;
  /** Mô tả unique cho SEO (2–3 câu). */
  intro: string;
  /** Các dạng bài toán tư duy của lớp — nội dung unique, hiển thị + dùng làm keyword. */
  topics: string[];
  faq: { q: string; a: string }[];
  /** Ngân hàng câu hỏi — ĐỔ VÀO SAU. */
  questions: TuDuyQuestion[];
};

export const GRADES = [1, 2, 3, 4, 5] as const;

export const TOAN_TU_DUY: Record<number, TuDuyGrade> = {
  1: {
    grade: 1,
    intro:
      'Toán tư duy lớp 1 giúp bé 6–7 tuổi làm quen với suy luận qua các bài đếm, so sánh, tìm quy luật và phân loại đơn giản. Bé học cách quan sát, phán đoán và giải thích lựa chọn của mình thay vì chỉ tính toán máy móc.',
    topics: [
      'Đếm và so sánh số lượng',
      'Tìm quy luật hình và màu sắc',
      'Ghép hình, xếp khối',
      'Phân loại theo đặc điểm',
      'Logic đơn giản (đúng – sai)',
      'Định hướng không gian: trái – phải, trên – dưới',
    ],
    faq: [
      { q: 'Toán tư duy lớp 1 học những gì?', a: 'Bé lớp 1 học đếm và so sánh, tìm quy luật hình – màu, ghép hình, phân loại và logic đơn giản — rèn khả năng quan sát và suy luận từ sớm.' },
      { q: 'Toán tư duy lớp 1 có khó không?', a: 'Không. Các bài được thiết kế nhẹ nhàng, nhiều hình ảnh trực quan, phù hợp bé 6–7 tuổi mới vào lớp 1, giúp bé thấy toán học thú vị.' },
      { q: 'Học toán tư duy sớm có lợi ích gì?', a: 'Giúp bé phát triển tư duy logic, khả năng quan sát và phán đoán, tạo nền tảng học toán vững vàng và tự tin hơn ở các lớp trên.' },
    ],
    questions: [
      {
        id: 'thu-thach-iq-lop-1-01',
        subject: 'THỬ THÁCH IQ|LỚP 1 - Toán tư duy',
        lesson: 'Toán tư duy',
        question: 'Trên cây có 3 con chim, bay đến thêm 2 con nữa.\nHỏi trên cây có tất cả mấy con chim?',
        question_speech: 'Trên cây có ba con chim, bay đến thêm hai con nữa. Hỏi trên cây có tất cả mấy con chim?',
        options: ['5 con', '4 con', '6 con', '3 con'],
        correct_index: 0,
        countdown: ['5', '4', '3', '2', '1'],
        explanation: 'Có 3 con chim, thêm 2 con nữa: 3 + 2 = 5. Vậy trên cây có 5 con chim.',
        explanation_speech: 'Ba con chim thêm hai con nữa là năm con. Vậy trên cây có năm con chim.',
      },
      {
        id: 'thu-thach-iq-lop-1-02',
        subject: 'THỬ THÁCH IQ|LỚP 1 - Toán tư duy',
        lesson: 'Toán tư duy',
        question: 'Số liền sau của số 9 là số nào?',
        question_speech: 'Số liền sau của số chín là số nào?',
        options: ['8', '9', '10', '11'],
        correct_index: 2,
        countdown: ['5', '4', '3', '2', '1'],
        explanation: 'Đếm tiếp sau 9 ta được 10. Vậy số liền sau của 9 là 10.',
        explanation_speech: 'Đếm tiếp sau chín ta được mười. Vậy số liền sau của chín là mười.',
      },
      {
        id: 'thu-thach-iq-lop-1-03',
        subject: 'THỬ THÁCH IQ|LỚP 1 - Toán tư duy',
        lesson: 'Toán tư duy',
        question: 'Trong các số 2, 4, 6, 7 số nào lớn nhất?',
        question_speech: 'Trong các số hai, bốn, sáu, bảy số nào lớn nhất?',
        options: ['2', '4', '6', '7'],
        correct_index: 3,
        countdown: ['5', '4', '3', '2', '1'],
        explanation: 'So sánh 2, 4, 6, 7 thì 7 là số lớn nhất.',
        explanation_speech: 'So sánh hai, bốn, sáu, bảy thì bảy là số lớn nhất.',
      },
      {
        id: 'thu-thach-iq-lop-1-04',
        subject: 'THỬ THÁCH IQ|LỚP 1 - Toán tư duy',
        lesson: 'Toán tư duy',
        question: 'Điền số còn thiếu vào dãy: 1, 2, 3, ?, 5',
        question_speech: 'Điền số còn thiếu vào dãy: một, hai, ba, dấu hỏi, năm.',
        options: ['3', '4', '5', '6'],
        correct_index: 1,
        countdown: ['5', '4', '3', '2', '1'],
        explanation: 'Dãy số đếm tăng dần từng 1 đơn vị: 1, 2, 3, 4, 5. Số còn thiếu là 4.',
        explanation_speech: 'Dãy số tăng dần từng một đơn vị: một, hai, ba, bốn, năm. Số còn thiếu là bốn.',
      },
      {
        id: 'thu-thach-iq-lop-1-05',
        subject: 'THỬ THÁCH IQ|LỚP 1 - Toán tư duy',
        lesson: 'Toán tư duy',
        question: 'Có 5 cái bánh, bé ăn 2 cái.\nHỏi còn lại mấy cái bánh?',
        question_speech: 'Có năm cái bánh, bé ăn hai cái. Hỏi còn lại mấy cái bánh?',
        options: ['1', '2', '3', '4'],
        correct_index: 2,
        countdown: ['5', '4', '3', '2', '1'],
        explanation: 'Còn lại bằng 5 trừ 2: 5 − 2 = 3. Vậy còn 3 cái bánh.',
        explanation_speech: 'Năm trừ hai bằng ba. Vậy còn ba cái bánh.',
      },
      {
        id: 'thu-thach-iq-lop-1-06',
        subject: 'THỬ THÁCH IQ|LỚP 1 - Toán tư duy',
        lesson: 'Toán tư duy',
        question: 'Một con gà có 2 chân.\nHỏi 3 con gà có bao nhiêu chân?',
        question_speech: 'Một con gà có hai chân. Hỏi ba con gà có bao nhiêu chân?',
        options: ['6', '5', '8', '4'],
        correct_index: 0,
        countdown: ['5', '4', '3', '2', '1'],
        explanation: 'Mỗi con 2 chân, 3 con là 2 + 2 + 2 = 6 chân.',
        explanation_speech: 'Mỗi con hai chân, ba con là hai cộng hai cộng hai bằng sáu chân.',
      },
      {
        id: 'thu-thach-iq-lop-1-07',
        subject: 'THỬ THÁCH IQ|LỚP 1 - Toán tư duy',
        lesson: 'Toán tư duy',
        question: 'Lan cao hơn Mai. Mai cao hơn Hoa.\nHỏi ai thấp nhất?',
        question_speech: 'Lan cao hơn Mai. Mai cao hơn Hoa. Hỏi ai thấp nhất?',
        options: ['Lan', 'Mai', 'Hoa', 'Không rõ'],
        correct_index: 2,
        countdown: ['5', '4', '3', '2', '1'],
        explanation: 'Lan cao hơn Mai, Mai cao hơn Hoa nên Hoa thấp nhất.',
        explanation_speech: 'Lan cao hơn Mai, Mai cao hơn Hoa, nên Hoa là người thấp nhất.',
      },
      {
        id: 'thu-thach-iq-lop-1-08',
        subject: 'THỬ THÁCH IQ|LỚP 1 - Toán tư duy',
        lesson: 'Toán tư duy',
        question: 'Dãy màu lặp lại: đỏ, xanh, đỏ, xanh, đỏ, …\nHỏi màu tiếp theo là màu gì?',
        question_speech: 'Dãy màu lặp lại: đỏ, xanh, đỏ, xanh, đỏ. Hỏi màu tiếp theo là màu gì?',
        options: ['Đỏ', 'Xanh', 'Vàng', 'Tím'],
        correct_index: 1,
        countdown: ['5', '4', '3', '2', '1'],
        explanation: 'Quy luật là đỏ rồi xanh xen kẽ. Sau màu đỏ sẽ đến màu xanh.',
        explanation_speech: 'Quy luật là đỏ rồi xanh xen kẽ nhau. Sau màu đỏ sẽ đến màu xanh.',
      },
      {
        id: 'thu-thach-iq-lop-1-09',
        subject: 'THỬ THÁCH IQ|LỚP 1 - Toán tư duy',
        lesson: 'Toán tư duy',
        question: 'Điền số còn thiếu vào dãy: 2, 4, 6, ?, 10',
        question_speech: 'Điền số còn thiếu vào dãy: hai, bốn, sáu, dấu hỏi, mười.',
        options: ['5', '6', '7', '8'],
        correct_index: 3,
        countdown: ['5', '4', '3', '2', '1'],
        explanation: 'Dãy số tăng dần từng 2 đơn vị: 2, 4, 6, 8, 10. Số còn thiếu là 8.',
        explanation_speech: 'Dãy số tăng dần từng hai đơn vị: hai, bốn, sáu, tám, mười. Số còn thiếu là tám.',
      },
      {
        id: 'thu-thach-iq-lop-1-10',
        subject: 'THỬ THÁCH IQ|LỚP 1 - Toán tư duy',
        lesson: 'Toán tư duy',
        question: 'Bé có 4 viên bi xanh và 3 viên bi đỏ.\nBé cho bạn 2 viên.\nHỏi bé còn lại mấy viên bi?',
        question_speech: 'Bé có bốn viên bi xanh và ba viên bi đỏ. Bé cho bạn hai viên. Hỏi bé còn lại mấy viên bi?',
        options: ['4', '5', '6', '7'],
        correct_index: 1,
        countdown: ['5', '4', '3', '2', '1'],
        explanation: 'Bé có tất cả 4 + 3 = 7 viên. Cho bạn 2 viên còn 7 − 2 = 5 viên.',
        explanation_speech: 'Bé có tất cả bốn cộng ba bằng bảy viên. Cho bạn hai viên, còn bảy trừ hai bằng năm viên.',
      },
    ],
  },
  2: {
    grade: 2,
    intro:
      'Toán tư duy lớp 2 mở rộng suy luận với dãy số theo quy luật, phép cộng – trừ có lời văn, đếm hình và các bài logic. Bé tập phân tích đề bài, tìm mối liên hệ và trình bày cách giải rõ ràng.',
    topics: [
      'Dãy số theo quy luật',
      'Phép cộng, trừ có suy luận',
      'Đếm hình (tam giác, hình vuông)',
      'Bài toán logic đơn giản',
      'Tìm số còn thiếu',
      'Suy luận về tuổi, nhiều hơn – ít hơn',
    ],
    faq: [
      { q: 'Toán tư duy lớp 2 gồm những dạng nào?', a: 'Gồm dãy số quy luật, cộng trừ có suy luận, đếm hình, tìm số còn thiếu và các bài logic về tuổi, nhiều hơn – ít hơn.' },
      { q: 'Làm sao giúp bé lớp 2 học toán tư duy hiệu quả?', a: 'Cho bé đọc kỹ đề, vẽ hình hoặc liệt kê trường hợp, và giải thích tại sao chọn đáp án đó — hiểu bản chất thay vì học vẹt.' },
      { q: 'Toán tư duy khác gì toán trên lớp?', a: 'Toán tư duy nhấn vào suy luận và cách nghĩ, thường có nhiều cách tiếp cận, giúp bé linh hoạt hơn so với việc chỉ áp dụng công thức.' },
    ],
    questions: [],
  },
  3: {
    grade: 3,
    intro:
      'Toán tư duy lớp 3 đưa bé đến các bài toán nhân – chia có suy luận, trồng cây, dãy số và logic loại trừ. Bé rèn khả năng lập luận theo nhiều bước và kiểm tra lại kết quả.',
    topics: [
      'Phép nhân, chia có suy luận',
      'Bài toán trồng cây, khoảng cách',
      'Dãy số và quy luật',
      'Suy luận logic (phương pháp loại trừ)',
      'Đếm hình và hình học',
      'Bài toán về thời gian, lịch',
    ],
    faq: [
      { q: 'Toán tư duy lớp 3 học gì?', a: 'Bé học nhân chia có suy luận, bài toán trồng cây, dãy số, suy luận loại trừ, đếm hình và bài toán thời gian – lịch.' },
      { q: 'Bài toán trồng cây là gì?', a: 'Là dạng toán tính số cây (hoặc cọc, đèn…) trồng trên đoạn đường theo khoảng cách — kinh điển trong toán tư duy lớp 3, rèn cách suy luận về khoảng và số điểm.' },
      { q: 'Bé cần chuẩn bị gì để học tốt?', a: 'Nắm chắc bảng cửu chương và phép nhân chia cơ bản, sau đó luyện đọc – phân tích đề để chọn cách giải phù hợp.' },
    ],
    questions: [],
  },
  4: {
    grade: 4,
    intro:
      'Toán tư duy lớp 4 tập trung vào các bài toán tổng – hiệu, tổng – tỉ, dãy số cách đều và suy luận logic nâng cao. Bé học cách đặt bài toán về dạng quen thuộc và giải bằng sơ đồ, lập luận.',
    topics: [
      'Tìm hai số khi biết tổng và hiệu',
      'Tìm hai số khi biết tổng và tỉ',
      'Dãy số cách đều',
      'Suy luận logic nâng cao',
      'Chu vi, diện tích theo tư duy',
      'Bài toán tính ngược',
    ],
    faq: [
      { q: 'Toán tư duy lớp 4 gồm dạng bài nào?', a: 'Gồm tổng – hiệu, tổng – tỉ, dãy số cách đều, suy luận logic nâng cao, chu vi – diện tích tư duy và bài toán tính ngược.' },
      { q: 'Vẽ sơ đồ đoạn thẳng có giúp ích không?', a: 'Rất hữu ích. Sơ đồ đoạn thẳng giúp bé nhìn rõ mối quan hệ tổng – hiệu – tỉ và tìm ra lời giải nhanh, chính xác.' },
      { q: 'Học toán tư duy lớp 4 để làm gì?', a: 'Giúp bé làm chủ các dạng toán điển hình, chuẩn bị cho kiểm tra, thi học sinh giỏi và tạo nền tảng cho toán lớp 5.' },
    ],
    questions: [],
  },
  5: {
    grade: 5,
    intro:
      'Toán tư duy lớp 5 nâng cao với toán chuyển động, tỉ số phần trăm, phân số và hình học nâng cao. Bé rèn tư duy phân tích, tổng hợp và giải các bài toán nhiều bước — hành trang vững cho bậc THCS.',
    topics: [
      'Toán chuyển động (vận tốc, quãng đường, thời gian)',
      'Tỉ số phần trăm theo tư duy',
      'Phân số và bài toán tỉ lệ',
      'Suy luận logic nâng cao',
      'Hình học nâng cao (diện tích, thể tích)',
      'Bài toán cổ, bài toán dân gian',
    ],
    faq: [
      { q: 'Toán tư duy lớp 5 học những gì?', a: 'Bé học toán chuyển động, tỉ số phần trăm, phân số – tỉ lệ, suy luận nâng cao, hình học nâng cao và các bài toán cổ.' },
      { q: 'Toán tư duy lớp 5 có giúp thi vào lớp 6 không?', a: 'Có. Nhiều dạng bài tư duy lớp 5 xuất hiện trong đề khảo sát và thi vào lớp 6 chất lượng cao, nên luyện tập sớm rất có lợi.' },
      { q: 'Làm sao để bé giải nhanh bài nhiều bước?', a: 'Tập tóm tắt đề, chia bài toán thành các bước nhỏ, và luôn kiểm tra lại kết quả bằng cách thử hoặc ước lượng.' },
    ],
    questions: [],
  },
};

export function getTuDuyGrade(grade: number): TuDuyGrade | null {
  return TOAN_TU_DUY[grade] ?? null;
}
