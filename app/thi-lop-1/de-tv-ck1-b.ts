// Đề kiểm tra cuối kì 1 – Tiếng Việt 1 (Qbooks), Đề 11–20 — chép từ bản scan trang 41–60.
// Đọc thành tiếng và chính tả giữ nguyên trên tờ đề nhưng không chấm trên máy (diem 0); máy chấm đọc hiểu và
// bài tập 4–5, điểm quy theo tỉ lệ điểm trên giấy cho đủ thang 10. Tranh cắt từ bản scan (public/thi-lop-1/tv/ck*).
// Đọc hiểu là câu viết tiếp → ô gõ chữ nhận câu trả lời đầy đủ hoặc có chứa ý chính ("~x").

import type { RawBai, RawBlock, RawPhieu } from './kieu';

const I = (n: string) => `tv/${n}`;
/** Ô chọn âm/vần/dấu: [[t:đáp án/lựa chọn 1,lựa chọn 2]] */
const t = (ans: string, opts: string[]) => `[[t:${ans}/${opts.join(',')}]]`;
/** Ô gõ chữ: nhiều đáp án ngăn bằng "|", "~x" = chứa x (đáp án đầu là đáp án hiện khi sai) */
const w = (...ans: string[]) => `[[w:${ans.join('|')}]]`;

const doan = (ten: string, noi: string): RawBlock[] => [...(ten ? [{ t: 'text' as const, text: ten, center: true }] : []), { t: 'text', text: noi }];
const tranhBen = (chu: RawBlock[], img?: string, rong = 240): RawBlock =>
  img ? { t: 'row', widths: ['3fr', '2fr'], cols: [chu, [{ t: 'img', src: I(img), w: rong }]] } : { t: 'row', cols: [chu] };
/** Nối cột A → cột B: `dung[i]` là chỉ số ô B nối với ô A thứ i (mảng = nhận nhiều cách nối). */
const noi = (a: string[], b: string[], dung: (number | number[])[]): RawBlock => ({ t: 'match', layout: 'cols', top: a.map((text) => ({ text })), bottom: b.map((text) => ({ text })), pairs: dung, topShape: 'box', bottomShape: 'box' });
const noiTranh = (a: string[], tranh: string[], dung: string[]): RawBlock => ({ t: 'match', layout: 'cols', top: a.map((text) => ({ text })), bottom: tranh.map((img) => ({ img: I(img) })), pairs: dung.map((d) => tranh.indexOf(d)), topShape: 'word' });
/** Nối tranh (cột A) → chữ (cột B), có ô chữ thừa. */
const noiTranhChu = (tranh: string[], b: string[], dung: number[]): RawBlock => ({ t: 'match', layout: 'cols', top: tranh.map((img) => ({ img: I(img) })), bottom: b.map((text) => ({ text })), pairs: dung, bottomShape: 'box' });
const the = (cols: number, items: [string, string][]): RawBlock => ({ t: 'cards', cols, items: items.map(([img, word]) => ({ img: I(img), word })) });
const viet = (dong: number, mau?: string, cursive = false): RawBlock => ({ t: 'viet', dong, mau, cursive });
const khong = (title: string, blocks: RawBlock[]): RawBai => ({ title, diem: 0, blocks });
const bai = (title: string, blocks: RawBlock[]): RawBai => ({ title, blocks });
const lines = (items: string[], cols?: number): RawBlock => ({ t: 'lines', items, cols });

const NG = ['ng', 'ngh'];
const G = ['g', 'gh'];
const CK = ['c', 'k', 'ng', 'ngh'];
const ng = t('ng', NG);
const ngh = t('ngh', NG);

