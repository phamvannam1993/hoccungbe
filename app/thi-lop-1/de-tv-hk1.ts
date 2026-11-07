// 23 đề Kiểm tra học kì I môn Tiếng Việt lớp 1 — chép từ "23 ĐỀ TIẾNG VIỆT K1 LỚP 1.pdf" (Gv Lưu Trinh).
// Đề 1–10 bản thiết kế có tranh, Đề 11–23 bản Word. Tranh cắt từ bản scan (public/thi-lop-1/tv).
// Phần đọc thành tiếng, chính tả, tập chép và câu viết tự do giữ nguyên trên tờ đề nhưng không chấm trên máy
// (diem 0) — máy chỉ chấm phần đọc hiểu và bài tập có đáp án xác định.
// Đã sửa lỗi in trong đề: "Dì Lâm" → "dì Ly" (Đề 14), "bố mệ" → "bố mẹ", "bawfmg" → "bằng" (Đề 21)…
// Bỏ 2 ô không xác định được đáp án: "ng…… sừng" (Đề 20) và "cái ……ế" (Đề 23, không điền được ng/ngh).

import type { RawBai, RawBlock, RawPhieu } from './kieu';

const I = (n: string) => `tv/${n}`;
/** Ô chọn âm/vần/dấu: [[t:đáp án/lựa chọn 1,lựa chọn 2]] */
const t = (ans: string, opts: string[]) => `[[t:${ans}/${opts.join(',')}]]`;
/** Ô gõ chữ: nhiều đáp án ngăn bằng "|", "~x" = chứa x */
const w = (...ans: string[]) => `[[w:${ans.join('|')}]]`;
const DAU = ['sắc', 'huyền', 'hỏi', 'ngã', 'nặng'];

const docTo = (o: string[]): RawBlock => ({ t: 'grid', border: true, rows: [o.slice(0, 4), o.slice(4, 8), o.slice(8, 12)] });
const doan = (ten: string, noi: string): RawBlock[] => [{ t: 'text', text: ten, center: true }, { t: 'text', text: noi }];
const mc = (q: string, opts: string[], ans: string, cols?: number): RawBlock => ({ t: 'mc', q, opts, ans, cols: cols ?? (opts.some((o) => o.length > 22) ? 1 : Math.min(opts.length, 4)) });
/** Nối cột A → cột B: `dung[i]` là chỉ số ô B nối với ô A thứ i. */
const noi = (a: string[], b: string[], dung: number[]): RawBlock => ({ t: 'match', layout: 'cols', top: a.map((text) => ({ text })), bottom: b.map((text) => ({ text })), pairs: dung, topShape: 'box', bottomShape: 'box' });
const noiTranh = (a: string[], tranh: string[], dung: string[]): RawBlock => ({ t: 'match', layout: 'cols', top: a.map((text) => ({ text })), bottom: tranh.map((img) => ({ img: I(img) })), pairs: dung.map((d) => tranh.indexOf(d)), topShape: 'word' });
const the = (cols: number, items: [string, string][]): RawBlock => ({ t: 'cards', cols, items: items.map(([img, word]) => ({ img: I(img), word })) });
const viet = (dong: number, mau?: string, cursive = false): RawBlock => ({ t: 'viet', dong, mau, cursive });
const khong = (title: string, blocks: RawBlock[]): RawBai => ({ title, diem: 0, blocks });
const bai = (title: string, blocks: RawBlock[]): RawBai => ({ title, blocks });

const DOC_THAM: RawBai = khong('1. Kiểm tra đọc thành tiếng (7 điểm) — giáo viên / phụ huynh nghe bé đọc', [
  { t: 'text', italic: true, text: 'Bé đọc một đoạn văn ngắn ngoài sách giáo khoa do người lớn chọn, rồi trả lời 1 câu hỏi về nội dung đoạn đọc.' },
]);
const chinhTa = (diem: number, mau: string): RawBai => khong(`Chính tả (${diem} điểm) — người lớn đọc cho bé chép`, [viet(Math.max(3, Math.ceil(mau.length / 70) + 1), mau)]);

/* ───────────── Đề 1–10 (mẫu có tranh) ───────────── */

const thietKe = (n: number, desc: string, bai_: RawBai[]): RawPhieu => ({
  slug: `tieng-viet-hk1-de-${n}`,
  title: `Kiểm tra học kì 1 – Tiếng Việt lớp 1 – Đề ${n}`,
  description: desc,
  mon: 'tieng-viet',
  kieu: 'tv-hk1',
  head: [`ĐỀ ${n}`, 'KIỂM TRA HỌC KÌ I MÔN TIẾNG VIỆT'],
  thoiGian: 40,
  phan: { 0: 'I. Đọc thành tiếng', 1: 'II. Đọc hiểu', [bai_.findIndex((b) => b.title.startsWith('Viết:'))]: 'III. Viết' },
  bai: bai_.map((b) => ({ ...b, title: b.title.replace(/^Viết: /, '') })),
});
const docThanhTieng = (o: string[], ten: string, noiDung: string, img?: string): RawBai =>
  khong('a. Đọc thành tiếng các ô chữ (khoảng 1 phút) · b. Đọc thành tiếng đoạn văn (khoảng 2 phút)', [
    docTo(o),
    img ? { t: 'row', widths: ['3fr', '2fr'], cols: [doan(ten, noiDung), [{ t: 'img', src: I(img), w: 260 }]] } : { t: 'row', cols: [doan(ten, noiDung)] },
  ]);

