/**
 * KIỂM TRA BỘ ĐÁNH VẦN — soát từng bước một, theo luật dạy lớp 1.
 *
 * Vì sao cần: sai một luật ở `danhVan.ts` là sai đồng loạt vài trăm từ, mà lỗi
 * kiểu đó KHÔNG hiện ra khi bấm thử vài chữ. Bộ kiểm này dựng lại kết quả mong
 * đợi một cách ĐỘC LẬP (không gọi lại hàm đang kiểm) rồi đối chiếu.
 *
 * Chạy: npm run kiem:danh-van
 */
import { buocDanhVan, tachTieng, AM_DOC } from '../app/lib/danhVan';
import { VONG_AM } from '../app/lib/vongTronAm';

type Loi = { tu: string; vong: string; luat: string; chiTiet: string };
const loi: Loi[] = [];
const canhBao: Loi[] = [];
const ghi = (v: Loi[], tu: string, vong: string, luat: string, chiTiet: string) =>
  v.push({ tu, vong, luat, chiTiet });

const THANH = ['ngang', 'huyền', 'sắc', 'hỏi', 'ngã', 'nặng'];
const boThanhHet = (s: string) =>
  s.normalize('NFD').replace(/[̣̀́̃̉]/g, '').normalize('NFC');

/** Âm chính (nguyên âm đơn + nguyên âm đôi), DÀI TRƯỚC. */
const AM_CHINH = [
  'iê', 'yê', 'ia', 'ya', 'uô', 'ua', 'ươ', 'ưa',
  'a', 'ă', 'â', 'e', 'ê', 'i', 'o', 'ô', 'ơ', 'u', 'ư', 'y',
];
/** Âm cuối, DÀI TRƯỚC. */
const AM_CUOI = ['ngh', 'ng', 'nh', 'ch', 'm', 'n', 'p', 't', 'c', 'i', 'y', 'o', 'u'];
/** Âm đệm chỉ có thể là o hoặc u. */
function tachVan(van: string): { dem: string; chinh: string; cuoi: string } | null {
  for (const dem of ['', 'o', 'u']) {
    if (dem && !van.startsWith(dem)) continue;
    const con = van.slice(dem.length);
    if (!con) continue;
    for (const chinh of AM_CHINH) {
      if (!con.startsWith(chinh)) continue;
      const cuoi = con.slice(chinh.length);
      if (cuoi === '' || AM_CUOI.includes(cuoi)) return { dem, chinh, cuoi };
    }
  }
  return null;
}

const laKhep = (s: string) => /(p|t|c|ch)$/.test(boThanhHet(s));