/** Tìm 2 tiếng có vần: hai ô, mỗi ô nhận một tiếng bất kì trong danh sách. */
const tim = (van: string, ds: string[]) => `${van}: ${w(...ds)}   ${w(...ds)}`;
const OA = ['hoa', 'loa', 'toa', 'khoa', 'xoa', 'thoa', 'ngoa', 'choa', 'oa', 'hòa', 'hoà', 'họa', 'hoạ', 'hóa', 'hoá', 'hỏa', 'hoả', 'khóa', 'khoá', 'lòa', 'loà', 'lóa', 'loá', 'tòa', 'toà', 'tỏa', 'toả', 'xòa', 'xoà', 'xóa', 'xoá', 'xõa', 'xoã', 'đóa', 'đoá', 'góa', 'goá', 'chòa', 'choà', 'oà', 'òa', 'õa', 'oã'];
const OAI = ['ngoài', 'khoai', 'xoài', 'loài', 'oai', 'hoài', 'ngoái', 'loại', 'ngoại', 'thoại', 'khoái', 'choai', 'toại', 'đoái', 'hoại', 'xoải', 'toái', 'oái', 'thoải', 'hoái'];
const UOI = ['mười', 'mươi', 'người', 'cười', 'cưới', 'tươi', 'tưới', 'lười', 'lưới', 'lưỡi', 'bưởi', 'sưởi', 'cưỡi', 'dưới', 'rưới', 'rười', 'đười', 'ươi', 'ười', 'khươi', 'ngươi'];
const UOU = ['hươu', 'rượu', 'bướu', 'bươu', 'khướu', 'ươu'];

/** Phần 1: đoạn đọc chữ thật + tranh, câu hỏi miệng. */
const docTT = (diem: string, ten: string, noiDung: string, hoi: string, img?: string, tacGia?: string): RawBai =>
  khong(`1. Đọc thành tiếng (${diem} điểm) — người lớn nghe bé đọc, rồi hỏi bé câu hỏi`, [
    tranhBen([...doan(ten, noiDung), ...(tacGia ? [{ t: 'text' as const, text: tacGia, italic: true }] : [])], img),
    { t: 'text', text: `❓ ${hoi}` },
  ]);
const chinhTa = (mau: string): RawBai => khong('2. Viết chính tả (2 điểm) — người lớn đọc cho bé viết', [viet(4, mau, true)]);
const docHieu = (ten: string, noiDung: string, img: string, cau: string[]): RawBai =>
  bai('3. Đọc hiểu (2 điểm) — Đọc bài rồi viết tiếp vào chỗ trống', [tranhBen(doan(ten, noiDung), img, 230), lines(cau)]);

/** Bài chấm: [điểm trên giấy, bài] → quy về thang 10 theo tỉ lệ. */
const de = (n: number, desc: string, doc: RawBai, ct: RawBai, cham: [number, RawBai][]): RawPhieu => {
  const tong = cham.reduce((s, [p]) => s + p, 0);
  return {
    slug: `tieng-viet-cuoi-ki-1-de-${n}`,
    title: `Đề kiểm tra cuối kì 1 – Tiếng Việt lớp 1 – Đề ${n}`,
    description: desc,
    mon: 'tieng-viet',
    kieu: 'tv-hk1',
    head: ['ĐỀ KIỂM TRA CUỐI KÌ I – TIẾNG VIỆT 1', `ĐỀ SỐ ${n}`],
    thoiGian: 40,
    phan: { 0: 'I. Đọc thành tiếng', 1: 'II. Viết chính tả', 2: 'III. Đọc hiểu và bài tập' },
    bai: [doc, ct, ...cham.map(([p, b]) => ({ ...b, diem: (p * 10) / tong }))],
  };
};

