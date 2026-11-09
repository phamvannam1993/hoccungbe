// Đề Toán lớp 5 — xem chung.ts
// Kiểm tra học kì 1, Đề 10 → Đề 17 (chép từ "20 đề thi học kì 1 Toán 5 có đáp án và lời giải chi tiết").
// Đề không ghi điểm từng câu → điểm chia đều. Đáp án đối chiếu phần hướng dẫn giải và tính lại.
import type { RawPhieu } from '../thi-lop-1/kieu';
import { B, ds, hk, ln, loiVan, T, tx, viet, xep } from './chung';

const DS = 'Đúng ghi Đ, sai ghi S:';
const DSc = 'Đúng chọn Đ, sai chọn S:';
const KH = 'Khoanh vào chữ đặt trước câu trả lời đúng:';
const T14 = '0,12|20,5|0,205|2,05|1,2|1,002';

export const DE_HK_B: RawPhieu[] = [
  hk(10, 'So sánh số đo độ dài, khối lượng; viết số đo dưới dạng hỗn số; bài toán hiệu – tỉ; tính cạnh tam giác từ tổng từng cặp cạnh.', [], [
    B(`Câu 1. ${DS} Điền dấu > , = , < vào chỗ chấm:`, [
      ln(['a) 20km 5m ......... 20050m', ds('20km 5m > 20050m', false), ds('20km 5m = 20050m', false), ds('20km 5m < 20050m', true)]),
      ln(['b) 3kg 15g ......... 3015g', ds('3kg 15g > 3015g', false), ds('3kg 15g = 3015g', true), ds('3kg 15g < 3015g', false)]),
    ]),
    B(`Câu 2. ${DS}`, [
      ln([ds('a) 3 tấn 25kg = 3{25/100} tấn', false), ds('b) 3 tấn 25kg = 3{25/1000} tấn', true), ds('c) 4km 8m = 4{8/10} km', false), ds('d) 4km 8m = 4{8/1000} km', true)], 2),
    ]),
    T(`Câu 3. ${KH} Con lợn nặng hơn con dê 24kg. Biết {1/3} con dê nặng bằng {1/5} con lợn. Hỏi cả hai con nặng bao nhiêu ki-lô-gam?`, ['72kg', '96kg', '120kg'], '96kg'),
    B('Câu 4. Bao thứ nhất có nhiều hơn bao thứ hai 40kg gạo. Sau khi mỗi bao bán đi 20kg gạo thì số gạo còn lại ở bao thứ hai bằng {3/5} số gạo ở bao thứ nhất. Hỏi lúc đầu mỗi bao có bao nhiêu ki-lô-gam gạo?', loiVan(['Đáp số: Bao thứ nhất: [[n:120]] kg;  Bao thứ hai: [[n:80]] kg'])),
    B('Câu 5. Một bồn hoa hình tam giác. Tổng số đo cạnh thứ nhất và cạnh thứ hai là 2{4/5} m. Tổng số đo cạnh thứ hai và cạnh thứ ba là {18/5} m. Tổng số đo cạnh thứ ba và cạnh thứ nhất là 3{2/10} m. Tính số đo mỗi cạnh của bồn hoa.', loiVan(['Đáp số: Cạnh thứ nhất: [[n:6/5|12/10|1,2]] m;  Cạnh thứ hai: [[n:8/5|16/10|1,6]] m;  Cạnh thứ ba: [[n:2]] m'])),
  ]),

  hk(11, 'Đổi đơn vị đo diện tích (dam², hm², km², mm², cm², dm², ha); viết số đo diện tích dưới dạng hỗn số; diện tích hình chữ nhật, hình bình hành; bài toán lát gạch.', [], [
    B(`Câu 1. ${DS}`, [ln([ds('a) 20 dam² = 200 m²', false), ds('b) 20 dam² = 2000 m²', true), ds('c) 12000m² = 120km²', false), ds('d) 12000m² = 12km²', false)], 2)]),
    B(`Câu 2. ${DS}`, [ln([ds('a) 300hm² = 30000dam²', true), ds('b) 300hm² = 3000dam²', false), ds('c) 125000dam² = 125 hm²', false), ds('d) 125000dam² = 1250 hm²', true)], 2)]),
    B(`Câu 3. ${DS}`, [ln([ds('a) 15000mm² = 1500cm²', false), ds('b) 15000mm² = 150cm²', true), ds('c) 42000cm² = 420 dm²', true), ds('d) 42000cm² = 4200 dm²', false)], 2)]),
    B(`Câu 4. ${DS}`, [
      ln([ds('a) 8m² = {8/10} dam²', false), ds('b) 8m² = {8/100} dam²', true), ds('c) 4hm² 5dam² = 4{5/10} hm²', false), ds('d) 4hm² 5dam² = 4{5/100} hm²', true), ds('e) 7cm² 16mm² = 7{16/10} cm²', false), ds('g) 7cm² 16mm² = 7{16/100} cm²', true)], 2),
    ]),
    T(`Câu 5. ${KH} Một khu đất hình chữ nhật có chiều dài 200m. Chiều rộng bằng {3/4} chiều dài. Hỏi khu đất có diện tích là bao nhiêu héc-ta?`, ['3000ha', '300ha', '30ha', '3ha'], '3ha'),
    T(`Câu 6. ${KH} Điền số vào chỗ chấm: {4/5} ha = ……. m²`, ['80', '800', '8000', '80000'], '8000'),
    B('Câu 7. Một thửa ruộng hình bình hành có độ dài đáy là 5dam 4m. Chiều cao bằng {5/9} cạnh đáy. Hỏi thửa ruộng đó có diện tích bao nhiêu đề-ca-mét vuông?', loiVan(['Đáp số: [[n:16]] dam² [[n:20]] m²'])),
    B('Câu 8. Một căn phòng hình chữ nhật có chiều rộng 6m, chiều dài gấp rưỡi chiều rộng. Người ta lát nền căn phòng đó bằng loại gạch vuông cạnh 3dm. Hỏi căn phòng đó lát hết bao nhiêu viên gạch (diện tích phần mạch vữa không đáng kể)?', loiVan(['Đáp số: [[n:600]] viên gạch'])),
  ]),

  hk(12, 'Đổi đơn vị đo diện tích (m², dm², cm², dam², ha); viết số đo dưới dạng phân số, hỗn số; so sánh số đo diện tích; diện tích hình thoi; bài toán diện tích hình chữ nhật khi tăng các chiều.', [], [
    B(`Câu 1. ${DS}`, [ln([ds('a) 8m² 7dm² = 870dm²', false), ds('b) 8m² 7dm² = 807dm²', true), ds('c) 6dm² 6cm² = 606cm²', true), ds('d) 6dm² 6cm² = 660cm²', false), ds('e) 15ha 3dam² = 15{3/10} ha', false), ds('g) 15ha 3dam² = 15{3/100} ha', true)], 2)]),
    B(`Câu 2. ${DS} Viết phân số tối giản vào chỗ chấm:   125m² = …………… ha`, [ln([ds('a) {1/8}', false), ds('b) {1/80}', true), ds('c) {1/800}', false)], 3)]),
    T(`Câu 3. ${KH} Điền hỗn số vào chỗ chấm: 2hm² 345m² = ……… dam²`, ['23{45/100}', '234{5/100}', '203{45/100}', '230{45/100}'], '203{45/100}'),
    B(`Câu 4. ${DS} Điền dấu > , = , < vào chỗ chấm:   2ha 15m² …….. 20015m²`, [ln([ds('2ha 15m² > 20015m²', false), ds('2ha 15m² = 20015m²', true), ds('2ha 15m² < 20015m²', false)])]),
    T(`Câu 5. ${KH} Một khu an dưỡng có diện tích là 2{7/10} ha, trong đó {4/9} là diện tích hồ nước. Hỏi diện tích còn lại là bao nhiêu mét vuông?`, ['8000m²', '10000m²', '12000m²', '15000m²'], '15000m²'),
    B('Câu 6. Một hình thoi có diện tích là {9/25} dm². Có một đường chéo có độ dài là {3/50} m. Cạnh của hình thoi bằng {4/9} tổng số đo hai đường chéo. Hỏi chu vi hình thoi đó là bao nhiêu xăng-ti-mét?', loiVan(['Đáp số: [[n:32]] cm'])),
    B('Câu 7. Một khu đất hình chữ nhật có chiều dài hơn chiều rộng 35m. Nếu mỗi chiều tăng thêm 5m thì diện tích tăng thêm là 1450m². Hỏi khu đất đó có diện tích là bao nhiêu héc-ta?', loiVan(['Đáp số: [[n:2]] ha'])),
  ]),

  hk(13, 'Hỗn số và số thập phân; đổi đơn vị đo khối lượng, độ dài sang số thập phân; viết phân số dưới dạng phân số thập phân và số thập phân; bài toán phân số của một số.', [], [
    B(`Câu 1. ${DS}`, [ln([ds('a) 14{5/10} = 14,5', true), ds('b) 14{5/10} = 14,05', false), ds('c) 37{7/100} = 37,7', false), ds('d) 37{7/100} = 37,07', true), ds('e) 5{128/1000} = 51,28', false), ds('g) 5{128/1000} = 5,128', true)], 2)]),
    T(`Câu 2. ${KH} a) Viết số thích hợp vào chỗ chấm: 12 tạ 7 kg = ..... kg`, ['12007', '1207', '127'], '1207'),
    T('b) Viết số thích hợp vào chỗ chấm: 14156m = ..... km', ['1,4156', '14,156', '1415,6'], '14,156'),
    B('Câu 3. Nối ba số có độ dài bằng nhau (viết số thích hợp vào ô trống, theo mẫu):', [
      ln(['Mẫu: 8dm = {8/10} m = 0,8m', '35mm = [[n:35/1000]] m = [[n:0,035]] m', '16cm = [[n:16/100]] m = [[n:0,16]] m', '9mm = [[n:9/1000]] m = [[n:0,009]] m', '7dm = [[n:7/10]] m = [[n:0,7]] m']),
    ]),
    B(`Câu 4. ${DS}`, [ln([ds('a) 4,8m = 48cm', false), ds('b) 4,8m = 48dm', true), ds('c) 2,1 tấn = 2100kg', true), ds('d) 2,1 tấn = 210 kg', false)], 2)]),
    B('Câu 5. Viết các phân số sau dưới dạng phân số thập phân và số thập phân (theo mẫu):', [
      ln(['a) {3/5} = {6/10} = 0,6 (mẫu)', 'b) {12/5} = [[n:24/10]] = [[n:2,4]]', 'c) {3/4} = [[n:75/100]] = [[n:0,75]]', 'd) {5/8} = [[n:625/1000]] = [[n:0,625]]'], 2),
    ]),
    B('Câu 6. Một khu đất có diện tích là 2ha. {4/10} diện tích khu đất trồng cây ăn quả. {5/10} diện tích đào ao thả cá. Hỏi còn lại bao nhiêu héc-ta để trồng rau?', loiVan(['Đáp số: [[n:0,2|2/10|1/5]] ha'])),
    B('Câu 7. Một xe tải chở 2tạ 50kg lương thực gồm {7/10} tạ gạo nếp; {4/5} tạ gạo tẻ, còn lại là ngô. Hỏi xe đó chở bao nhiêu tạ ngô?', loiVan(['Đáp số: [[n:1]] tạ ngô'])),
  ]),

  hk(14, 'Phân số thập phân và số thập phân; so sánh phân số với số thập phân; chuyển phân số thành hỗn số; hàng của số thập phân; lập và sắp xếp số thập phân; tính giá trị biểu thức phân số; bài toán làm chung công việc.', [], [
    T(`Câu 1. ${KH} a) Viết thành phân số thập phân: 0,008 = ?`, ['{8/10}', '{8/100}', '{8/1000}', '{8/10000}'], '{8/1000}'),
    T('b) Viết thành phân số thập phân: 1,025 = .....', ['{1025/10}', '{1025/100}', '{1025/1000}', '{1025/10000}'], '{1025/1000}'),
    B(`Câu 2. ${DS} Điền dấu > , = , < vào chỗ chấm:   {5/8} .......0,625`, [ln([ds('a) {5/8} > 0,625', false), ds('b) {5/8} = 0,625', true), ds('c) {5/8} < 0,625', false)], 3)]),
    B(`Câu 3. ${DS} Chuyển phân số thành hỗn số:`, [ln([ds('a) {208/100} = 20{8/10}', false), ds('b) {208/100} = 2{8/100}', true)], 2)]),
    B('Câu 4. Nối phân số (hoặc hỗn số) với số thập phân bằng nó (bấm ô để chọn số thập phân):', [
      ln([`{12/100} = [[t:0,12/${T14}]]`, `{205/10} = [[t:20,5/${T14}]]`, `{205/1000} = [[t:0,205/${T14}]]`, `2{5/100} = [[t:2,05/${T14}]]`, `{12/10} = [[t:1,2/${T14}]]`, `{1002/1000} = [[t:1,002/${T14}]]`], 2),
    ]),
    B(`Câu 5. ${DS} Số 125,08 có phần thập phân gồm có:`, [ln([ds('a) 8 phần mười', false), ds('b) 0 phần mười, 8 phần trăm', true)])]),
    B('Câu 6. Cho 3 chữ số 1, 5, 7. Hãy lập các số thập phân có đủ ba chữ số đã cho mà phần thập phân có hai chữ số. Xếp các số lập được theo thứ tự giảm dần.', [
      viet(1),
      ln([xep([1.57, 1.75, 5.17, 5.71, 7.15, 7.51], false)]),
    ]),
    B('Câu 7. Tính rồi viết kết quả dưới dạng số thập phân:', [
      ln(['a) {1/10} + {4/20} + {9/30} + {16/40} + {25/50} + {36/60} + {49/70} + {64/80} + {81/90} = [[n:4,5]]', 'b) ({4/5} × {3/8} + {4/5} × {5/8} − {4/5} × {7/8}) : {1/2} = [[n:0,2]]']),
      viet(2),
    ]),
    B('Câu 8. Viết đáp số dưới dạng số thập phân: Hai công nhân cùng làm chung một công việc. Nếu người thứ nhất làm riêng thì làm xong trong 8 giờ. Nếu người thứ hai làm riêng thì làm xong trong 12 giờ. Hỏi cả hai người làm chung thì sau mấy giờ xong công việc?', loiVan(['Đáp số: [[n:4,8]] giờ'])),
  ]),

  hk(15, 'Số thập phân bằng nhau; viết số thập phân thành phân số thập phân; so sánh, sắp xếp số thập phân; tìm số tự nhiên, chữ số chưa biết; chu vi, diện tích hình chữ nhật; lập số thập phân; tính thuận tiện.', [], [
    B(`Câu 1. ${DS}`, [ln([ds('a) 19,750 = 19,75', true), ds('b) 19,750 = 197,50', false), ds('c) 30,08 = 300,80', false), ds('d) 30,08 = 30,080', true)], 2)]),
    T('Câu 2. Khoanh tròn vào chữ đặt trước câu trả lời đúng:', ['0,0400 = {400/10}', '0,0400 = {400/100}', '0,0400 = {400/1000}', '0,0400 = {400/10000}'], '0,0400 = {400/10000}'),
    B(`Câu 3. ${DS}`, [ln([ds('a) 42,42 < 42,042', false), ds('b) 42,42 > 42,042', true), ds('c) 25,05 > 25,050', false), ds('d) 25,05 = 25,050', true)], 2)]),
    T('Câu 4. Khoanh tròn vào chữ đặt trước câu trả lời đúng: Viết số thập phân 40,060 dưới dạng rút gọn nhất:', ['4,6', '40,6', '40,006', '40,06'], '40,06'),
    B(`Câu 5. ${DS} Các số sau đây được xếp theo thứ tự từ bé đến lớn:`, [ln([ds('a) 0,6 ; 0,25 ; 0,48 ; 0,312', false), ds('b) 0,25 ; 0,312 ; 0,48 ; 0,6', true)])]),
    B(`Câu 6. ${DS}`, [
      ln(['a) Tìm số tự nhiên x biết: 42,95 < x < 43,01', ds('x = 42', false) + '        ' + ds('x = 43', true)]),
      ln(['b) Tìm chữ số x biết: 36,x9 < 36,1', ds('x = 0', true) + '        ' + ds('x = 1', false)]),
    ]),
    B('Câu 7. Hãy xếp các số sau theo thứ tự giảm dần:   15,1 ; 14,7 ; 14,09 ; 21,02 ; 32,09', [ln([xep([15.1, 14.7, 14.09, 21.02, 32.09], false)])]),
    B('Câu 8. Tìm hai số tự nhiên liên tiếp a và b biết:   a < 20,01 < b', [ln(['a = [[n:20]] ;   b = [[n:21]]'])]),
    B('Câu 9. Viết đáp số dưới dạng số thập phân. Một mảnh bìa hình chữ nhật có chiều dài bằng {3/4} m, chiều rộng bằng {4/5} chiều dài. Tính chu vi và diện tích mảnh bìa đó.', loiVan(['Đáp số: Chu vi: [[n:2,7]] m;  Diện tích: [[n:0,45]] m²'])),
    B('Câu 10. Cho 4 chữ số 0, 2, 4, 6. Hãy lập các số thập phân có đủ 4 chữ số khác nhau mà phần thập phân có 3 chữ số.', [
      viet(3),
      ln(['Lập được tất cả [[n:24]] số.  Số bé nhất là [[n:0,246]] ;  số lớn nhất là [[n:6,420|6,42]]']),
    ]),
    B('Câu 11. Tính bằng cách thuận tiện nhất rồi viết kết quả dưới dạng số thập phân.', [viet(1), ln(['{42 × 37/74 × 84} = [[n:0,25]]'])]),
  ]),

  hk(16, 'Viết gọn số thập phân; tìm chữ số chưa biết; so sánh phân số, hỗn số với số thập phân; sắp xếp số thập phân; tìm x với phân số; lập số thập phân; trung bình cộng, tổng – hiệu.', [], [
    T(`Câu 1. ${KH} Viết số thập phân 900,0500 dưới dạng gọn nhất`, ['9,5', '9,05', '900,5', '900,05'], '900,05'),
    B(`Câu 2. ${DSc} Tìm chữ số x biết 8,6x5 > 8,675`, [ln([ds('a) x = 6', false), ds('b) x = 7', false), ds('c) x = 8', true), ds('d) x = 9', true)], 2)]),
    B(`Câu 3. ${DSc}`, [ln([ds('a) {4/10} < 0,40', false), ds('b) {4/10} = 0,4', true), ds('c) {1357/1000} = 1,357', true), ds('d) {1357/1000} > 1,357', false), ds('e) 3{5/100} > 3,5', false), ds('g) 3{5/100} < 3,5', true)], 2)]),
    B(`Câu 4. ${DSc} Các số sau đây được xếp theo thứ tự từ bé đến lớn là:`, [ln([ds('a) 0,42 ; 0,024 ; 0,042 ; 0,24 ; 0,204 ; 0,402', false), ds('b) 0,024 ; 0,042 ; 0,204 ; 0,24 ; 0,402 ; 0,42', true)])]),
    B(`Câu 5. ${DSc} Điền dấu > , = , < vào ô trống:`, [ln([ds('a) 78,875 > 78,88', false), ds('b) 0,529 < 0,53', true), ds('c) 27,68 < 27,592', false), ds('d) 53,02 = 53,0200', true)], 2)]),
    B('Câu 6. Tìm số thập phân x biết:', [
      ln(['a) x + {3/4} = {4/5}   →   x = [[N:0,05|1/20]]', 'b) x − {1/2} = {5/8}   →   x = [[N:1,125|9/8]]', 'c) x × {5/6} = {4/5}   →   x = [[N:0,96|24/25]]', 'd) x : {5/8} = {1/25}   →   x = [[N:0,025|1/40]]'], 2),
    ]),
    B('Câu 7. Cho bốn chữ số 3, 2, 1, 0. Hãy viết tất cả các số thập phân bé hơn 1 với đủ bốn chữ số đã cho theo thứ tự từ bé đến lớn.', [ln([xep([0.123, 0.132, 0.213, 0.231, 0.312, 0.321], true)])]),
    B('Câu 8. Viết đáp số dưới dạng số thập phân. Trung bình cộng của 3 số là {5/8}. Số thứ ba bằng trung bình cộng của số thứ nhất và số thứ hai. Hiệu của số thứ nhất và số thứ hai là {1/4}. Tìm ba số đó.', loiVan(['Đáp số: Số thứ nhất: [[n:0,75]];  Số thứ hai: [[n:0,5]];  Số thứ ba: [[n:0,625]]'])),
  ]),

  hk(17, 'Viết số đo độ dài, khối lượng, diện tích dưới dạng số thập phân; đổi m² – dm² – ha; diện tích hình chữ nhật, hình vuông; toán chuyển động, rút về đơn vị.', [], [
    B(`Câu 1. ${DSc}`, [ln([ds('a) 6m 6dm = 6,6m', true), ds('b) 6m 6dm = 6,06m', false), ds('c) 14m 4cm = 14,4m', false), ds('d) 14m 4cm = 14,04m', true), ds('e) 8dm 8mm = 8,8dm', false), ds('g) 8dm 8mm = 8,08dm', true), ds('h) 6km 50m = 6,50km', false), ds('k) 6km 50m = 6,05km', true)], 2)]),
    B(`Câu 2. ${DSc}`, [ln([ds('a) 268kg = 2,68 tạ', true), ds('b) 268kg = 26,8 tạ', false), ds('c) 350kg = 3,5 tấn', false), ds('d) 350kg = 0,35 tấn', true)], 2)]),
    T(`Câu 3. ${KH} Điền số thích hợp vào chỗ chấm: 1234m² = ……….. ha`, ['1,234', '12,34', '0,1234', '0,01234'], '0,1234'),
    B('Câu 4. Nối hai số đo diện tích bằng nhau:', [
      {
        t: 'match',
        top: [{ text: '45,6 m²' }, { text: '0,456 m²' }, { text: '4,56 m²' }, { text: '0,0456 m²' }],
        bottom: [{ text: '456 dm²' }, { text: '4,56 dm²' }, { text: '4560 dm²' }, { text: '45,6 dm²' }],
        pairs: [2, 3, 0, 1],
        topShape: 'box',
        bottomShape: 'box',
      },
    ]),
    T('Câu 5. Khoanh vào chữ đặt trước câu trả lời là đúng: Một khu vườn hình chữ nhật có chiều dài 3,5km, chiều rộng bằng {4/7} chiều dài. Hỏi diện tích khu vườn đó là bao nhiêu héc-ta?', ['70ha', '700ha', '7000ha'], '700ha'),
    B('Câu 6. Một xe máy trung bình mỗi phút đi được 600m. Hỏi:', [
      tx('a) Mỗi giờ xe máy đi được bao nhiêu ki-lô-mét?'),
      tx('b) Xe máy đi được 21km 600m thì hết bao nhiêu phút?'),
      viet(2),
      ln(['Đáp số: a) [[n:36]] km;  b) [[n:36]] phút']),
    ]),
    B('Câu 7. Bốn con bò ăn hết một tạ cỏ trong một ngày. Hỏi 2 con bò như thế trong 30 ngày ăn hết bao nhiêu tấn cỏ?', loiVan(['Đáp số: [[n:1,5]] tấn cỏ'])),
    B('Câu 8. Một khu đất hình vuông có chu vi là 1km. Hỏi diện tích khu đất đó là bao nhiêu héc-ta?', loiVan(['Đáp số: [[n:6,25]] ha'])),
  ]),
];