for (const vong of VONG_AM) {
  for (const w of vong.tu) {
    const tieng = w.tu.split(' ')[0].toLowerCase();
    const b = buocDanhVan(tieng);
    const t = tachTieng(tieng);
    const V = vong.am;

    // ── L1: bước CUỐI luôn phải là chính tiếng đó ─────────────────────────────
    if (b[b.length - 1] !== tieng)
      ghi(loi, tieng, V, 'L1 bước cuối', `kết ở "${b[b.length - 1]}" chứ không phải "${tieng}"`);

    // ── L2: bước ĐẦU của tiếng CÓ âm đầu phải là cách đọc âm đầu ──────────────
    if (t.amDau) {
      const dung = AM_DOC[t.amDau] ?? t.amDau;
      if (b[0] !== dung) ghi(loi, tieng, V, 'L2 đọc âm đầu', `đọc "${b[0]}", phải là "${dung}"`);
      // c/k/q cùng ghi âm /k/ → khi ĐÁNH VẦN đều đọc "cờ" (khác tên chữ ca/quy)
      if (['c', 'k'].includes(t.amDau) && b[0] !== 'cờ')
        ghi(loi, tieng, V, 'L2b c/k đọc cờ', `đọc "${b[0]}"`);
      if (['g', 'gh'].includes(t.amDau) && b[0] !== 'gờ')
        ghi(loi, tieng, V, 'L2c g/gh đọc gờ', `đọc "${b[0]}"`);
      if (['ng', 'ngh'].includes(t.amDau) && b[0] !== 'ngờ')
        ghi(loi, tieng, V, 'L2d ng/ngh đọc ngờ', `đọc "${b[0]}"`);
    }

    // ── L3: tiếng KHÉP (p/t/c/ch) chỉ mang được thanh sắc hoặc nặng ───────────
    if (laKhep(tieng) && !['sắc', 'nặng', 'ngang'].includes(t.thanh))
      ghi(loi, tieng, V, 'L3 thanh trên tiếng khép', `thanh "${t.thanh}" không tồn tại ở tiếng khép`);

    // ── L4: SỐ BƯỚC phải đúng theo dạng tiếng ────────────────────────────────
    const sach = boThanhHet(tieng);
    const coCuoi = /(ng|nh|ch|[mnptc])$/.test(sach);
    const GHEP = ['yê', 'iê', 'uô', 'ươ', 'ya', 'ia', 'ua', 'ưa'];
    let mongDoi: number;
    if (t.amDau) {
      // âm đầu + vần (+ tiếng chưa dấu, trừ tiếng đóng) (+ dấu + tiếng)
      mongDoi = 2 + (laKhep(tieng) && t.thanh !== 'ngang' ? 0 : 1);
    } else if (!coCuoi) {
      // "ao", "ô", "yêu": không có gì để ghép, chỉ còn chính tiếng
      mongDoi = 1;
    } else {
      // âm chính + âm cuối + vần, cộng thêm mỗi con chữ của âm chính ghép
      const chinh = sach.replace(/(ng|nh|ch|[mnptc])$/, '');
      // Tiếng đóng: bỏ bước đọc vần riêng vì nó trùng y hệt bước cuối.
      mongDoi = (laKhep(tieng) && t.thanh !== 'ngang' ? 2 : 3)
        + (GHEP.includes(chinh) ? chinh.length : 0);
    }
    if (t.thanh !== 'ngang') mongDoi += 2;
    if (b.length !== mongDoi)
      ghi(loi, tieng, V, 'L4 sai số bước', `${b.length} bước (đợi ${mongDoi}): "${b.join(' - ')}"`);

    if (t.thanh !== 'ngang') {
      if (b[b.length - 2] !== t.thanh)
        ghi(loi, tieng, V, 'L4b gọi tên dấu', `áp chót là "${b[b.length - 2]}", phải là "${t.thanh}"`);
    }

    // ── L5: dạng của phần VẦN ────────────────────────────────────────────────
    // Tiếng MỞ: vần chưa dấu ("bờ – ong – bong – sắc – bóng").
    // Tiếng ĐÓNG: vần mang sẵn dấu ("ngờ – ọt – nặng – ngọt"), vì "ot" là chữ
    // không tồn tại nên giọng đọc sẽ tự gán bừa thanh.
    if (t.amDau) {
      const dong = laKhep(tieng) && t.thanh !== 'ngang';
      const vanCho = dong ? tieng.slice(t.amDau.length) : sach.slice(t.amDau.length);
      if (b[1] !== vanCho)
        ghi(loi, tieng, V, dong ? 'L5 vần phải CÓ dấu' : 'L5 vần phải chưa dấu',
          `đọc "${b[1]}", phải là "${vanCho}"`);
    }

    // ── L5b: tiếng KHÔNG có âm đầu phải kết phần ghép bằng chính phần vần ────
    // "ếch" → …– êch – sắc – ếch. Bước này từng bị bỏ nhầm vì tưởng "êch" là
    // tiếng không tồn tại; thật ra khi không có âm đầu thì đó chính là PHẦN VẦN.
    if (!t.amDau && coCuoi && !(laKhep(tieng) && t.thanh !== 'ngang') && !b.includes(t.tiengKhongDau))
      ghi(loi, tieng, V, 'L5c thiếu bước vần', `không thấy "${t.tiengKhongDau}" trong "${b.join(' - ')}"`);

    // ── L6: mọi bước phải khác rỗng và không lặp liền nhau ────────────────────
    b.forEach((x, i) => {
      if (!x || !x.trim()) ghi(loi, tieng, V, 'L6 bước rỗng', `bước ${i + 1} rỗng`);
      if (i > 0 && x === b[i - 1]) ghi(loi, tieng, V, 'L6b lặp liền', `bước ${i} và ${i + 1} đều là "${x}"`);
    });

    // ── L11: tiếng ĐÓNG không được có bước đọc trọn tiếng chưa dấu ───────────
    // "but", "côt", "băp" không tồn tại trong tiếng Việt; giọng đọc gặp chúng sẽ
    // tự gán thanh ("but" từng phát ra thành "bắt").
    // Chỉ cấm khi CÓ âm đầu: lúc đó "but", "băp" là TIẾNG trọn vẹn và không tồn
    // tại. Không có âm đầu thì dạng ấy là phần VẦN ("êch", "ôc") — đọc rời được.
    if (t.amDau && laKhep(tieng) && t.thanh !== 'ngang' && b.includes(t.tiengKhongDau))
      ghi(loi, tieng, V, 'L11 tiếng chưa dấu không tồn tại',
        `có bước "${t.tiengKhongDau}" — tiếng đóng không mang được thanh ngang`);

    // ── L7: phần VẦN phải tách được thành đệm + âm chính + âm cuối ────────────
    const vanSach = boThanhHet(t.van);
    if (vanSach && !tachVan(vanSach))
      ghi(loi, tieng, V, 'L7 vần không hợp lệ', `vần "${t.van}" không phân tích được`);

    // ── L8: LUẬT CHÍNH TẢ ngh/gh/k — chỉ đứng trước e, ê, i, iê/yê, ia ────────
    const truoc = vanSach[0] ?? '';
    const eEiI = ['e', 'ê', 'i', 'y'].includes(truoc);
    if (['ngh', 'gh', 'k'].includes(t.amDau) && !eEiI)
      ghi(loi, tieng, V, 'L8 ngh/gh/k sai chỗ', `"${t.amDau}" đứng trước "${truoc}" — phải dùng ng/g/c`);
    if (['ng', 'g', 'c'].includes(t.amDau) && eEiI && t.van !== '')
      ghi(loi, tieng, V, 'L8b ng/g/c sai chỗ', `"${t.amDau}" đứng trước "${truoc}" — phải dùng ngh/gh/k`);

    // ── L9: ghép âm đầu + vần phải ra đúng tiếng không dấu ────────────────────
    if (t.amDau + vanSach !== boThanhHet(tieng))
      ghi(loi, tieng, V, 'L9 ghép lại không khớp',
        `"${t.amDau}" + "${vanSach}" ≠ "${boThanhHet(tieng)}"`);

    // ── L10: tên thanh phải nằm trong 6 thanh ─────────────────────────────────
    if (!THANH.includes(t.thanh)) ghi(loi, tieng, V, 'L10 tên thanh lạ', t.thanh);

    // ── C1 (cảnh báo): tiếng không âm đầu, vần có phụ âm cuối mà chỉ 1 bước ───
    if (!t.amDau && /[mnptc]$|ng$|nh$|ch$/.test(vanSach) && b.length <= 1)
      ghi(canhBao, tieng, V, 'C1 không tách được', `chỉ ra 1 bước: "${b.join(' - ')}"`);

    // ── C2 (cảnh báo): số bước bất thường ─────────────────────────────────────
    // 7 bước là mức cao nhất hợp lệ: y – ê – yê – nờ – yên – sắc – yến.
    if (b.length > 7) ghi(canhBao, tieng, V, 'C2 quá nhiều bước', `${b.length} bước`);
  }
}

const tong = VONG_AM.reduce((a, v) => a + v.tu.length, 0);
console.log(`Đã soát ${tong} từ / ${VONG_AM.length} vòng, 11 luật + 2 cảnh báo.\n`);
const in_ = (ten: string, ds: Loi[]) => {
  if (!ds.length) { console.log(`✅ ${ten}: không có`); return; }
  console.log(`\n${ten} (${ds.length}):`);
  const nhom = new Map<string, Loi[]>();
  for (const l of ds) nhom.set(l.luat, [...(nhom.get(l.luat) ?? []), l]);
  for (const [luat, ds2] of nhom) {
    console.log(`\n  ▸ ${luat} — ${ds2.length} chỗ`);
    for (const l of ds2.slice(0, 12)) console.log(`      [vòng ${l.vong}] ${l.tu}: ${l.chiTiet}`);
    if (ds2.length > 12) console.log(`      … và ${ds2.length - 12} chỗ nữa`);
  }
};
in_('LỖI', loi);
in_('CẢNH BÁO', canhBao);
process.exit(loi.length ? 1 : 0);
