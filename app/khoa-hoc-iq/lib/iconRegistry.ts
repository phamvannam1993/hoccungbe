// Danh mục icon / ảnh giao diện của khu Toán IQ mà admin được phép thay (trang /admin/iq-icons).
// `key` là tên file ảnh mặc định trong public/khoa-hoc-vui/images và cũng là khóa lưu ở API (/api/iq-icons).

export type IconEntry = { key: string; label: string; where: string };
export type IconGroup = { title: string; icons: IconEntry[] };

export const ICON_GROUPS: IconGroup[] = [
  {
    title: 'Thanh tiêu đề & cửa hàng',
    icons: [
      { key: 'icon_title.png', label: 'Logo góc trái', where: 'Thanh tiêu đề xanh, trang cửa hàng' },
      { key: 'icon_prev.png', label: 'Nút quay lại', where: 'Thanh tiêu đề, mũi tên cuộn bản đồ' },
      { key: 'bg_coin.png', label: 'Khung ô xu', where: 'Ô đếm tổng sao trên thanh tiêu đề' },
      { key: 'icon_point.png', label: 'Đồng xu', where: 'Ô đếm tổng sao trên thanh tiêu đề' },
      { key: 'icon_store.png', label: 'Nút nhập mã', where: 'Thanh tiêu đề' },
      { key: 'bg.png', label: 'Nền banner', where: 'Banner đầu trang cửa hàng' },
      { key: 'mascot.png', label: 'Linh vật banner', where: 'Banner đầu trang cửa hàng' },
      { key: 'icon_award.png', label: 'Huy hiệu combo', where: 'Thẻ gói trọn bộ' },
      { key: 'bg_pro.png', label: 'Khung thẻ khóa (chưa mở)', where: 'Thẻ khóa học' },
      { key: 'bg_pro_active.png', label: 'Khung thẻ khóa (đã mở)', where: 'Thẻ khóa học đã kích hoạt' },
      { key: 'icon_lock.png', label: 'Ổ khóa', where: 'Thẻ khóa, bài chưa mở trên bản đồ' },
    ],
  },
  {
    title: 'Bản đồ bài học',
    icons: [
      { key: 'star_1.png', label: 'Sao đã học', where: 'Nút bài đã hoàn thành, màn kết quả' },
      { key: 'star_2.png', label: 'Sao chưa học', where: 'Nút bài chưa học, màn kết quả' },
      { key: 'bg_top.png', label: 'Nhãn bài (trên)', where: 'Nhãn tên bài phía trên nút' },
      { key: 'bg_top_active.png', label: 'Nhãn bài (trên, đã học)', where: 'Nhãn tên bài đã học phía trên nút' },
      { key: 'bg_bottom.png', label: 'Nhãn bài (dưới)', where: 'Nhãn tên bài phía dưới nút' },
      { key: 'bg_bottom_active.png', label: 'Nhãn bài (dưới, đã học)', where: 'Nhãn tên bài đã học phía dưới nút' },
      { key: 'icon_question.png', label: 'Linh vật cầm bảng', where: 'Khung thông tin khóa, màn kết quả (ít sao)' },
    ],
  },
  {
    title: 'Màn giới thiệu bài',
    icons: [
      { key: 'icon_content.png', label: 'Linh vật bài học', where: 'Khung xám màn giới thiệu bài' },
      { key: 'icon_vol.png', label: 'Nút NGHE', where: 'Menu bên phải màn giới thiệu' },
      { key: 'icon_read.png', label: 'Nút ĐỌC', where: 'Menu bên phải màn giới thiệu' },
      { key: 'icon_play.png', label: 'Nút LUYỆN TẬP', where: 'Menu bên phải màn giới thiệu' },
      { key: 'loading.png', label: 'Linh vật bài đang soạn', where: 'Bài chưa có câu hỏi' },
    ],
  },
  {
    title: 'Màn chơi',
    icons: [
      { key: 'icon_question_qz.png', label: 'Ảnh đại diện', where: 'Góc trái thanh câu hỏi' },
      { key: 'bg_question.png', label: 'Khung tên câu hỏi', where: 'Thanh câu hỏi phía trên' },
      { key: 'icon_volumn.png', label: 'Nút loa đọc đề', where: 'Cuối khung tên câu hỏi' },
      { key: 'u_watch.png', label: 'Khung đồng hồ', where: 'Ô đếm ngược' },
      { key: 'icon_watch.png', label: 'Đồng hồ', where: 'Ô đếm ngược' },
      { key: 'u_star.png', label: 'Khung điểm sao', where: 'Ô điểm' },
      { key: 'icon_star.png', label: 'Ngôi sao điểm', where: 'Ô điểm' },
      { key: 'icon_menu.png', label: 'Nút menu', where: 'Góc phải thanh câu hỏi' },
      { key: 'icon_read_2.png', label: 'Nút BÀI ĐỌC (gợi ý)', where: 'Góc trái dưới màn chơi' },
      { key: 'bg_read.png', label: 'Khung gợi ý', where: 'Hộp gợi ý cách làm' },
      { key: 'icon_next.png', label: 'Nút Câu tiếp', where: 'Góc phải dưới màn chơi' },
      { key: 'icon_prev.png', label: 'Nút Câu trước', where: 'Góc trái dưới màn chơi' },
      { key: 'icon_page.png', label: 'Biểu tượng thanh tiến độ', where: 'Đầu thanh ô số đúng/sai' },
    ],
  },
  {
    title: 'Menu tạm dừng, nộp bài & kết quả',
    icons: [
      { key: 'icon_close_menu.png', label: 'Nút đóng', where: 'Menu, hộp gợi ý, hộp mua/kích hoạt' },
      { key: 'icon_retry.png', label: 'Làm lại', where: 'Menu tạm dừng' },
      { key: 'icon_audio.png', label: 'Âm thanh bật', where: 'Menu tạm dừng' },
      { key: 'icon_audio_2.png', label: 'Âm thanh tắt', where: 'Menu tạm dừng' },
      { key: 'icon_submit.png', label: 'Nộp bài', where: 'Menu tạm dừng' },
      { key: 'icon_exit.png', label: 'Thoát', where: 'Menu tạm dừng' },
      { key: 'icon_modal_sb.png', label: 'Linh vật hỏi nộp bài', where: 'Hộp xác nhận nộp bài' },
      { key: 'icon_tab3.png', label: 'Linh vật ăn mừng', where: 'Màn kết quả, kích hoạt thành công' },
    ],
  },
];

export const ICON_KEYS = new Set(ICON_GROUPS.flatMap((g) => g.icons.map((i) => i.key)));
