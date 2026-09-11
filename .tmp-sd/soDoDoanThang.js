"use strict";
// Sinh bài toán có lời văn kèm SƠ ĐỒ ĐOẠN THẲNG.
//
// Vì sao phải có sơ đồ: trẻ tắc toán lời văn không phải vì tính sai, mà vì
// không biết bài đang cho gì và hỏi gì. Vẽ ra hai đoạn thẳng là thấy ngay
// "cộng vào" hay "bớt đi". Đây đúng cách sách giáo khoa tiểu học Việt Nam dạy
// (và cũng là lối "bar model" của Singapore).
//
// Mỗi bài trả về cả LỜI VĂN lẫn CẤU TRÚC SƠ ĐỒ, nên trang web vẽ được hình mà
// không phải đoán gì thêm.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEN_DANG = exports.DANG_THEO_LOP = void 0;
exports.raBaiToan = raBaiToan;
exports.dapAnNhieu = dapAnNhieu;
exports.kiemSoDo = kiemSoDo;
const nn = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const chon = (ds) => ds[Math.floor(Math.random() * ds.length)];
const TEN = ['Lan', 'Nam', 'Mai', 'Bình', 'Hoa', 'Tuấn', 'Linh', 'Minh'];
const DO_VAT = [
    { ten: 'cái kẹo', donVi: 'cái' }, { ten: 'quyển vở', donVi: 'quyển' },
    { ten: 'quả cam', donVi: 'quả' }, { ten: 'con tem', donVi: 'con' },
    { ten: 'bông hoa', donVi: 'bông' }, { ten: 'viên bi', donVi: 'viên' },
];
const MAU = ['#f97316', '#8b5cf6', '#0ea5e9', '#16a34a'];
/** Dạng bài mà mỗi lớp đã học. */
exports.DANG_THEO_LOP = {
    2: ['tong', 'con-lai', 'nhieu-hon', 'it-hon'],
    3: ['tong', 'con-lai', 'nhieu-hon', 'it-hon', 'gap-lan'],
    4: ['tong', 'nhieu-hon', 'it-hon', 'gap-lan', 'tong-hieu'],
    5: ['tong-hieu', 'gap-lan', 'nhieu-hon', 'it-hon'],
};
exports.TEN_DANG = {
    'tong': 'Tìm tổng',
    'con-lai': 'Tìm phần còn lại',
    'nhieu-hon': 'Nhiều hơn',
    'it-hon': 'Ít hơn',
    'tong-hieu': 'Tìm hai số khi biết tổng và hiệu',
    'gap-lan': 'Gấp một số lần',
};
/** Khoảng số hợp với lớp — lớp 2 trong phạm vi 100, lớp 5 tới hàng nghìn. */
function khoang(lop) {
    if (lop === 2)
        return [3, 40];
    if (lop === 3)
        return [5, 90];
    if (lop === 4)
        return [8, 200];
    return [20, 500];
}
function raBaiToan(lop, batBuoc) {
    const dang = batBuoc ?? chon(exports.DANG_THEO_LOP[lop]);
    const [lo, hi] = khoang(lop);
    const [a, b] = [chon(TEN), chon(TEN.filter((t) => t !== TEN[0]))];
    const ten1 = a;
    const ten2 = chon(TEN.filter((t) => t !== ten1));
    const dv = chon(DO_VAT);
    const hang = (ds) => ds.map((h, i) => ({ ...h, mau: MAU[i % MAU.length] }));
    if (dang === 'tong') {
        const x = nn(lo, hi), y = nn(lo, hi);
        return {
            dang, donVi: dv.donVi, dapAn: x + y,
            loiVan: `${ten1} có ${x} ${dv.ten}. ${ten2} có ${y} ${dv.ten}.`,
            hoi: `Cả hai bạn có tất cả bao nhiêu ${dv.ten}?`,
            hang: hang([
                { ten: ten1, doan: [{ nhan: String(x), gia: x }] },
                { ten: ten2, doan: [{ nhan: String(y), gia: y }] },
            ]),
            ngoacTong: { nhan: '?', an: true },
            phepTinh: `${x} + ${y} = ${x + y}`,
            giaiThich: `Sơ đồ có hai đoạn nối tiếp nhau, dấu ngoặc ôm cả hai chính là "tất cả" — nên lấy ${x} cộng ${y}.`,
        };
    }
    if (dang === 'con-lai') {
        const tong = nn(lo + 5, hi);
        const bot = nn(lo, tong - 1);
        return {
            dang, donVi: dv.donVi, dapAn: tong - bot,
            loiVan: `${ten1} có ${tong} ${dv.ten}, ${ten1} cho bạn ${bot} ${dv.ten}.`,
            hoi: `${ten1} còn lại bao nhiêu ${dv.ten}?`,
            hang: hang([
                { ten: ten1, doan: [{ nhan: `cho ${bot}`, gia: bot }, { nhan: '?', gia: tong - bot, an: true }] },
            ]),
            ngoacTong: { nhan: `${tong} ${dv.donVi}`, an: false },
            phepTinh: `${tong} − ${bot} = ${tong - bot}`,
            giaiThich: `Cả đoạn dài là ${tong}, phần đã cho đi là ${bot}. Phần còn lại chính là đoạn bị thiếu, nên lấy ${tong} trừ ${bot}.`,
        };
    }
    if (dang === 'nhieu-hon' || dang === 'it-hon') {
        const goc = nn(lo + 5, hi);
        const lech = nn(2, Math.max(3, Math.floor(goc / 2)));
        const nhieu = dang === 'nhieu-hon';
        const kq = nhieu ? goc + lech : goc - lech;
        return {
            dang, donVi: dv.donVi, dapAn: kq,
            loiVan: `${ten1} có ${goc} ${dv.ten}. ${ten2} có ${nhieu ? 'nhiều hơn' : 'ít hơn'} ${ten1} ${lech} ${dv.ten}.`,
            hoi: `${ten2} có bao nhiêu ${dv.ten}?`,
            hang: hang(nhieu
                ? [
                    { ten: ten1, doan: [{ nhan: String(goc), gia: goc }] },
                    { ten: ten2, doan: [{ nhan: String(goc), gia: goc }, { nhan: `+${lech}`, gia: lech, an: true }] },
                ]
                : [
                    { ten: ten1, doan: [{ nhan: String(kq), gia: kq, an: true }, { nhan: `−${lech}`, gia: lech }] },
                    { ten: ten2, doan: [{ nhan: '?', gia: kq, an: true }] },
                ]),
            ngoacTong: null,
            phepTinh: `${goc} ${nhieu ? '+' : '−'} ${lech} = ${kq}`,
            giaiThich: nhieu
                ? `Đoạn của ${ten2} dài hơn đoạn của ${ten1} đúng ${lech} phần, nên lấy ${goc} cộng ${lech}.`
                : `Đoạn của ${ten2} ngắn hơn đoạn của ${ten1} đúng ${lech} phần, nên lấy ${goc} trừ ${lech}.`,
        };
    }
    if (dang === 'gap-lan') {
        const lan = nn(2, lop >= 4 ? 5 : 4);
        const be = nn(Math.max(2, Math.floor(lo / 2)), Math.max(6, Math.floor(hi / lan)));
        return {
            dang, donVi: dv.donVi, dapAn: be * lan,
            loiVan: `${ten1} có ${be} ${dv.ten}. ${ten2} có gấp ${lan} lần ${ten1}.`,
            hoi: `${ten2} có bao nhiêu ${dv.ten}?`,
            hang: hang([
                { ten: ten1, doan: [{ nhan: String(be), gia: be }] },
                { ten: ten2, doan: Array.from({ length: lan }, () => ({ nhan: String(be), gia: be })) },
            ]),
            ngoacTong: null,
            phepTinh: `${be} × ${lan} = ${be * lan}`,
            giaiThich: `Đoạn của ${ten2} gồm đúng ${lan} đoạn bằng đoạn của ${ten1}, nên lấy ${be} nhân ${lan}.`,
        };
    }
    // tong-hieu: tổng và hiệu cùng chẵn hoặc cùng lẻ thì mới chia hết cho 2.
    const beNhat = nn(lo, Math.floor(hi / 2));
    const hieu = nn(2, Math.max(2, Math.floor(hi / 3)));
    const lonNhat = beNhat + hieu;
    const tong = beNhat + lonNhat;
    return {
        dang: 'tong-hieu', donVi: dv.donVi, dapAn: beNhat,
        loiVan: `Hai bạn ${ten1} và ${ten2} có tất cả ${tong} ${dv.ten}. ${ten1} có nhiều hơn ${ten2} ${hieu} ${dv.ten}.`,
        hoi: `${ten2} có bao nhiêu ${dv.ten}?`,
        hang: hang([
            { ten: ten1, doan: [{ nhan: '?', gia: beNhat, an: true }, { nhan: String(hieu), gia: hieu }] },
            { ten: ten2, doan: [{ nhan: '?', gia: beNhat, an: true }] },
        ]),
        ngoacTong: { nhan: `${tong} ${dv.donVi}`, an: false },
        phepTinh: `(${tong} − ${hieu}) : 2 = ${beNhat}`,
        giaiThich: `Cắt bỏ phần dôi ra ${hieu} thì hai đoạn bằng nhau, tổng lúc đó là ${tong} − ${hieu} = ${tong - hieu}. Chia đôi được số bé: ${tong - hieu} : 2 = ${beNhat}.`,
    };
}
/** Bốn đáp án: số đúng + ba lỗi hay gặp (nhầm phép tính, quên chia đôi…). */
function dapAnNhieu(b) {
    const ra = [];
    const them = (n) => {
        if (Number.isInteger(n) && n > 0 && n !== b.dapAn && !ra.includes(n))
            ra.push(n);
    };
    const so = (b.loiVan.match(/\d+/g) || []).map(Number);
    const [x = 0, y = 0] = so;
    them(x + y); // nhầm sang phép cộng
    them(Math.abs(x - y)); // nhầm sang phép trừ
    if (b.dang === 'tong-hieu') {
        them((x + y) / 2);
        them(b.dapAn + y);
    }
    if (b.dang === 'gap-lan') {
        them(x + y);
        them(b.dapAn - x);
    }
    them(b.dapAn + 1);
    them(b.dapAn - 1);
    them(b.dapAn + 10);
    return ra.slice(0, 3);
}
/**
 * Soát bộ sinh đề: 2.000 lượt mỗi lớp, mỗi dạng.
 * Bắt các lỗi kiểu số âm, đáp án không nguyên, lời văn không khớp đáp án,
 * sơ đồ vẽ ra không cộng đúng bằng tổng.
 */