export const DE_TV_CK1_B: RawPhieu[] = [
  de(11, 'Đọc thành tiếng đoạn văn về biển buổi sớm, viết chính tả, đọc hiểu "Gấu và thỏ", nối câu, tìm tiếng có vần oa, oai.',
    docTT('3,5', '', 'Buổi sớm mai, ông mặt trời nhô lên từ biển. Mặt biển nhuộm màu xanh biếc. Đàn hải âu sải cánh bay liệng trên bầu trời. Xa xa là những cánh buồm căng gió.', 'Buổi sớm, mặt biển màu gì?', 'ck11-doc'),
    chinhTa('Mỏng như là giấy\nMưa nắng nào phai,\nTên nghe rất mỏng\nNhưng mà dẻo dai.'),
    [
      [2, docHieu('Gấu và thỏ', 'Nhà gấu và nhà thỏ nâu cách nhau một bờ giậu. Mỗi sáng, thỏ nâu bắc ghế đẩu, nghểnh đầu gọi gấu đi học. Học xong, hai bạn rủ nhau đi xem bác mèo vằn bắt sâu và châu chấu làm mồi câu cá.', 'ck11-hieu', [
        `a) Mỗi sáng, thỏ nâu ${w('bắc ghế đẩu, nghểnh đầu gọi gấu đi học', '~gọi gấu', '~bắc ghế')}.`,
        `b) Học xong, hai bạn ${w('rủ nhau đi xem bác mèo vằn bắt sâu và châu chấu làm mồi câu cá', '~mèo vằn', '~xem bác mèo')}.`,
      ])],
      [1.5, bai('4. Nối (1,5 điểm)', [noi(['Gia đình em', 'Lớp của em', 'Em yêu'], ['rất đoàn kết.', 'rất hạnh phúc.', 'cô giáo lớp em.'], [[1, 0], [0, 1], 2])])],
      [1, bai('5. Tìm 2 tiếng có vần (1 điểm)', [lines([`a) ${tim('oa', OA)}`, `b) ${tim('oai', OAI)}`])])],
    ]),

  de(12, 'Đọc thành tiếng bài thơ "Ếch cốm", viết chính tả, đọc hiểu "Đi mua đồ", tìm từ có ai/ay theo tranh, khoanh tiếng viết đúng.',
    docTT('4', 'Ếch cốm', 'Có một hôm ếch cốm\nTinh nghịch nấp bờ ao\nMải rình bắt cào cào\nQuên sách bên bờ cỏ.\n\nTới lớp cô hỏi nhỏ:\n- Sách đâu ếch học bài?\nCậu gãi đầu, gãi tai:\n- Thưa cô, em xin lỗi.', 'Tại sao ếch cốm lại để quên sách?', undefined, 'Mộc Miên'),
    chinhTa('Đàn ngan đã nở\nChín chú ngan non\nNgan mẹ ngắm con:\n“Ồ! Ưa nhìn thế!”.'),
    [
      [2, docHieu('Đi mua đồ', 'Hạnh và mẹ ra cửa hàng mua đồ. Mẹ mua kính cho bố, mua ấm tích cho bà. Hạnh xin mẹ mua bàn tính học cộng trừ. Mua xong, Hạnh và mẹ đi xích lô về nhà.', 'ck12-hieu', [
        `a) Mẹ mua những món đồ là: ${w('kính cho bố, ấm tích cho bà', '~kính', '~ấm tích')}.`,
        `b) Mua xong, Hạnh và mẹ đi ${w('xích lô về nhà', '~xích lô')}.`,
      ])],
      [1, bai('4. Nhìn tranh, tìm các từ ngữ chứa “ai” hoặc “ay”. Viết các từ tìm được vào vở (1 điểm)', [
        { t: 'img', src: I('ck12-be'), w: 300 },
        lines([`1. ${w('tai', '~tai', '~tay')}`, `2. ${w('tay', '~tay', '~tai')}`], 2),
      ])],
      [1, bai('5. Khoanh vào tiếng viết đúng (1 điểm)', [lines([`a) Chị ngã em ${t('nâng', ['nâng', 'năng'])}.`, `b) Chân ${t('cứng', ['cứng', 'cúng'])} đá mềm.`])])],
    ]),

  de(13, 'Đọc thành tiếng đoạn văn về lạc đà, viết chính tả, đọc hiểu "Ngày Tết", nối chữ với tranh, chọn từ điền chỗ trống.',
    docTT('4', '', 'Lạc đà là con vật đặc biệt. Nó có cái bướu to trên lưng. Nó có thể sống qua nhiều ngày mà không cần ăn uống. Lạc đà giúp con người băng qua những vùng sa mạc khô cằn.', 'Trên lưng lạc đà có điều gì đặc biệt?', 'ck13-doc'),
    chinhTa('Chuồn chuồn tinh nghịch\nTrốn vào ruộng rau\nLuống cuống thò ra\nCái đuôi đỏ chót.'),
    [
      [2, docHieu('Ngày Tết', 'Ngày Tết, bố và mẹ cho bé Mây đi chơi Bờ Hồ. Ở đó có hội, Mây thích lắm. Bố kể: “Hồi bé, bố cũng hay được ông bà nội cho đi xem hội. Bố thích nhất là hội bơi trải.”.', 'ck13-hieu', [
        `a) Ngày Tết, bố và mẹ cho ${w('bé Mây đi chơi Bờ Hồ', '~bờ hồ')}.`,
        `b) Bố thích nhất là ${w('hội bơi trải', '~bơi trải', '~bơi chải')}.`,
      ])],
      [1, bai('4. Nối (1 điểm)', [noiTranh(['con tinh tinh', 'đang ăn chuối', 'con khỉ'], ['ck13-tinhtinh', 'ck13-khi'], ['ck13-tinhtinh', 'ck13-khi', 'ck13-khi'])])],
      [1, bai('5. Em chọn từ trong ngoặc và điền vào chỗ trống (1 điểm): yêu thương, Tiếng Việt', [
        lines([`a) Bố mẹ luôn ${t('yêu thương', ['yêu thương', 'Tiếng Việt'])} em.`, `b) Em rất thích học môn ${t('Tiếng Việt', ['yêu thương', 'Tiếng Việt'])}.`]),
      ])],
    ]),

  de(14, 'Đọc thành tiếng đoạn văn về gà mẹ, viết chính tả, đọc hiểu "Về quê", điền ep/êp, tìm tiếng có vần ươi, ươu.',
    docTT('4', '', 'Gà mẹ dẫn đàn con đi ăn. Chốc chốc, tìm thấy mồi, gà mẹ “tục… tục…”. Đàn con chạy lại, chen chúc nhau ăn rồi rúc vào bên mẹ. Gà mẹ ủ ấm cho các con.', 'Gà mẹ gọi đàn con đến ăn như thế nào?', 'ck14-doc'),
    chinhTa('Nghe cò cuống rủ\nXuống bờ ao chơi\nHai bạn đùa vui\nThích ơi là thích!'),
    [
      [2, docHieu('Về quê', 'Nghỉ hè, mẹ cho Hòe đi tàu hỏa về quê. Vườn nhà bà có rất nhiều cây, lá hoa lòa xòa ra cả lối đi. Hôm tiễn hai mẹ con ra thành phố, bà cắt cho Hòe bó hoa loa kèn to.', 'ck14-hieu', [
        `a) Mẹ và Hòe đi ${w('tàu hỏa', 'tàu hoả', '~tàu')} về quê.`,
        `b) Lúc tiễn hai mẹ con, bà cho Hòe ${w('bó hoa loa kèn to', '~loa kèn')}.`,
      ])],
      [1, bai('4. Điền “ep”, “êp” thích hợp vào chỗ trống (1 điểm)', [
        the(4, [['ck14-dep', `đôi d${t('ép', ['ép', 'ếp'])}`], ['ck14-gao', `gạo n${t('ếp', ['ép', 'ếp'])}`], ['ck14-bep', `đầu b${t('ếp', ['ép', 'ếp'])}`], ['ck14-chep', `ghi ch${t('ép', ['ép', 'ếp'])}`]]),
      ])],
      [1, bai('5. Tìm 2 tiếng có vần (1 điểm)', [lines([`a) ${tim('ươi', UOI)}`, `b) ${tim('ươu', UOU)}`])])],
    ]),

  de(15, 'Đọc thành tiếng đoạn văn về cơn mưa, viết chính tả, đọc hiểu "Bác sĩ An", điền ng/ngh, sắp xếp từ thành câu.',
    docTT('4', '', 'Trời sắp mưa. Chuồn chuồn bay thấp. Bầu trời đen kịt. Gió thổi mạnh cuốn theo những đám lá khô. Rồi mưa ào ào trút xuống. Mưa tạnh, những hạt mưa long lanh đọng trên các cuống lá.', 'Câu hỏi khó: “Trời sắp mưa. Chuồn chuồn bay thấp.” Câu văn này giúp em nhớ đến câu thơ nào về hiện tượng thiên nhiên?', 'ck15-doc'),
    chinhTa('Chuột luồn lỗ hổng\nMèo đuổi theo sau\nChuột cố chạy mau\nTrốn đâu cho thoát.'),
    [
      [2, docHieu('Bác sĩ An', 'Bác sĩ An chuyên chữa bệnh cho các loài vật. Năm ngoái, nhà bác sĩ chẳng có gì để ăn. Các loài vật đã thoăn thoắt khuân đồ ăn cho bác sĩ.', 'ck15-hieu', [
        `a) Bác sĩ An chuyên ${w('chữa bệnh cho các loài vật', '~chữa bệnh')}.`,
        `b) Nhà bác sĩ chẳng có gì để ăn. Các loài vật đã ${w('thoăn thoắt khuân đồ ăn cho bác sĩ', '~khuân', '~mang đồ ăn', '~đồ ăn')}.`,
      ])],
      [1, bai('4. Điền “ng”, “ngh” thích hợp vào chỗ trống (1 điểm)', [
        tranhBen([lines([`Thỏ con ${ng}ốc ${ngh}ếch tưởng đây là cà rốt nên ${ng}ấu ${ngh}iến ăn.`])], 'ck15-tho', 140),
      ])],
      [1, bai('5. Sắp xếp từ ngữ thành câu và viết lại câu (1 điểm)', [
        lines([`a) đồng hồ / reng / kêu → ${w('Đồng hồ kêu reng.')}`, `b) ông / hiền / rất / hậu / em → ${w('Ông em rất hiền hậu.')}`]),
      ])],
    ]),

  de(16, 'Đọc thành tiếng đoạn văn về chú chim sâu, viết chính tả, đọc hiểu "Tình bạn", điền c/k, ng/ngh, nối tranh với chữ.',
    docTT('4', '', 'Sớm nay thức dậy, Nam chợt thấy một chú chim sâu. Chim hớn hở như chào Nam. Nó nhảy nhót một hồi rồi bay qua bay lại, tìm bắt sâu bọ cho cây. Nam thấy rất thích thú.', 'Sáng sớm thức dậy, Nam thấy thích thú vì điều gì?', 'ck16-doc'),
    chinhTa('Gió từ tay mẹ\nRu bé ngủ say\nThay cho gió trời\nGiữa trưa oi ả.'),
    [
      [2, docHieu('Tình bạn', 'Nhím Xù và Thỏ Xám là hai bạn thân. Mùa hè, hai bạn rủ nhau đi hái hoa, đào củ. Mùa thu, hai bạn ra bãi cỏ nô đùa. Ngày lại ngày, tình bạn càng thêm thắm thiết.', 'ck16-hieu', [
        `a) Mùa thu, hai bạn ${w('ra bãi cỏ nô đùa', '~nô đùa', '~bãi cỏ')}.`,
        `b) Mùa hè, hai bạn ${w('rủ nhau đi hái hoa, đào củ', '~hái hoa', '~đào củ')}.`,
      ])],
      [1, bai('4. Điền “c”, “k” hoặc “ng”, “ngh” vào chỗ trống (1 điểm)', [
        lines([
          `Con ${t('c', CK)}óc là ${t('c', CK)}ậu ông trời, ${t('c', CK)}óc ${t('k', CK)}êu trời đổ mưa.`,
          `Em ${t('ngh', CK)}ĩ mình sẽ tạo dáng ${t('ngh', CK)}iêng ${t('ng', CK)}ười theo gió.`,
        ]),
      ])],
      [1, bai('5. Nối (1 điểm)', [noiTranhChu(['ck16-sach', 'ck16-xichdu'], ['giá sách', 'bập bênh', 'xích đu', 'sách vở'], [3, 2])])],
    ]),

  de(17, 'Đọc thành tiếng bài thơ "Gió", viết chính tả, đọc hiểu "Bé ngoan", điền ng/ngh, tìm từ viết sai và viết lại câu.',
    docTT('3,5', 'Gió', 'Gió đưa những cánh diều bay bổng\nGió ru cái ngủ đến la đà\nHình như gió cũng thèm ăn quả\nHết trèo cây bưởi lại cây na…', 'Gió đi qua những loại cây nào?', undefined, 'Ngô Văn Phú'),
    chinhTa('Bầu trời xanh xanh\nÔm đàn mây trắng\nVòm cây xanh xanh\nXòe ô che nắng.'),
    [
      [2, docHieu('Bé ngoan', 'Mẹ ra vườn hái rau, bé cầm rổ cho mẹ. Mẹ ngồi xếp quần, bé ngồi xếp cùng. Mẹ vào bếp nấu cơm, bé nhặt rau cho mẹ. Xong việc, mẹ ôm bé vào lòng, thơm lên trán bé.', 'ck17-hieu', [
        `a) Mẹ vào bếp nấu cơm, ${w('bé nhặt rau cho mẹ', '~nhặt rau')}.`,
        `b) Xong việc, mẹ ${w('ôm bé vào lòng, thơm lên trán bé', '~ôm bé', '~thơm lên trán', '~thơm bé')}.`,
      ])],
      [1.5, bai('4. Điền “ng”, “ngh” thích hợp vào chỗ trống (1,5 điểm)', [lines([`bị ${ng}ã`, `${ngh}iên cứu`, `${ng}ấu ${ngh}iến`], 3)])],
      [1, bai('5. Tìm từ viết sai và viết lại câu cho đúng (1 điểm)', [
        lines([`a) Chú chin vành khuyên hót líu lo. → ${w('Chú chim vành khuyên hót líu lo.')}`, `b) Chú chuột chạy quanh cánh đồn. → ${w('Chú chuột chạy quanh cánh đồng.')}`]),
      ])],
    ]),

  de(18, 'Đọc thành tiếng đoạn văn về vịt con tập bơi, viết chính tả, đọc hiểu "Ngày cuối năm", điền um/un/ung, sắp xếp từ thành câu.',
    docTT('3,5', '', 'Nhà vịt ở gần một con kênh xinh xinh. Hôm nay trời đẹp, bố mẹ cho vịt ra kênh tập bơi. Mới tập mà vịt con đã bơi rất nhanh. Vịt bố vịt mẹ vui quá, kêu “cạp cạp”.', 'Vịt con được bố mẹ dạy điều gì?', 'ck18-doc'),
    chinhTa('Ai bảo là giấy\nNắng không bạc màu?\nAi bảo là giấy\nMưa không ướt nhàu?'),
    [
      [2, docHieu('Ngày cuối năm', 'Ngày cuối năm, bé cùng cả nhà gói bánh chưng. Bố thì dọn bàn ghế lấy chỗ trống ngồi gói bánh. Còn mẹ chuẩn bị gạo nếp, thịt, đỗ, lá chuối xanh. Sau một hồi bận rộn cũng chuẩn bị xong.', 'ck18-hieu', [
        `a) Bé cùng cả nhà ${w('gói bánh chưng', '~bánh chưng')}.`,
        `b) Mẹ chuẩn bị ${w('gạo nếp, thịt, đỗ, lá chuối xanh', '~gạo nếp', '~lá chuối')}.`,
      ])],
      [1.5, bai('4. Điền “um”, “un” hoặc “ung” vào chỗ trống (1,5 điểm)', [
        the(3, [['ck18-chum', `cái ch${t('um', ['um', 'un', 'ung'])}`], ['ck18-hung', `anh h${t('ùng', ['ùm', 'ùn', 'ùng'])}`], ['ck18-giun', `con gi${t('un', ['um', 'un', 'ung'])}`]]),
      ])],
      [1, bai('5. Sắp xếp từ thành câu và viết lại câu (1 điểm)', [
        lines([
          `a) mẹ / chợ huyện / chở cá / ra → ${w('Mẹ chở cá ra chợ huyện.')}`,
          `b) ông nội / bà nội / em / đón / về nhà / và → ${w('Ông nội và bà nội đón em về nhà.', 'Bà nội và ông nội đón em về nhà.', 'Em đón ông nội và bà nội về nhà.', 'Em đón bà nội và ông nội về nhà.')}`,
        ]),
      ])],
    ]),

  de(19, 'Đọc thành tiếng bài thơ "Quê hương", viết chính tả, đọc hiểu "Buổi liên hoan", điền ng/ngh, khoanh vào từ viết đúng.',
    docTT('3,5', 'Quê hương', 'Quê hương là con diều biếc\nTuổi thơ con thả trên đồng\nQuê hương là con đò nhỏ\nÊm đềm khua nước ven sông.', 'Đối với các bạn nhỏ, quê hương là gì?', undefined, 'Đỗ Trung Quân'),
    chinhTa('Trái gấc xinh xinh\nNắng vàng chín đỏ\nBao nhiêu mặt trời\nNgủ say trong đó.'),
    [
      [2, docHieu('Buổi liên hoan', 'Cô giáo phát cho mỗi bạn một túi quà nhỏ mang về nhà. Túi quà của bé có những chiếc kẹo nhiều màu sắc, trông thật ngon lành. Thế nhưng bé không bóc ra ăn ngay, mà cho vào cặp, mang về nhà cho ông.', 'ck19-hieu', [
        `a) Cô giáo phát cho mỗi bạn ${w('một túi quà nhỏ mang về nhà', '~túi quà')}.`,
        `b) Bé cho kẹo vào cặp để ${w('mang về nhà cho ông', '~cho ông')}.`,
      ])],
      [1, bai('4. Điền “ng” hoặc “ngh” thích hợp vào chỗ trống (1 điểm)', [lines([`bé ${ng}oan`, `${ngh}ịch ${ng}ợm`, `ý ${ngh}ĩa`, `${ng}ốc ${ngh}ếch`], 2)])],
      [1.5, bai('5. Em hãy khoanh tròn vào từ viết đúng (1,5 điểm)', [
        lines([
          `a) Cành cây rụng hết lá trông càng gầy ${t('guộc', ['guộc', 'ghuộc'])}.`,
          `b) Mặt mày nhem nhuốc ${t('chẳng', ['chẳng', 'trẳng'])} đáng yêu đâu.`,
          `c) ${t('Cánh', ['Cánh', 'Kánh'])} tay em bé trắng nõn.`,
        ]),
      ])],
    ]),

  de(20, 'Đọc thành tiếng bài thơ "Quê em", viết chính tả, đọc hiểu "Trường em", điền g/gh, sắp xếp từ thành câu.',
    docTT('4', 'Quê em', 'Quê em đồng lúa, nương dâu\nBên dòng sông nhỏ nhịp cầu bắc ngang.\nDừa xanh tỏa mát đường làng,\nNgân nga tiếng hát, rộn ràng tiếng thoi.', 'Bạn nhỏ nhắc đến những cảnh vật nào ở quê hương?', undefined, 'Nguyên Hồ'),
    chinhTa('Này các bạn nhỏ\nĐừng hái hoa tươi\nHoa yêu mọi người\nNên hoa khoe sắc.'),
    [
      [2, docHieu('Trường em', 'Trường em có rất nhiều hoa và cây xanh. Sau khi tan học, em và các bạn thường tưới nước, bắt sâu cho cây. Được chăm sóc chu đáo, cây cối lúc nào cũng xanh mướt.', 'ck20-hieu', [
        `a) Trường em có rất nhiều ${w('hoa và cây xanh', '~hoa', '~cây xanh')}.`,
        `b) Sau khi tan học, ${w('em và các bạn thường tưới nước, bắt sâu cho cây', '~tưới nước', '~bắt sâu', '~tưới cây')}.`,
      ])],
      [1, bai('4. Điền “g” hoặc “gh” thích hợp vào chỗ trống (1 điểm)', [
        lines([`${t('g', G)}ăng tay`, `${t('g', G)}ồng ${t('g', G)}ánh`, `${t('gh', G)}ồ ${t('gh', G)}ề`, `${t('g', G)}ai ${t('g', G)}óc`], 2),
      ])],
      [1, bai('5. Sắp xếp từ thành câu và viết lại câu (1 điểm)', [
        lines([`trường học / thứ hai / ngôi nhà / là / của em → ${w('Trường học là ngôi nhà thứ hai của em.')}`]),
      ])],
    ]),
];
