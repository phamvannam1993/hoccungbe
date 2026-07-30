# Knowledge Race Layout V4 Responsive

## Sửa lỗi chính

- Không kéo giãn canvas Phaser sai tỉ lệ.
- Desktop giữ bố cục ba cột và khu đua tỉ lệ 8:5 (trùng 960x600).
- Tablet đưa khu đua lên trước, phần hướng dẫn và phản hồi xuống dưới.
- Mobile: logo -> HUD -> câu hỏi/đáp án -> đường đua -> phản hồi -> tùy chỉnh -> phần thưởng.
- Intro và kết quả có chiều cao riêng trên mobile để không bị cắt nội dung.
- Bỏ `min-width` cứng ở cột trung tâm.
- Bỏ `min-height` cứng khiến canvas bị méo.
- Sửa danh sách cách chơi bị vỡ từng chữ ở PC.
- Cột trái/phải không còn kéo cao làm xuất hiện khoảng trống lớn dưới đường đua.

## Breakpoints

- > 1180px: 3 cột giống ảnh tham chiếu.
- 761–1180px: game ở trên, hướng dẫn/phản hồi ở dưới.
- <= 760px: một cột, ưu tiên vùng chơi.
- <= 480px: HUD và điều khiển thu gọn.