const DE_1_10: RawPhieu[] = [
  thietKe(1, 'Đọc "Bà ốm", nối câu, đọc và nối từ với tranh, điền um/up, tập chép.', [
    docThanhTieng(['trong vắt', 'giọt sương', 'ruộng vườn', 'hạt ngọc', 'con chuột', 'miếng thịt', 'tia nắng', 'đất nung', 'chăn bông', 'vùn vụt', 'nóng nực', 'eng éc'], 'Bà ốm', 'Bà ốm đã ba hôm. Mẹ nghỉ làm để chăm bà. Có đêm, mẹ chả ngủ. Bé lo vì chưa đỡ gì cho mẹ. Mẹ ôm bé thủ thỉ: “Bé chăm chỉ là bà đỡ ốm!”'),
    bai('Câu 1. Dựa vào nội dung ở bài đọc ở phần I, em hãy nối đúng:', [noi(['Mẹ', 'Bà', 'Bé'], ['ốm đã ba hôm.', 'nghỉ làm để chăm bà.', 'lo vì chưa đỡ gì cho mẹ.'], [1, 0, 2])]),
    bai('Câu 2. * Khoanh tròn chữ cái trước ý đúng:', [{ t: 'row', cols: [[mc('1. Bà ốm đã mấy hôm?', ['bốn hôm', 'ba hôm'], 'ba hôm', 1)], [mc('2. Bé lo điều gì?', ['bà ốm nặng', 'chưa đỡ gì cho mẹ'], 'chưa đỡ gì cho mẹ', 1)]] }]),
    bai('Câu 3. Đọc và nối đúng', [noiTranh(['chiếc lược', 'hộp bút', 'sút bóng', 'ruộng ngô', 'khăn quàng'], ['tv1-bong', 'tv1-luoc', 'tv1-khan', 'tv1-hopbut', 'tv1-ngo'], ['tv1-luoc', 'tv1-hopbut', 'tv1-bong', 'tv1-ngo', 'tv1-khan'])]),
    bai('Viết: Câu 1. Điền um hay up', [{ t: 'lines', cols: 2, items: [`tôm h${t('ùm', ['ùm', 'ụp'])}`, `b${t('úp', ['úm', 'úp'])} sen`] }]),
    khong('Câu 2. Tập chép', [viet(2, 'Hương lúa thơm ngát.', true)]),
  ]),
  thietKe(2, 'Đọc bài thơ "Bé vẽ", trắc nghiệm, đúng – sai, nối thành từ, điền om/ôm/am/âm, tập chép.', [
    docThanhTieng(['nhổ cỏ', 'que kem', 'ruộng vườn', 'chả cốm', 'cờ đỏ', 'gà mơ', 'hộp quà', 'đất nung', 'chăn bông', 'thỏ thẻ', 'nóng nực', 'diếp cá'], 'Bé vẽ', 'Bé ngồi vẽ\nCái nhà to\nKề bậc cửa\nBác ốc bò\nChú chó mực\nNhắc gâu gâu\nChắc chú giục\nĐi học mau.\n            Lê Hải', 'tv2-beve'),
    bai('Câu 1. * Khoanh tròn chữ cái trước ý đúng:', [mc('1. Bài đọc Bé vẽ có xuất hiện bao nhiêu tiếng có vần âu?', ['1', '2', '3'], '2'), mc('2. Bé vẽ những con vật nào?', ['bác ốc bò', 'chú chó mực', 'Cả a và b'], 'Cả a và b')]),
    bai('Câu 2. Dựa vào nội dung ở bài đọc ở phần I, em hãy chọn Đúng (Đ) hay Sai (S):', [{ t: 'lines', items: ['Bé ngồi vẽ cái nhà to, kề bậc cửa.  [[D:Đ]]', 'Chú chó mực nhắc gâu gâu, đi ngủ mau.  [[D:S]]'] }]),
    bai('Câu 3. Đọc và nối đúng (ghép thành từ)', [noi(['nhà', 'làng', 'ca', 'miền', 'lần', 'khu'], ['quê', 'Bắc', 'vườn', 'tầng', 'lượt', 'nhạc'], [3, 0, 5, 1, 4, 2])]),
    bai('Viết: Câu 1. Điền vào chỗ chấm: om, ôm, am, âm', [the(4, [['tv2-cam', `quả c${t('am', ['om', 'ôm', 'am', 'âm'])}`], ['tv2-chom', `quả ch${t('ôm', ['om', 'ôm', 'am', 'âm'])}ch${t('ôm', ['om', 'ôm', 'am', 'âm'])}`], ['tv2-nhom', `học nh${t('óm', ['óm', 'ốm', 'ám', 'ấm'])}`], ['tv2-nam', `n${t('ấm', ['óm', 'ốm', 'ám', 'ấm'])} rơm`]])]),
    khong('Câu 2. Tập chép', [viet(2, 'Khu vườn nắng sớm.', true)]),
  ]),
  thietKe(3, 'Đọc "Gà mơ và chó xù", nối câu, tìm vần iêp/ep, điền c/k, oa/oe, ươn/ương, tập chép.', [
    docThanhTieng(['phép chia', 'chiêm chiếp', 'thềm nhà', 'ấm áp', 'nằm nghỉ', 'ngựa đua', 'số tám', 'nơm nớp', 'làm đẹp', 'tập võ', 'chim sẻ', 'lom khom'], 'Gà mơ và chó xù', 'Gà Mơ rất chăm làm, lo cho lũ gà nhép. Chó Xù chỉ la cà chỗ nọ, chỗ kia, sủa ầm ĩ. Lũ gà nhép sợ lắm, la: “Chiếp chiếp”. Gà Mơ góp ý: “Chó Xù đùa thế là hư, làm lũ nhỏ nhà chị sợ khiếp vía!”'),
    bai('Câu 1. Dựa vào nội dung ở bài đọc ở phần I, em hãy nối đúng:', [noi(['Gà Mơ', 'Chó Xù'], ['la cà chỗ nọ chỗ kia, sủa ầm ĩ.', 'rất chăm làm, lo cho lũ gà nhép.'], [1, 0])]),
    bai('Câu 2. * Khoanh tròn chữ cái trước ý đúng:', [
      mc('a. Bài đọc Gà Mơ và Chó Xù có xuất hiện bao nhiêu tiếng có vần iêp?', ['1', '2', '3'], '3'),
      { t: 'lines', items: [`b. Viết lại các tiếng trong bài — Tiếng có vần iêp: ${w('chiếp', 'khiếp')}  ${w('khiếp', 'chiếp')}`, `Tiếng có vần ep: ${w('nhép')}`] },
    ]),
    bai('Viết: Câu 1. Điền vào chỗ chấm: c hay k', [{ t: 'lines', cols: 3, items: [`${t('c', ['c', 'k'])}ửa hàng`, `cửa ${t('k', ['c', 'k'])}ính`, `${t('c', ['c', 'k'])}ủ điện`, `dòng ${t('k', ['c', 'k'])}ẻ`, `${t('c', ['c', 'k'])}on đường`, `cái ${t('c', ['c', 'k'])}ưa`] }]),
    bai('Câu 2. Điền tiếng chứa vần thích hợp vào chỗ trống: a) vần oa hoặc oe · b) vần ươn hoặc ương', [
      the(2, [['tv3-hong', `Tôi trồng một cây ${w('hoa')} hồng.`], ['tv3-choe', `Tiếng hót của chích ${w('chòe', 'choè')} vang xa.`], ['tv3-phuong', `Hè về, hoa ${w('phượng')} nở đỏ rực khu phố.`], ['tv3-vuon', `${w('Vườn')} nhà bà có rất nhiều cây.`]]),
    ]),
    khong('Câu 3. Tập chép', [viet(2, 'Trong đầm gì đẹp bằng sen\nLá xanh bông trắng lại chen nhị vàng.', true)]),
  ]),
  thietKe(4, 'Đọc bài thơ "Con chim sẻ", nối câu, tìm vần ep/êp, điền g/gh, iên/iêc, ung/ưng, tập chép.', [
    docThanhTieng(['cái gương', 'cây đào', 'muôn loài', 'buổi sáng', 'ghi bài', 'mùa xuân', 'cành cây', 'chim sẻ', 'làm đẹp', 'góc vườn', 'chim sẻ', 'chích chòe'], 'Con chim sẻ', 'Con chim se sẻ\nNó ăn gạo tẻ\nNó hót líu lo\nNó ăn hạt ngô\nNó kêu lép nhép\nNó ăn gạo nếp\nNó vãi ra sân\nXua con chim sẻ.', 'tv4-chimse'),
    bai('Câu 1. Dựa vào nội dung ở bài đọc ở phần I, em hãy nối đúng:', [noi(['Chim sẻ ăn', 'Chim sẻ kêu'], ['lép nhép.', 'gạo tẻ, gạo nếp.'], [1, 0])]),
    bai('Câu 2. * Khoanh tròn chữ cái trước ý đúng:', [
      mc('a. Bài đọc Con chim sẻ có xuất hiện bao nhiêu tiếng có vần ao?', ['1', '2', '3'], '2'),
      { t: 'lines', items: [`b. Viết lại các tiếng trong bài — Tiếng có vần ep: ${w('lép', 'nhép')}  ${w('nhép', 'lép')}`, `Tiếng có vần êp: ${w('nếp')}`] },
    ]),
    bai('Viết: Câu 1. Điền vào chỗ chấm: g hay gh?', [{ t: 'lines', cols: 3, items: [`${t('g', ['g', 'gh'])}õ trống`, `cái ${t('gh', ['g', 'gh'])}ế`, `${t('g', ['g', 'gh'])}à trống`, `${t('g', ['g', 'gh'])}ọn ${t('g', ['g', 'gh'])}àng`, `${t('gh', ['g', 'gh'])}i bài`, `${t('g', ['g', 'gh'])}ầy ${t('g', ['g', 'gh'])}ò`] }]),
    bai('Câu 2. Điền vần thích hợp vào chỗ trống: iên, iêc, ung, ưng', [{ t: 'lines', cols: 2, items: [`Hôm nay em đi xem x${t('iếc', ['iến', 'iếc'])}`, `Đàn k${t('iến', ['iến', 'iếc'])} rất chăm chỉ`, `Chúc m${t('ừng', ['ùng', 'ừng'])} năm mới`, `Tr${t('ung', ['ung', 'ưng'])} thu của bé`] }]),
    khong('Câu 3. Tập chép', [viet(2, 'Trong veo hạt nắng trên cành\nLá biêng biếc những âm thanh gọi mời.', true)]),
  ]),
  thietKe(5, 'Đọc "Đi học", nối câu, đếm vần ân, điền ơn/ơt/uôn/uôt, giải câu đố, tập chép.', [
    docThanhTieng(['cái gương', 'cây đào', 'muôn loài', 'buổi sáng', 'ghi bài', 'mùa xuân', 'cành cây', 'chim sẻ', 'làm đẹp', 'góc vườn', 'chim sẻ', 'chích chòe'], 'Đi học', 'Thỏ Ngọc gặp sóc đi học. Sóc ôm một quả bóng to. Sóc rủ Thỏ Ngọc nghỉ chân để đá bóng. Thỏ Ngọc đáp: “Đang đi học chớ đá bóng. Bố mẹ sẽ không yên tâm khi tớ tự đi học”.\nNghe xong, Sóc chợt nhớ cô Sơn Ca luôn dặn: “Chỉ nên đá bóng ở sân”.'),
    bai('Câu 1. Dựa vào nội dung ở bài đọc ở phần I, em hãy nối đúng:', [noi(['Sóc rủ Thỏ Ngọc', 'Thỏ Ngọc đáp'], ['đi học sớm.', 'nghỉ chân đá bóng.', 'chỉ nên đá bóng ở sân.', 'đang đi học chớ đá bóng.'], [1, 3])]),
    bai('Câu 2. * Khoanh tròn chữ cái trước ý đúng:', [mc('Bài đọc Đi học có xuất hiện bao nhiêu tiếng có vần ân?', ['1', '2', '3'], '2')]),
    bai('Viết: Câu 1. Điền đúng vần: ơn, ơt, uôn, uôt', [the(4, [['tv5-ot', `quả ${t('ớt', ['ớn', 'ớt', 'uốn', 'uốt'])}`], ['tv5-chuot', `ch${t('uột', ['ợn', 'ợt', 'uộn', 'uột'])} nhắt`], ['tv5-lon', `con l${t('ợn', ['ợn', 'ợt', 'uộn', 'uột'])}`], ['tv5-len', `c${t('uộn', ['ợn', 'ợt', 'uộn', 'uột'])} len`]])]),
    bai('Câu 2. Điền chữ óng, thẳng, hồng thích hợp vào chỗ chấm và giải câu đố:', [
      { t: 'row', widths: ['3fr', '2fr'], cols: [[{ t: 'lines', items: [`Con gì lông ${t('óng', ['óng', 'thẳng', 'hồng'])} mượt`, `Mắt đen, mép đỏ ${t('hồng', ['óng', 'thẳng', 'hồng'])}`, 'Chỉ vì chưa chăm chỉ', 'Thua rùa khi đi thi?', `(Là con ${w('thỏ')})`] }], [{ t: 'img', src: I('tv5-tho'), w: 220 }]] },
      { t: 'row', widths: ['3fr', '2fr'], cols: [[{ t: 'lines', items: [`Thân ${t('thẳng', ['óng', 'thẳng', 'hồng'])} ruột bằng`, 'Vẽ gió vẽ trăng', 'Mòn thì em gọt.', `(Là cái ${w('bút chì', 'bút', 'bút chì gỗ')})`] }], [{ t: 'img', src: I('tv5-but'), w: 200 }]] },
    ]),
    khong('Câu 3. Tập chép', [viet(2, 'Một cây làm chẳng nên non\nBa cây chụm lại nên hòn núi cao.', true)]),
  ]),
  thietKe(6, 'Đọc "Đi đò", nối câu, trắc nghiệm, điền ươn/ang/ăng/ac, giải câu đố, tập chép.', [
    docThanhTieng(['vầng trăng', 'nhảy dây', 'nắng vàng', 'múa sạp', 'khu vườn', 'yên tâm', 'chang chang', 'quả trứng', 'đá bóng', 'sơn ca', 'vở vẽ', 'gặp gỡ'], 'Đi đò', 'Chó và khỉ đi đò. Đò đi khắp chỗ mà khỉ chả ngắm gì. Nó chỉ ngủ thôi. Đò sắp vào bờ.\nChó thỏ thẻ:\n- Tớ có cam và dứa cho khỉ. Khỉ ngủ tớ cho mèo nhé!\nKhỉ bỏ cả ngủ:\n- Quả gì thế? Cho tớ đi!'),
    bai('Câu 1. Dựa vào nội dung ở bài đọc ở phần I, em hãy nối đúng:', [noi(['Chó và khỉ', 'Chó có quả'], ['đi xe đạp', 'đi đò', 'cam, dừa', 'cam, dứa'], [1, 3])]),
    bai('Câu 2. * Khoanh tròn chữ cái trước ý đúng:', [mc('Chó thỏ thẻ sẽ cho khỉ…..', ['cam', 'đu đủ', 'cam, dứa'], 'cam, dứa'), mc('Nghe chó kể có quà, khỉ……', ['ngủ say', 'bỏ cả ngủ', 'buồn ngủ'], 'bỏ cả ngủ')]),
    bai('Viết: Câu 1. Điền đúng vần: ươn, ang, ăng, ac', [the(4, [['tv6-vuon', `khu v${t('ườn', ['ườn', 'àng', 'ằng', 'ạc'])}`], ['tv6-nang', `tia n${t('ắng', ['ướn', 'áng', 'ắng', 'ác'])}`], ['tv6-lang', `xóm l${t('àng', ['ườn', 'àng', 'ằng', 'ạc'])}`], ['tv6-hoptac', `hợp t${t('ác', ['ướn', 'áng', 'ắng', 'ác'])}`]])]),
    bai('Câu 2. Điền chữ vàng vàng, mang, nắng thích hợp vào chỗ chấm và giải câu đố:', [
      { t: 'row', widths: ['3fr', '2fr'], cols: [[{ t: 'lines', items: ['Con gì chân ngắn', 'Bàn chân có màng', `Mỏ bẹt ${t('vàng vàng', ['vàng vàng', 'mang', 'nắng'])}`, 'Mồm la cạp cạp?', `(Là con ${w('vịt')})`] }], [{ t: 'img', src: I('tv6-vit'), w: 180 }]] },
      { t: 'row', widths: ['3fr', '2fr'], cols: [[{ t: 'lines', items: [`Mùa gì cứ ${t('nắng', ['vàng vàng', 'mang', 'nắng'])} chang chang`, `Đi về em nhớ phải ${t('mang', ['vàng vàng', 'mang', 'nắng'])} mũ nón?`, `(Là mùa ${w('hè', 'hạ', 'mùa hè')})`] }], [{ t: 'img', src: I('tv6-troi'), w: 170 }]] },
    ]),
    khong('Câu 3. Tập chép', [viet(2, 'Bầu ơi thương lấy bí cùng\nTuy rằng khác giống nhưng chung một giàn.', true)]),
  ]),
  thietKe(7, 'Đọc "Đón Tết", nối câu, đếm vần ưt/on, điền in/iên, giải câu đố, tập chép.', [
    docThanhTieng(['xem phim', 'que diêm', 'cồn cát', 'đơn ca', 'nhóm lửa', 'nắp ấm', 'bún chả', 'số hai', 'nhà bếp', 'thủ thỉ', 'bút bi', 'mứt tết'], 'Đón Tết', 'Sắp đến Tết, mẹ làm mứt cà rốt, mứt dừa để bố và Liên đón tiếp bạn bè. Liên giúp mẹ chọn cà rốt, gọt vỏ, rửa sạch và đun bếp. Cả nhà chờ món mứt thơm ngon. Vậy là Tết này cả nhà đã có món ngon để mời khách.'),
    bai('Câu 1. Dựa vào nội dung ở bài đọc ở phần I, em hãy nối đúng:', [noi(['Mẹ làm', 'Liên giúp mẹ'], ['mứt cà rốt, bí đỏ.', 'mứt cà rốt, dừa.', 'chọn cà rốt, gọt vỏ, rửa sạch.', 'chọn cà rốt, gọt vỏ, rửa sạch, đun bếp.'], [1, 3])]),
    bai('Câu 2. * Khoanh tròn chữ cái trước ý đúng (đếm trong đoạn văn, không tính tên bài):', [mc('a. Bài đọc Đón Tết có xuất hiện bao nhiêu tiếng có vần ưt?', ['1', '2', '3'], '3'), mc('b. Bài đọc Đón Tết có xuất hiện bao nhiêu tiếng có vần on?', ['5', '6', '7'], '6')]),
    bai('Viết: Câu 1. Điền đúng vần: in hoặc iên', [{ t: 'lines', cols: 3, items: [`che k${t('ín', ['ín', 'iến'])}`, `con k${t('iến', ['ín', 'iến'])}`, `b${t('iến', ['ín', 'iến'])} mất`] }]),
    bai('Câu 2. Điền chữ biết, tròn thích hợp vào chỗ chấm và giải câu đố:', [
      { t: 'row', widths: ['3fr', '2fr'], cols: [[{ t: 'lines', items: ['Con gì liếp chiếp, lon chon', `Nhìn xa như quả thị tròn ${t('biết', ['biết', 'tròn'])} đi?`, `(Là con ${w('gà con', 'gà', 'vịt', 'vịt con')})`] }], [{ t: 'img', src: I('tv7-ga'), w: 150 }]] },
      { t: 'row', widths: ['3fr', '2fr'], cols: [[{ t: 'lines', items: ['Cà gì chín đỏ', `Chứa trăm hạt ${t('tròn', ['biết', 'tròn'])}`, 'Vị ăn chua ngon', 'Cả nhà khen ngọt?', `(Là quả ${w('cà chua')})`] }], [{ t: 'img', src: I('tv7-cachua'), w: 170 }]] },
    ]),
    khong('Câu 3. Tập chép', [viet(2, 'Trẻ em như búp trên cành\nBiết ăn biết ngủ biết học hành là ngoan.', true)]),
  ]),
  thietKe(8, 'Đọc "Chú mèo Min", nối câu, trắc nghiệm, nối từ, điền uông/uôn, giải câu đố, tập chép.', [
    docThanhTieng(['quả thông', 'thợ mộc', 'búp măng', 'giàn mướp', 'số năm', 'con công', 'lồng chim', 'mùa thu', 'nhà tầng', 'tiến bộ', 'mặt biển', 'làng xóm'], 'Chú mèo Min', 'Min có bộ lông trắng muốt, luôn chải chuốt. Cái đầu chú tròn tròn như trái bóng con. Hai mắt xanh lè, long lanh như hai hòn bi ve. Đôi tai mỏng và vểnh lên như hai hình tam giác. Trời nắng đẹp, Min tìm chỗ ngồi sưởi nắng, rồi đưa hai cái chân lên liếm láp. Chú thật đáng yêu.'),
    bai('Câu 1. Dựa vào nội dung ở bài đọc ở phần I, em hãy nối đúng:', [noi(['Bộ lông của Min', 'Cái đầu tròn tròn'], ['màu trắng muốt.', 'màu vàng nhạt.', 'như cuộn len.', 'như trái bóng con.'], [0, 3])]),
    bai('Câu 2. * Khoanh tròn chữ cái trước ý đúng:', [mc('Trời nắng đẹp, Min……', ['đi bắt chuột', 'dạo chơi', 'sưởi nắng'], 'sưởi nắng'), mc('Đôi tai chú mèo Min như…', ['hình vuông', 'hình tròn', 'hình tam giác'], 'hình tam giác')]),
    bai('Viết: Câu 1. Nối đúng rồi viết lại từ ngữ', [noi(['ca', 'nhà'], ['tầng', 'nhạc'], [1, 0]), viet(2)]),
    bai('Câu 2. Chọn vần thích hợp điền vào chỗ trống: uông, uôn', [{ t: 'lines', cols: 2, items: [`Cửa hàng này làm bánh c${t('uốn', ['uống', 'uốn'])} rất ngon.`, `Đây là hình v${t('uông', ['uông', 'uôn'])}.`] }]),
    bai('Câu 3. Điền chữ ruột, hương thích hợp vào chỗ chấm và giải câu đố:', [
      { t: 'row', widths: ['3fr', '2fr'], cols: [[{ t: 'lines', items: ['Da thì da cóc', `Trong ${t('ruột', ['ruột', 'hương'])} có vàng`, `Gió đưa ${t('hương', ['ruột', 'hương'])} thơm`, 'Mang đi khắp xóm.', `(Là quả ${w('mít')})`] }], [{ t: 'img', src: I('tv8-mit'), w: 230 }]] },
    ]),
    khong('Câu 4. Tập chép', [viet(2, 'Họa mi cất tiếng hót líu lo trong vườn.', true)]),
  ]),
  thietKe(9, 'Đọc bài thơ "Gà mẹ", trắc nghiệm, nối từ, điền um/up/ươm/ươp, chọn chữ, tập chép.', [
    docThanhTieng(['cô Tấm', 'quả vải', 'nhà bếp', 'dép nhựa', 'tập vở', 'cá chép', 'phòng khách', 'bức thư', 'que kem', 'cây nấm', 'cái ghế', 'phá cỗ'], 'Gà mẹ', 'Gà mẹ xòe đôi cánh\nLàm hai mái nhà xinh\nĐàn gà con rúc rích\nMưa rơi xuống nhà mình\n\nGà mẹ xòe đôi cánh\nLàm bức tường cản ngăn\nKhi mèo khoang, chó vện\nĐuổi con mình trên sân.\n      (Theo Phùng Ngọc Hùng)', 'tv9-game'),
    bai('Câu 1. Dựa vào nội dung ở bài đọc ở phần I, em hãy khoanh tròn chữ cái trước ý đúng:', [mc('1. Gà mẹ xòe đôi cánh làm gì?', ['Làm hai mái nhà xinh', 'Làm bức tường cản ngăn', 'Cả a và b'], 'Cả a và b', 1), mc('2. Từ ngữ nào dưới đây phù hợp với gà mẹ?', ['Học giỏi', 'Ngoan ngoãn', 'Yêu con'], 'Yêu con', 1)]),
    bai('Viết: Câu 1. Nối đúng rồi viết lại từ ngữ', [noi(['um', 'mát'], ['mẻ', 'tùm'], [1, 0]), viet(2)]),
    bai('Câu 2. Điền tiếng có vần: um, up, ươm, ươp', [the(4, [['tv9-cum', `cảm ${w('cúm')}`], ['tv9-muop', `quả ${w('mướp')}`], ['tv9-cuop', `c${t('ướp', ['úm', 'úp', 'ướm', 'ướp'])} cờ`], ['tv9-chup', `${w('chụp')} ảnh`]])]),
    bai('Câu 3. Chọn chữ thích hợp điền vào chỗ trống: hay, đẹp', [{ t: 'lines', cols: 2, items: [`Bé Lan vẽ rất ${t('đẹp', ['hay', 'đẹp'])}`, `Chị em hát rất ${t('hay', ['hay', 'đẹp'])}`] }]),
    khong('Câu 4. Tập chép', [viet(2, 'Nhà sạch thì mát, bát sạch ngon cơm.', true)]),
  ]),
  thietKe(10, 'Đọc "Đầm sen", nối câu, trắc nghiệm, nối từ, điền om/ôm/ơm/ơp, chọn chữ, tập chép.', [
    docThanhTieng(['chăn len', 'khăn đỏ', 'ca hát', 'chăm chỉ', 'bàn chân', 'lật đật', 'đầm sen', 'múa hát', 'nét chữ', 'quả gấc', 'máy giặt', 'phố phường'], 'Đầm sen', 'Nhà Dế Mèn bên đầm sen. Lá sen, búp sen đu đưa khi gió về. Mùa sen nở, đầm sen thật êm ả. Đó là chỗ cá cờ, cá rô nô đùa. Đêm về, Dế Mèn rủ bạn đến đầm sen ca hát và tập đàn. Ngỡ như Tết sắp về bên đầm sen.'),
    bai('Câu 1. Dựa vào nội dung ở bài đọc ở phần I, em hãy nối đúng:', [noi(['a) Lá sen, búp sen', 'b) Cá cờ, cá rô', 'c) Dế Mèn'], ['1) nô đùa ở đầm sen.', '2) rủ bạn ca hát, tập đàn.', '3) đu đưa khi gió về.'], [2, 0, 1])]),
    bai('Câu 2. * Khoanh tròn chữ cái trước ý đúng:', [mc('a. Nhà Dế Mèn ở đâu?', ['gần sông', 'bên đầm sen', 'bãi đá'], 'bên đầm sen'), mc('b. Bài đọc Đầm sen có xuất hiện bao nhiêu tiếng có vần âm (đếm trong đoạn văn)?', ['3', '4', '5'], '4')]),
    bai('Viết: Câu 1. Nối đúng rồi viết lại từ ngữ', [noi(['kim', 'tấm'], ['thiệp', 'tiêm'], [1, 0]), viet(2)]),
    bai('Câu 2. Điền tiếng có vần: om, ôm, ơm, ơp', [the(4, [['tv10-dom', `đom ${w('đóm')}`], ['tv10-chop', `tia ${w('chớp')}`], ['tv10-bom', `b${t('ờm', ['òm', 'ồm', 'ờm', 'ợp'])} ngựa`], ['tv10-chom', `ch${t('ôm', ['om', 'ôm', 'ơm', 'ơp'])} ch${t('ôm', ['om', 'ôm', 'ơm', 'ơp'])}`]])]),
    bai('Câu 3. Chọn chữ thích hợp điền vào chỗ trống: sen, sên', [{ t: 'lines', cols: 2, items: [`Đi chậm như ${t('sên', ['sen', 'sên'])}`, `Nhà Dế bên đầm ${t('sen', ['sen', 'sên'])}`] }]),
    khong('Câu 4. Tập chép', [viet(2, 'Lá sen, búp sen đu đưa trong gió.', true)]),
  ]),
];

