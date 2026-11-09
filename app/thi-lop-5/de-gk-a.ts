// Đề Toán lớp 5 — xem chung.ts
// Kiểm tra giữa học kì 1, Đề 1 → 8 (PDF "20 đề kiểm tra học kì 1 Toán 5 có đáp án và lời giải chi tiết").
// Đáp án lấy từ phần hướng dẫn giải, đã tính lại; Đề 5 câu 3a sửa đáp án (bản gốc 9/35, đúng là 11/35).
import type { RawPhieu } from '../thi-lop-1/kieu';
import { B, T, gk, ln, loiVan, tx, xep } from './chung';

export const DE_GK_A: RawPhieu[] = [
  gk(1, 'Phân số thập phân, giá trị chữ số, so sánh số thập phân, rút về đơn vị, đổi đơn vị đo, nhân chia hỗn số, lát gạch, hiệu – tỉ.', [
    T('Câu 1. Phân số nào dưới đây là phân số thập phân?', ['{100/57}', '{23/100}', '{15/20}', '{10/55}'], '{23/100}'),
    T('Câu 2. Chữ số 7 trong số thập phân 15,327 có giá trị là:', ['7', '{7/100}', '{7/1000}', '{15327/1000}'], '{7/1000}'),
    T('Câu 3. Viết phân số {21/100} dưới dạng số thập phân được:', ['21,0', '2,1', '0,21', '0,021'], '0,21'),
    T('Câu 4. Số bé nhất trong các số 57,843; 56,834; 57,354; 56,345 là:', ['57,843', '56,834', '57,354', '56,345'], '56,345'),
    T('Câu 5. Một người trong 5 ngày làm được 30 sản phẩm. Với mức làm như thế để được 48 sản phẩm người đó phải làm trong bao nhiêu ngày?', ['6 ngày', '7 ngày', '8 ngày', '9 ngày'], '8 ngày'),
  ], [
    B('Câu 1. Viết số thập phân thích hợp vào chỗ chấm:', [
      ln(['a) 1kg 38g = [[n:1,038]] kg', 'b) 6m² 15dm² = [[n:615]] dm²', 'c) 12 ha = [[n:0,12]] km²', 'd) 4236m² = [[n:0,4236]] ha'], 2),
    ]),
    B('Câu 2. Chuyển các hỗn số sau thành phân số rồi thực hiện phép tính:', [
      ln(['a) 2{2/3} × 3{3/4} = [[n:10|120/12|40/4]]', 'b) 3{1/2} : 2{1/4} = [[n:14/9|28/18]]'], 2),
    ]),
    B('Câu 3. Một căn phòng hình chữ nhật có chiều rộng 6m, chiều dài 9m. Người ta lát nền căn phòng đó bằng loại gạch vuông cạnh 3dm. Hỏi để lát kín căn phòng đó cần bao nhiêu viên gạch? (Diện tích phần mạch vữa không đáng kể)', loiVan(['Đáp số: [[n:600]] viên gạch'])),
    B('Câu 4. Hiện nay mẹ hơn con 27 tuổi. Biết rằng sau 3 năm nữa tuổi mẹ bằng {5/2} tuổi con. Tính tuổi hiện nay của mỗi người?', loiVan(['Đáp số: Mẹ: [[n:42]] tuổi;  Con: [[n:15]] tuổi'])),
  ]),
  gk(2, 'Viết số thập phân, hỗn số và số thập phân, so sánh, đổi đơn vị đo, cộng – nhân – chia phân số, rút về đơn vị, tổng – tỉ, diện tích hình chữ nhật.', [
    T('Câu 1. Số gồm: Hai mươi tư đơn vị, hai phần mười, tám phần nghìn được viết là:', ['24,280', '24,028', '24,208', '24,820'], '24,208'),
    T('Câu 2. Hỗn số 11{9/100} viết dưới dạng số thập phân là:', ['11,9', '11,09', '11,009', '11,90'], '11,09'),
    T('Câu 3. Số lớn nhất trong các số 5,789; 5,897; 5,798; 5,879 là:', ['5,789', '5,897', '5,798', '5,879'], '5,897'),
    T('Câu 4. Số thích hợp điền vào chỗ chấm 8m² 3cm² = ….. cm² là:', ['803', '8030', '80003', '80200'], '80003'),
    T('Câu 5. Để hút hết nước ở một cái hồ phải dùng 6 máy bơm làm việc liên tục trong 12 giờ. Nếu muốn hoàn thành công việc trong 4 giờ thì cần dùng bao nhiêu máy bơm? (Công suất các máy bơm như nhau).', ['18 máy bơm', '12 máy bơm', '10 máy bơm', '24 máy bơm'], '18 máy bơm'),
  ], [
    B('Câu 1. Điền số thập phân thích hợp vào chỗ chấm:', [
      ln(['a) 5m 28cm = [[n:5,28]] m', 'b) 18 tấn 25kg = [[n:18,025]] tấn', 'c) 9ha 7dam² = [[n:9,07]] ha', 'd) 5269m² = [[n:0,5269]] ha'], 2),
    ]),
    B('Câu 2. Tính:', [ln(['a) 4{1/2} + 2{3/8} = [[n:55/8]]', 'b) {11/12} : {22/30} × {6/15} = [[n:1/2]]'], 2)]),
    B('Câu 3. Một người thợ may 40 bộ quần áo đồng phục hết 120m vải. Hỏi nếu người đó may 65 bộ quần áo đồng phục như thế thì cần bao nhiêu mét vải?', loiVan(['Đáp số: [[n:195]] m vải'])),
    B('Câu 4. Một mảnh đất hình chữ nhật có chiều rộng bằng {3/4} chiều dài và chu vi mảnh đất là 168m.', [tx('a) Tính chiều dài, chiều rộng của mảnh đất đó.'), tx('b) Người ta trồng rau trên mảnh đất đó, cứ 1m² thu hoạch được 5kg rau. Hỏi cả thửa ruộng đó thu hoạch được bao nhiêu ki-lô-gam rau?'), ...loiVan([
      'Đáp số: a) Chiều dài: [[n:48]] m;  Chiều rộng: [[n:36]] m',
      'b) [[n:8640]] kg rau',
    ])]),
  ]),
  gk(3, 'Viết số thập phân, giá trị chữ số, hỗn số và số thập phân, đổi đơn vị đo, rút về đơn vị, tính với hỗn số, tổng – tỉ, diện tích.', [
    T('Câu 1. Số thập phân gồm: Mười hai đơn vị, tám phần mười, sáu phần nghìn viết là:', ['12,860', '12,608', '12,806', '12,086'], '12,806'),
    T('Câu 2. Chữ số 8 trong số thập phân 27,285 có giá trị là:', ['{8/1000}', '{8/100}', '{8/10}', '8'], '{8/100}'),
    T('Câu 3. Số 23{3/5} viết dưới dạng số thập phân là:', ['23,6', '23,4', '23,35', '23,53'], '23,6'),
    T('Câu 4. Viết số thích hợp vào chỗ chấm 318m² = ……… ha', ['0,318', '0,0318', '3,018', '3,18'], '0,0318'),
    T('Câu 5. Một ô tô đi trong 6 giờ được 390km. Hỏi trong 4 giờ ô tô đó đi được bao nhiêu ki-lô-mét?', ['250 km', '260 km', '240 km', '280 km'], '260 km'),
  ], [
    B('Câu 1. Thực hiện phép tính:', [ln(['a) 1{1/8} × 2{1/2} : 3{3/4} = [[n:3/4]]', 'b) 1{1/4} × ({13/14} − {3/7}) = [[n:5/8|10/16|35/56]]'], 2)]),
    B('Câu 2. Viết số thập phân thích hợp vào chỗ chấm.', [
      ln(['a) 35kg 8g = [[n:35,008]] kg', 'b) 37m² 4cm² = [[n:3700,04]] dm²', 'c) 2ha 8dam² = [[n:2,08]] ha', 'd) 8ha 360m² = [[n:8,036]] ha'], 2),
    ]),
    B('Câu 3. Một bếp ăn tập thể chuẩn bị đủ gạo cho 110 người ăn trong 30 ngày. Nhưng thực tế sau đó vì có thêm người đến ăn nên số gạo đó chỉ đủ ăn trong 22 ngày. Vậy số người đến thêm là bao nhiêu người?', loiVan(['Đáp số: [[n:40]] người'])),
    B('Câu 4. Một thửa ruộng hình chữ nhật có nửa chu vi 105m, chiều rộng bằng {2/5} chiều dài. Người ta cấy lúa trên thửa ruộng đó. Tính ra cứ 50m² cấy lúa thu hoạch được 70kg thóc. Hỏi cả thửa ruộng thu hoạch được bao nhiêu ki-lô-gam thóc?', loiVan(['Đáp số: [[n:3150]] kg thóc'])),
  ]),
  gk(4, 'Hỗn số và phân số, viết số thập phân, hàng của chữ số, rút về đơn vị, diện tích, sắp xếp số thập phân, đổi đơn vị đo, tìm phân số của một số.', [
    T('Câu 1. Hỗn số 2{5/8} được viết thành phân số:', ['{15/8}', '{10/8}', '{17/8}', '{21/8}'], '{21/8}'),
    T('Câu 2. Viết số thập phân gồm có: Tám mươi ba đơn vị, sáu phần mười, chín phần trăm, tám phần nghìn', ['80,896', '83,698', '83,896', '83,968'], '83,698'),
    T('Câu 3. Số thập phân 7,003 viết dưới dạng hỗn số là:', ['{703/1000}', '{7003/1000}', '7{3/1000}', '7{3/100}'], '7{3/1000}'),
    T('Câu 4. Chữ số 6 trong số thập phân 32,956 thuộc hàng nào?', ['Hàng đơn vị', 'Hàng phần mười', 'Hàng phần trăm', 'Hàng phần nghìn'], 'Hàng phần nghìn'),
    T('Câu 5. Một xe tải nhỏ chở 4 chuyến được 320 bao xi măng. Hỏi xe đó phải chở hết 480 bao xi măng trong mấy chuyến nếu sức chở của xe không thay đổi?', ['6 chuyến', '8 chuyến', '10 chuyến', '7 chuyến'], '6 chuyến'),
    T('Câu 6. Một khu vườn hình chữ nhật có kích thước được ghi ở hình vẽ bên. Diện tích của khu vườn là:', ['15km²', '15ha', '15dam²', '150m²'], '15dam²', ['gk4-c6', 220]),
  ], [
    B('Câu 1. Viết các số thập phân sau theo thứ tự từ bé đến lớn:', [tx('34,257 ;  37,329 ;  34,075 ;  34,175 ;  37,303'), ln([xep([34.257, 37.329, 34.075, 34.175, 37.303], true)])]),
    B('Câu 2. Viết số thập phân thích hợp vào chỗ chấm:', [
      ln(['a) 3 tấn 482kg = [[n:3,482]] tấn', 'b) 42m² = [[n:0,0042]] hm²', 'c) 15ha = [[n:0,15]] km²', 'd) 8m² 5cm² = [[n:8,0005]] m²'], 2),
    ]),
    B('Câu 3. Một bếp ăn dự trữ đủ gạo cho 120 người ăn trong 20 ngày. Thực tế đã có 150 người ăn. Hỏi số gạo dự trữ đó đủ ăn trong bao nhiêu ngày? (Mức ăn của mỗi người như nhau).', loiVan(['Đáp số: [[n:16]] ngày'])),
    B('Câu 4. Một khu vườn hình chữ nhật có chiều dài 25m và chiều rộng 16m. Người ta dùng {2/5} diện tích của vườn để trồng cam, {3/4} diện tích còn lại để trồng bưởi. Diện tích còn lại sau khi đã trồng cam và bưởi là để trồng cây cảnh. Tính diện tích trồng cây cảnh?', loiVan(['Đáp số: [[n:60]] m²'])),
  ]),
  gk(5, 'Phân số thập phân, hỗn số và số thập phân, giá trị chữ số, đổi đơn vị đo, rút về đơn vị, so sánh số thập phân, tính với phân số, tìm phân số của một số.', [
    T('Câu 1. Phân số {7/25} viết thành phân số thập phân là:', ['{11/100}', '{17/100}', '{14/50}', '{28/100}'], '{28/100}'),
    T('Câu 2. Hỗn số 3{19/1000} được viết dưới dạng số thập phân là:', ['3,190', '3,019', '3,0019', '3,19'], '3,019'),
    T('Câu 3. Số thập phân 35,29 bằng số thập phân nào sau đây:', ['35,290', '35,029', '35,209', '350,29'], '35,290'),
    T('Câu 4. Chữ số 8 trong số thập phân 21,485 có giá trị là:', ['{8/10}', '{8/100}', '{8/1000}', '{8/10000}'], '{8/100}'),
    T('Câu 5. Số thích hợp để viết vào chỗ chấm 5kg 8g = ……… kg là:', ['5,8', '5,08', '5,008', '5,0008'], '5,008'),
    T('Câu 6. Một tổ gồm 8 người dự định làm xong một con đường trong 6 ngày nhưng sau đó tổ được bổ sung thêm 4 người. Hỏi con đường được làm xong trong bao nhiêu ngày biết sức làm việc của mỗi người như nhau.', ['3 ngày', '4 ngày', '5 ngày', '2 ngày'], '4 ngày'),
  ], [
    B('Câu 1. Điền dấu >, <, = thích hợp vào chỗ trống', [
      ln(['38,027 [[c:<]] 38,105', '62,274 [[c:>]] 62,269', '45,08 [[c:=]] 45,080', '90,304 [[c:>]] 89,921'], 2),
    ]),
    B('Câu 2. Viết số thích hợp vào chỗ chấm', [
      ln(['a) 8760kg = [[n:87]] tạ [[n:60]] kg', 'b) 37dam² 9m² = [[n:3709]] m²', 'c) 7km² 5hm² = [[n:70500]] dam²', 'd) 15cm² = [[n:0,0015]] m²'], 2),
    ]),
    B('Câu 3. Thực hiện phép tính:', [ln(['a) {4/7} × {12/15} − {12/15} × {5/28} = [[n:11/35|44/140]]', 'b) {4/9} : {5/16} : 1{5/27} = [[n:6/5|12/10]]'], 2)]),
    B('Câu 4. Cứ 3 xe tải thì vận chuyển được 17 tấn hàng hóa. Hỏi có 12 xe như thế thì vận chuyển được bao nhiêu tấn hàng hóa?', loiVan(['Đáp số: [[n:68]] tấn hàng hóa'])),
    B('Câu 5. Một khu đất rộng 10dam² 80m², người ta sử dụng {2/5} diện tích để làm nhà và {1/3} diện tích đất còn lại để trồng hoa, phần đất cuối cùng để làm chuồng trại chăn nuôi. Tính diện tích đất làm chuồng trại chăn nuôi?', loiVan(['Đáp số: [[n:432]] m²'])),
  ]),
  gk(6, 'Giá trị chữ số, so sánh và sắp xếp số thập phân, đổi đơn vị đo, tổng – tỉ, phân số bằng nhau, rút về đơn vị, tính với phân số, diện tích, tính tổng dãy phân số.', [
    T('Câu 1. Chữ số 3 trong số 21,753 có giá trị là:', ['3', '{3/10}', '{3/100}', '{3/1000}'], '{3/1000}'),
    T('Câu 2. Số tự nhiên không nằm giữa 2,65 và 5,12 là:', ['2', '3', '4', '5'], '2'),
    T('Câu 3. Dãy số thập phân nào dưới đây được viết theo thứ tự từ bé đến lớn?', ['0,42; 0,024; 0,042; 0,24; 0,204', '0,024; 0,042; 0,24; 0,204; 0,402', '0,024; 0,042; 0,24; 0,204; 0,42', '0,024; 0,042; 0,204; 0,24; 0,402'], '0,024; 0,042; 0,204; 0,24; 0,402'),
    T('Câu 4. 0,408km² = ……. ha. Số thích hợp để viết vào chỗ chấm là:', ['408', '40,8', '4,08', '4,008'], '40,8'),
    T('Câu 5. 3 tấn 5kg = … tạ. Số thích hợp để viết vào chỗ chấm là:', ['3,5', '30,5', '3,005', '30,05'], '30,05'),
    T('Câu 6. Mẹ cho hai anh em 40 cái kẹo. Số kẹo của em gấp rưỡi số kẹo của anh. Mẹ cho em số kẹo là:', ['20 cái', '24 cái', '30 cái', '32 cái'], '24 cái'),
    T('Câu 7. Số thích hợp để viết vào chỗ chấm để được {18/54} = {.../9} là:', ['2', '18', '3', '6'], '3'),
    T('Câu 8. Một ô tô đi trong 5 giờ được 225km. Ô tô đó đi trong 8 giờ được quãng đường là:', ['360km', '345km', '320km', '400km'], '360km'),
  ], [
    B('Câu 9. Tính:', [ln(['a) 3 × {1/2} + {1/4} × {1/3} = [[n:19/12]]', 'b) 1{4/5} − {2/3} : 2{1/3} = [[n:53/35]]'], 2)]),
    B('Câu 10. Điền dấu (>, <, =)', [
      ln(['a) 5ha 89m² [[c:<]] 5,089ha', 'b) 8ha 6dam² [[c:>]] 8{5/100} ha', 'c) 18,064cm [[c:<]] 18m 64cm', 'd) 750kg [[c:>]] {3/5} tấn'], 2),
    ]),
    B('Câu 11. Một thửa ruộng hình chữ nhật có chu vi 240m và chiều dài gấp 3 lần chiều rộng.', [tx('a) Tính diện tích của thửa ruộng.'), tx('b) Người ta cấy lúa trên thửa ruộng, biết rằng cứ 100m² thu được 50kg thóc. Hỏi cả thửa ruộng đó thu hoạch được bao nhiêu tạ thóc?'), ...loiVan(['Đáp số: a) [[n:2700]] m²;  b) [[n:13,5]] tạ thóc'])]),
    B('Câu 12. Tính:', [ln(['{1/1 × 2} + {1/2 × 3} + {1/3 × 4} + {1/4 × 5} + ... + {1/99 × 100} = [[n:99/100]]'])]),
  ]),
  gk(7, 'Giá trị chữ số, phân số thập phân, tìm thành phần chưa biết, đổi đơn vị đo, hiệu – tỉ, so sánh số thập phân, tính với phân số, rút về đơn vị, phân số bằng nhau.', [
    T('Câu 1. Chữ số 5 trong số 42,475 có giá trị là:', ['5', '{5/10}', '{5/100}', '{5/1000}'], '{5/1000}'),
    T('Câu 2. Phân số thập phân nào sau đây không bằng phân số {2/25}?', ['{8/100}', '{8/10}', '{80/1000}', '{800/10000}'], '{8/10}'),
    T('Câu 3. Giá trị thích hợp để y × 1{1/2} = {1/4} là:', ['y = {1/6}', 'y = 6', 'y = {3/8}', 'y = 1{1/8}'], 'y = {1/6}'),
    T('Câu 4. Viết hỗn số thích hợp vào chỗ chấm: 1hm² 235m² = …… dam²', ['12{35/100}', '123{5/100}', '102{35/100}', '120{35/100}'], '102{35/100}'),
    T('Câu 5. Hiệu của hai số là 25. Tỉ số của hai số đó là {2/3}. Hai số đó là:', ['50 và 75', '9 và 56', '33 và 40', '37 và 62'], '50 và 75'),
    T('Câu 6. Số thập phân nhỏ nhất trong các số thập phân 4,15; 4,860; 4,91; 4,84 là:', ['4,91', '4,860', '4,15', '4,84'], '4,15'),
    T('Câu 7. Hợp tác xã trồng rau sạch trên diện tích 1ha 350m². Người ta đã trồng rau được {4/9} diện tích đó. Hỏi còn lại bao nhiêu mét vuông chưa trồng rau?', ['600m²', '750m²', '4600m²', '5750m²'], '5750m²'),
  ], [
    B('Câu 8. Tính:', [ln(['a) 2 + {3/4} × {8/5} = [[n:16/5]]', 'b) {9/8} − {6/5} : {8/5} = [[n:3/8]]'], 2)]),
    B('Câu 9. Viết số thích hợp vào chỗ chấm:', [
      ln(['a) 42m 34cm = [[n:42,34]] m', 'b) 3kg 5g = [[n:3,005]] kg', 'c) 5,34km² = [[n:534]] ha', 'd) 16,5m² = [[n:16]] m² [[n:50]] dm²'], 2),
    ]),
    B('Câu 10. Muốn đắp xong một nền nhà trong 6 ngày cần có 8 người. Hỏi muốn đắp xong nền nhà đó trong 4 ngày thì cần thêm bao nhiêu người? (Biết sức làm việc của mọi người như nhau).', loiVan(['Đáp số: [[n:4]] người'])),
    B('Câu 11. Tìm một số sao cho khi cộng tử số của phân số {17/24} với số đó và giữ nguyên mẫu số thì được phân số bằng {5/6}.', loiVan(['Đáp số: [[n:3]]'])),
  ]),
  gk(8, 'Viết số thập phân, so sánh phân số, tìm một số khi biết phân số của nó, đổi đơn vị đo, rút về đơn vị, diện tích, cộng trừ nhân chia hỗn số, lát gạch.', [
    T('Câu 1. Số thập phân gồm ba mươi hai đơn vị, tám phần trăm, tám phần mười nghìn được viết là:', ['32,88', '32,08', '32,080', '32,0808'], '32,0808'),
    T('Câu 2. Giá trị thích hợp của x để 1 > {x/7} > {4/7} là:', ['x = 5', 'x = 6', 'x = 5; 6', 'x = 5; 6; 7'], 'x = 5; 6'),
    T('Câu 3. Biết {2/5} quãng đường AB dài 36km. Vậy quãng đường AB dài là:', ['50 km', '90 km', '100 km', '150 km'], '90 km'),
    T('Câu 4. 6kg 18g = ……. kg. Số thích hợp vào chỗ chấm là:', ['6,18', '6,180', '6,018', '61,8'], '6,018'),
    T('Câu 5. 8cm² 5mm² = ……. mm². Số thích hợp vào chỗ chấm là:', ['85', '805', '850', '8500'], '805'),
    T('Câu 6. Có 30 cái can, mỗi can đựng 5 lít dầu. Số lít dầu đó rót đầy vào các can loại 3 lít thì được số can là:', ['40 can', '50 can', '15 can', '18 can'], '50 can'),
    T('Câu 7. Số thập phân nhỏ nhất trong các số thập phân 4,105; 4,15; 4,860; 4,91 là:', ['4,91', '4,860', '4,15', '4,105'], '4,105'),
    T('Câu 8. Một khu đất hình chữ nhật có chiều dài 160m và chiều rộng 125m. Hỏi khu đất có diện tích bao nhiêu héc-ta?', ['2 000 ha', '200 ha', '20 ha', '2 ha'], '2 ha'),
  ], [
    B('Câu 9. Tính:', [
      ln(['a) 1{1/2} + 1{1/3} = [[n:17/6]]', 'b) 2{2/3} − 1{4/7} = [[n:23/21]]', 'c) 2{2/3} × 5{1/4} = [[n:14|168/12|56/4]]', 'd) 3{1/2} : 2{1/4} = [[n:14/9|28/18]]'], 2),
    ]),
    B('Câu 10. Để hút hết nước ở một cái hồ, phải dùng 3 máy bơm làm việc liên tục trong 4 giờ. Vì muốn công việc hoàn thành sớm hơn dự định nên người ta đã dùng 6 máy bơm như thế. Hỏi sau mấy giờ sẽ hút hết nước ở hồ?', loiVan(['Đáp số: [[n:2]] giờ'])),
    B('Câu 11. Để lát nền một căn phòng hình chữ nhật, người ta dùng loại gạch men hình vuông cạnh 30cm. Hỏi cần bao nhiêu viên gạch để lát kín nền căn phòng đó, biết rằng căn phòng có chiều rộng 6m, chiều dài 9m? (Diện tích phần mạch vữa không đáng kể).', loiVan(['Đáp số: [[n:600]] viên gạch'])),
    B('Câu 12. Không quy đồng mẫu số, hãy so sánh hai phân số sau: {3268/3264} và {2789/2785}.', [ln(['{3268/3264} [[c:<]] {2789/2785}'])]),
  ]),
];
