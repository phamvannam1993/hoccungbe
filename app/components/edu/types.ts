export type PageKey =
  // ─── Hệ thống ─────────────────────────────────────────────
  | 'home'
  | 'lesson'
  | 'tien-do'
  | 'pricing'
  | 'dang-nhap'
  | 'dang-ky'
  | 'dashboard'
  | 'khoa-hoc'
  | 'ho-tro'
  | 'tro-choi'

  // ─── Toán & đếm số ────────────────────────────────────────
  | 'toan-vui'
  | 'toan-bong-bong'
  | 'tim-so-thieu'
  | 'dem-dong-vat'
  | 'dem-chim'
  | 'chim-bay-mat'
  | 'tho-vao-hang'
  | 'tho-cap-ca-rot'
  | 'so-va-so-luong'
  | 'so-sanh-so'
  | 'so-roi'
  | 'noi-so'
  | 'viet-day-so'
  | 'cong-tren-so-do'
  | 'ca-trong-ho'
  | 'tau-hoc-toan'
  | 'day-so'
  | 'keo-cot-so'

  // ─── Ngôn ngữ & chữ ───────────────────────────────────────
  | 'ghep-tu'
  | 'ghep-van'
  | 'chu-cai-dau'
  | 'am-dau'
  | 'cap-doi-trai-nghia'
  | 'tu-vung-tieng-anh'
  | 'fishing-letters'
  | 'missing-letter'
  | 'letter-tracing'
  | 'trace-sentence'
  | 'doc-van-ghep-chu'

  // ─── Ghi nhớ & tập trung ──────────────────────────────────
  | 'san-hinh-ghi-nho'
  | 'nho-thu-tu'
  | 'chon-nhanh'
  | 'ghep-doi'
  | 'ghep-bong'

  // ─── Quan sát, tư duy & phân loại ─────────────────────────
  | 'sap-xep-mau'
  | 'sap-xep-thu-tu'
  | 'sap-xep-truyen'
  | 'ghep-nhom'
  | 'tim-ke-le'
  | 'hoan-thanh-quy-luat'
  | 'tim-cho-cho-vat'
  | 'me-cung-nho'

  // ─── Nghe & tương tác ─────────────────────────────────────
  | 'ghep-am-thanh'
  | 'nghe-va-lam'

  // ─── Hoạt động sống ───────────────────────────────────────
  | 'hai-tao'
  | 'hai-tao-hoc'
  | 'cho-vat-an'

  // ─── Ghép hình & logic ────────────────────────────────────
  | 'ghep-hinh-rung'
  | 'ghep-manh-hinh'
  | 'puzzle-game'
  | 'toan-bong-bong-bien';

export type SetPage = (page: PageKey) => void;