function kiemSoDo() {
    const loi = [];
    for (const lop of [2, 3, 4, 5]) {
        for (const dang of exports.DANG_THEO_LOP[lop]) {
            for (let i = 0; i < 500; i++) {
                const b = raBaiToan(lop, dang);
                if (!Number.isInteger(b.dapAn) || b.dapAn <= 0)
                    loi.push(`Lớp ${lop}/${dang}: đáp án ${b.dapAn} không hợp lệ`);
                if (!b.hang.length)
                    loi.push(`Lớp ${lop}/${dang}: thiếu sơ đồ`);
                for (const h of b.hang) {
                    if (!h.doan.length)
                        loi.push(`Lớp ${lop}/${dang}: hàng "${h.ten}" không có đoạn nào`);
                    if (h.doan.some((d) => d.gia <= 0))
                        loi.push(`Lớp ${lop}/${dang}: hàng "${h.ten}" có đoạn dài 0 hoặc âm`);
                }
                // Phép tính viết ra phải cho đúng đáp án — chống chuyện lời giải một
                // đằng, đáp án một nẻo.
                const ve = b.phepTinh.split('=').pop().trim();
                if (Number(ve) !== b.dapAn)
                    loi.push(`Lớp ${lop}/${dang}: phép tính "${b.phepTinh}" khác đáp án ${b.dapAn}`);
                const nhieu = dapAnNhieu(b);
                if (nhieu.length < 3)
                    loi.push(`Lớp ${lop}/${dang}: chỉ tạo được ${nhieu.length} đáp án nhiễu`);
                if (nhieu.includes(b.dapAn))
                    loi.push(`Lớp ${lop}/${dang}: đáp án nhiễu trùng đáp án đúng`);
            }
        }
    }
    return { loi: [...new Set(loi)] };
}
