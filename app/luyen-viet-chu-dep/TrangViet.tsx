// Vẽ MỘT trang phiếu tập viết khổ A4 bằng SVG.
//
// Vì sao SVG chứ không phải HTML: phiếu này in ra giấy, bé đặt bút viết lên
// đúng dòng kẻ — sai vài milimét là chữ lệch ly. SVG cho phép ra lệnh theo
// đúng milimét thật, còn HTML thì phụ thuộc cách trình duyệt làm tròn.
//
// TOẠ ĐỘ: viewBox tính bằng MILIMÉT, gốc ở góc trên trái vùng in.

// Mọi số đo khung trang lấy từ lib để `npm run kiem:viet` soát được — đổi số ở
// một nơi, checker bắt ngay nếu trang tràn khổ A4.
import {
  O_LI_MM, TRANG, CO_CHU, CAO_DAU_TRANG, CAO_CHAN, khungDong, beNgangChuoi,
  CO_CHU_NHO_NHAT, LE_TRAI_VIET, RONG_VIET,
  type Dong, type KhungDong, type Trang,
} from '../lib/luyenViet';

const RONG = TRANG.rong - TRANG.le * 2; // 186mm
const CAO = TRANG.cao - TRANG.le * 2; // 273mm

type Props = {
  trang: Trang;
  /** Slug bộ — quyết định khung dòng (bộ nét cần dòng cao hơn). */
  boSlug: string;
  tenBo: string;
  mau: string;
  soTrang: number;
  tongTrang: number;
};

export default function TrangViet({ trang, boSlug, tenBo, mau, soTrang, tongTrang }: Props) {
  const khung = khungDong(boSlug);
  const soDong = trang.dongs.length;
  const cao1Dong = khung.dongOLi * O_LI_MM;
  const yBatDau = CAO_DAU_TRANG;
  const caoLuoi = soDong * cao1Dong;

  return (
    <svg
      className="trang-viet"
      viewBox={`0 0 ${RONG} ${CAO}`}
      width={`${RONG}mm`}
      height={`${CAO}mm`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ---- Đầu trang ---- */}
      <text x={0} y={6} fontSize={5} fontWeight={800} fill={mau}>
        {tenBo.toUpperCase()}
      </text>
      <text x={RONG} y={6} fontSize={4} fill="#94a3b8" textAnchor="end">
        Trang {soTrang}/{tongTrang} · behayhoc.com
      </text>
      <text x={0} y={15.5} fontSize={4} fill="#475569">
        Họ và tên: . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
      </text>
      <text x={RONG} y={15.5} fontSize={4} fill="#475569" textAnchor="end">
        Ngày . . . . tháng . . . . năm . . . .
      </text>
      <text x={0} y={23} fontSize={6} fontWeight={800} fill="#0f172a">
        {trang.tieuDe}
      </text>
      <line x1={0} y1={CAO_DAU_TRANG - 2} x2={RONG} y2={CAO_DAU_TRANG - 2} stroke={mau} strokeWidth={0.6} />

      {/* ---- Lưới ô li: vẽ LIỀN MẠCH cả vùng viết, đúng như vở ô li thật ---- */}
      <LuoiOLi y={yBatDau} cao={caoLuoi} />

      {/* ---- Từng dòng viết ---- */}
      {trang.dongs.map((d, i) => (
        <DongViet
          key={i}
          dong={d}
          yDinh={yBatDau + i * cao1Dong}
          khung={khung}
          mau={mau}
        />
      ))}

      {/* ---- Chân trang ---- */}
      <text x={RONG / 2} y={CAO - CAO_CHAN + 2} fontSize={3.4} fill="#94a3b8" textAnchor="middle">
        Bé Hay Học · Phiếu luyện viết chữ đẹp · In lại thoải mái cho gia đình và lớp học
      </text>
    </svg>
  );
}

/** Lưới ô li 5mm: đường mảnh màu xanh nhạt, đúng tông vở tập viết. */
function LuoiOLi({ y, cao }: { y: number; cao: number }) {
  const cot = Math.floor(RONG / O_LI_MM);
  const hang = Math.round(cao / O_LI_MM);
  const duoi = y + hang * O_LI_MM;
  return (
    <g>
      {Array.from({ length: cot + 1 }, (_, i) => (
        <line key={`v${i}`} x1={i * O_LI_MM} y1={y} x2={i * O_LI_MM} y2={duoi} stroke="#dbeafe" strokeWidth={0.2} />
      ))}
      {Array.from({ length: hang + 1 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={y + i * O_LI_MM} x2={RONG} y2={y + i * O_LI_MM} stroke="#dbeafe" strokeWidth={0.2} />
      ))}
    </g>
  );
}

/**
 * Một dòng viết: dòng kẻ đậm để đặt bút, dòng đứt ở đỉnh thân chữ (2 ô li) cho
 * bé canh chiều cao, rồi tới nội dung.
 */
