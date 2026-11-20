// "Đề kiểm tra cuối kì số 1 → 10" — Tiếng Việt 1, học kì 1 (Qbooks), trang 21–40 của bản scan.
// Mỗi đề: 1. Đọc thành tiếng + câu hỏi miệng, 2. Viết chính tả — không chấm trên máy (diem 0);
// 3. Đọc hiểu và các bài 4, 5 (6) có đáp án xác định — máy chấm, điểm quy theo tỉ lệ điểm trên đề về thang 10.
// Tranh cắt từ bản scan (public/thi-lop-1/tv/ck<đề>-*.webp).
// Đề 5 bài 4: đề in "a) … c)" (thiếu b) → sửa thành "a) … b)". Đề 6 bài 6 (viết tiếng có vần uôi, uôn) là câu tự do → không chấm.

import type { RawBai, RawBlock, RawPhieu } from './kieu';

const I = (n: string) => `tv/${n}`;
/** Ô chọn âm/vần/từ: [[t:đáp án/lựa chọn 1,lựa chọn 2]] */
const t = (ans: string, opts: string[]) => `[[t:${ans}/${opts.join(',')}]]`;
/** Ô gõ chữ: nhiều đáp án ngăn bằng "|", "~x" = chứa x */
const w = (...ans: string[]) => `[[w:${ans.join('|')}]]`;

const doan = (ten: string, noi: string, tacGia?: string): RawBlock[] => [
  ...(ten ? [{ t: 'text' as const, text: ten, center: true }] : []),
  { t: 'text', text: noi },
  ...(tacGia ? [{ t: 'text' as const, text: tacGia, italic: true }] : []),
];
/** Nối cột A → cột B: `dung[i]` là chỉ số ô B nối với ô A thứ i. */
const noi = (a: string[], b: string[], dung: number[]): RawBlock => ({ t: 'match', layout: 'cols', top: a.map((text) => ({ text })), bottom: b.map((text) => ({ text })), pairs: dung, topShape: 'box', bottomShape: 'box' });
const noiTranh = (a: string[], tranh: string[], dung: string[]): RawBlock => ({ t: 'match', layout: 'cols', top: a.map((text) => ({ text })), bottom: tranh.map((img) => ({ img: I(img) })), pairs: dung.map((d) => tranh.indexOf(d)), topShape: 'word' });
/** Nối tranh (cột trái) với chữ (cột phải): `dung[i]` là chỉ số ô chữ nối với tranh thứ i. */
const tranhNoi = (tranh: string[], chu: string[], dung: number[]): RawBlock => ({ t: 'match', layout: 'cols', top: tranh.map((img) => ({ img: I(img) })), bottom: chu.map((text) => ({ text })), pairs: dung, bottomShape: 'word' });
const the = (cols: number, items: [string, string][]): RawBlock => ({ t: 'cards', cols, items: items.map(([img, word]) => ({ img: I(img), word })) });
const viet = (dong: number, mau?: string, cursive = false): RawBlock => ({ t: 'viet', dong, mau, cursive });
const khong = (title: string, blocks: RawBlock[]): RawBai => ({ title, diem: 0, blocks });
/** Bài chấm trên máy; `p` = điểm ghi trên đề (quy về thang 10 trong `de`). */
const cham = (p: number, title: string, blocks: RawBlock[]): RawBai => ({ title, diem: p, blocks });
const voiTranh = (blocks: RawBlock[], img: string, w_ = 240): RawBlock => ({ t: 'row', widths: ['3fr', '2fr'], cols: [blocks, [{ t: 'img', src: I(img), w: w_ }]] });

const CK = ['c', 'k'];
const G = ['g', 'gh'];

/** 1. Đọc thành tiếng: đoạn đọc + tranh + câu hỏi miệng. */
const docTo = (diem: string, ten: string, noiDung: string, img: string, hoi: string, tacGia?: string, w_ = 240): RawBai =>
  khong(`1. Đọc thành tiếng (${diem} điểm) — người lớn nghe bé đọc rồi hỏi bé`, [
    voiTranh(doan(ten, noiDung, tacGia), img, w_),
    { t: 'text', text: `❓ ${hoi}` },
  ]);
