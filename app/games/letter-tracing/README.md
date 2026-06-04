# Letter Tracing Game

Thư mục này là một game luyện viết chữ tiếng Việt dạng Next.js App Router.

## Cách dùng

Copy nguyên thư mục `letter-tracing` vào:

```txt
src/app/games/letter-tracing
```

Sau đó chạy project và mở:

```txt
/games/letter-tracing
```

## File chính

```txt
letter-tracing/
├─ page.tsx
├─ LetterTracingGame.tsx
├─ letters.ts
├─ letterTracing.module.css
└─ README.md
```

## Nội dung đã sửa

- Thêm bút chì đi theo tay bé khi vẽ.
- Thêm nút `Xem bút mẫu` để bút tự chạy theo nét chữ.
- Sửa lại nhiều path chữ cho gọn hơn, đặc biệt nhóm dấu: `ă`, `â`, `ô`, `ơ`, `ư`, `Ơ`, `Ư`.
- Thêm `strokeWidths` trong `letters.ts` để dấu/móc/thanh ngang mảnh hơn thân chữ, tránh bị phình thành cục.
- Sửa chữ `g` thường gọn hơn và giảm độ dày nét riêng để không bị thừa viền.
- Giữ hệ tọa độ SVG 600x520 để dễ mở rộng chữ mới.

## Thêm chữ mới

Mở file `letters.ts`, thêm object mới vào mảng `TRACE_LETTERS`.

Ví dụ:

```ts
{
  key: 'ơ',
  label: 'ơ',
  speak: 'chữ ơ',
  paths: [
    '...',
    '...'
  ],
  strokeWidths: [54, 30]
}
```

`strokeWidths` là tuỳ chọn. Nếu không khai báo, path sẽ dùng độ dày mặc định trong CSS.
