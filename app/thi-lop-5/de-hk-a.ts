// Đề Toán lớp 5 — xem chung.ts
// Kiểm tra học kì 1, Đề 1 – 9 ("20 đề thi học kì 1 Toán 5 có đáp án và lời giải chi tiết").
import type { RawPhieu } from '../thi-lop-1/kieu';
import { B, T, datTinh, ds, hk, ln, loiVan, mc, timX, tinh, tx, viet } from './chung';

export const DE_HK_A: RawPhieu[] = [
  hk(1, 'Viết số thập phân, phân số thập phân, so sánh số thập phân, rút về đơn vị, diện tích tam giác, đặt tính, tìm x, tỉ số phần trăm, tính nhanh.', [
    T('Câu 1. Số thập phân “tám đơn vị, hai phần nghìn” được viết là:', ['82', '8,2', '8,02', '8,002'], '8,002'),
    T('Câu 2. Phân số thập phân {834/100} được viết dưới dạng số thập phân là:', ['0,0834', '0,834', '8,34', '83,4'], '8,34'),
    T('Câu 3. Trong các số thập phân 42,538; 41,835; 42,358; 41,538 số thập phân lớn nhất là:', ['42,538', '41,835', '42,358', '41,538'], '42,538'),
    T('Câu 4. Mua 12 quyển vở hết 24000 đồng. Vậy mua 30 quyển vở như thế hết số tiền là:', ['60000 đồng', '72000 đồng', '6000 đồng', '720 000 đồng'], '60000 đồng'),
    T('Câu 5. Một hình tam giác có độ dài đáy là 2m và chiều cao là 5,8dm thì diện tích hình tam giác trên là:', ['116m²', '58dm²', '58m²', '116dm²'], '58dm²'),
    T('Câu 6. Chọn dấu thích hợp để điền vào chỗ chấm: 3,71 ... 3,685', ['=', '>', '<'], '>'),
  ], [
    B('Bài 1. (2 điểm) Đặt tính rồi tính.', datTinh('5,1 + 4,65', '70,4 - 32,8', '12,5 × 3', '24 : 5'), 2),
    B('Bài 2. (2 điểm) Tìm x, biết:', [ln(['a) ' + timX('x × 4,8 = 60'), 'b) ' + timX('100 - x : 6 = 77,8')], 2)], 2),
    B('Bài 3. (2 điểm) Lớp 5A có 40 học sinh, trong đó số học sinh nữ là 30 em còn lại là học sinh nam. Tìm tỉ số phần trăm của học sinh nam và số học sinh lớp 5A.', loiVan(['Đáp số: [[n:25]] %']), 2),
    B('Bài 4. (1 điểm) Tính nhanh', [ln([tinh('3,456 × 40 + 3,456 × 460 + 3,456 × 500')])], 1),
  ], 0.5),

  hk(2, 'Hỗn số và số thập phân, hàng của chữ số, so sánh số thập phân, đổi hm² – m², tìm x, rút về đơn vị, đặt tính, tỉ số phần trăm, diện tích – chu vi, lãi suất.', [
    T('Câu 1. Hỗn số 2{34/100} được viết dưới dạng số thập phân là:', ['2,034', '0,234', '23,4', '2,34'], '2,34'),
    T('Câu 2. Chữ số 8 trong số 36,082 thuộc hàng nào?', ['Hàng đơn vị', 'Hàng phần mười', 'Hàng phần trăm', 'Hàng phần nghìn'], 'Hàng phần trăm'),
    T('Câu 3. Trong các số: 69,54; 9,07; 105,8; 28,3. Số bé nhất là:', ['69,54', '9,07', '105,8', '28,3'], '9,07'),
    T('Câu 4. Số thập phân thích hợp để viết vào chỗ chấm của 6hm² 47m² = ……hm² là:', ['6,0047', '6,047', '6,47', '0,647'], '6,0047'),
    T('Câu 5. Tìm x, biết: x × 0,125 = 1,09. Vậy x là:', ['0,872', '87,2', '8,72', '872'], '8,72'),
    T('Câu 6. 10 người làm xong một sân trường phải hết một tuần lễ. Nay muốn làm xong sân trường đó trong 5 ngày thì cần bao nhiêu người? (sức làm của mỗi người như nhau)', ['12 người', '14 người', '15 người', '20 người'], '14 người'),
  ], [
    B('Bài 1 (2 điểm). Đặt tính rồi tính:', datTinh('24,206 + 38,497', '85,34 - 46,29', '40,5 × 5,3', '28,32 : 8'), 2),
    B('Bài 2 (1 điểm). Đúng ghi Đ, sai ghi S:', [ln([ds('a) Tỉ số phần trăm của hai số 10,26 và 36 là 2,85%.', false), ds('b) 65% của một số là 78. Vậy số đó là: 120.', true)])], 1),
    B('Bài 3 (2,5 điểm). Một mảnh đất hình chữ nhật có diện tích là 340,2m² và chiều dài là 32,4m. Tính chu vi của mảnh đất đó.', loiVan(['Đáp số: [[n:85,8]] m']), 2.5),
    B('Bài 4 (1,5 điểm). Hãy tìm hiểu lãi suất gửi ngân hàng ở địa phương em và tính xem nếu gửi 20 000 000 đồng thì sau một tháng cả số tiền gửi và tiền lãi là bao nhiêu? (Giả sử lãi suất là 0,5% một tháng.)', loiVan(['Đáp số: [[n:20100000]] đồng']), 1.5),
  ], 0.5),

  hk(3, 'Giá trị chữ số, cấu tạo số thập phân, so sánh ha – m², tổng – tỉ, tỉ số phần trăm, đặt tính, giá trị biểu thức, diện tích hình chữ nhật, lãi suất.', [
    T('Câu 1. Giá trị của chữ số 5 trong số thập phân 869,457 là:', ['{5/10}', '{5/1000}', '50', '{5/100}'], '{5/100}'),
    T('Câu 2. Số thập phân mà phần nguyên là số lẻ nhỏ nhất có ba chữ số, phần thập phân là số chẵn lớn nhất có bốn chữ số là:', ['101,9998', '111,1998', '103,1988', '100,8888'], '101,9998'),
    T('Câu 3. Điền dấu (>, < hoặc =) thích hợp vào chỗ trống:   23ha 45m² ……. 23,45ha', ['>', '=', '<'], '<'),
    T('Câu 4. Tổng của hai số là 0,6. Thương của số bé và số lớn cũng bằng 0,6. Tìm hai số.', ['0,2 và 0,4', '0,225 và 0,375', '0,235 và 0,2', '0,48 và 0,12'], '0,225 và 0,375'),
    T('Câu 5. Trong bể có 25 con cá, trong đó có 20 con cá chép. Tỉ số phần trăm của số cá chép và số cá trong bể là:', ['5%', '20%', '80%', '100%'], '80%'),
    T('Câu 6. 45% của 120 là:', ['540', '54', '45', '12'], '54'),
  ], [
    B('Bài 1 (1 điểm). Đặt tính rồi tính:', datTinh('146,34 + 521,85', '745,5 - 14,92', '25,04 × 3,5', '66,15 : 63'), 1),
    B('Bài 2 (2 điểm). Tính giá trị biểu thức:', [ln(['a) ' + tinh('207,5 - 12,3 × 2,4 + 8,5'), 'b) ' + tinh('502 - (45,5 + 22,5 × 12)')])], 2),
    B('Bài 3 (3 điểm). Một mảnh đất hình chữ nhật có chiều dài 24m, chiều rộng kém chiều dài 4,5m. a) Tính diện tích mảnh đất đó? b) Người ta dành 15% diện tích đất để làm nhà. Tính diện tích phần đất làm nhà.', loiVan(['Đáp số: a) [[n:468]] m²;  b) [[n:70,2]] m²']), 3),
    B('Bài 4 (1 điểm). Viết tiếp số thích hợp vào chỗ chấm:', [tx('Lãi suất tiết kiệm là 0,6% một tháng. Một người gửi tiết kiệm 10 000 000 đồng. Sau 1 tháng cả số tiền gửi và số tiền lãi là: [[n:10060000]] đồng.')], 1),
  ]),

  hk(4, 'Viết số thập phân, so sánh, tỉ số phần trăm, giá trị biểu thức, đổi dm² – cm², diện tích tam giác, đặt tính, tìm x, tìm phần trăm của một số, tính thuận tiện.', [
    T('Câu 1. Số “Tám mươi chín phẩy bảy mươi bảy” viết là:', ['809,77', '89,77', '89,707', '98,77'], '89,77'),
    T('Câu 2. Số lớn nhất trong các số 5,25; 5,52; 5,7; 5,58 là:', ['5,52', '5,25', '5,7', '5,58'], '5,7'),
    T('Câu 3. Số 0,55 viết dưới dạng tỉ số phần trăm là:', ['0,55%', '5,5%', '55%', '550%'], '55%'),
    T('Câu 4. Giá trị của biểu thức 8,6 × (5,7 – 4,7) + 5,6 : 4 là:', ['10', '12', '7,5', '3,55'], '10'),
    T('Câu 5. 6dm² 15cm² = ... dm². Số thích hợp điền vào chỗ chấm là:', ['615', '61,5', '6,0015', '6,15'], '6,15'),
    T('Câu 6. Một hình tam giác có độ dài đáy là 4,5cm, chiều cao 2,4cm. Tính diện tích hình tam giác đó.', ['10,8cm²', '5,4cm²', '21,6cm²', '4,8cm²'], '5,4cm²'),
  ], [
    B('Bài 1. (2 điểm) Đặt tính rồi tính:', datTinh('12,47 + 39,68', '657,21 - 198,34', '109,8 × 5,4', '91,08 : 3,6'), 2),
    B('Bài 2. (2 điểm) Tìm x:', [ln(['a) ' + timX('9,8 : x = 2,8 + 7'), 'b) ' + timX('x + 25,6 = 86,5 : 2,5')], 2)], 2),
    B('Bài 3. (2 điểm) Một trại chăn nuôi có số gà và vịt là 1575 con, trong đó 40% là vịt, còn lại là gà. Hỏi trại chăn nuôi đó có bao nhiêu con gà, bao nhiêu con vịt?', loiVan(['Đáp số: Gà: [[n:945]] con;  Vịt: [[n:630]] con']), 2),
    B('Bài 4. (1 điểm) Tính bằng cách thuận tiện nhất:', [ln(['a) ' + tinh('16,9 + 8,4 + 3,1 + 1,6'), 'b) ' + tinh('34,5 × 6,7 + 34,5 × 3,3')])], 1),
  ], 0.5),

  hk(5, 'Viết số thập phân, đổi m – cm, tìm một số khi biết phần trăm, tỉ số phần trăm, chiều cao tam giác, đặt tính, tìm x, diện tích, tổng – tỉ.', [
    T('Câu 1. Số "Bốn mươi bảy đơn vị, bốn phần mười và tám phần trăm" viết như sau:', ['47,48', '47,408', '47,0480', '47,048'], '47,48'),
    T('Câu 2. Viết số thập phân thích hợp vào chỗ chấm:   3m 8cm = … m', ['38', '3,8', '3,08', '3,008'], '3,08'),
    T('Câu 3. Tìm một số biết 25% của nó là 438. Số đó là:', ['1652', '1752', '1852', '1952'], '1752'),
    T('Câu 4. Phân số {1/2} được viết dưới dạng tỉ số phần trăm là:', ['0,5%', '1,2%', '12%', '50%'], '50%'),
    T('Câu 5. Lớp học có 25 học sinh, trong đó có 13 nữ. Hỏi số học sinh nữ chiếm bao nhiêu phần trăm của lớp học đó?', ['13%', '25%', '52%', '48%'], '52%'),
    T('Câu 6. Một bồn hoa hình tam giác có diện tích là 18m², độ dài đáy là 7,5m. Chiều cao của bồn hoa đó là:', ['6m', '4,8m', '2,4m', '13,5m'], '4,8m'),
  ], [
    B('Bài 1. Đặt tính rồi tính (2 điểm)', datTinh('926,83 + 549,7', '987,054 - 456,18', '12,6 × 7,3', '9,6 : 1,25'), 2),
    B('Bài 2. Tìm x (2 điểm)', [ln(['a) ' + timX('2,4 : x = 16 : 10'), 'b) ' + timX('x × 3,5 = 104,92 - 47,52')], 2)], 2),
    B('Bài 3. (2 điểm) Một mảnh đất hình chữ nhật có chiều dài 48m, chiều rộng bằng {1/2} chiều dài. Người ta dành 25% diện tích mảnh đất để đào ao. Tính diện tích đất đào ao.', loiVan(['Đáp số: [[n:288]] m²']), 2),
    B('Bài 4. (1 điểm) Tìm một số thập phân biết nếu dịch chuyển dấu phẩy của số đó sang trái 1 chữ số thì được số mới mà tổng của số mới và số cần tìm là 19,25.', loiVan(['Đáp số: [[n:17,5]]']), 1),
  ], 0.5),

  hk(6, 'So sánh hỗn số, đổi đơn vị đo về hỗn số, hỗn số và phân số, tính hợp lí với hỗn số, hai vòi nước cùng chảy, tìm số tự nhiên.', [], [
    T('Câu 1. Khoanh vào chữ đặt trước câu trả lời đúng: So sánh 3{2/5} và 3{4/10}:', ['3{2/5} < 3{4/10}', '3{2/5} > 3{4/10}', '3{2/5} = 3{4/10}'], '3{2/5} = 3{4/10}'),
    B('Câu 2. Đúng ghi Đ, sai ghi S:', [
      ln([
        ds('a) 2m 45mm = 2{45/100} m', false),
        ds('b) 2m 45mm = 2{45/1000} m', true),
        ds('c) 8km 9m = 8{9/100} m', false),
        ds('d) 8km 9m = 8{9/1000} km', true),
      ], 2),
    ]),
    B('Câu 3. Nối số tự nhiên với phân số để được hỗn số: Mỗi số 3; 5; 7 ghép được với phân số nào dưới đây để được hỗn số? (chọn “Được” hoặc “Không”)', [
      {
        t: 'grid',
        border: true,
        rows: [
          ['{3/4}', '{4/3}', '{5/4}', '{4/5}', '{3/8}', '{8/3}'],
          ['[[t:Được/Được,Không]]', '[[t:Không/Được,Không]]', '[[t:Không/Được,Không]]', '[[t:Được/Được,Không]]', '[[t:Được/Được,Không]]', '[[t:Không/Được,Không]]'],
        ],
      },
    ]),
    B('Câu 4. Khoanh vào chữ đặt trước câu trả lời đúng:', [
      mc('a) 5{3/4} = ?', ['{15/4}', '{20/4}', '{23/4}'], '{23/4}'),
      mc('b) {38/3} = ?', ['12{1/3}', '12{2/3}', '12{3/4}'], '12{2/3}'),
    ]),
    B('Câu 5. Đúng ghi Đ, sai ghi S:', [
      ln([ds('a) 1{3/4} tấn < 10{3/4} tạ', false), ds('b) 1{3/4} tấn = 10{3/4} tạ', false), ds('c) 1{3/4} tấn > 10{3/4} tạ', true)]),
    ]),
    B('Câu 6. Tính bằng cách hợp lí nhất:', [
      viet(2),
      ln(['a) 1{1/3} × 1{1/4} × 1{1/5} × 1{1/6} × 1{1/7} × 1{1/8} = [[n:3]]', 'b) 1{1/3} : 1{1/4} : 1{1/5} : 1{1/6} : 1{1/7} : 1{1/8} = [[n:16/27]]']),
    ]),
    B('Câu 7. Có hai vòi nước cùng chảy vào một bể không chứa nước. Nếu vòi thứ nhất chảy riêng thì sau 9 giờ sẽ đầy bể. Nếu vòi thứ hai chảy riêng thì sau 6 giờ sẽ đầy bể. Hỏi hai vòi cùng chảy lúc 8 giờ 24 phút thì đến mấy giờ đầy nước?', loiVan(['Đáp số: Bể đầy nước lúc [[n:12]] giờ'])),
    B('Câu 8. Tìm a biết a là số tự nhiên:', [tx('({6/7} + {1/4}) : ({19/14} − {1/4}) < a < {7/3}'), viet(2), ln(['a = [[N:2]]'])]),
  ]),

  hk(7, 'Tìm hai số khi biết tổng – tỉ, hiệu – tỉ, rút về đơn vị, quan hệ tỉ lệ, diện tích hình chữ nhật, gấp rưỡi.', [], [
    B('Câu 1. Đúng ghi Đ, sai ghi S: Tổng của hai số là 376. Số thứ hai bằng {3/5} số thứ nhất. Tìm hai số đó.', [
      ln([ds('a) Số thứ nhất là 141, số thứ hai là 235', false), ds('b) Số thứ nhất là 235, số thứ hai là 141', true)]),
    ]),
    T('Câu 2. Hiệu hai số là 240. Tỉ số giữa hai số là {7/12}. Tìm hai số đó.', ['330 và 570', '336 và 576', '348 và 588'], '336 và 576'),
    B('Câu 3. Đúng ghi Đ, sai ghi S: Một ô tô đi trong 5 giờ được 225km. Hỏi ô tô đó đi trong 8 giờ được bao nhiêu ki-lô-mét?', [
      ln([ds('a) 320km', false), ds('b) 345km', false), ds('c) 360km', true)], 3),
    ]),
    B('Câu 4. Đúng ghi Đ, sai ghi S: Một tổ công nhân có 4 người làm xong một công việc trong 12 ngày. Nếu chỉ có 3 người thì làm xong công việc đó trong mấy ngày? (năng suất làm của mọi người như nhau và không thay đổi).', [
      ln([ds('a) 200 ngày', false), ds('b) 18 ngày', false), ds('c) 16 ngày', true)], 3),
    ]),
    T('Câu 5. Một mảnh vườn hình chữ nhật có chu vi là 120m, chiều rộng bằng {2/3} chiều dài. Tính diện tích mảnh vườn đó.', ['800m²', '864m²', '3456m²'], '864m²'),
    B('Câu 6. Mẹ cho hai anh em 40 cái kẹo. Số kẹo của em gấp rưỡi số kẹo của anh. Hỏi mẹ cho mỗi người bao nhiêu cái kẹo?', loiVan(['Đáp số: Em: [[n:24]] cái kẹo;  Anh: [[n:16]] cái kẹo'])),
    B('Câu 7. Dùng một số tiền để mua gạo tẻ với giá 6000 đồng/1kg thì mua được 30kg. Với số tiền đó mua gạo nếp với giá 9000 đồng/1kg thì được bao nhiêu ki-lô-gam?', loiVan(['Đáp số: [[n:20]] kg'])),
    B('Câu 8. Mua 5m vải hết 120 000 đồng. Hỏi mua 15m vải như thế hết bao nhiêu tiền?', loiVan(['Đáp số: [[n:360000]] đồng'])),
  ]),

  hk(8, 'Tổng – tỉ, hiệu – tỉ, diện tích hình chữ nhật, rút về đơn vị, quan hệ tỉ lệ, bài toán tuổi, năng suất.', [], [
    T('Câu 1. Tổng của hai số là số lớn nhất có hai chữ số. Tìm hai số đó biết nếu viết thêm một chữ số 0 vào bên phải số bé thì được số lớn.', ['10 và 90', '9 và 99', '9 và 90'], '9 và 90'),
    T('Câu 2. Một mảnh đất hình chữ nhật có chiều rộng bằng {2/5} chiều dài. Nếu chiều rộng tăng thêm 9m, chiều dài bớt đi 9m thì mảnh đất trở thành hình vuông. Tính diện tích mảnh đất đó.', ['300m²', '360m²', '420m²'], '360m²'),
    B('Câu 3. Đúng ghi Đ, sai ghi S: Một người đi xe máy trong 16 phút được 9km 600m. Hỏi với mức đi như thế trong 5{1/3} giờ thì người đó đi được bao nhiêu ki-lô-mét?', [
      ln([ds('a) 108km', false), ds('b) 150km', false), ds('c) 192km', true)], 3),
    ]),
    T('Câu 4. 18 người làm xong một đoạn đường mất 5 ngày. Hỏi 30 người làm xong đoạn đường đó trong bao nhiêu ngày? (Biết sức làm việc của mỗi người là như nhau).', ['2 ngày', '3 ngày', '4 ngày'], '3 ngày'),
    B('Câu 5. Tổng số tuổi hiện nay của hai mẹ con là 36 tuổi. Tuổi con bằng {2/7} tuổi mẹ. Hỏi: a) Hiện nay mỗi người bao nhiêu tuổi? b) Mấy năm sau tuổi mẹ gấp 3 lần tuổi con?', loiVan(['Đáp số: a) Mẹ: [[n:28]] tuổi;  Con: [[n:8]] tuổi', 'b) [[n:2]] năm'])),
    B('Câu 6. 6 người thợ trong 4 giờ quét vôi trên tường được 120m². Hỏi 8 người thợ quét vôi trong mấy giờ thì được 200m². Biết năng suất làm việc của mỗi người như nhau.', loiVan(['Đáp số: [[n:5]] giờ'])),
  ]),

  hk(9, 'Đổi và so sánh đơn vị đo độ dài, khối lượng, tính với số đo, phân số của một số, trung bình cộng.', [], [
    T('Câu 1. Điền số thích hợp vào chỗ chấm:   350m = ......... cm.', ['3500', '35 000', '350 000'], '35 000'),
    B('Câu 2. Điền dấu >, =, < vào chỗ chấm:', [ln(['a) 260 m [[c:>]] {1/4} km', 'b) 2km 5m [[c:=]] 2005 m', 'c) 430 m [[c:>]] 4hm 3m', 'd) {2/5} km [[c:<]] 420 m'], 2)]),
    B('Câu 3. Đúng ghi Đ, sai ghi S: Điền số thích hợp vào chỗ chấm: 50000kg = ....... tấn', [ln([ds('a) 5000', false), ds('b) 500', false), ds('c) 50', true), ds('d) 5', false)], 2)]),
    T('Câu 4. Một cửa hàng bán ngày thứ nhất được 4 tạ 5kg gạo. Ngày thứ hai bán bằng {3/5} ngày thứ nhất. Hỏi cả hai ngày bán được bao nhiêu ki-lô-gam gạo?', ['540kg', '620kg', '648kg'], '648kg'),
    B('Câu 5. Đúng ghi Đ, sai ghi S:', [
      tx('a) Tính: 4km 7m + 124m – 2km 95m = ?'),
      ln([ds('2km 36m', true), ds('2km 540m', false), ds('2km 450m', false)], 3),
      tx('b) Tính: 13kg 25g – 7kg 30g + 495g = ?'),
      ln([ds('6kg 49g', false), ds('6kg 490g', true), ds('6kg 940g', false)], 3),
    ]),
    B('Câu 6. Xe tải thứ nhất chở được 3 tấn 260kg rau xanh. Xe tải thứ hai chở được ít hơn xe tải thứ nhất 120kg nhưng lại nhiều hơn xe tải thứ ba 540kg. Hỏi trung bình mỗi xe chở được mấy tấn rau xanh?', loiVan(['Đáp số: [[n:3]] tấn'])),
    B('Câu 7. Ba đội công nhân phải sửa một đoạn đường dài 8km 460m. Đội một sửa được {2/9} đoạn đường. Đội hai sửa được số mét bằng {5/4} số mét đội một sửa được. Số mét còn lại đội ba sửa. Hỏi mỗi đội sửa được bao nhiêu mét đường?', loiVan(['Đáp số: Đội một: [[n:1880]] m;  Đội hai: [[n:2350]] m;  Đội ba: [[n:4230]] m'])),
  ]),
];