/** 2. Viết chính tả: người lớn đọc, bé viết (chữ mẫu viết thường như trên đề). */
const chinhTa = (mau: string, dong = 4): RawBai => khong('2. Viết chính tả (2 điểm) — người lớn đọc cho bé viết', [viet(dong, mau, true)]);
const docHieu = (ten: string, noiDung: string, img: string, cau: string[], tacGia?: string, w_ = 240): RawBai =>
  cham(2, '3. Đọc hiểu (2 điểm) — đọc thầm rồi viết tiếp cho đúng', [voiTranh(doan(ten, noiDung, tacGia), img, w_), { t: 'lines', items: cau }]);

const de = (n: number, desc: string, bai: RawBai[]): RawPhieu => {
  const tong = bai.reduce((s, b) => s + (b.diem ?? 0), 0);
  return {
    slug: `tieng-viet-cuoi-ki-1-de-${n}`,
    title: `Đề kiểm tra cuối kì 1 – Tiếng Việt lớp 1 – Đề ${n}`,
    description: desc,
    mon: 'tieng-viet',
    kieu: 'tv-hk1',
    head: ['ĐỀ KIỂM TRA CUỐI KÌ I – TIẾNG VIỆT 1', `ĐỀ SỐ ${n}`],
    thoiGian: 40,
    phan: { 0: 'I. Đọc thành tiếng', 1: 'II. Viết chính tả', 2: 'III. Đọc hiểu và bài tập' },
    bai: bai.map((b) => ({ ...b, diem: ((b.diem ?? 0) * 10) / tong })),
  };
};