/* ───────────── Đề 11–23 (mẫu Word) ───────────── */

const word = (n: number, desc: string, docHieu: RawBai[], baiTap: RawBai[], ct: [number, string]): RawPhieu => ({
  slug: `tieng-viet-hk1-de-${n}`,
  title: `Kiểm tra học kì 1 – Tiếng Việt lớp 1 – Đề ${n}`,
  description: desc,
  mon: 'tieng-viet',
  kieu: 'tv-hk1',
  head: [`ĐỀ ${n}`, 'KIỂM TRA HỌC KÌ I MÔN TIẾNG VIỆT'],
  thoiGian: 60,
  phan: { 0: 'I. Kiểm tra đọc (10 điểm)', 1: '2. Kiểm tra đọc hiểu (3 điểm) — Đọc thầm và trả lời câu hỏi', [1 + docHieu.length]: 'II. Kiểm tra viết (10 điểm)' },
  bai: [DOC_THAM, ...docHieu, chinhTa(ct[0], ct[1]), ...baiTap],
});
const bai_ = (title: string, blocks: RawBlock[]) => bai(title, blocks);
const tuDo = (title: string, dong = 2, tranh?: string): RawBai => khong(title, [...(tranh ? [{ t: 'img' as const, src: I(tranh), w: 420 }] : []), viet(dong)]);

