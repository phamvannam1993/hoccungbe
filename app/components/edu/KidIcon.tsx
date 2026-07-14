// Icon PNG dùng chung cho các trang phụ huynh (tien-do, dashboard, ho-so-be).
// Ảnh tĩnh trong /public/icons → dùng <img> thường cho nhẹ.

export const ICON = {
  level: '/icons/01_huy_hieu_cap_5.png',
  abc: '/icons/01_the_chu_cai_ABC.png',
  home: '/icons/01_trang_chu.png',
  flame: '/icons/02_huy_hieu_ngon_lua.png',
  book: '/icons/02_sach_mo.png',
  count123: '/icons/02_the_so_dem_123.png',
  trophy: '/icons/03_cup_thanh_tich.png',
  target: '/icons/03_huy_hieu_muc_tieu.png',
  experiment: '/icons/03_the_be_lam_thi_nghiem.png',
  giftRed: '/icons/04_hop_qua_do.png',
  starBadge: '/icons/04_huy_hieu_ngoi_sao.png',
  temple: '/icons/04_the_ngoi_chua.png',
  tigerHero: '/icons/05_ho_con_sieu_nhan.png',
  check: '/icons/05_nut_dau_tich.png',
  bell: '/icons/05_thong_bao_so_3.png',
  tigerRead: '/icons/06_ho_con_doc_sach.png',
  starBtn: '/icons/06_nut_ngoi_sao.png',
  bookBtn: '/icons/06_nut_sach.png',
  clock: '/icons/07_nut_dong_ho.png',
  giftBtnRed: '/icons/07_nut_hop_qua_do.png',
  rabbit: '/icons/07_tho_trang_doc_sach.png',
  avatarBoy: '/icons/08_anh_dai_dien_be_trai.png',
  starPurple: '/icons/08_nut_ngoi_sao_tim.png',
  statusGray: '/icons/08_nut_trang_thai_xam.png',
  giftGreen: '/icons/09_hop_qua_xanh.png',
  medal: '/icons/09_huy_chuong.png',
  calendar: '/icons/10_lich.png',
  starKing: '/icons/10_ngoi_sao_vua.png',
  airplane: '/icons/11_may_bay_giay.png',
  starBig: '/icons/11_ngoi_sao_lon.png',
  cloud: '/icons/12_dam_may.png',
  starSmall: '/icons/12_ngoi_sao_nho.png',
} as const;

export type IconName = keyof typeof ICON;

// Ảnh môn học theo courseType.
export function subjectIcon(ct?: string | null): IconName {
  switch (ct) {
    case 'math': return 'count123';
    case 'language': return 'book';
    case 'english': return 'abc';
    case 'logic': return 'target';
    case 'creative': return 'experiment';
    default: return 'starSmall';
  }
}

export default function KidIcon({ name, className = 'h-6 w-6', alt = '' }: { name: IconName; className?: string; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- icon PNG tĩnh trong /public
  return <img src={ICON[name]} alt={alt} className={`${className} object-contain`} draggable={false} />;
}

// ── Avatar cho bé (ảnh trong /public/avatars) ──
// Quy ước: lẻ = bé trai (01,03,05,07) · chẵn = bé gái (02,04,06,08).
export const BOY_AVATARS = ['/avatars/avatar-be-01.webp', '/avatars/avatar-be-03.webp', '/avatars/avatar-be-05.webp', '/avatars/avatar-be-07.webp'];
export const GIRL_AVATARS = ['/avatars/avatar-be-02.webp', '/avatars/avatar-be-04.webp', '/avatars/avatar-be-06.webp', '/avatars/avatar-be-08.webp'];
export const ALL_AVATARS = ['/avatars/avatar-be-01.webp', '/avatars/avatar-be-02.webp', '/avatars/avatar-be-03.webp', '/avatars/avatar-be-04.webp', '/avatars/avatar-be-05.webp', '/avatars/avatar-be-06.webp', '/avatars/avatar-be-07.webp', '/avatars/avatar-be-08.webp'];

// Ảnh đại diện của bé: ưu tiên avatarUrl bé đã chọn, nếu chưa thì lấy mặc định theo giới tính (ổn định theo id).
export function childAvatar(child?: { id?: number; gender?: string; avatarUrl?: string } | null): string {
  if (child?.avatarUrl) return child.avatarUrl;
  const pool = child?.gender === 'female' ? GIRL_AVATARS : BOY_AVATARS;
  const idx = child?.id ? Math.abs(Number(child.id)) % pool.length : 0;
  return pool[idx] ?? pool[0];
}

export function ChildAvatar({ child, className = 'h-12 w-12' }: { child?: { id?: number; gender?: string; avatarUrl?: string } | null; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- ảnh avatar tĩnh trong /public
  return <img src={childAvatar(child)} alt="Ảnh đại diện của bé" className={`${className} rounded-full object-cover`} draggable={false} />;
}
