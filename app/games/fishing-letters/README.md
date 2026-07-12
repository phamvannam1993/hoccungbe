# Fishing Letters Game - Next.js Module

Đây là module game **Câu cá chữ cái** dùng cho Next.js App Router.

## Cách dùng

Copy nguyên thư mục `fishing-letters` vào:

```txt
app/games/fishing-letters/
```

Cấu trúc sau khi copy:

```txt
app/
  games/
    fishing-letters/
      page.tsx
      FishingLettersGame.tsx
      fishingLetters.data.ts
```

Chạy dự án:

```bash
npm run dev
```

Mở đường dẫn:

```txt
http://localhost:3000/games/fishing-letters
```

## Yêu cầu

Dự án cần có Tailwind CSS. Nếu chưa có Tailwind, cài bằng:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Thêm vào `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Tính năng có sẵn

- 3 cấp độ: chữ hoa, chữ hoa - chữ thường, chữ đầu của từ.
- Random câu hỏi.
- Cá bơi, chọn đúng/sai, hiệu ứng câu cá.
- Nút nghe lại yêu cầu bằng `speechSynthesis` của trình duyệt.
- Tự mở cấp tiếp theo khi đủ điểm.
- Dữ liệu câu hỏi tách riêng trong `fishingLetters.data.ts`.
