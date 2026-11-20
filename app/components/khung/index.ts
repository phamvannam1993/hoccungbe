// Khung chung cho mọi trang học (đợt 3 của bản thiết kế "cấu trúc mới"):
//   <PageHeader href=… title=… />   đầu trang: breadcrumb → H1 → "Hợp lớp …" → "Bé học được gì"
//   …nội dung / công cụ của trang…
//   <HocTiep href=… links=… />      chân trang: 3 gợi ý cùng lớp/môn + nút về trang lớp
// Thẻ dùng chung: ItemCard / ItemGrid ở app/components/catalog/CatalogCards.tsx. Màu: token trong globals.css.
export { PageHeader } from './PageHeader';
export { HocTiep } from './HocTiep';