function DongViet({ dong, yDinh, khung, mau }: { dong: Dong; yDinh: number; khung: KhungDong; mau: string }) {
  const day = yDinh + khung.dayTuDinh * O_LI_MM; // dòng kẻ bé đặt bút
  const dinhThan = day - 2 * O_LI_MM; // đỉnh thân chữ thường

  return (
    <g>
      <line x1={0} y1={day} x2={RONG} y2={day} stroke="#60a5fa" strokeWidth={0.45} />
      <line
        x1={0} y1={dinhThan} x2={RONG} y2={dinhThan}
        stroke="#93c5fd" strokeWidth={0.3} strokeDasharray="1.6 1.6"
      />
      {dong.ghiChu ? (
        <text x={RONG} y={yDinh + 3.4} fontSize={3.4} fill={mau} textAnchor="end" fontWeight={700}>
          {dong.ghiChu}
        </text>
      ) : null}
      {dong.kieu === 'net' ? <NoiDungNet dong={dong} day={day} /> : null}
      {dong.kieu === 'chu' ? <NoiDungChu dong={dong} day={day} /> : null}
      {dong.kieu === 'chuoi' ? <NoiDungChuoi dong={dong} day={day} /> : null}
    </g>
  );
}

const DAM = '#1e293b';
const MO = '#cbd5e1';

/** Nét cơ bản: 1 nét mẫu đậm, 3 nét mờ để tô, phần còn lại bỏ trống cho bé viết. */
function NoiDungNet({ dong, day }: { dong: Extract<Dong, { kieu: 'net' }>; day: number }) {
  const { net } = dong;
  const buoc = (net.rong + 1.2) * O_LI_MM; // cách nhau hơn 1 ô cho thoáng
  const soLuong = Math.floor((RONG - O_LI_MM) / buoc);
  return (
    <g>
      {Array.from({ length: soLuong }, (_, i) => (
        <path
          key={i}
          d={net.d}
          transform={`translate(${O_LI_MM + i * buoc} ${day}) scale(${O_LI_MM})`}
          fill="none"
          stroke={i === 0 ? DAM : i <= 3 ? MO : 'none'}
          strokeWidth={0.42 / O_LI_MM * 1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

/** Một chữ cái / chữ số: mẫu đậm rồi các bản mờ để tô. */
function NoiDungChu({ dong, day }: { dong: Extract<Dong, { kieu: 'chu' }>; day: number }) {
  const buoc = CO_CHU * 0.95;
  const soLuong = Math.floor(RONG_VIET / buoc);
  return (
    <g fontFamily="var(--font-chu-mau), sans-serif" fontSize={CO_CHU}>
      {Array.from({ length: soLuong }, (_, i) => (
        <text key={i} x={LE_TRAI_VIET + i * buoc} y={day} fill={i === 0 ? DAM : i <= 3 ? MO : 'none'}>
          {dong.chu}
        </text>
      ))}
    </g>
  );
}

/**
 * Vần / từ / câu. Chuỗi ngắn xếp được nhiều lần trên một dòng; chuỗi dài co cỡ
 * chữ lại cho vừa bề ngang trang rồi in một lần.
 */
function NoiDungChuoi({ dong, day }: { dong: Extract<Dong, { kieu: 'chuoi' }>; day: number }) {
  const s = dong.chuoi;
  if (!s) return null;
  const rongCoChuan = beNgangChuoi(s, CO_CHU);

  // Co chữ cho vừa dòng, nhưng không nhỏ hơn CO_CHU_NHO_NHAT lần cỡ chuẩn —
  // nhỏ quá thì chữ không còn khớp lưới ô li và bé viết theo cũng khó.
  const coChu = rongCoChuan > RONG_VIET
    ? Math.max(CO_CHU * CO_CHU_NHO_NHAT, (RONG_VIET / rongCoChuan) * CO_CHU)
    : CO_CHU;
  const rong = beNgangChuoi(s, coChu);
  const buoc = rong + coChu * 0.8;
  const soLuong = Math.max(1, Math.floor(RONG_VIET / buoc));

  return (
    <g fontFamily="var(--font-chu-mau), sans-serif" fontSize={coChu}>
      {Array.from({ length: soLuong }, (_, i) => (
        <text key={i} x={LE_TRAI_VIET + i * buoc} y={day} fill={dong.toMo ? MO : i === 0 ? DAM : MO}>
          {s}
        </text>
      ))}
    </g>
  );
}

/** CSS in: mỗi trang phiếu là một tờ A4 riêng. */
export const PRINT_VIET_CSS = `
  @page { size: A4; margin: ${TRANG.le}mm; }
  .trang-viet { display: block; background: #fff; }
  @media screen {
    .to-giay {
      margin: 0 auto 18px;
      padding: ${TRANG.le}mm;
      background: #fff;
      box-shadow: 0 6px 24px rgba(15, 23, 42, .12);
      border-radius: 6px;
      width: max-content;
      max-width: 100%;
      overflow: auto;
    }
  }
  @media print {
    .no-print { display: none !important; }
    body { background: #fff !important; }
    .to-giay { margin: 0 !important; padding: 0 !important; box-shadow: none !important; border-radius: 0 !important; }
    /* Mỗi tờ một trang giấy; tờ cuối không đẩy thêm trang trắng */
    .to-giay { break-after: page; page-break-after: always; }
    .to-giay:last-child { break-after: auto; page-break-after: auto; }
    .trang-viet, .trang-viet * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`;
