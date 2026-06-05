# Letter Tracing Game - bản chuẩn từng nét

Bản này đã được chuẩn hóa theo hướng luyện viết:
- Chữ mảnh kiểu 1 nét.
- Mỗi chữ tách thành từng nét riêng.
- Có số thứ tự nét.
- Có mũi tên hướng dẫn chiều viết.
- Chỉ cho bé viết đúng nét đang active.
- Viết đủ nét hiện tại mới chuyển sang nét tiếp theo.
- Đầu bút nằm đúng tại vị trí chạm/kéo.

## Cách dùng

Copy thư mục `letter-tracing` vào project Next.js App Router.

Ví dụ:

```tsx
import LetterTracingGame from './LetterTracingGame';

export default function Page() {
  return <LetterTracingGame />;
}
```

File chính:
- `LetterTracingGame.tsx`
- `letters.ts`
- `letterTracing.module.css`
- `page.tsx`

Lưu ý: component đang import `speakText` từ `@/app/components/edu/utils/speech`.
Nếu project của bạn không có hàm này, hãy đổi import hoặc thay bằng `window.speechSynthesis`.
