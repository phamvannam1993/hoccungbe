// Tiếng Việt lớp 2 (Kết nối tri thức) — chép từ thư mục "đề thi tiếng việt lớp 2" (Loigiaihay.com):
// 5 đề giữa học kì I (PDF) và 5 đề cuối học kì I (Đề 1–3 trong file docx, Đề 4–5 PDF). Đáp án trắc nghiệm theo
// bảng đáp án của đề; câu gạch chân / điền dấu / điền từ theo phần "Lời giải chi tiết".
// Đọc thành tiếng, nghe viết, viết đoạn văn và câu trả lời tự do: hiện trên tờ đề để người lớn chấm, máy không chấm.

import type { RawBai, RawBlock, RawPhieu } from '../thi-lop-1/kieu';

const mc = (q: string, opts: string[], ans: string): RawBlock => ({ t: 'mc', q, opts, ans, cols: opts.some((o) => o.length > 22) ? 1 : opts.some((o) => o.length > 12) ? 2 : Math.min(opts.length, 4) });
const B = (title: string, blocks: RawBlock[]): RawBai => ({ title, blocks });
const tuDo = (title: string, dong = 2): RawBai => ({ title, diem: 0, blocks: [{ t: 'viet', dong }] });
const ln = (items: string[], cols = 1): RawBlock => ({ t: 'lines', cols, items });
const gach = (cau: string, ...dung: string[]): RawBlock => ({ t: 'gach', cau, dung });
const noi = (a: string[], b: string[], dung: number[]): RawBlock => ({ t: 'match', layout: 'cols', top: a.map((text) => ({ text })), bottom: b.map((text) => ({ text })), pairs: dung, topShape: 'box', bottomShape: 'box' });
/** Ô chọn dấu câu */
const dau = (d: string, opts = ['.', '?', '!']) => `[[T:${d}/${opts.join('|')}]]`;
const PHAY = (co: boolean) => `[[T:${co ? ',' : '(không)'}/,|(không)]]`;

const DOC_TIENG: RawBai = { title: 'I. Đọc thành tiếng — giáo viên / phụ huynh nghe bé đọc', diem: 0, blocks: [{ t: 'text', italic: true, text: 'Bé đọc một đoạn trong các bài tập đọc và trả lời một số câu hỏi về nội dung đoạn vừa đọc.' }] };
const baiDoc = (ten: string, noiDung: string, tacGia?: string): RawBai => ({
  title: 'II. Đọc hiểu — Đọc thầm văn bản sau:',
  diem: 0,
  blocks: [{ t: 'text', text: ten, center: true }, { t: 'text', text: noiDung }, ...(tacGia ? [{ t: 'text' as const, italic: true, text: `(${tacGia})` }] : [])],
});
const viet = (ten: string, doan: string, deVan: string): RawBai[] => [
  { title: '1. Nghe viết — người lớn đọc cho bé viết', diem: 0, blocks: [{ t: 'text', text: ten, center: true }, { t: 'viet', dong: Math.max(3, Math.ceil(doan.length / 80) + 1), mau: doan }] },
  tuDo(`2. ${deVan}`, 4),
];

const de = (loai: 'giua-ki' | 'cuoi-ki', n: number, desc: string, doc: RawBai, cau: RawBai[], vietB: RawBai[]): RawPhieu => ({
  slug: `tieng-viet-lop-2-${loai === 'giua-ki' ? 'giua-ki-1' : 'cuoi-ki-1'}-de-${n}`,
  title: `${loai === 'giua-ki' ? 'Đề thi giữa học kì 1' : 'Đề thi cuối học kì 1'} – Tiếng Việt lớp 2 – Đề ${n}`,
  description: desc,
  mon: 'tieng-viet',
  kieu: 'giua-ki',
  head: [`ĐỀ THI ${loai === 'giua-ki' ? 'GIỮA' : 'CUỐI'} HỌC KÌ I – Đề số ${n}`, 'Môn: Tiếng Việt - Lớp 2', ' 2'],
  thoiGian: 60,
  phan: { 0: 'A. KIỂM TRA ĐỌC', [2 + cau.length]: 'B. KIỂM TRA VIẾT' },
  bai: [DOC_TIENG, doc, ...cau, ...vietB],
});

/* ───────────── Giữa học kì I ───────────── */