const DE_11_23: RawPhieu[] = [
  word(11, 'Đọc "Nhà bà bé Nga", khoanh vào củ nghệ, điền v/d, viết từ theo tranh, xếp tiếng thành câu.', [
    bai_('', [...doan('Nhà bà bé Nga', 'Bà bé Nga ở quê. Nhà bé Nga ở phố, xa nhà bà. Nghỉ hè, Nga ở nhà bà. Nhà bà có gà, có nghé, có cả cá rô, cá quả. Cả nhà ai cũng rất yêu bé Nga.'), mc('Câu 1: (0,5 điểm) Đoạn văn có tên là gì?', ['Nhà bé', 'Nhà bé Nga', 'Nhà bà bé Nga'], 'Nhà bà bé Nga'), mc('Câu 2: (0,5 điểm) Nhà bé Nga ở đâu?', ['ở quê', 'ở phố', 'ở thị xã'], 'ở phố'), mc('Câu 3: (1 điểm) Nhà bà có gì?', ['có gà, có nghé', 'có nghé, có gà, có cá rô, cá quả', 'có gà, có nghé, cá quả'], 'có nghé, có gà, có cá rô, cá quả', 1)]),
    tuDo('Câu 4: (1 điểm) Tình cảm của cả nhà đối với bé như thế nào?'),
  ], [
    bai_('2. Bài tập (3 điểm) · Câu 1: Khoanh tròn vào củ nghệ?', [{ t: 'img', src: I('d11-nghe') }, mc('', ['A', 'B', 'C', 'D'], 'C')]),
    bai_('Câu 2: Điền v hay d', [{ t: 'lines', cols: 3, items: [`${t('d', ['v', 'd'])}a dẻ`, `${t('v', ['v', 'd'])}a li`, `${t('v', ['v', 'd'])}ở vẽ`] }]),
    bai_('Câu 3: Quan sát tranh viết từ thích hợp?', [the(3, [['d11-cachua', w('cà chua', 'quả cà chua')], ['d11-vit', w('con vịt', 'vịt')], ['d11-ban', w('cái bàn', 'bàn')]])]),
    tuDo('Câu 4: Xếp tiếng thành câu rồi viết ra:  Li, bé, chợ, cá, mua, rô phi  ·  cà phê, bố, có, mẹ'),
  ], [7, 'Gà tre ra nhà tớ đi. Tớ sẽ cho gà tre đỗ đỏ, hạt lúa nhé.']),
  word(12, 'Đọc "Thăm sở thú", khoanh hình có âm kh, nối câu, viết từ có âm a, viết từ theo tranh.', [
    bai_('', [...doan('Thăm sở thú', 'Bố và mẹ cho bé Ly đi thăm sở thú. Sở thú có ngựa, dê, khỉ và có cả thú dữ là hổ và sư tử. Bé nem nép, đi khép nép và nhè nhẹ để xem thú.'), mc('Câu 1: (0,5 điểm) Đoạn văn trên có mấy câu?', ['3 câu', '4 câu', '5 câu'], '3 câu'), mc('Câu 2: (0,5 điểm) Từ nào có 2 vần giống nhau?', ['sở thú', 'khép nép', 'sư tử'], 'khép nép'), mc('Câu 3: (1 điểm) Bé Ly đi đâu?', ['đi về quê', 'đi học', 'đi sở thú'], 'đi sở thú')]),
    tuDo('Câu 4: (1 điểm) Em hãy kể tên 1 số con vật em yêu thích.'),
  ], [
    bai_('2. Bài tập (3 điểm) · Câu 1: Khoanh tròn vào hình có tiếng chứa âm: kh', [{ t: 'img', src: I('d12-kh') }, mc('', ['A', 'B', 'C', 'D'], 'C')]),
    bai_('Câu 2: Nối ô chữ ở cột A với ô chữ ở cột B cho phù hợp', [noi(['Nghỉ lễ', 'Nhà bà'], ['có na, khế và có gà, nghé nữa', 'cả nhà Nga ở nhà bà'], [1, 0])]),
    tuDo('Câu 3: Em hãy viết 5 từ có chứa âm: a'),
    bai_('Câu 4: Nhìn tranh rồi viết các từ thích hợp.', [the(3, [['d12-luon', w('con lươn', 'lươn')], ['d12-bupbe', w('búp bê', 'con búp bê')], ['d12-le', w('quả lê', 'lê')]])]),
  ], [7, 'Nhà bà ở quê. Ở quê có gà ri, cá rô phi, cá quả và có cả ba ba nữa. Ở quê có đủ thứ, Na rất vi vu.']),
  word(13, 'Đọc "Quà quê", nối câu, điền dấu thanh, nối thành từ, điền on/ong, in/it, ơm/ăm, ch/tr.', [
    bai_('', [...doan('Quà quê', 'Dì Hà ở quê ra phố, ghé qua nhà bé Na. Dì có quà quê cho cả nhà. Bố có chè và cà phê. Mẹ có khế để kho cá. Na và chị Lê có dứa, có nho và có cả đu đủ.'), mc('Câu 1: (0,5 điểm) Tên của đoạn văn là gì?', ['Về quê', 'Quê bà', 'Quà quê'], 'Quà quê'), mc('Câu 2: (0,5 điểm) Bố của bé Na có gì?', ['dứa, đu đủ', 'chè, cà phê', 'nho, cà phê'], 'chè, cà phê')]),
    bai_('Câu 3: (1 điểm) Nối đúng?', [noi(['Na và chị Lê', 'Mẹ'], ['có khế để kho cá', 'có dứa, có nho và có cả đu đủ'], [1, 0])]),
    tuDo('Câu 4: (1 điểm) Em hãy kể tên 1 số loại quả mà em biết?'),
  ], [
    bai_('2. Bài tập (3 điểm) · Câu 1: Điền dấu thích hợp vào chỗ chấm', [the(4, [['d13-bo', `Con bo ${t('huyền', DAU)}`], ['d13-khi', `Con khi ${t('hỏi', DAU)}`], ['d13-ca', `Con ca ${t('sắc', DAU)}`], ['d13-ech', `Con êch ${t('sắc', DAU)}`]])]),
    bai_('Câu 2: Nối ô chữ ở cột A với ô chữ ở cột B cho phù hợp', [noi(['thám', 'đỏ', 'chăm'], ['chỉ', 'hiểm', 'tươi'], [1, 2, 0])]),
    bai_('Câu 3:', [{ t: 'lines', items: [`a. Điền on hay ong: Quả b${t('óng', ['ón', 'óng'])} tr${t('òn', ['òn', 'òng'])} to`, `b. Điền in hay it: Đèn p${t('in', ['in', 'it'])} của bé Na`, `c. Điền ơm hay ăm: Bé Li đi ăn c${t('ơm', ['ơm', 'ăm'])} ở nhà bà`, `d. Điền ch hay tr: Chị Na ${t('ch', ['ch', 'tr'])}ăm ${t('ch', ['ch', 'tr'])}ỉ quét nhà`] }]),
    tuDo('Câu 4: Nhìn tranh viết 1 đến 2 câu thích hợp với nội dung.', 2, 'd13-tranh'),
  ], [7, 'Rủ nhau chơi ú tìm\nGiờ đến phiên chó trốn\nMèo đảo mắt đi nhìn\nChó nấp đâu rất giỏi.']),
  word(14, 'Đọc "Bữa trưa ở quê", điền ng/ngh, nối thành từ, viết từ theo tranh, nối câu.', [
    bai_('', [...doan('Bữa trưa ở quê', 'Bé Kim và ba mẹ về quê. Ở quê dì Ly mua và làm đủ thứ cho bữa trưa của cả nhà: cá hấp, gà hầm, mắm tép, nấm mỡ, cà tím. Bữa trưa thêm thú vị vì có cả si rô sim và kem nữa.'), mc('Câu 1: (0,5 điểm) Đoạn văn có mấy câu?', ['2 câu', '3 câu', '4 câu'], '3 câu'), mc('Câu 2: (0,5 điểm) Dì Ly làm bữa trưa cho ai?', ['Bé Kim', 'Cả nhà', 'Dì Ly'], 'Cả nhà'), mc('Câu 3: (1 điểm) Bữa trưa thêm thú vị vì ………….?', ['có cả mắm tép, cà tím', 'có cả si rô và kem', 'có cà tím và kem'], 'có cả si rô và kem')]),
    tuDo('Câu 4: (1 điểm) Em hãy kể 1 vài món ăn mà em yêu thích nhất?'),
  ], [
    bai_('2. Bài tập (3 điểm) · Câu 1: Điền ng hoặc ngh', [{ t: 'lines', cols: 4, items: [`${t('ng', ['ng', 'ngh'])}ón chân`, `${t('ngh', ['ng', 'ngh'])}e hát`, `bắp ${t('ng', ['ng', 'ngh'])}ô`, `con ${t('ngh', ['ng', 'ngh'])}é`] }]),
    bai_('Câu 2: Nối đúng?', [noi(['lá', 'xóm', 'kho'], ['cá', 'thư', 'quê'], [1, 2, 0])]),
    bai_('Câu 3: Viết từ thích hợp dưới mỗi tranh?', [the(3, [['d14-banghe', w('bàn ghế', 'bộ bàn ghế', 'bàn học', 'cái bàn')], ['d14-xucxac', w('xúc xắc', 'con xúc xắc', 'cục xúc xắc')], ['d14-chomchom', w('chôm chôm', 'quả chôm chôm')]])]),
    bai_('Câu 3b: Nối đúng rồi viết lại câu hoàn chỉnh', [noi(['Bé Hà', 'Mẹ'], ['mua cá trê về kho tộ', 'chăm chỉ làm bài tập'], [1, 0]), viet(2)]),
    tuDo('Câu 4: Quan sát tranh và viết 1, 2 câu thích hợp với nội dung tranh', 2, 'd14-tranh'),
  ], [7, 'Đôi bàn tay bé xíu\nLại siêng năng nhất nhà\nHết xâu kim cho bà\nLại nhặt rau giúp mẹ']),
  word(15, 'Đọc "Bà ốm", viết tiếng có thanh sắc/huyền, khoanh con vật có vần oi, viết từ theo tranh.', [
    bai_('', [...doan('Bà ốm', 'Bà ốm đã ba hôm. Mẹ nghỉ làm để chăm bà. Có đêm, mẹ chả ngủ. Bé lo vì chưa đỡ gì cho mẹ. Mẹ ôm bé thủ thỉ: “Bé chăm chỉ là bà đỡ ốm!”'), mc('Câu 1: (0,5 điểm) Đoạn văn có mấy câu?', ['5 câu', '6 câu', '7 câu'], '5 câu'), mc('Câu 2: (0,5 điểm) Bà của bé bị gì?', ['bị ốm', 'bị đau chân', 'bị ngã'], 'bị ốm'), mc('Câu 3: (1 điểm) Bé lo điều gì?', ['vì không đi học', 'vì chưa đỡ gì cho mẹ', 'vì sợ bà ốm nặng'], 'vì chưa đỡ gì cho mẹ')]),
    tuDo('Câu 4: (1 điểm) Em hãy viết 1 đến 2 câu kể về bà của mình.'),
  ], [
    tuDo('2. Bài tập (3 điểm) · Câu 1: Em hãy viết: a. 2 tiếng chứa thanh sắc · b. 2 tiếng chứa thanh huyền', 1),
    bai_('Câu 2: Khoanh vào tên con vật có chứa vần oi.', [{ t: 'img', src: I('d15-oi') }, mc('', ['A', 'B', 'C'], 'C')]),
    bai_('Câu 3: Viết mỗi từ thích hợp dưới mỗi tranh', [the(3, [['d15-sen', w('hoa sen', 'bông sen', 'sen')], ['d15-co', w('lá cờ', 'cờ', 'cờ đỏ sao vàng', 'quốc kỳ')], ['d15-na', w('quả na', 'na', 'mãng cầu', 'trái na')]])]),
    tuDo('Câu 4: Quan sát tranh và viết 1, 2 câu thích hợp với nội dung tranh', 2, 'd15-tranh'),
  ], [7, 'Gà mơ rất chăm chỉ kiếm ăn, luôn luôn lo cho lũ gà nhép đủ ăn. Gà nhép rất vui vì được gà mơ quan tâm, chăm sóc.']),
  word(16, 'Đọc "Hai con chim", điền dấu thanh, nối câu, chọn từ điền chỗ trống, nói về tranh.', [
    bai_('', [...doan('Hai con chim', 'Trời mưa to. Trên cây sấu già có hai con chim. Con chim bé run rẩy kêu: Chíp! Chíp! Chim lớn dỗ dành: Ti ri… ti ri… Rồi chim lớn dang rộng đôi cánh, lấy thân mình che chở cho con chim bé dưới trời mưa gió.\nKhi tia nắng óng ánh vừa rơi xuống chỗ ẩn nấp, con chim lớn mở choàng mắt. Nó giũ giũ lông cánh cho khô rồi khẽ nhích ra ngoài để nắng sưởi ấm cho chim bé. Con chim bé đang ngái ngủ, lông cánh vẫn khô nguyên.'), mc('Câu 1: (0,5 điểm) Trong đêm, hai con chim gặp khó khăn gì trên cây?', ['Trời mưa to', 'Trời gió to', 'Trời mưa gió'], 'Trời mưa to'), mc('Câu 2: (0,5 điểm) Khi tia nắng rơi xuống chỗ ẩn nấp, chim lớn nhích ra ngoài để làm gì?', ['Để nắng sưởi ấm chỗ nằm', 'Để nắng hong khô đôi cánh', 'Để nắng sưởi ấm chim bé'], 'Để nắng sưởi ấm chim bé', 1), mc('Câu 3: (1 điểm) Vì sao lông cánh của chim bé vẫn còn khô nguyên?', ['Vì được nằm trong chỗ không bị mưa gió', 'Vì được chim lớn che chở lúc mưa gió', 'Vì được tia nắng óng ánh rọi chiếu vào'], 'Vì được chim lớn che chở lúc mưa gió', 1)]),
    tuDo('Câu 4: (1 điểm) Em hãy kể 1 số việc làm em đã giúp đỡ bạn, khi bạn gặp khó khăn?'),
  ], [
    bai_('2. Bài tập (3 điểm) · Câu 1: Điền dấu thích hợp vào chỗ chấm', [the(4, [['d16-thoi', `thôi ${t('hỏi', DAU)} bóng`], ['d16-liem', `lươi ${t('ngã', DAU)} liềm`], ['d16-bep', `bếp lưa ${t('hỏi', DAU)}`], ['d16-cuoi', `cươi ${t('ngã', DAU)} ngựa`]])]),
    bai_('Câu 2: Nối ô chữ ở cột A với ô chữ ở cột B cho phù hợp', [noi(['Chiều chiều các bạn nhỏ', 'Con gà trống', 'Ông mặt trời', 'Bạn Lan'], ['tỏa nắng chói chang', 'mặc chiếc áo màu đỏ', 'lên đê thả diều', 'gáy ò…ó…o'], [2, 3, 0, 1])]),
    bai_('Câu 3: Chọn từ thích hợp điền vào chỗ trống: dắt trâu, cây xanh, nhỏ, mùa xuân', [{ t: 'lines', items: [`- Những hàng ${t('cây xanh', ['dắt trâu', 'cây xanh', 'nhỏ', 'mùa xuân'])} che bóng rợp con đường`, `- Đôi chân chích bông ${t('nhỏ', ['dắt trâu', 'cây xanh', 'nhỏ', 'mùa xuân'])} như hai que tăm.`, `- ${t('mùa xuân', ['dắt trâu', 'cây xanh', 'nhỏ', 'mùa xuân'])} đến, cây cối đâm chồi, nảy lộc xanh mơn mởn.`, `- Chiều chiều, chúng tôi thong thả ${t('dắt trâu', ['dắt trâu', 'cây xanh', 'nhỏ', 'mùa xuân'])} ra đồng ăn cỏ.`] }]),
    tuDo('Câu 4: Quan sát tranh và nói những điều em biết về bức tranh đó. Bức tranh vẽ: …', 2, 'd16-tranh'),
  ], [7, 'Chú ếch\nCó chú ếch là chú ếch con\nHai mắt mở tròn nhảy nhót đi chơi\nGặp ai ếch cũng thế thôi\nHai cái mắt lồi cứ ngước trơ trơ\nEm không như thế bao giờ\nVì em lễ phép biết thưa biết chào']),
  word(17, 'Đọc "Xe lu và xe ca", tìm từ có vần ăn/ong, chọn tiếng điền chỗ chấm, viết tên con vật, việc làm theo tranh.', [
    bai_('', [...doan('Xe lu và xe ca', 'Xe lu và xe ca cùng đi trên đường với nhau. Thấy xe lu đi chậm, xe ca chế giễu bạn:\n- Cậu đi như con rùa ấy! Xem tớ đây này!\nNói rồi, xe ca phóng vụt lên, bỏ xe lu ở tít đằng sau. Xe ca tưởng mình thế là giỏi lắm.\nTới một quãng đường bị hỏng, xe ca phải đỗ lại vì lầy lội quá. Bấy giờ xe lu mới tiến lên. Khi đám đá hộc và đá cuội ngổn ngang đổ xuống, xe lu liền lăn qua lăn lại cho phẳng lì. Nhờ vậy mà xe ca mới tiếp tục lên đường.\nTừ đấy, xe ca không chế giễu xe lu nữa. Xe ca đã hiểu rằng: công việc của bạn xe lu là như vậy.   (Theo Phong Thu)'), mc('Câu 1. (0,5 điểm) Thấy xe lu đi chậm, xe ca đã làm gì?', ['Đợi xe lu đi cùng', 'Chế giễu xe lu đi chậm rồi phóng vụt lên', 'Động viên xe lu'], 'Chế giễu xe lu đi chậm rồi phóng vụt lên', 1), mc('Câu 2: (0,5 điểm) Xe ca đã chế giễu xe lu như thế nào?', ['Cậu đi như con rùa ấy. Xem tớ đây này!', 'Cậu đi như bò', 'Cậu đi nhanh lên đi không mọi người cười cho đấy'], 'Cậu đi như con rùa ấy. Xem tớ đây này!', 1), mc('Câu 3. (1 điểm) Khi xe ca không đi qua được chỗ đường bị hỏng, xe lu đã làm gì?', ['Chế giễu lại xe ca kiêu căng', 'Tiến lên và bỏ mặc xe ca ở tít đằng sau', 'Lăn qua lăn lại đường phẳng lì cho xe ca đi'], 'Lăn qua lăn lại đường phẳng lì cho xe ca đi', 1)]),
    tuDo('Câu 4. (1 điểm) Em hãy viết 1 lời khuyên dành cho chú xe ca (gợi ý: không nên coi thường và chế giễu người khác).'),
  ], [
    tuDo('C. Bài tập (4 điểm) · Câu 1: Tìm 3 từ có vần ăn · Tìm 3 từ có vần ong', 1),
    bai_('Câu 2: Chọn tiếng để điền vào chỗ chấm cho thích hợp', [{ t: 'lines', items: [`a. bút hay bụt: cái ${t('bút', ['bút', 'bụt'])} chì của em`, `b. quýt hay quỵt: quả ${t('quýt', ['quýt', 'quỵt'])} rất ngon và ngọt`, `c. mặt trời hay mặt trăng: ông ${t('mặt trời', ['mặt trời', 'mặt trăng'])} tỏa nắng chói chang`, `d. màu đỏ hay màu xanh: quả gấc chín có ${t('màu đỏ', ['màu đỏ', 'màu xanh'])}`] }]),
    bai_('Câu 3: Viết tên mỗi con vật cho thích hợp', [the(4, [['d17-cho', w('con chó', 'chó', 'chú chó')], ['d17-voi', w('con voi', 'voi', 'chú voi')], ['d17-huou', w('hươu cao cổ', 'con hươu cao cổ', 'con hươu', 'hươu')], ['d17-lon', w('con lợn', 'lợn', 'con heo', 'heo')]])]),
    bai_('Câu 4: Quan sát tranh và viết việc làm của các bạn nhỏ trong hình', [the(2, [['d17-tuoi', w('~tưới')], ['d17-quet', w('~quét')]])]),
  ], [6, 'Quê em là một tỉnh ở phía Nam tổ quốc. Ở nơi đây, người dân ai cũng hiền lành, thân thiện. Đặc biệt, quê em có cánh đồng lúa rộng lớn, thẳng cánh cò bay. Vào những trưa hè nóng bức, em sẽ ra ngồi bên bờ ruộng, tận hưởng từng làn gió mát rượi mang theo hương lúa chín thơm.']),
  word(18, 'Đọc "Người bạn nhỏ", điền l/n, an/ang, điền dấu thanh vào bài thơ, nối câu, viết từ theo tranh.', [
    bai_('', [...doan('Người bạn nhỏ', 'Trong những con chim rừng, Lan thích nhất con nộc thua. Có hôm Lan dậy thật sớm, ra suối lấy nước, chưa có con chim nào ra khỏi tổ. Thế mà con nộc thua đã hót ở trên cành. Có những hôm trời mưa gió rất to, những con chim khác đi trú mưa hết. Nhưng con nộc thua vẫn bay đi kiếm mồi hoặc đậu trên cành cao hót một mình. Trong rừng chỉ nghe có tiếng mưa và tiếng con chim chịu thương, chịu khó ấy hót mà thôi. Thành ra, có hôm Lan đi học một mình mà cũng thấy vui như có bạn đi cùng.   (Quang Huy)'), mc('Câu 1. Bạn Lan sống và học tập ở vùng nào?', ['Vùng nông thôn', 'Vùng thành phố', 'Vùng rừng núi'], 'Vùng rừng núi'), mc('Câu 2. Chi tiết nào cho thấy nộc thua là con chim “chịu thương, chịu khó”?', ['Dậy sớm, bay khỏi tổ để ra suối uống nước', 'Dậy sớm đi kiếm mồi hoặc hót trên cành cao', 'Dậy sớm hót vang, trong lúc trời mưa rất to'], 'Dậy sớm đi kiếm mồi hoặc hót trên cành cao', 1), mc('Câu 3. Khi trời mưa gió, Lan nghe thấy những âm thanh gì trong rừng?', ['Tiếng mưa rơi, tiếng suối reo vui', 'Tiếng mưa rơi, tiếng nộc thua hót', 'Tiếng suối reo, tiếng nộc thua hót'], 'Tiếng mưa rơi, tiếng nộc thua hót', 1), mc('Câu 4. Vì sao trong những con chim rừng, Lan thích nhất nộc thua?', ['Vì nộc thua hót hay và chịu thương, chịu khó', 'Vì nộc thua hót hay và luôn cùng Lan đi học', 'Vì nộc thua hay hót trên con đường Lan đi học'], 'Vì nộc thua hót hay và chịu thương, chịu khó', 1)]),
  ], [
    bai_('2. Bài tập (3 điểm) · Câu 1: Điền đúng: a. l hoặc n · b. an hoặc ang', [{ t: 'lines', cols: 2, items: [`ăn ${t('n', ['l', 'n'])}o`, `${t('l', ['l', 'n'])}o lắng`, `gánh ${t('n', ['l', 'n'])}ặng`, `im ${t('l', ['l', 'n'])}ặng`, `l${t('àng', ['àn', 'àng'])} xóm`, `l${t('àn', ['àn', 'àng'])} gió`] }]),
    bai_('Câu 2: Điền các dấu thanh vào bài thơ sau cho hoàn chỉnh', [{ t: 'lines', items: [`Cơn mưa nào la${t('nặng', DAU)} thê${t('sắc', DAU)}`, `Thoang${t('sắc', DAU)} qua rồi tanh${t('nặng', DAU)} ngay`, `Em vê${t('huyền', DAU)} nha${t('huyền', DAU)} hoi${t('hỏi', DAU)} me${t('nặng', DAU)}`, `Me${t('nặng', DAU)} cươi${t('huyền', DAU)}: mưa bong${t('sắc', DAU)} mây`] }]),
    bai_('Câu 3: Nối ô chữ ở cột A với ô chữ ở cột B cho phù hợp', [noi(['Em đang học', 'Sân trường em', 'Cô giáo em', 'Các bạn nữ'], ['giảng bài rất hay', 'rất thích nhảy dây', 'rất rộng và nhiều cây', 'ở trường Tiểu học Quỳnh Thanh'], [3, 2, 0, 1])]),
    bai_('Câu 4: Viết tên mỗi hình', [the(3, [['d18-khoi', w('khối lập phương', 'hình lập phương', 'khối hộp', 'hộp')], ['d18-coc', w('cái cốc', 'cốc', 'cái ca', 'ca', 'cái chén', 'cái tách')], ['d18-ong', w('con ong', 'ong', 'ong mật')]])]),
  ], [7, 'Cò đi lò dò\nNgày xửa ngày xưa có một chú cò con bị rơi từ trên cao xuống và bị gãy mất một cái chân. Rất may, cò được một anh nông dân đem về nhà nuôi dưỡng và chữa chạy. Chẳng bao lâu nó đã trở lại bình thường và trở thành người bạn thân thiết của anh nông dân.']),
  word(19, 'Đọc "Nhớ ông", điền uôi/ươi, yêu/quý, nối câu, viết từ dưới tranh.', [
    bai_('', [...doan('Nhớ ông', 'Xe chuẩn bị lăn bánh. Trời bỗng đổ cơn mưa. Ông giương cái ô đen lên. Mẹ và Minh lên xe. Xe chạy xa dần, rồi ngoặt vào một góc phố. Minh chỉ còn thấy chiếc ô đen giơ lên cao rồi khuất hẳn. Minh nghẹn ngào muốn khóc. Thương ông quá đi mất!\n- Bao giờ con lớn con cũng nuôi ông… Minh nói đến đấy rồi rúc đầu vào lòng mẹ khóc thút thít.'), mc('Câu 1: (0,5 điểm) Đoạn văn trên có mấy câu?', ['8 câu', '9 câu', '10 câu', '11 câu'], '10 câu'), mc('Câu 2: (0,5 điểm) Trong đoạn văn chữ nào là tên riêng cần phải viết hoa?', ['Xe', 'Ông', 'Minh', 'Thương'], 'Minh'), mc('Câu 3: (1 điểm) Trời mưa ông đã làm gì?', ['Ông lên xe cùng cháu', 'Ông bảo Minh ở lại trời tạnh rồi lên xe', 'Ông giương cái ô đen cho Minh', 'Ông lấy nón che cho Minh'], 'Ông giương cái ô đen cho Minh', 1), mc('Câu 4: (1 điểm) Vì sao Minh lại khóc?', ['Vì Minh không được ở lại chơi với các bạn nhỏ', 'Vì Minh thương ông', 'Vì Minh yêu mẹ', 'Vì Minh không muốn lên thành phố đi học'], 'Vì Minh thương ông', 1)]),
  ], [
    bai_('2. Bài tập (3 điểm) · Câu 1: Điền vần uôi hay ươi và thêm dấu thanh', [{ t: 'lines', cols: 2, items: [`B${w('uổi')} sáng`, `quả b${w('ưởi')}`, `Số m${w('ười')}`, `dòng s${w('uối')}`] }]),
    bai_('Câu 2: Điền yêu hay quý', [{ t: 'lines', items: [`Em bé trông thật đáng ${t('yêu', ['yêu', 'quý'])}`, `Tình cảm gia đình thật đáng ${t('quý', ['yêu', 'quý'])}`] }]),
    bai_('Câu 3: Nối ô chữ ở cột A với ô chữ ở cột B cho phù hợp', [noi(['Con trâu', 'Trăng khuya', 'Chích chòe', 'Tóc bạn Nam'], ['sáng vằng vặc', 'hót véo von', 'đen và xoăn tít', 'chăm chỉ cày ruộng'], [3, 0, 1, 2])]),
    bai_('Câu 4: Tìm và viết từ thích hợp vào chỗ chấm dưới mỗi tranh', [the(4, [['d19-ngo', w('bắp ngô', 'ngô', 'bắp')], ['d19-mattroi', w('mặt trời', 'ông mặt trời')], ['d19-cua', w('con cua', 'cua')], ['d19-xucxac', w('xúc xắc', 'con xúc xắc')]])]),
  ], [7, 'Sông Hương là một đặc ân của thiên nhiên dành cho Huế, làm cho không khí thành phố trở nên trong lành, làm tan biến những tiếng ồn ào của chợ búa, tạo cho thành phố một vẻ êm đềm.']),
  word(20, 'Đọc chuyện chú chim sâu, điền vần, nối hình với chữ, viết từ dưới tranh, viết câu theo tranh.', [
    bai_('', [{ t: 'text', text: 'Một hôm chú chim sâu nghe được họa mi hót. Chú phụng phịu nói với bố mẹ: “Tại sao bố mẹ sinh con ra không phải là họa mi mà lại là chim sâu?”\n- Bố mẹ là chim sâu thì sinh ra con là chim sâu chứ sao! Chim mẹ trả lời.\nChim con nói: Vì con muốn hót hay để mọi người yêu quý. Chim bố nói: Con cứ hãy chăm chỉ bắt sâu để bảo vệ cây sẽ được mọi người yêu quý.' }, mc('Câu 1: (0,5 điểm) Chú chim sâu được nghe loài chim gì hót?', ['Chào mào', 'Chích chòe', 'Họa mi'], 'Họa mi'), mc('Câu 2: (0,5 điểm) Chú chim sâu sẽ đáng yêu khi nào?', ['Hót hay', 'Bắt nhiều sâu', 'Biết bay'], 'Bắt nhiều sâu')]),
    tuDo('Câu 3: (1 điểm) Để được mọi người yêu quý em sẽ làm gì? · Câu 4: (1 điểm) Em viết 1 câu nói về mẹ em'),
  ], [
    bai_('Bài tập (4 điểm) · Câu 1: Điền vần thích hợp vào chỗ trống.', [the(2, [['d20-huou', `Con h${w('ươu')}`], ['d20-cho', `chạy l${w('ăng')} quăng`]])]),
    bai_('Câu 2: Nối mỗi hình vẽ với ô chữ cho phù hợp', [noiTranh(['Gà trống', 'Bắp ngô', 'Cà tím'], ['d20-catim', 'd20-ga', 'd20-ngo'], ['d20-ga', 'd20-ngo', 'd20-catim'])]),
    bai_('Câu 3: Tìm và viết từ thích hợp vào chỗ chấm dưới mỗi tranh', [the(4, [['d20-thiep', w('tấm thiệp', 'thiệp', 'thiệp chúc mừng', 'tấm thiếp', 'thiếp')], ['d20-quan', w('quần', 'quần đùi', 'quần soóc', 'quần short', 'cái quần')], ['d20-nguavan', w('ngựa vằn', 'con ngựa vằn')], ['d20-dongho', w('đồng hồ', 'cái đồng hồ')]])]),
    tuDo('Câu 4: Quan sát tranh rồi viết 2 câu phù hợp với nội dung bức tranh.', 2, 'd20-tranh'),
  ], [6, 'Mẹ dạy em khi gặp người cao tuổi, con cần khoanh tay và cúi đầu chào hỏi rõ ràng, đó là những cử chỉ lễ phép, lịch sự.']),
  word(21, 'Đọc "Công bằng", tìm từ có 2 vần giống nhau, điền l/n, nối câu, viết câu theo tranh.', [
    bai_('', [...doan('Công bằng', 'Hoa nói với bố mẹ: Con yêu bố mẹ bằng đường từ đất lên trời!\nBố cười: Còn bố yêu con bằng từ đất lên trời và bằng từ trời trở về đất. Hoa không chịu: Con yêu bố mẹ nhiều hơn!\nMẹ lắc đầu: Chính mẹ mới là người yêu con và bố nhiều nhất!\nHoa rối rít xua tay: Thế thì không công bằng! Vậy cả nhà mình ai cũng nhất bố mẹ nhé!'), mc('Câu 1: (0,5 điểm) Hoa nói với bố mẹ điều gì?', ['Hoa chỉ yêu mẹ', 'Hoa yêu bố mẹ bằng từ đất lên trời', 'Hoa yêu bố mẹ rất nhiều', 'Hoa chỉ yêu bố'], 'Hoa yêu bố mẹ bằng từ đất lên trời', 1), mc('Câu 2: (0,5 điểm) Bố nói gì với Hoa?', ['Bố yêu Hoa rất nhiều', 'Bố yêu Hoa bằng từ đất lên trời', 'Bố yêu Hoa bằng từ đất lên trời và bằng từ trời trở về đất', 'Bố yêu con'], 'Bố yêu Hoa bằng từ đất lên trời và bằng từ trời trở về đất', 1), mc('Câu 3: (1 điểm) Sau cuộc nói chuyện Hoa quyết định như thế nào để công bằng cho mọi người?', ['Cả nhà mình ai cũng nhất', 'Mẹ Hoa là nhất', 'Bố của Hoa là nhất', 'Hoa là nhất'], 'Cả nhà mình ai cũng nhất', 1)]),
    tuDo('Câu 4: (1 điểm) Em hãy viết 1 đến 2 câu thể hiện tình cảm của mình đối với bố mẹ'),
  ], [
    bai_('2. Bài tập (3 điểm) · Câu 1: Chọn từ có 2 vần giống nhau', [mc('', ['Chuồn chuồn', 'lo lắng', 'lấp lánh', 'chông chênh'], 'Chuồn chuồn')]),
    bai_('Câu 2: Điền vào chỗ trống chữ l hoặc n', [{ t: 'lines', items: [`- Bà ${t('n', ['l', 'n'])}ội đang ${t('l', ['l', 'n'])}ội dưới ruộng`, `- Những hạt sương ${t('l', ['l', 'n'])}ong ${t('l', ['l', 'n'])}anh trên lá`] }]),
    bai_('Câu 3: Nối ô chữ ở cột A với ô chữ ở cột B cho phù hợp', [noi(['Cái lược', 'Hoa đào', 'Chú ve', 'Ông mặt trời'], ['tỏa nắng chói chang', 'dùng để chải tóc', 'nở vào mùa xuân', 'ca hát suốt mùa hè'], [1, 2, 3, 0])]),
    tuDo('Câu 4: Quan sát tranh rồi viết 1 – 2 câu phù hợp với nội dung bức tranh.', 2, 'd21-tranh'),
  ], [7, 'Trong vườn thơm ngát hương hoa\nBé ngồi đọc sách gió hòa tiếng chim\nChú mèo ngủ mắt lim dim\nChị ngồi bậc cửa xâu kim giúp bà']),
  word(22, 'Đọc bài thơ "Chú ếch", nối câu, tìm vần ong/uyên, điền từ, viết từ dưới tranh, viết câu theo tranh.', [
    bai_('', [...doan('Chú ếch', 'Có chú ếch là chú ếch con\nHai mắt mở tròn nhảy nhót đi chơi\nGặp ai ếch cũng thế thôi\nHai cái mắt lồi cứ ngước trơ trơ\nEm không như thế bao giờ\nVì em lễ phép biết thưa biết chào'), mc('Câu 1: (0,5 điểm) Bài thơ có tên gọi là gì?', ['Ếch con', 'Chú Ếch', 'Con Ếch'], 'Chú Ếch'), mc('Câu 2: (0,5 điểm) Chú Ếch con thích đi đâu?', ['đi học', 'đi lượn', 'đi chơi'], 'đi chơi'), mc('Câu 3: (1 điểm) Em thích chú ếch con ở điều gì?', ['Em thích đi chơi như ếch', 'Em biết chào hỏi mọi người'], 'Em biết chào hỏi mọi người', 1)]),
    bai_('Câu 4: (1 điểm) Nối đúng', [noi(['Chú Ếch', 'Em'], ['Lễ phép biết chào hỏi mọi người', 'Nhảy nhót đi chơi, không chào hỏi mọi người.'], [1, 0])]),
  ], [
    tuDo('2. Bài tập (3 điểm) · Câu 1: Tìm 2 tiếng chứa vần ong · Tìm 2 tiếng chứa vần uyên', 1),
    bai_('Câu 2: Điền xinh hoặc mới, hoặc thẳng, hoặc khỏe vào chỗ trống', [{ t: 'lines', cols: 2, items: [`a) Cô bé rất ${t('xinh', ['xinh', 'mới', 'thẳng', 'khỏe'])}`, `b) Con voi rất ${t('khỏe', ['xinh', 'mới', 'thẳng', 'khỏe'])}`, `c) Quyển vở còn ${t('mới', ['xinh', 'mới', 'thẳng', 'khỏe'])}`, `d) Cây cau rất ${t('thẳng', ['xinh', 'mới', 'thẳng', 'khỏe'])}`] }]),
    bai_('Câu 3: Tìm và viết từ thích hợp vào chỗ chấm dưới mỗi tranh', [the(3, [['d22-tom', w('con tôm', 'tôm')], ['d22-thanhlong', w('quả thanh long', 'thanh long', 'trái thanh long')], ['d22-lohoa', w('lọ hoa', 'bình hoa', 'lọ hoa nhỏ', 'hai lọ hoa', 'bình hoa nhỏ')]])]),
    tuDo('Câu 4: Quan sát tranh rồi viết 1 – 2 câu phù hợp với nội dung bức tranh.', 2, 'd22-tranh'),
  ], [7, 'Ngay ở giữa sân trường, sừng sững một cây bàng. Mùa đông, cây vươn dài những cành khẳng khiu, trụi lá. Xuân sang, cành trên cành dưới chi chít những lộc non mơn mởn. Ôi! Mùa xuân thật đẹp biết bao.']),
  word(23, 'Đọc "Chú gấu ngoan", tìm tiếng có âm th/tr, điền ng/ngh, nối câu, viết về ước mơ.', [
    bai_('', [...doan('Chú gấu ngoan', 'Bác voi cho gấu anh một rổ lê. Gấu anh cảm ơn bác voi rồi đem lê về, chọn quả to nhất biếu ông. Gấu ông rất vui, xoa đầu gấu anh và bảo:\n- Cháu ngoan lắm! Cảm ơn cháu yêu!\nGấu anh đưa quả lê to thứ hai tặng mẹ. Mẹ cũng rất vui, ôm hôn gấu anh.\n- Con ngoan lắm! Mẹ cảm ơn con!\nGấu anh đưa quả lê to thứ ba cho em. Gấu em thích quá, ôm quả lê, nói:\n- Em cảm ơn anh!\nGấu anh cầm quả lê còn lại, ăn một cách ngon lành. Hai anh em gấu vừa cười vừa lăn khắp nhà.'), mc('Câu 1: (0,5 điểm) Bác voi cho gấu anh quả gì?', ['Quả táo', 'Quả dưa', 'Quả lê', 'Quả na'], 'Quả lê'), mc('Câu 2: (0,5 điểm) Khi được nhận quà ông gấu đã nói gì với gấu anh?', ['Khen cháu rất ngoan', 'Cháu ngoan lắm. Ông cảm ơn cháu', 'Cháu rất giỏi', 'Cháu ngoan lắm! Cảm ơn cháu yêu!'], 'Cháu ngoan lắm! Cảm ơn cháu yêu!', 1), mc('Câu 3: (1 điểm) Gấu anh có gì ngoan?', ['Biết chia sẻ', 'Biết nói lời cảm ơn', 'Biết nhường nhịn và chọn quả lê to nhất để biếu ông', 'Cả 3 đáp án trên'], 'Cả 3 đáp án trên', 1)]),
    tuDo('Câu 4: (1 điểm) Qua câu chuyện trên, em học được điều gì?'),
  ], [
    tuDo('2. Bài tập (3 điểm) · Câu 1: Tìm 4 tiếng chứa âm th · Tìm 4 tiếng chứa âm tr', 1),
    bai_('Câu 2: Điền ng hay ngh', [{ t: 'lines', cols: 4, items: [`${t('ng', ['ng', 'ngh'])}ón chân`, `${t('ngh', ['ng', 'ngh'])}e tiếng`, `bắp ${t('ng', ['ng', 'ngh'])}ô`, `${t('ngh', ['ng', 'ngh'])}ỉ hè`] }]),
    bai_('Câu 3: Nối ô chữ ở cột A với ô chữ ở cột B cho phù hợp', [noi(['Biển quê em', 'Chiếc đèn', 'Con cá vàng', 'Bà em'], ['thắp sáng cho em học bài', 'bơi dưới nước', 'đang may quần áo', 'rất yên ả'], [3, 0, 1, 2])]),
    tuDo('Câu 4: Em hãy viết lên ước mơ sau này của mình? Để thực hiện được ước mơ đó em phải làm gì?', 3),
  ], [7, 'Giúp bạn\nGà con đi học gặp mưa\nCó anh ếch cốm cũng vừa đến nơi\nMưa to, gió lớn bời bời\nẾch cốm vừa nhảy vừa bơi lò cò\nMang lên một lá sen to\nLàm cái ô lớn che cho bạn gà']),
];

export const DE_TV_HK1: RawPhieu[] = [...DE_1_10, ...DE_11_23];