export const DE_TV_CK1_A: RawPhieu[] = [
  de(1, 'Đọc đoạn văn về bé Hà đi công viên, viết chính tả, đọc hiểu "Chú của Hiên", điền c/k vào câu tục ngữ, nối từ với tranh.', [
    docTo('3', '', 'Mẹ cho Hà đi công viên. Cô bé rất thích thú và háo hức. Hà mặc váy trắng, đi giày màu hồng. Mẹ còn vuốt tóc và buộc nơ cho Hà. Mẹ bảo Hà đi chơi cần ăn mặc gọn gàng, lịch sự.', 'ck1-doc', 'Mẹ bảo Hà đi chơi cần ăn mặc như thế nào?', '(Sưu tầm)'),
    chinhTa('Em về làng xóm\nTre xanh, lúa xanh\nSông máng lượn quanh\nMột dòng xanh mát.'),
    docHieu('Chú của Hiên', 'Chú của Hiên là chiến sĩ ở đảo xa. Lần nào về nghỉ, chú đều có quà cho Hiên, rồi đưa Hiên đi chơi, dạy Hiên vẽ tranh. Chú còn kể cho Hiên nghe về biển đảo, về chú bộ đội. Mỗi lần chú về chơi, Hiên thấy vui quá.', 'ck1-chu', [
      `a) Chú của Hiên là ${w('chiến sĩ ở đảo xa', '~chiến sĩ')}.`,
      `b) Chú kể cho Hiên nghe về ${w('biển đảo, về chú bộ đội', '~biển đảo', '~bộ đội')}.`,
    ], 'Sưu tầm', 200),
    cham(1.5, '4. Em hãy điền "c" hoặc "k" vào chỗ trống (1,5 điểm)', [{ t: 'lines', items: [`${t('C', ['C', 'K'])}ó ${t('c', CK)}ông mài sắt ${t('c', CK)}ó ngày nên ${t('k', CK)}im.`] }]),
    cham(1.5, '5. Nối (1,5 điểm)', [noiTranh(['khoai tây', 'sầu riêng', 'huân chương'], ['ck1-saurieng', 'ck1-huanchuong', 'ck1-khoaitay'], ['ck1-khoaitay', 'ck1-saurieng', 'ck1-huanchuong'])]),
  ]),

  de(2, 'Đọc bài thơ "Buổi sớm", viết chính tả, đọc hiểu "Thăm Hà Nội", điền ng/ngh, sắp xếp từ ngữ thành câu.', [
    docTo('4', 'Buổi sớm', 'Mặt trời tỉnh giấc\nHai má ửng hồng,\nTung đám mây bông\nVươn vai thức dậy.\n\nCô gió thi chạy\nTrong cánh rừng xa,\nMang cả hương hoa\nÙa vào lớp học.', 'ck2-mattroi', 'Cô gió mang điều gì vào lớp học?', 'Hoàng Minh Ngọc', 180),
    chinhTa('Mây mang đầy mình nước\nGió thổi thành hạt mưa\nRồi chia đều cho đất\nCho cỏ cây sông hồ.'),
    docHieu('Thăm Hà Nội', 'Nghỉ hè, bố cho Thảo đi thăm chùa Một Cột. Bố còn kể cho Thảo về nhiều nơi mà Thảo chưa đến thăm ở Hà Nội. Hè năm tới, Thảo lại xin bố cho đi thăm thủ đô nữa.', 'ck2-bo', [
      `a) Thảo được bố dẫn đi ${w('thăm chùa Một Cột', '~chùa Một Cột')}.`,
      `b) Hè năm tới, Thảo ${w('lại xin bố cho đi thăm thủ đô nữa', '~thủ đô', '~Hà Nội')}.`,
    ], undefined, 200),
    cham(1, '4. Em hãy điền "ng" hoặc "ngh" vào chỗ trống (1 điểm)', [{ t: 'lines', items: ['Công cha như núi Thái Sơn', `${t('Ngh', ['Ng', 'Ngh'])}ĩa mẹ như nước trong ${t('ng', ['ng', 'ngh'])}uồn chảy ra.`] }]),
    cham(1, '5. Sắp xếp từ ngữ thành câu và viết lại câu (1 điểm)', [{ t: 'lines', items: [
      `a) bố / công nhân / là / em → ${w('Bố em là công nhân')}`,
      `b) tốt đẹp / đậy lại / xấu xa / phô ra → ${w('Tốt đẹp phô ra, xấu xa đậy lại', 'Tốt đẹp phô ra xấu xa đậy lại')}`,
    ] }]),
  ]),

  de(3, 'Đọc đoạn văn về Tết, viết chính tả, đọc hiểu "Cánh đồng quê", điền g/gh, nối câu về các mùa.', [
    docTo('3', '', 'Tết đến thật gần. Cái rét vẫn đậm. Mấy cây đào đã chi chít lộc non. Vài nụ tròn đỏ thắm vừa hé nở. Rồi trời ấm dần, đàn én nhỏ lại ríu rít bay về, náo nức đón chào năm mới.', 'ck3-doc', 'Khi Tết đến, đàn én thường làm gì?', '(Sưu tầm)'),
    chinhTa('Ăn vào mát mẻ\nLà trái thanh long\nXanh vỏ đỏ lòng\nLà trái dưa hấu.'),
    docHieu('Cánh đồng quê', 'Nắng vàng lan nhanh xuống chân núi rồi rải vội lên đồng lúa. Bà con xã viên đã đổ ra đồng gặt lúa mùa. Trên những ruộng lúa chín vàng, tiếng nói cười vui vẻ, rộn ràng cả cánh đồng quê.', 'ck3-dong', [
      `a) Bà con xã viên ${w('đã đổ ra đồng gặt lúa mùa', '~gặt lúa', '~đổ ra đồng')}.`,
      `b) ${w('Tiếng nói cười vui vẻ', '~nói cười')} làm rộn ràng cả cánh đồng quê.`,
    ], 'Sưu tầm', 220),
    cham(1.5, '4. Em hãy điền "g" hoặc "gh" vào chỗ trống (1,5 điểm)', [the(3, [['ck3-guong', `cái ${t('g', G)}ương`], ['ck3-ghe', `${t('gh', G)}ế ${t('g', G)}ỗ`], ['ck3-phong', `${t('g', G)}ọn ${t('g', G)}àng`]])]),
    cham(1.5, '5. Nối (1,5 điểm)', [noi(['Xuân tới', 'Hè sang', 'Đông về'], ['hoa đào nở thắm.', 'hoa phượng nở đỏ rực.', 'thời tiết lạnh giá.'], [0, 1, 2])]),
  ]),

  de(4, 'Đọc bài thơ "Trăng sáng", viết chính tả, đọc hiểu "Hội thi tài", điền uôc/uôt, khoanh vào từ viết đúng.', [
    docTo('3', 'Trăng sáng', 'Sân nhà em sáng quá\nNhờ ánh trăng sáng ngời\nTrăng tròn như quả bóng\nLơ lửng mà không rơi\n\nNhững đêm nào trăng khuyết\nTrông giống con thuyền trôi\nEm đi trăng theo bước\nNhư muốn cùng đi chơi.', 'ck4-trang', 'Những đêm trăng khuyết, nhìn trăng như thế nào?', 'Nhược Thuỷ', 220),
    chinhTa('Đồng làng vương chút heo may\nMầm cây tỉnh giấc vườn đầy tiếng chim.', 3),
    docHieu('Hội thi tài', 'Hè về, bầy thú mở hội thi tài. Hươu sao, hươu cao cổ và thỏ dự thi. Khỉ, dê thì cổ vũ. Cuối cùng, hươu cao cổ được trao giải có trang phục đẹp nhất, thỏ được trao giải chạy nhanh nhất.', 'ck4-thu', [
      `a) Hội thi có 3 con vật tham gia là: ${w('hươu sao', 'hươu cao cổ', 'thỏ')}, ${w('hươu cao cổ', 'hươu sao', 'thỏ')} và ${w('thỏ', 'hươu sao', 'hươu cao cổ')}.`,
      `b) Hươu cao cổ được trao giải ${w('có trang phục đẹp nhất', '~trang phục đẹp')}.`,
    ], undefined, 260),
    cham(1, '4. Điền "uôc" hoặc "uôt" (1 điểm)', [voiTranh([{ t: 'lines', cols: 2, items: [`nhem nh${t('uốc', ['uốc', 'uốt'])}`, `cái c${t('uốc', ['uốc', 'uốt'])}`, `v${t('uốt', ['uốc', 'uốt'])} ve`, `trắng m${t('uốt', ['uốc', 'uốt'])}`] }], 'ck4-cuoc', 120)]),
    cham(2, '5. Em hãy khoanh tròn vào từ viết đúng (2 điểm)', [{ t: 'lines', items: [
      `a) Mẹ mua con bạch ${t('tuộc', ['tuộc', 'tuột'])}.`,
      `b) ${t('Chuông', ['Chuông', 'Chuôn'])} chùa kêu vang.`,
      `c) Em ${t('quyết', ['quyên', 'quyết'])} tâm học thật tốt.`,
      `d) Chị mải ${t('miết', ['miết', 'miếc'])} dọn nhà.`,
    ] }]),
  ]),

  de(5, 'Đọc đoạn văn về Hồng đi chợ, viết chính tả, đọc hiểu "Nhà bà nội", chọn từ ngữ điền vào chỗ trống, nối từ với tranh.', [
    docTo('4', '', 'Hồng theo mẹ đi chợ. Chợ đông vui và bán đủ thứ. Ngay từ cổng là những dãy hàng đồ dùng gia đình. Bên trong là hàng rau, thịt và cá. Hồng thích lắm vì lần đầu cùng mẹ đi chợ.', 'ck5-cho', 'Hồng thấy những mặt hàng nào được bán ngoài chợ?'),
    chinhTa('Hoa cà tim tím\nHoa mướp vàng vàng\nHoa lựu chói chang\nĐỏ như đốm lửa.'),
    docHieu('Nhà bà nội', 'Nhà bà nội Thiêm ở trên đồi. Bà ươm cây, trồng giàn mướp và nuôi đàn gà tre. Chiều chiều, Thiêm cho gà ăn giúp bà và nhổ cỏ để cây mau lớn.', 'ck5-ba', [
      `a) Nhà bà nội Thiêm ở ${w('trên đồi', '~đồi')}.`,
      `b) Thiêm giúp bà ${w('cho gà ăn và nhổ cỏ', '~cho gà ăn', '~nhổ cỏ')}.`,
    ]),
    cham(1, '4. Chọn từ ngữ thích hợp điền vào chỗ trống: quả dưa hấu, rửa bát, đuổi bắt (1 điểm)', [{ t: 'lines', items: [
      `a) ${t('quả dưa hấu', ['quả dưa hấu', 'rửa bát', 'đuổi bắt'])} ăn rất ngọt và mát.`,
      `b) Em chơi ${t('đuổi bắt', ['quả dưa hấu', 'rửa bát', 'đuổi bắt'])} với các bạn.`,
    ] }]),
    cham(1, '5. Nối (1 điểm)', [tranhNoi(['ck5-cong', 'ck5-goccay'], ['chim công', 'cây cổ thụ', 'gốc cây', 'chim yến'], [0, 2])]),
  ]),

  de(6, 'Đọc bài thơ "Tết đang vào nhà", viết chính tả, đọc hiểu "Đà Lạt", điền g/gh, điền từ, viết tiếng có vần uôi, uôn.', [
    docTo('3', 'Tết đang vào nhà (trích)', 'Hoa đào trước ngõ\nCười vui sáng hồng\nHoa mai trong vườn\nRung rinh cánh trắng.\n\nSân nhà đầy nắng\nMẹ phơi áo hoa\nEm dán tranh gà\nÔng treo câu đối.', 'ck6-dao', 'Bài thơ trên miêu tả dịp nào trong năm?', 'Nguyễn Hồng Kiên'),
    chinhTa('Bác Hồ là vị lãnh tụ vô cùng vĩ đại của nhân dân Việt Nam. Sinh thời, Bác rất quan tâm đến các cháu thiếu niên, nhi đồng.'),
    docHieu('Đà Lạt', 'Nghỉ mát ở Đà Lạt thật là tuyệt vời. Nếu Nha Trang mát nhờ gió biển thì Đà Lạt mát nhờ khí hậu cao nguyên. Đến Đà Lạt lần đầu, bạn có cảm giác lâng lâng, hư ảo như huyền thoại.', 'ck6-dalat', [
      `a) Nha Trang mát nhờ ${w('gió biển', '~gió biển')}.`,
      `b) Đà Lạt mát nhờ ${w('khí hậu cao nguyên', '~khí hậu', '~cao nguyên')}.`,
    ]),
    cham(1, '4. Điền "g", "gh" vào chỗ trống (1 điểm)', [{ t: 'lines', cols: 3, items: [`kẹp ${t('gh', G)}im`, `${t('gh', G)}é qua`, `${t('g', G)}om ${t('g', G)}óp`] }]),
    cham(1, '5. Điền "rắp", "cánh", "kết", "thúng" vào chỗ trống (1 điểm)', [{ t: 'lines', cols: 2, items: [
      `a) Đều răm ${t('rắp', ['rắp', 'cánh', 'kết', 'thúng'])}`,
      `b) Chim ${t('cánh', ['rắp', 'cánh', 'kết', 'thúng'])} cụt`,
      `c) Quả bồ ${t('kết', ['rắp', 'cánh', 'kết', 'thúng'])}`,
      `d) Cái ${t('thúng', ['rắp', 'cánh', 'kết', 'thúng'])}`,
    ] }]),
    khong('6. Viết tiếng có vần dưới đây (1 điểm) — a) uôi:   b) uôn:', [viet(2)]),
  ]),

  de(7, 'Đọc đoạn văn về ước mơ của Nam, viết chính tả, đọc hiểu "Về nhà mới", nối câu với tranh, chọn tiếng viết đúng.', [
    docTo('4', '', 'Lúc học hát, Nam ước làm ca sĩ. Lúc nghe mẹ đọc thơ, Nam lại ước trở thành nhà thơ. Khi ra biển, Nam ước là người lái tàu, vượt qua những con sóng lớn. Nhìn lên bầu trời, Nam lại ước làm phi công.', 'ck7-maybay', 'Nam có mấy ước mơ, đó là những ước mơ gì?'),
    chinhTa('Gió giục lá xôn xao\nMưa giục cây trổ nụ\nĐàn chim lạc mùa cũ\nRủ nhau gọi vào thu.'),
    docHieu('Về nhà mới', 'Về nhà mới, Hữu nhớ nhà cũ lắm. Hữu nhớ bờ ao có cây keo, nơi Hữu và bố ngồi câu cá. Bãi rau cải mơn mởn. Cây nhãn có dây tầm gửi. Nhớ cả khi bạn bè nô đùa trên sân.', 'ck7-nha', [
      `a) Về nhà mới, Hữu nhớ ${w('nhà cũ lắm', '~nhà cũ', '~bờ ao', '~cây keo')}.`,
      `b) Hữu và bạn bè nô đùa ở ${w('trên sân', '~sân')}.`,
    ]),
    cham(1, '4. Dựa vào bài 1, em hãy nối đúng (1 điểm)', [noiTranh(['Lúc học hát, Nam ước làm', 'Lúc ra biển, Nam ước làm'], ['ck7-tau', 'ck7-casi'], ['ck7-casi', 'ck7-tau'])]),
    cham(1, '5. Em hãy chọn tiếng viết đúng (1 điểm)', [{ t: 'lines', items: [
      `a) Quả bí ${t('đỏ', ['đỏ', 'dỏ'])} màu vàng.`,
      `b) Cái máy ${t('tính', ['tính', 'tín'])} cầm tay rất đẹp.`,
    ] }]),
  ]),

  de(8, 'Đọc bài thơ "Nắng xuân hồng", viết chính tả, đọc hiểu "Nhà có khách", nối câu, chọn từ điền vào chỗ trống.', [
    docTo('4', 'Nắng xuân hồng (trích)', 'Qua rét lạnh mùa đông\nXuân lại ấm nắng hồng,\nNgàn cây vui hớn hở\nĐua hé nhuỵ khoe bông.', 'ck8-xuan', 'Bài thơ miêu tả khung cảnh của mùa nào?', 'Nguyễn Sư Giao', 260),
    chinhTa('Trước mặt Minh, đầm sen rộng mênh mông. Những bông sen trắng, sen hồng khẽ đu đưa trên nền lá xanh mượt.'),
    docHieu('Nhà có khách', 'Hôm nay chú Khánh sẽ đến ăn tối. Hà hăng hái vào bếp giúp mẹ. Mẹ làm cá tẩm bột. Bố nấu canh măng. Hà nhặt rau. Chẳng mấy chốc mâm cơm đã đầy đủ các món.', 'ck8-mam', [
      `a) Hà hăng hái ${w('vào bếp giúp mẹ', '~giúp mẹ', '~vào bếp')}.`,
      `b) Bố nấu món ${w('canh măng', '~canh măng')}.`,
    ]),
    cham(1, '4. Nối (1 điểm)', [noi(['Hà', 'Bố', 'Mẹ', 'Chú Khánh'], ['làm cá tẩm bột.', 'sẽ đến ăn tối.', 'nhặt rau.', 'nấu canh măng.'], [2, 3, 0, 1])]),
    cham(1, '5. Chọn từ thích hợp điền vào chỗ trống: vàng tươi, chạy bộ (1 điểm)', [{ t: 'lines', cols: 2, items: [
      `a) Hoa mai ${t('vàng tươi', ['vàng tươi', 'chạy bộ'])}.`,
      `b) Ông đang ${t('chạy bộ', ['vàng tươi', 'chạy bộ'])}.`,
    ] }]),
  ]),

  de(9, 'Đọc đoạn văn về cơn mưa, viết chính tả, đọc hiểu bài thơ "Rau xanh của bà", nối với tranh, sắp xếp từ ngữ thành câu.', [
    docTo('4', '', 'Trời xám xịt, mưa sầm sập như trút. Sấm sét ì ầm xa xa. Cây cỏ ngả rạp vào nhau. Một lúc sau, mưa bộp bộp rồi dứt hẳn. Mặt trời ló khỏi chân mây. Vạn vật như thức dậy, đầy ắp sắc màu.', 'ck9-mua', 'Lúc hết mưa, bầu trời trông như thế nào?'),
    chinhTa('Những chú hải âu sải rộng cánh bay. Bầu trời trong xanh. Phía chân trời, những đám mây đang bồng bềnh trôi.'),
    docHieu('Rau xanh của bà', 'Mấy thùng xốp nhỏ\nBà trồng húng chanh,\nTía tô, lá lốt\nHành, mùi biếc xanh.\n\nHúng chanh chữa ho\nTía tô giải cảm\nHành, mùi nấu canh\nLá lốt làm chả.', 'ck9-rau', [
      `a) Bà trồng trong thùng xốp những thứ là: ${[0, 1, 2, 3, 4].map(() => w('húng chanh', 'tía tô', 'lá lốt', 'hành', 'mùi', 'rau mùi')).join(', ')}.`,
      `b) Lá húng chanh dùng để ${w('chữa ho', '~chữa ho')}.`,
    ], 'Hoàng Minh Ngọc', 200),
    cham(1, '4. Em hãy dựa vào nội dung bài 3 để nối đúng (1 điểm)', [noiTranh(['Hành', 'Lá lốt', 'làm chả.', 'nấu canh.'], ['ck9-hanh', 'ck9-lalot'], ['ck9-hanh', 'ck9-lalot', 'ck9-lalot', 'ck9-hanh'])]),
    cham(1, '5. Sắp xếp từ ngữ thành câu và viết lại cho đúng (1 điểm)', [{ t: 'lines', items: [
      `a) trâu / như / khoẻ → ${w('Khoẻ như trâu', 'Khỏe như trâu')}`,
      `b) học / mãi / nữa / học → ${w('Học, học nữa, học mãi', 'Học học nữa học mãi', 'Học, học nữa học mãi', 'Học học nữa, học mãi')}`,
    ] }]),
  ]),

  de(10, 'Đọc bài thơ "Mèo con đi học", viết chính tả, đọc hiểu "Bố đi công tác", điền iêng/iên/yên, sửa từ viết sai.', [
    docTo('3,5', 'Mèo con đi học', 'Hôm nay trời nắng chang chang\nMèo con đi học chẳng mang thứ gì\nChỉ mang một cái bút chì\nVà mang một mẩu bánh mì con con.', 'ck10-meo', 'Mèo con mang những gì khi đi học?', 'Phan Thị Vàng Anh', 200),
    chinhTa('Cô dắt em đi\nTrên đường tới lớp\nĐường đẹp quê hương\nĐường dài đất nước.'),
    docHieu('Bố đi công tác', 'Bố đi công tác miền núi. Na gửi thư, kể cho bố về những niềm vui ở lớp. Em còn kể về ông bà, mẹ và bé Hà. Na viết: Ông bà và mẹ rất nhớ bố. Bé Hà đã biết nói, cứ bi bô gọi “Bố, bố”, vui lắm ạ.', 'ck10-bo', [
      `a) Bố đi công tác ở ${w('miền núi', '~miền núi')}.`,
      `b) Trong thư, Na viết: ${w('~nhớ bố', '~bi bô', '~biết nói')}.`,
    ], undefined, 200),
    cham(1.5, '4. Điền "iêng", "iên" hoặc "yên" vào chỗ trống (1,5 điểm)', [the(3, [['ck10-banh', `m${t('iếng', ['iếng', 'iến', 'yến'])} bánh`], ['ck10-yen', `${t('yên', ['iêng', 'iên', 'yên'])} xe`], ['ck10-bien', `b${t('iển', ['iểng', 'iển', 'yển'])} báo`]])]),
    cham(1, '5. Tìm từ viết sai và viết lại câu cho đúng (1 điểm)', [{ t: 'lines', items: [
      `a) Mẹ mua kà tím. → ${w('Mẹ mua cà tím', 'cà tím')}`,
      `b) Bố và em chơi gép hình. → ${w('Bố và em chơi ghép hình', 'ghép hình')}`,
    ] }]),
  ]),
];