const GK: RawPhieu[] = [
  de('giua-ki', 1, 'Đọc bài thơ "Tình bạn", điền dấu câu, kiểu câu Ai là gì, tìm từ chỉ hoạt động – cảm xúc – đặc điểm.',
    baiDoc('Tình bạn', 'Nếu có thể bạn hãy kể cho tôi.\nNỗi buồn nào cũng có thể phai phôi\nNỗi đau nào trước sau rồi cũng đỡ\nHãy đứng lên khi ta còn hơi thở\nĐừng vì nó mà cản trở tương lai.\nCon đường đời nhiều cạm bẫy chông gai\nGặp khó khăn cùng ghé vai san sẻ\nĐừng e ngại mà một mình lặng lẽ\nVui hay buồn mình không thể quên nhau.\nLà bạn tốt phải sống trước như sau\nGiàu hay nghèo vẫn bền lâu tình bạn\nSang hay hèn chẳng bao giờ nghĩa cạn\nĐể tình bạn được trong sáng như gương!', 'Sưu tầm'),
    [
      B('Câu 1. Ở câu thơ đầu tiên, tác giả muốn bạn mình kể điều gì?', [mc('', ['Tác giả muốn bạn kể cho mình những câu chuyện vui trong cuộc sống.', 'Tác giả muốn bạn mình chia sẻ, nói ra những nỗi buồn để nhẹ lòng hơn.', 'Tác giả muốn bạn mình kể những bí mật.', 'Tác giả muốn bạn mình kể những câu chuyện riêng chỉ hai người biết.'], 'Tác giả muốn bạn mình chia sẻ, nói ra những nỗi buồn để nhẹ lòng hơn.')]),
      B('Câu 2. Trong bài thơ, tác giả mong muốn điều gì với bạn bè của mình?', [mc('', ['Muốn bạn bè kề bên sát vai nhau đến cuối đời.', 'Muốn bạn bè luôn vượt qua khó khăn để tìm kiếm hạnh phúc.', 'Muốn chia sẻ nỗi buồn, dù giàu nghèo, khó khăn để tình bạn được lâu bền.', 'Muốn bạn mình phải tự mạnh mẽ vượt qua khó khăn trong cuộc sống.'], 'Muốn chia sẻ nỗi buồn, dù giàu nghèo, khó khăn để tình bạn được lâu bền.')]),
      tuDo('Câu 3. Theo em tình bạn đẹp là tình bạn như thế nào?'),
      B('Câu 4. Câu thơ: “Để tình bạn được trong sáng như gương!” có ý nghĩa là gì?', [mc('', ['Là tình bạn trong sáng, đẹp đẽ như gương.', 'Là tình bạn đẹp, có thể nhìn rõ nhau như soi gương.', 'Là tình bạn đẹp, trong sáng, thấu hiểu nhau coi nhau như tri kỉ.', 'Là tình bạn đẹp, hai người phải luôn luôn giống nhau.'], 'Là tình bạn đẹp, trong sáng, thấu hiểu nhau coi nhau như tri kỉ.')]),
      B('Câu 5. Em hãy điền dấu câu thích hợp vào chỗ trống dưới đây:', [ln([`a) Tôi và Lan là những người bạn tốt ${dau('.')}`, `b) Bạn ơi mình cùng chơi nhé ${dau('!')}`, `c) Bạn có yêu quý tôi không ${dau('?')}`])]),
      B('Câu 6. Câu nào dưới đây thuộc kiểu câu Ai (cái gì, con gì) là gì?', [mc('', ['Chú Nam xây bể nước cho nhà em.', 'Lớp em làm vệ sinh lớp học sạch sẽ.', 'Mẹ may cho em chiếc áo rất ấm.', 'Chiếc túi xanh là chiếc túi mẹ may cho em.'], 'Chiếc túi xanh là chiếc túi mẹ may cho em.')]),
      tuDo('Câu 7. Tìm trong bài đọc và ghi lại mỗi cột 3 từ: Từ chỉ hoạt động · Từ chỉ cảm xúc · Từ chỉ đặc điểm', 3),
    ],
    viet('Dế Mèn phiêu lưu kí', 'Bởi tôi ăn uống điều độ và làm việc có chừng mực nên tôi chóng lớn lắm. Chẳng bao lâu tôi đã trở thành một chàng dế thanh niên cường tráng. Đôi càng tôi mẫm bóng. Những cái vuốt ở chân, ở khoeo cứ cứng dần và nhọn hoắt. (Tô Hoài)', 'Em hãy viết 4 - 5 câu về thầy cô giáo của em.'),
  ),
  de('giua-ki', 2, 'Đọc "Bé Chăm may áo", từ chỉ sự vật, gạch chân từ chỉ hoạt động, dấu hỏi – ngã, điền ng/gh.',
    baiDoc('Bé Chăm may áo', 'Bé Chăm rất chăm làm nhưng cũng mau chán việc. Làm việc này chưa xong, em lại bỏ dở để làm việc khác. Bố em thường khuyên răn em, nhưng bé Chăm vẫn chưa sửa chữa được. Một hôm, bố dẫn Chăm đến bác thợ may ở trong làng để may một bộ quần áo mới. Chăm thích quá vì sắp có bộ quần áo đẹp để mặc Tết.\nMột ngày, hai ngày và ngày thứ ba, Chăm đến lấy quần áo mới. Nhưng bác thợ may chỉ may xong nửa cái áo và nửa cái quần. Bác bảo Chăm cứ thế mặc vào xem sao. Chăm bực tức nói:\n- Thế bác hãy may xong cái áo cho cháu đã có được không? Bác làm thế thành ra chẳng cái nào xong hẳn cả!\nBác thợ nghiêm trang bảo: “Cháu nói đúng, làm việc gì cũng phải làm đến nơi đến chốn mới khỏi phí công vô ích.”', 'Sưu tầm'),
    [
      B('Câu 1. Bé Chăm là người như thế nào?', [mc('', ['Chăm là một cô bé lười biếng.', 'Chăm là một cô bé chăm làm nhưng cũng hay chán việc.', 'Chăm là một cô bé chăm chỉ.', 'Chăm là một cậu bé ngoan, chăm chỉ làm việc nhà.'], 'Chăm là một cô bé chăm làm nhưng cũng hay chán việc.')]),
      B('Câu 2. Bác thợ may đã may quần áo cho Chăm như thế nào?', [mc('', ['Bác may xong chiếc áo rồi may đến chiếc quần.', 'Bác may xong chiếc quần rồi may đến chiếc áo.', 'Bác chỉ may được nửa cái áo và nửa cái quần.', 'Bác chỉ cắt xong vải rồi may áo với quần vào với nhau.'], 'Bác chỉ may được nửa cái áo và nửa cái quần.')]),
      B('Câu 3. Câu chuyện khuyên em điều gì?', [mc('', ['Khi làm việc gì, chúng ta cũng phải làm đến nơi đến chốn.', 'Con cái phải biết vâng lời cha mẹ.', 'Trẻ em chỉ nên làm những việc mình yêu thích.', 'Chúng ta cần tập trung làm nhiều việc một lúc.'], 'Khi làm việc gì, chúng ta cũng phải làm đến nơi đến chốn.')]),
      B('Câu 4. Từ nào dưới đây là từ chỉ sự vật?', [mc('', ['Quần áo', 'Mới', 'May', 'Bực tức'], 'Quần áo')]),
      B('Câu 5. Gạch chân dưới các từ ngữ chỉ hoạt động trong câu dưới đây:', [gach('a) Chăm mặc thử bộ quần áo làm cho mọi người bò lăn ra cười.', 'mặc', 'thử', 'bò', 'lăn', 'cười'), gach('b) Mới quét xong nửa cái sân, em lại lấy sách ra đọc.', 'quét', 'lấy', 'đọc')]),
      B('Câu 6. Điền dấu hỏi hoặc dấu ngã trên chữ in đậm: “Chào Mào đi học”', [ln([`Ch${'[[T:ẳng/ẳng,ẵng]]'} ai như chú chào mào`, 'Cứ vào lớp học thì thào chuyện riêng', `Cái m${'[[T:ũ/ủ,ũ]]'} đội lệch ng${'[[T:ả/ả,ã]]'} nghiêng`, `Cái đầu nghĩ chuyện h${'[[T:ão/ảo,ão]]'} huyền ở đâu.`])]),
      B('Câu 7. Em hãy điền từ có chứa "ng" / "gh" thích hợp vào chỗ trống:', [ln(['Mùng 2 tháng 9 là một [[w:ngày]] kỉ niệm đáng [[w:ghi]] nhớ. Hà Nội tưng bừng màu đỏ. Một vùng trời bát [[w:ngát]] cờ, đèn, hoa và biểu [[w:ngữ]].'])]),
    ],
    viet('Hoa bạch mai', 'Hoa bạch mai màu trắng tinh khiết, gồm sáu đến tám cánh. Cánh dày, hơi tròn, nhụy vàng và khá giống như hoa sứ. Hoa có hương thơm dịu nhẹ thoang thoảng và dễ chịu. Cây được trồng chủ yếu ở Bến Tre, vùng núi Bà Đen – Tây Ninh, Hà Tiên...', 'Em hãy viết 2 - 3 câu tự giới thiệu về bản thân.'),
  ),
  de('giua-ki', 3, 'Đọc "Tay thứ ba" (Mô-da), điền dấu chấm – chấm hỏi, ghép từ ngữ thành câu nêu đặc điểm, câu nêu hoạt động.',
    baiDoc('Tay thứ ba', 'Khi còn nhỏ, Mô-da đã có biệt danh là "thần đồng âm nhạc".\nMột hôm, Mô-da nói với thầy giáo dạy đàn:\n- Thưa thầy, em có thể viết ra một bản nhạc mà thầy không đàn nổi.\nThầy của Mô-da cũng là một nhà soạn nhạc nổi tiếng. Ông bảo Mô-da cứ thoải mái viết rồi mang đến. Chẳng mấy chốc, Mô-da đã mang bản nhạc đến cho ông. Thầy giáo ngồi xuống bên cây dương cầm và bắt đầu chơi.\nThế nhưng tiếng đàn đột ngột ngừng lại. Thầy bực tức nói:\n- Bản nhạc gì kì lạ thế? Sao lúc hai bàn tay ta đang ở hai đầu của cây đàn thì lại có một nốt nhạc xuất hiện ở phím chính giữa vậy?\nMô-da cười, chậm rãi ngồi xuống, tay nhẹ nhàng lướt trên phím đàn. Thầy giáo không tin cậu bé này có thể làm được trừ phi có thêm một bàn tay.\nChẳng mấy chốc đã đến đoạn khó chơi kia. Đột nhiên, Mô-da cúi đầu, dùng mũi nhấn vào phím đàn.\nThầy giáo xuýt xoa khen ngợi cậu học trò nhỏ của mình.', 'Theo 100 câu chuyện hay dành cho bé trai'),
    [
      B('Câu 1. Mô-da đã nói điều gì với thầy giáo dạy đàn?', [mc('', ['Mô-da nói sẽ viết ra một bản nhạc mà thầy không đàn nổi.', 'Mô-da nói sẽ vẽ một bức tranh tặng thầy giáo.', 'Mô-da nói sẽ viết ra một bài thơ tặng thầy giáo.'], 'Mô-da nói sẽ viết ra một bản nhạc mà thầy không đàn nổi.')]),
      B('Câu 2. Câu văn nào giới thiệu về thầy giáo của Mô-da?', [mc('', ['Một hôm, Mô-da nói với thầy giáo dạy đàn.', 'Thầy của Mô-da cũng là một nhà soạn nhạc nổi tiếng.', 'Thầy giáo ngồi xuống bên cây dương cầm và bắt đầu chơi.'], 'Thầy của Mô-da cũng là một nhà soạn nhạc nổi tiếng.')]),
      B('Câu 3. Vì sao thầy giáo không chơi được đoạn cuối bản nhạc do Mô-da viết?', [mc('', ['Vì thầy không nhớ được bản nhạc.', 'Vì đôi tay của thầy không đủ nhanh.', 'Vì có một nốt nhạc xuất hiện phím chính giữa đàn trong khi hai tay thầy đang ở hai đầu của cây đàn.'], 'Vì có một nốt nhạc xuất hiện phím chính giữa đàn trong khi hai tay thầy đang ở hai đầu của cây đàn.')]),
      B('Câu 4. Mô-da đã làm thế nào để chơi được nốt nhạc khó nhằn đó?', [mc('', ['Mô-da đưa nhanh tay về để nhấn nốt nhạc.', 'Mô-da dùng mũi để nhấn nốt nhạc.', 'Mô-da dùng cằm để nhấn nốt nhạc.'], 'Mô-da dùng mũi để nhấn nốt nhạc.')]),
      tuDo('Câu 5. Em có suy nghĩ gì về Mô-da?'),
      B('Câu 6. Điền dấu chấm hoặc dấu chấm hỏi vào chỗ trống:', [ln([`a. Mô-da là một nhạc sĩ thiên tài người Áo ${dau('.', ['.', '?'])}`, `b. Bạn có thích nghe nhạc của Mô-da không ${dau('?', ['.', '?'])}`, `c. Những bản nhạc của Mô-da làm mọi người say mê ${dau('.', ['.', '?'])}`])]),
      tuDo('Câu 7. Ghép các từ ngữ: Các bạn học sinh · Hai má của em bé · nhảy dây · đuổi bắt · chơi trốn tìm · trong giờ ra chơi · mịn màng · phúng phính để tạo thành: a. 1 câu nêu đặc điểm. b. 1 câu nêu hoạt động.'),
    ],
    viet('Buổi sáng ở sân trường', 'Buổi sáng, sân trường rất vui. Các bạn học sinh mặc áo sạch đẹp. Từng nhóm nhỏ đang chơi đá cầu, nhảy dây và trò chuyện. Cô giáo bước vào lớp với nụ cười hiền. Tiếng trống vang lên báo hiệu giờ học bắt đầu.', 'Em hãy viết đoạn văn (5 – 6 câu) kể lại một câu chuyện đã đọc, đã nghe mà em thích.'),
  ),
  de('giua-ki', 4, 'Đọc "Thỏ Trắng đi học", điền dấu chấm – chấm hỏi, nối thành câu nêu đặc điểm.',
    baiDoc('Thỏ Trắng đi học', 'Thỏ Trắng rụt rè nhìn vào lớp xem có Sóc Nâu không. Khi thấy Sóc Nâu chăm chậu cây cảnh trong lớp, cậu nói: "Mình cùng làm nhé!"\nHai bạn say sưa làm nhiệm vụ. Có tiếng kêu: "Thỏ Trắng đâu?". Cậu ngước lên, tay vung vẩy, không may chậu cây rơi vỡ. Thỏ khóc oà lên. Cô giáo Hoạ Mi liền chạy đến hỏi: "Sao Thỏ Trắng khóc?". Sóc nói: "Con lỡ tay làm vỡ chậu cây, bạn sợ nên khóc, cô ạ!". Cô bảo hai bạn mang cây ra vườn trồng lại, còn chậu vỡ cô sẽ mang bỏ đi. Thỏ Trắng nhìn Sóc thầm cảm ơn.\nChiều về, Thỏ thủ thỉ với mẹ chuyện sáng nay. Mẹ khuyên Thỏ nên dũng cảm nói sự thật với cô. Sáng hôm sau, Thỏ Trắng rụt rè đến bên cô giáo: “Thưa cô, là con lỡ tay làm vỡ chậu cây, không phải Sóc ạ.”. Cô khen Thỏ ngoan và tặng quà. Thỏ mở ra là một chiếc chậu xinh xắn. Thỏ và Sóc reo lên sung sướng. Các bạn cảm ơn cô và bàn nhau gieo hạt, trồng cây vào chậu.\nTừ đó, Thỏ Trắng ngày nào cũng mong ước được đến trường để học và khám phá bao điều mới lạ và được gặp cô, bạn bè thật đáng yêu.', 'Theo Truyện đọc Đạo đức 2'),
    [
      B('Câu 1. Hai bạn Thỏ Trắng và Sóc Nâu cùng say sưa làm việc gì?', [mc('', ['Hai bạn say sưa học tập.', 'Hai bạn say sưa quét dọn lớp.', 'Hai bạn say sưa chăm chậu cây cảnh.'], 'Hai bạn say sưa chăm chậu cây cảnh.')]),
      B('Câu 2. Vì sao Thỏ Trắng khóc?', [mc('', ['Vì Thỏ Trắng giật mình khi có người gọi.', 'Vì Thỏ Trắng sợ khi làm vỡ chậu cây.', 'Vì Thỏ Trắng bị xước tay bởi chậu cây bị vỡ.'], 'Vì Thỏ Trắng sợ khi làm vỡ chậu cây.')]),
      B('Câu 3. Thỏ Trắng cảm thấy thế nào khi Sóc Nâu nhận lỗi làm vỡ chậu hoa?', [mc('', ['Thỏ Trắng cảm thấy bình thường.', 'Thỏ Trắng vẫn sợ hãi, lo lắng.', 'Thỏ Trắng yên tâm, thầm cảm ơn Sóc Nâu.'], 'Thỏ Trắng yên tâm, thầm cảm ơn Sóc Nâu.')]),
      B('Câu 4. Nhờ đâu mà Thỏ Trắng đã dũng cảm nói sự thật với cô giáo?', [mc('', ['Nhờ mẹ khuyên nhủ.', 'Nhờ Thỏ Trắng cảm thấy xấu hổ khi để bạn nhận lỗi thay.', 'Nhờ Sóc Nâu khuyên nhủ bớt rụt rè đi.'], 'Nhờ mẹ khuyên nhủ.')]),
      tuDo('Câu 5. Vì sao sau khi nhận lỗi, Thỏ Trắng lại thích đến trường?'),
      B('Câu 6. Điền dấu chấm hoặc dấu chấm hỏi vào chỗ trống:', [ln([`Thấy mùa đông đến, bác Ốc Sên run rẩy bò lên cây mận ${dau('.', ['.', '?'])} Sẻ con ngạc nhiên hỏi:`, `- Bác Ốc Sên ơi, trời lạnh thế này, bác bò lên cây mận làm gì ${dau('?', ['.', '?'])}`, `- Bác leo lên để ăn quả mận ${dau('.', ['.', '?'])}`, `- Mùa đông làm gì có mận để ăn ạ ${dau('?', ['.', '?'])}`, '- Khi bác bò được đến cành, thì mận chín đầy cây đấy!'])]),
      B('Câu 7. Nối từ ngữ ở cột A với từ ngữ ở cột B để được câu nêu đặc điểm.', [noi(['Ngôi nhà của bà ngoại', 'Chiếc váy của Châu', 'Cây đa'], ['cao lớn sừng sững.', 'rực rỡ sắc màu.', 'khang trang, rộng lớn.'], [2, 1, 0])]),
    ],
    viet('Ngôi trường mới', 'Dưới mái trường mới, sao tiếng trống rung động kéo dài! Tiếng cô giáo trang nghiêm mà ấm áp. Tiếng đọc bài của em cũng vang vang đến lạ! Em nhìn ai cũng thấy thân thương. Cả đến chiếc thước kẻ, chiếc bút chì sao cũng đáng yêu đến thế! (Theo Ngô Quân Miện)', 'Em hãy viết đoạn văn (3 – 4 câu) tả chiếc cặp / ba lô của em.'),
  ),
  de('giua-ki', 5, 'Đọc "Trâu rừng", gạch chân từ chỉ sự vật, điền s/x, nối thành câu nêu đặc điểm.',
    baiDoc('Trâu rừng', 'Trâu rừng sống ở đồng cỏ dưới chân núi. Chúng chỉ di chuyển khi có hạn hán, đồng cỏ khô cháy. Khi có mưa, chúng lại trở về. Nơi chúng sinh sống bao giờ cũng có đầm nước hoặc dòng sông. Đó là nơi chúng ngâm mình sau lúc ăn no.\nBuổi chiều, trâu rừng đi kiếm ăn rồi trở về nơi ngủ đêm, nằm thành vòng tròn. Trâu già, trâu mẹ và nghé con nằm ở vòng trong, bên ngoài là trâu mộng. Con trâu mộng vạm vỡ, nằm canh giữ an toàn cho cả đàn. Nhiệm vụ canh gác sẽ được lũ trâu mộng truyền nhau, từ con này đến con khác ở vòng ngoài.\nTrâu rừng là chỗ dựa của loài thú ăn cỏ yếu ớt. Ban ngày, thú nhỏ ngủ trong hang ổ bí mật. Đêm đến, chúng kiếm ăn gần bầy trâu. Thấy hơi thú dữ, bầy trâu hào hiệp đồng loạt đứng lên trong tư thế phòng ngự. Lúc đó, bọn thú nhỏ không ngần ngại lẻn vào giữa vòng tròn, run rẩy đứng lẫn vào đám nghé non. Bầy trâu không bao giờ xua đuổi chúng.', 'Theo Vũ Hùng'),
    [
      B('Câu 1. Nơi sinh sống của trâu rừng có gì đặc biệt?', [mc('', ['Có nhiều cỏ.', 'Có rừng cây.', 'Khi mưa to.'], 'Có nhiều cỏ.')]),
      B('Câu 2. Khi nào trâu rừng di chuyển khỏi nơi sinh sống?', [mc('', ['Khi hạn hán.', 'Có nước.', 'Khi ăn no.'], 'Khi hạn hán.')]),
      B('Câu 3. Trong đàn, con trâu nào làm nhiệm vụ canh gác?', [mc('', ['Trâu già.', 'Trâu mẹ.', 'Trâu mộng.'], 'Trâu mộng.')]),
      B('Câu 4. Vì sao bọn thú nhỏ thích kiếm ăn gần bầy trâu?', [mc('', ['Vì chúng thích kết bạn với nghé non.', 'Vì bầy trâu sẽ bảo vệ thú nhỏ.', 'Vì thú nhỏ ăn cỏ giống trâu rừng.'], 'Vì bầy trâu sẽ bảo vệ thú nhỏ.')]),
      B('Câu 5. Gạch chân các từ ngữ chỉ sự vật trong đoạn thơ sau (Huy Cận):', [gach('Bàn tay em đánh răng', 'bàn tay', 'răng'), gach('Răng trắng như hoa nhài', 'răng', 'hoa nhài'), gach('Bàn tay em chải tóc', 'bàn tay', 'tóc'), gach('Tóc sáng rạng như ánh mai', 'tóc', 'ánh mai')]),
      B('Câu 6. Điền s hoặc x vào chỗ trống (Tố Hữu):', [ln(['Vui [[T:s/s,x]]ao một [[T:s/s,x]]áng tháng Năm', 'Đường về Việt Bắc lên thăm Bác Hồ', '[[T:s/s,x]]uối dài [[T:x/s,x]]anh mướt nương ngô', 'Bốn phương lồng lộng thủ đô gió ngàn…'])]),
      B('Câu 7. Nối từ ngữ ở cột A với từ ngữ ở cột B để được câu nêu đặc điểm.', [noi(['Bàn tay của bé', 'Hàng cây được trồng', 'Lời cô nói'], ['ngọt ngào.', 'mũm mĩm.', 'thẳng tắp.'], [1, 2, 0])]),
    ],
    viet('Bữa trưa ở trường', 'Hằng ngày, tôi vẫn về nhà ăn trưa. Nhưng hôm nay tôi sẽ ăn ở trường vì bố mẹ đi vắng cả ngày. Tối qua tôi đã giận dỗi và hét lên rằng tôi sẽ không ăn ở trường, rằng ăn ở đó rất chán và tôi sẽ phát ốm nếu ở trường cả ngày.', 'Em hãy viết đoạn văn (5 - 6 câu) giới thiệu về một đồ chơi mà em yêu thích.'),
  ),
];

