// Đề Toán lớp 5 — xem chung.ts
// Kiểm tra giữa học kì 1, Đề 9 → 15 (PDF "20 đề kiểm tra học kì 1 Toán 5 có đáp án và lời giải chi tiết").
import type { RawPhieu } from '../thi-lop-1/kieu';
import { B, T, gk, ln, loiVan, timX, tinh, viet, xep } from './chung';

/** Mọi số thập phân có 2–3 chữ số sau dấu phẩy nằm giữa 0,2 và 0,23 (Đề 14, câu 4). */
const giua02va023 = [
  '0,21',
  '0,22',
  ...Array.from({ length: 29 }, (_, i) => `0,${201 + i}`).filter((s) => !s.endsWith('0')),
].join('|');

export const DE_GK_B: RawPhieu[] = [
  gk(9, 'Hàng của số thập phân, hỗn số sang số thập phân, đọc viết và so sánh số thập phân, đổi đơn vị đo, rút về đơn vị, diện tích hình chữ nhật.', [
    T('Câu 1. Chữ số 3 trong số thập phân của số 465,732 thuộc hàng nào?', ['Hàng chục.', 'Hàng phần trăm.', 'Hàng phần mười.', 'Hàng trăm.'], 'Hàng phần trăm.'),
    T('Câu 2. Hỗn số 8{25/100} chuyển thành số thập phân nào?', ['8,205', '82,5', '8,25', '8,025'], '8,25'),
    T('Câu 3. Số thập phân gồm có: ba trăm linh tám đơn vị, năm phần trăm, chín phần nghìn được viết:', ['308,59', '308,509', '308,059', '308,590'], '308,059'),
    T('Câu 4. Số lớn nhất trong các số 8,09; 7,99; 8,89; 8,9 là:', ['8,09', '7,99', '8,89', '8,9'], '8,9'),
    T('Câu 5. 7m 56cm = ………m. Số thập phân thích hợp điền vào chỗ chấm là:', ['70,56', '7,056', '7,506', '7,56'], '7,56'),
    T('Câu 6. 6m² 8dm² = ……… m². Số thập phân thích hợp để viết vào chỗ chấm là:', ['6,8', '6,08', '0,68', '6,008'], '6,08'),
  ], [
    B('Câu 7. Viết số thập phân có:', [ln(['a) Tám trăm linh hai đơn vị, sáu phần trăm: [[n:802,06]]', 'b) Năm đơn vị, bảy phần mười, hai phần nghìn: [[n:5,702]]'])]),
    B('Câu 8. Viết các số thập phân sau theo thứ tự từ bé đến lớn: 0,32; 0,197; 0,4; 0,321; 0,187.', [ln([xep([0.32, 0.197, 0.4, 0.321, 0.187], true)])]),
    B('Câu 9. Viết các số thập phân thích hợp vào chỗ chấm:', [ln(['a) 2m 5dm = [[n:2,5]] m', 'b) 4 tấn 5 kg = [[n:4,005]] tấn', 'c) 12m² 6dm² = [[n:12,06]] m²', 'd) 5 kg 6g = [[n:5,006]] kg'], 2)]),
    B('Câu 10. Bạn Lan mua 25 quyển vở hết 75 000 đồng. Hỏi bạn Hà muốn mua ba chục quyển vở như thế thì phải trả người bán hàng bao nhiêu tiền?', loiVan(['Đáp số: [[n:90000]] đồng'])),
    B('Câu 11. Một thửa ruộng hình chữ nhật có chiều dài 150 m. Chiều rộng bằng {3/5} chiều dài.', [ln(['a) Tính diện tích thửa ruộng hình chữ nhật đó.', 'b) Trung bình cứ 100 m² người ta thu hoạch được 60 kg thóc. Hỏi cả thửa ruộng đó người ta thu hoạch được bao nhiêu tạ thóc?']), ...loiVan(['Đáp số: a) [[n:13500]] m²;  b) [[n:81]] tạ thóc'])]),
  ]),
  gk(10, 'Viết số thập phân, giá trị chữ số, hỗn số và phân số thập phân, so sánh số thập phân, đổi đơn vị đo, rút về đơn vị, phân số bằng nhau.', [
    T('Câu 1. Số thập phân gồm: năm trăm; hai đơn vị; sáu phần mười; tám phần trăm viết là:', ['502,608', '52,608', '52,68', '502,68'], '502,68'),
    T('Câu 2. Chữ số 6 trong số thập phân 82,561 có giá trị là:', ['{6/10}', '{6/100}', '{6/1000}', '6'], '{6/100}'),
    T('Câu 3. 5{6/100} viết dưới dạng số thập phân là:', ['5,06', '5,600', '5,6', '5,60'], '5,06'),
    T('Câu 4. Số lớn nhất trong các số: 6,235; 5,325; 6,325; 4,235 là:', ['6,235', '5,325', '6,325', '4,235'], '6,325'),
    T('Câu 5. Số thập phân 25,18 bằng số thập phân nào sau đây:', ['25,018', '25,180', '25,108', '250,18'], '25,180'),
    T('Câu 6. 0,05 viết dưới dạng phân số thập phân là:', ['{5/100}', '{5/10}', '{5/1000}', '5'], '{5/100}'),
  ], [
    B('Câu 7. Viết số thập phân thích hợp vào chỗ chấm:', [ln(['a) 8m 5dm = [[n:8,5]] m', 'b) 2km 65m = [[n:2,065]] km', 'c) 5 tấn 562 kg = [[n:5,562]] tấn', 'd) 12m² 5dm² = [[n:12,05]] m²'], 2)]),
    B('Câu 8. Mua 9 quyển vở hết 36000 đồng. Hỏi mua 27 quyển vở như thế thì hết bao nhiêu tiền?', loiVan(['Đáp số: [[n:108000]] đồng'])),
    B('Câu 9. Mua 1 tá bút chì hết 18 000 đồng. Hỏi mua 48 bút chì như thế hết bao nhiêu tiền?', loiVan(['Đáp số: [[n:72000]] đồng'])),
    B('Câu 10. Tìm x biết: {6/8} = {15/x}', [viet(2), ln(['x = [[N:20]]'])]),
  ]),
  gk(11, 'Phân số và hỗn số sang số thập phân, giá trị chữ số, viết số thập phân, đổi đơn vị diện tích, rút về đơn vị, cộng trừ chia phân số, tổng – hiệu, hiệu – tỉ.', [
    T('Câu 1. {9/100} viết dưới dạng số thập phân là:', ['0,9', '0,09', '0,009', '9,00'], '0,09'),
    T('Câu 2. Hỗn số 3{2/5} được chuyển thành số thập phân là?', ['3,4', '0,4', '17,5', '32,5'], '3,4'),
    T('Câu 3. Chữ số 5 trong số thập phân 12,25 có giá trị là?', ['{5/1000}', '{5/10}', '{5/100}', '{5/10000}'], '{5/100}'),
    T('Câu 4. Chín đơn vị, hai phần nghìn được viết là:', ['9,200', '9,2', '9,002', '9,02'], '9,002'),
    T('Câu 5. 5m² 5dm² = ……. cm². Số thích hợp điền vào chỗ trống là:', ['55', '550', '55000', '50500'], '50500'),
    T('Câu 6. Một người thợ may 15 bộ quần áo đồng phục hết 36 m vải. Hỏi nếu người thợ đó may 45 bộ quần áo đồng phục như thế thì cần bao nhiêu mét vải?', ['72 m', '108 m', '300 m', '81 m'], '108 m'),
  ], [
    B('Câu 1. Tính:', [ln(['a) {2/3} + {4/5} = [[n:22/15]]', 'b) {5/2} − {1/3} : {1/6} = [[n:1/2|3/6]]'], 2)]),
    B('Câu 2. Viết số thích hợp vào chỗ chấm:', [ln(['a) 5 m² = [[n:50000]] cm²', 'b) 2 km² = [[n:200]] ha', 'c) 2608 m² = [[n:26]] dam² [[n:8]] m²', 'd) 30000 hm² = [[n:30000]] ha'], 2)]),
    B('Câu 3. Chu vi của một thửa ruộng hình chữ nhật là 240 m. Chiều rộng kém chiều dài 20 m. Tính diện tích thửa ruộng đó.', loiVan(['Đáp số: [[n:3500]] m²'])),
    B('Câu 4. Con kém mẹ 24 tuổi. Năm nay tuổi con bằng {2/5} tuổi mẹ. Hỏi năm nay con bao nhiêu tuổi, mẹ bao nhiêu tuổi?', loiVan(['Đáp số: Con: [[n:16]] tuổi;  Mẹ: [[n:40]] tuổi'])),
  ]),
  gk(12, 'Phân số thập phân, giá trị chữ số, viết và so sánh số thập phân, đổi đơn vị đo, tìm tỉ số, tính với hỗn số, tìm x.', [
    T('Câu 1. Phân số nào dưới đây là phân số thập phân?', ['{100/57}', '{25/100}', '{15/20}', '{10/55}'], '{25/100}'),
    T('Câu 2. Giá trị của chữ số 5 trong số 87,052 là:', ['{5/10}', '{5/100}', '{5/1000}', '5 đơn vị'], '{5/100}'),
    T('Câu 3. Số thập phân gồm sáu mươi tám đơn vị, ba phần trăm được viết là:', ['68,3', '6,83', '68,03', '608,03'], '68,03'),
    T('Câu 4. Số bé nhất trong các số: 57,843 ; 56,834 ; 57,354 ; 56,345', ['57,843', '56,834', '57,354', '56,345'], '56,345'),
    T('Câu 5. Số thích hợp viết vào chỗ chấm là: 7cm² 9mm² = …… cm²', ['7,09', '7,9', '0,79', '0,790'], '7,09'),
    T('Câu 6. Một đội trồng rừng trung bình cứ 10 ngày trồng được 1500 cây thông. Hỏi trong 5 ngày đội đó trồng được bao nhiêu cây thông?', ['3000 cây', '7500 cây', '300 cây', '750 cây'], '750 cây'),
  ], [
    B('Câu 1. Tính:', [ln(['a) 3{1/3} − 2{1/2} = [[n:5/6]]', 'b) 1{1/5} : 1{1/2} = [[n:4/5|12/15]]'], 2)]),
    B('Câu 2. Viết số thích hợp vào chỗ chấm.', [ln(['a) 4,35m² = [[n:435]] dm²', 'b) 8 tấn 35kg = [[n:8,035]] tấn', 'c) 5 km 50m = [[n:5,05]] km', 'd) {1/4} ha = [[n:2500]] m²'], 2)]),
    B('Câu 3. Thắng cùng mẹ đi siêu thị mua 12 hộp bút thì trả 150 000 đồng. Hỏi nếu mua 36 hộp bút như thế thì trả bao nhiêu tiền?', loiVan(['Đáp số: [[n:450000]] đồng'])),
    B('Câu 4. Tìm x:', [viet(2), ln([timX('150 - (x + 35) = 100')])]),
  ]),
  gk(13, 'Giá trị chữ số, hỗn số sang số thập phân, so sánh số thập phân, diện tích hình thoi, đổi đơn vị đo, tính với phân số, bài toán tỉ lệ nghịch, diện tích hình vuông.', [
    T('Câu 1. Chữ số 8 trong số thập phân 95,824 có giá trị là:', ['{8/1000}', '{8/100}', '{8/10}', '8'], '{8/10}'),
    T('Câu 2. 3{9/100} viết dưới dạng số thập phân là:', ['3,900', '3,09', '3,9', '3,90'], '3,09'),
    T('Câu 3. Tìm số tự nhiên x biết: 69,98 < x < 70,001', ['x = 69', 'x = 70', 'x = 69,99', 'x = 69,980'], 'x = 70'),
    T('Câu 4. Số gồm sáu trăm, bốn chục, hai đơn vị và tám phần mười viết là:', ['6,428', '64,28', '642,8', '0,642'], '642,8'),
    T('Câu 5. Quan sát hình dưới đây và tính diện tích của hình thoi MNPQ. Biết: BC = 52 cm; AB = 75 cm.', ['3900 m²', '3900 cm²', '1950 cm', '1950 cm²'], '1950 cm²', ['gk13-c5', 220]),
  ], [
    B('Câu 1. Viết số thập phân thích hợp vào chỗ chấm:', [ln(['a) 9m 6dm = [[n:9,6]] m', 'b) 2cm² 5mm² = [[n:2,05]] cm²', 'c) 5 tấn 62kg = [[n:5,062]] tấn'])]),
    B('Câu 2. Tính:', [ln(['a) {2/5} + {5/6} = [[n:37/30]]', 'b) 4 − 2{1/3} = [[n:5/3]]', 'c) {4/7} + {1/4} : {2/3} = [[n:53/56]]', 'd) {3/4} : {2/3} × {8/9} = [[n:1|72/72]]'], 2)]),
    B('Câu 3. Một bếp ăn chuẩn bị số gạo cho 36 người ăn trong 50 ngày. Nhưng thực tế có 60 người ăn, hỏi số gạo đã chuẩn bị đủ dùng trong bao nhiêu ngày? (Mức ăn của mỗi người như nhau)', loiVan(['Đáp số: [[n:30]] ngày'])),
    B('Câu 4. Một khu vườn hình vuông có chu vi 1000m. Diện tích khu vườn đó bằng bao nhiêu mét vuông? Bao nhiêu héc-ta?', loiVan(['Đáp số: [[n:62500]] m²;  [[n:6,25]] ha'])),
  ]),
  gk(14, 'Phân số sang số thập phân, giá trị chữ số, so sánh số thập phân, bài toán tỉ lệ nghịch, tính với phân số, đổi đơn vị đo, diện tích hình chữ nhật, số thập phân xen giữa.', [
    T('Câu 1. {5/100} viết dưới dạng số thập phân là:', ['0,5', '0,05', '0,005', '5,00'], '0,05'),
    T('Câu 2. Phân số {2/5} được chuyển thành số thập phân là?', ['0,4', '2,5', '4', '40'], '0,4'),
    T('Câu 3. Chữ số 5 trong số thập phân 342,205 có giá trị là?', ['{5/1000}', '{5/10}', '{5/100}', '{5/10000}'], '{5/1000}'),
    T('Câu 4. Số lớn nhất trong các số 39,402; 39,204; 40,392; 40,293 là:', ['40,392', '39,204', '40,293', '39,402'], '40,392'),
    T('Câu 5. Một tổ gồm 5 người đắp xong một đoạn đường trong 20 ngày. Hỏi nếu tổ đó có 10 người thì đắp xong đoạn đường đó trong bao nhiêu ngày?', ['5 ngày', '2 ngày', '10 ngày', '15 ngày'], '10 ngày'),
  ], [
    B('Câu 1. Tính:', [ln(['a) {1/2} + {3/4} × {1/3} = [[n:3/4|6/8]]', 'b) {2/3} + {1/2} − {5/12} = [[n:3/4|9/12]]'], 2)]),
    B('Câu 2. Viết số thập phân thích hợp vào chỗ chấm:', [ln(['a) 2m 5dm = [[n:2,5]] m', 'b) 4 tạ 5 yến = [[n:4,5]] tạ', 'c) 12m² 6dm² = [[n:12,06]] m²', 'd) 4ha 17dam² = [[n:4,17]] ha'], 2)]),
    B('Câu 3. Một thửa ruộng hình chữ nhật có chiều dài 60m, chiều rộng bằng {2/3} chiều dài.', [ln(['a) Tính diện tích thửa ruộng đó.', 'b) Biết rằng, cứ 100m² thu hoạch được 50kg thóc. Hỏi trên cả thửa ruộng đó người ta thu hoạch được bao nhiêu tạ thóc?']), ...loiVan(['Đáp số: a) [[n:2400]] m²;  b) [[n:12]] tạ thóc'])]),
    B('Câu 4. Tìm ba số thập phân thích hợp để viết vào chỗ chấm, sao cho: 0,2 < ......... < 0,23', [ln([`0,2 < [[n:${giua02va023}]] < 0,23`, `0,2 < [[n:${giua02va023}]] < 0,23`, `0,2 < [[n:${giua02va023}]] < 0,23`])]),
  ]),
  gk(15, 'Hỗn số sang số thập phân, viết số thập phân, đổi đơn vị khối lượng và diện tích, nhân chia số đo, tính với phân số, chu vi – diện tích hình chữ nhật, trung bình cộng, tính hợp lí.', [
    T('Câu 1. Hỗn số 5{1/4} được chuyển thành số thập phân là?', ['5,1', '5,4', '2,25', '5,25'], '5,25'),
    T('Câu 2. Viết số thập phân có: Ba trăm, hai đơn vị, bốn phần trăm, hai phần chục nghìn', ['32,042', '302,0042', '302,4020', '302,0402'], '302,0402'),
    T('Câu 3. Số thích hợp để điền vào chỗ chấm: 30g = …... kg là:', ['30 000', '0,03', '0,3', '3'], '0,03'),
    T('Câu 4. Viết số thích hợp vào chỗ chấm: 627m² = ... ha', ['627', '0,0627', '6,027', '6,27'], '0,0627'),
    T('Câu 5. Một ngày có 5 xe ô tô chở thóc về kho, trung bình mỗi xe chở được 3500kg thóc. Hỏi trong 5 ngày đoàn xe đó chở được bao nhiêu tấn thóc về kho?', ['8750 tấn', '875 tấn', '87,5 tấn', '8,75 tấn'], '87,5 tấn'),
  ], [
    B('Câu 1. Tính:', [ln(['a) 1{1/2} + 1{1/3} = [[n:17/6]]', 'b) {5/6} : {3/8} × {3/4} = [[n:5/3|15/9|60/36|120/72]]'], 2)]),
    B('Câu 2. Một thửa ruộng hình chữ nhật có chiều dài 50m, chiều rộng bằng {3/5} chiều dài. Tính chu vi và diện tích thửa ruộng đó?', loiVan(['Đáp số: Chu vi: [[n:160]] m;  Diện tích: [[n:1500]] m²'])),
    B('Câu 3. Một vòi nước chảy vào bể. Giờ đầu chảy được {2/8} bể, giờ thứ hai chảy vào được {2/4} bể. Hỏi trung bình mỗi giờ vòi nước đó chảy vào được bao nhiêu phần của bể?', loiVan(['Đáp số: [[n:3/8|6/16]] bể'])),
    B('Câu 4. Tính theo cách hợp lí:', [viet(2), ln([tinh('(12 + 77 + 34 + 23 + 88 + 45 + 55 + 66) × (45200 - 1808 × 25)')])]),
  ]),
];