/* ───────────── Cuối học kì I ───────────── */

const CK: RawPhieu[] = [
  de('cuoi-ki', 1, 'Đọc "Thần đồng Lương Thế Vinh", từ chỉ hoạt động, điền dấu chấm – chấm hỏi, từ chỉ đặc điểm.',
    baiDoc('Thần đồng Lương Thế Vinh', 'Lương Thế Vinh từ nhỏ đã nổi tiếng thông minh.\nCó lần, cậu đang chơi bên gốc đa cùng các bạn thì thấy một bà gánh bưởi đi qua. Đến gần gốc đa, bà bán bưởi vấp ngã, bưởi lăn tung tóe dưới đất. Có mấy trái lăn xuống một cái hố sâu bên đường. Bà bán bưởi chưa biết làm cách nào lấy bưởi lên thì Lương Thế Vinh đã bảo các bạn lấy nước đổ vào hố. Nước dâng đến đâu, bưởi nổi lên đến đó.\nMới 23 tuổi, Lương Thế Vinh đã đỗ Trạng nguyên. Ông được gọi là “Trạng Lường” vì rất giỏi tính toán.', 'Theo Chuyện hay nhớ mãi'),
    [
      B('Câu 1. Từ nhỏ, Lương Thế Vinh đã nổi tiếng về điều gì?', [mc('', ['Rất ngoan.', 'Rất nghịch.', 'Thông minh.', 'Chậm chạp.'], 'Thông minh.')]),
      B('Câu 2. Lương Thế Vinh được gọi là gì?', [mc('', ['Ông Lương', 'Trạng Lường', 'Thầy giáo', 'Thầy thuốc'], 'Trạng Lường')]),
      B('Câu 3. Trong câu chuyện, cậu bé Vinh đã thể hiện trí thông minh như thế nào?', [mc('', ['Nhảy xuống hố lấy lên.', 'Nghĩ ra một trò chơi hay.', 'Đổ nước vào hố để bưởi nổi lên.', 'Nhặt bưởi trên đường trả bà bán bưởi.'], 'Đổ nước vào hố để bưởi nổi lên.')]),
      B('Câu 4. Cách làm của Lương Thế Vinh đã đem lại kết quả gì?', [mc('', ['Bưởi nổi lên.', 'Bưởi chìm xuống nước.', 'Không lấy được bưởi.', 'Bưởi không nổi lên.'], 'Bưởi nổi lên.')]),
      B('Câu 5. Lương Thế Vinh được gọi là “Trạng Lường” vì?', [ln(['Vì ông rất giỏi [[w:tính toán|~tính toán]].'])]),
      B('Câu 6. Từ ngữ chỉ hoạt động trong câu “Có mấy trái lăn xuống một cái hố sâu bên đường.” là:', [mc('', ['trái', 'đường', 'cái hố', 'lăn'], 'lăn')]),
      B('Câu 7. Điền dấu chấm, chấm hỏi vào ô trống thích hợp.', [ln([`Chị: - Em đang làm gì đấy ${dau('?', ['.', '?'])}`, `Em: - Em đang viết thư cho bà ${dau('.', ['.', '?'])}`])]),
      tuDo('Câu 8. Viết 2 từ ngữ chỉ đặc điểm.', 1),
    ],
    viet('Đồ đạc trong nhà', 'Em yêu đồ đạc trong nhà\nCùng em trò chuyện như là bạn thân.\nCái bàn kể chuyện rừng xanh\nQuạt nan mang đến gió lành trời xa.\nĐồng hồ giọng nói thiết tha\nNhắc em ngày tháng thường là trôi mau.\nNgọn đèn sáng giữa trời khuya\nNhư ngôi sao nhỏ gọi về niềm vui. (Phan Thị Thanh Nhàn)', 'Viết đoạn văn từ 3 - 4 câu kể một việc người thân đã làm cho em.'),
  ),
  de('cuoi-ki', 2, 'Đọc "Buổi sớm mùa hè trong thung lũng", kiểu câu, gạch chân từ chỉ đặc điểm, sắp xếp từ thành câu.',
    baiDoc('Buổi sớm mùa hè trong thung lũng', 'Rừng núi còn chìm đắm trong màn đêm. Trong bầu không khí đầy hơi ẩm và lành lạnh, mọi người đang ngon giấc trong những chiếc chăn đơn. Bỗng một con gà trống vỗ cánh phành phạch và cất tiếng gáy lanh lảnh ở đầu bản. Tiếp đó, rải rác khắp thung lũng, tiếng gà gáy râm ran. Mấy con gà rừng trên núi cũng thức dậy gáy te te.\nTrên mấy cây cao cạnh nhà, ve đua nhau kêu ra rả. Ngoài suối, tiếng chim cuốc vọng vào đều đều. Bản làng đã thức giấc. Đó đây, ánh lửa hồng bập bùng trên các bếp. Ngoài bờ ruộng đã có bước chân người đi, tiếng nói chuyện rì rầm, tiếng gọi nhau í ới.', 'Hoàng Hữu Bội'),
    [
      B('Câu 1. Dòng nào dưới đây nêu đúng tên các con vật được tả trong bài?', [mc('', ['Gà trống, gà rừng, ve, chim cuốc', 'Gà trống, gà mái, ve, chim cuốc', 'Gà trống, gà mái, gà rừng, chim cuốc', 'Gà trống, chim sẻ, gà rừng, ve'], 'Gà trống, gà rừng, ve, chim cuốc')]),
      B('Câu 2. Tiếng gà gáy sớm mùa hè vùng cao được tả qua những từ nào?', [mc('', ['Phành phạch, râm ran, te te', 'Lanh lảnh, phành phạch, te te', 'Lanh lảnh, râm ran, te te', 'Rầm rầm, lanh lảnh'], 'Lanh lảnh, râm ran, te te')]),
      B('Câu 3. Cảnh sáng sớm ở vùng cao được tác giả tập trung miêu tả điều gì?', [mc('', ['Những hình ảnh nổi bật.', 'Những âm thanh nổi bật.', 'Những sự việc diễn ra.', 'Hoạt động của con người.'], 'Những âm thanh nổi bật.')]),
      B('Câu 4. Bài đọc trên tả khoảng thời gian nào trong ngày?', [mc('', ['Buổi chiều', 'Buổi trưa', 'Buổi đêm', 'Buổi sáng sớm'], 'Buổi sáng sớm')]),
      tuDo('Câu 5. Nội dung bài đọc nói về điều gì?'),
      B('Câu 6. Câu “Chị Chín khóc nức nở vì xúc động” thuộc kiểu câu nào?', [mc('', ['Câu giới thiệu.', 'Câu nêu đặc điểm.', 'Câu nêu hoạt động.', 'Không thuộc kiểu câu nào.'], 'Câu nêu hoạt động.')]),
      B('Câu 7. Gạch chân dưới từ chỉ đặc điểm có trong câu sau:', [gach('Ở ngôi làng nhỏ có một ông chủ giàu có, ông có một người đầy tớ chăm chỉ.', 'nhỏ', 'giàu có', 'chăm chỉ')]),
      tuDo('Câu 8. Sắp xếp các từ dưới đây thành 2 câu khác nhau và viết lại cho đúng: lưng / mái tóc / bà em / bạc phơ / còng / và'),
    ],
    viet('Con sóc', 'Trong hốc cây có một chú sóc. Sóc có bộ lông màu xám nhưng dưới bụng lại đỏ hung, chóp đuôi cũng đỏ. Đuôi sóc xù như cái chổi và hai mắt tinh anh. Sóc không đứng yên lúc nào, thoắt trèo, thoắt nhảy.', 'Viết đoạn văn từ 4 - 5 câu giới thiệu một đồ dùng học tập của em.'),
  ),
  de('cuoi-ki', 3, 'Đọc "Người lính cứu hỏa", đặt dấu phẩy, gạch chân từ chỉ đặc điểm, đặt câu nêu hoạt động.',
    baiDoc('Người lính cứu hỏa', 'Ngọn lửa bao trùm tòa nhà, tiếng cháy bên trong lộp độp, hòa lẫn tiếng kêu cứu thất thanh của người dân đang mắc kẹt bên trong. Mẹ và tôi cùng các cô, chú hàng xóm đều lo và sợ hãi, chỉ mong không có thiệt hại về người. Rất nhanh, xe cứu hỏa đã xuất hiện. Các anh lính nhanh chóng chuẩn bị đồ, gấp gáp vào dập lửa. Tác phong các anh nhanh nhẹn, ai nấy đều sẵn sàng lao vào ngọn lửa lớn cứu người, chẳng màng đến cả tính mạng của bản thân. Trong lúc đang đứng đó, tôi thấy một anh lính cứu hỏa người ướt đẫm, thở gấp, chân đi khập khiễng, khuôn mặt anh ám màu đen của khói lửa, tay bế một cô gái. Có lẽ anh bị thương khi đang làm nhiệm vụ nhưng vẫn ưu tiên việc giải cứu người dân, không hề tỏ ra mệt mỏi hay kêu than gì.', 'Theo Uyển Ly'),
    [
      B('Câu 1. Bài đọc trên miêu tả khung cảnh gì?', [mc('', ['Bão ập đến, mọi người đang sơ tán để tránh bão.', 'Tòa nhà bị cháy, người dân mắc kẹt bên trong.', 'Động đất khiến nhiều tòa nhà bị đổ.', 'Lũ lụt khiến nhà cửa bị ngập lụt.'], 'Tòa nhà bị cháy, người dân mắc kẹt bên trong.')]),
      B('Câu 2. Tác phong của những người lính cứu hỏa như thế nào?', [mc('', ['Nhanh nhẹn, gấp gáp chuẩn bị đồ, sẵn sàng lao vào ngọn lửa cứu người.', 'Cẩn thận, chu đáo, quan tâm mọi người.', 'Tích cực, nhiệt huyết, tỉ mỉ.', 'Chậm chạp, lề mề.'], 'Nhanh nhẹn, gấp gáp chuẩn bị đồ, sẵn sàng lao vào ngọn lửa cứu người.')]),
      B('Câu 3. Anh lính cứu hỏa được miêu tả như thế nào?', [mc('', ['Nhút nhát, lười biếng.', 'Đẹp trai, cao ráo, sáng sủa.', 'Dũng cảm, không sợ bất cứ thứ gì.', 'Người ướt đẫm, thở gấp, chân đi khập khiễng, mặt ám màu đen của khói lửa.'], 'Người ướt đẫm, thở gấp, chân đi khập khiễng, mặt ám màu đen của khói lửa.')]),
      B('Câu 4. Tình cảm của nhân vật tôi đối với những người lính cứu hỏa là gì?', [mc('', ['Sợ hãi', 'Quý mến', 'Ngưỡng mộ', 'Thấu hiểu'], 'Ngưỡng mộ')]),
      tuDo('Câu 5. Qua bài đọc, em có cảm nhận gì về những người lính cứu hỏa?'),
      B('Câu 6. Em hãy đặt dấu phẩy vào vị trí thích hợp (bấm ô để chọn “,” hoặc “(không)”):', [ln([`a) Ong ${PHAY(false)} bướm ${PHAY(true)} sơn ca ${PHAY(true)} chuồn chuồn đang tập hát để chuẩn bị cho “Lễ hội rừng xanh”.`, `b) Ánh trăng soi rọi xuống vườn cây ${PHAY(true)} xuống vạt cỏ non xanh ${PHAY(false)} và xuống cả dòng sông đang lững lờ trôi.`])]),
      B('Câu 7. Gạch chân dưới từ chỉ đặc điểm có trong câu sau:', [gach('Mỗi chiếc chong chóng có một cái cán nhỏ và dài, một đầu gắn bốn cánh giấy mỏng, xinh như một bông hoa.', 'nhỏ', 'dài', 'mỏng', 'xinh')]),
      tuDo('Câu 8. Hãy đặt một câu nêu hoạt động em giúp đỡ người khác.', 1),
    ],
    viet('Bác Lâm làng tôi', 'Dưới gốc si cạnh cổng làng, một người đàn ông ngồi ở quán nước, vừa ngắm cảnh đàn vịt đùa nghịch dưới ao, vừa nhâm nhi cốc chè xanh. Đi từ xa, tôi đã nhận ra ngay bác Lâm. Ở làng tôi, không ai là không biết bác. (Theo Thư Linh)', 'Viết đoạn văn từ 4 - 5 câu về một bạn ở trường em.'),
  ),
  de('cuoi-ki', 4, 'Đọc "Cậu bé và cây si già", từ trái nghĩa, từ chỉ đặc điểm, điền dấu chấm – dấu phẩy.',
    baiDoc('Cậu bé và cây si già', 'Bờ ao đầu làng có một cây si già. Thân cây to, cành lá xum xuê, ngả xuống mặt nước. Một cậu bé đi ngang qua. Sẵn con dao nhọn trong tay, cậu hí hoáy khắc tên mình lên thân cây. Cây đau điếng nhưng cố lấy giọng vui vẻ, hỏi cậu:\n- Chào cậu bé. Tên cậu bé là gì nhỉ?\n- Cháu tên là Ngoan.\n- Cậu có cái tên mới đẹp làm sao!\nMắt cậu bé rạng ngời. Cậu nói:\n- Cảm ơn cây.\n- Này, vì sao cậu không khắc tên lên người cậu? Như thế có phải tiện hơn không? – Cây nói.\nCậu bé rùng mình, lắc đầu:\n- Đau lắm, cháu chịu thôi.\n- Vậy, vì sao cậu lại bắt tôi nhận điều cậu không muốn?\n- Cháu xin lỗi ạ! Cháu biết làm vậy là sai rồi. Cháu sẽ không bao giờ làm tổn thương đến cây nữa.', 'Theo Trần Hồng Thắng'),
    [
      B('Câu 1. Cậu bé đã làm gì với cây si già?', [mc('', ['Leo lên cây', 'Khắc tên mình lên cây', 'Ngắt lá cây'], 'Khắc tên mình lên cây')]),
      B('Câu 2. Để cậu bé hiểu được sự đau đớn của mình, cây si già đã làm gì?', [mc('', ['Cây kêu la vì đau đớn.', 'Cây khóc lóc, rền rĩ.', 'Cây nén đau và trò chuyện cho cậu bé hiểu.'], 'Cây nén đau và trò chuyện cho cậu bé hiểu.')]),
      B('Câu 3. Từ nào trái nghĩa với từ “vui vẻ”?', [mc('', ['Vui vẻ', 'Buồn bã', 'Nhanh nhẹn'], 'Buồn bã')]),
      tuDo('Câu 4. Câu chuyện muốn khuyên chúng ta điều gì?'),
      B('Câu 5. Trong câu “Mặt cậu bé rạng ngời”, từ rạng ngời thuộc từ chỉ gì?', [mc('', ['Từ chỉ đặc điểm', 'Từ chỉ sự vật', 'Từ chỉ hoạt động, trạng thái'], 'Từ chỉ đặc điểm')]),
      B('Câu 6. Điền dấu chấm hoặc dấu phẩy vào chỗ trống:', [ln([`Một ngày đẹp trời ${dau(',', [',', '.'])} cậu bé năm nào đến bên bờ ao đầu làng dựa lưng vào cây si già ${dau('.', [',', '.'])} Cậu bé vui vẻ trò chuyện cùng cây ${dau('.', [',', '.'])}`])]),
      B('Câu 7. Viết từ trái nghĩa với mỗi từ sau:', [ln(['a. Chật – [[w:rộng|rộng rãi]]', 'b. Khuya – [[w:sớm]]', 'c. Trẻ – [[w:già]]', 'd. Vui – [[w:buồn|buồn bã]]'], 2)]),
      tuDo('Câu 8. Đặt 1 câu để nói về cậu bé trong bài.', 1),
    ],
    viet('Thì thầm', 'Gió thì thầm với lá\nLá thì thầm cùng cây\nVà hoa và ong bướm\nThì thầm điều chi đây?\nTrời mênh mông đến vậy\nĐang thì thầm cùng sao\nSao trời tưởng yên lặng\nLại thì thầm cùng nhau. (Phùng Ngọc Hùng)', 'Viết một đoạn văn ngắn (từ 3 – 5 câu) kể về gia đình em.'),
  ),
  de('cuoi-ki', 5, 'Đọc "Có một bầy hươu", gạch từ không cùng nhóm, điền dấu câu, chọn từ chỉ thời gian.',
    baiDoc('Có một bầy hươu', 'Một bầy hươu đang gặm cỏ bên dòng suối thì một chú hươu bé nhỏ đi tới. Chú hươu con bị đau chân, bước đi tập tễnh. Bộ lông xác xơ đầy những vết bùn đất. Chắc là chú ta vừa bị ngã rất đau. Chú hươu nói:\n- Các bạn ơi! Cho tôi ăn cùng với nhé!\nBầy hươu đồng thanh mời:\n- Bạn lại đây cùng ăn với chúng tôi!\nRồi một chú hươu lấy gạc cắt rụng mấy cái chồi non và nói:\n- Bạn ăn đi!\nChú hươu ăn rất ngon lành và cảm động nhìn các bạn.\nĐúng lúc ấy, một bác hươu già từ trong rừng đi tới. Thấy bầy hươu con giúp bạn, bác hươu già khen:\n- Các cháu ngoan lắm!\nBầy hươu con rất vui vì đã làm được việc tốt giúp bạn.', 'Theo Vũ Hùng'),
    [
      B('Câu 1. Trong câu chuyện, tình cảnh của chú hươu con như thế nào?', [mc('', ['Bị bùn bắn lên bẩn mất bộ lông đẹp đẽ', 'Bị đau mắt không nhìn thấy đường', 'Bị đau chân, bước đi tập tễnh'], 'Bị đau chân, bước đi tập tễnh')]),
      B('Câu 2. Bầy hươu đã làm gì để giúp hươu con?', [mc('', ['Dắt hươu con sang đường', 'Cắt lá non cho hươu con ăn', 'Tìm cách đưa hươu con qua suối'], 'Cắt lá non cho hươu con ăn')]),
      B('Câu 3. Bác hươu già đã nói gì với bầy hươu con?', [mc('', ['Bác khen cả bầy hươu con ngoan.', 'Bác bảo cả bầy hươu hãy kiếm thức ăn cho hươu con.', 'Bác khuyên bầy hươu cần tiết kiệm thức ăn.'], 'Bác khen cả bầy hươu con ngoan.')]),
      tuDo('Câu 4. Câu chuyện muốn khuyên chúng ta điều gì?'),
      B('Câu 5. Gạch dưới từ ngữ không thuộc nhóm trong dãy từ sau:', [gach('a. Trường học, bệnh viện, bàn ghế, chạy nhảy.', 'chạy nhảy'), gach('b. Hát, xinh đẹp, múa, vẽ.', 'xinh đẹp'), gach('c. Chăm ngoan, hiền hậu, cô giáo, đẹp đẽ.', 'cô giáo')]),
      B('Câu 6. Điền dấu phẩy, dấu chấm hỏi hoặc dấu chấm vào chỗ trống. “Sợ bẩn”', [ln([`Trong giờ học môn Tự nhiên và xã hội ${dau(',', [',', '?', '.'])} cô hỏi Tí:`, `- Tại sao khi bón phân cây cối lại xanh tốt ${dau('?', [',', '?', '.'])}`, 'Tí trả lời:', `- Thưa cô ${dau(',', [',', '?', '.'])} vì cây cối sợ bẩn ${dau('.', [',', '?', '.'])} Nó vươn cao để tránh chỗ bẩn ạ ${dau('.', [',', '?', '.'])}`])]),
      B('Câu 7. Chọn từ ngữ thích hợp điền vào chỗ chấm: (tháng Giêng, hạ, tháng Chạp)', [ln(['a. Mùa hè còn được gọi là mùa [[T:hạ/tháng Giêng,hạ,tháng Chạp]]', 'b. Tháng Một còn được gọi là [[T:tháng Giêng/tháng Giêng,hạ,tháng Chạp]]', 'c. Tháng Mười hai còn được gọi là [[T:tháng Chạp/tháng Giêng,hạ,tháng Chạp]]'])]),
      tuDo('Câu 8. Em đã làm gì giúp đỡ khi bạn gặp khó khăn?'),
    ],
    viet('Giọng hót chim sơn ca', 'Sáng hôm sau khi mọi người đến nhà thì thấy sơn ca đang say sưa luyện giọng. Thỉnh thoảng, sơn ca dừng lại nghe tiếng cây cối xào xạc, tiếng suối chảy róc rách rồi bắt chước theo. Các bạn chim lúc ấy mới chợt hiểu tại sao sơn ca có giọng hót hay đến thế. (Theo Nguyễn Hoàng – Quốc Việt)', 'Viết một đoạn văn ngắn (từ 3 – 5 câu) kể về một giờ ra chơi.'),
  ),
];

export const DE_TV_L2: RawPhieu[] = [...GK, ...CK];
