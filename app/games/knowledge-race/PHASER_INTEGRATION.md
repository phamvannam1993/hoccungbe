# Đua xe kiến thức — Phaser visual upgrade

## Kiến trúc

- React quản lý câu hỏi, đáp án, điểm, combo, thời gian và kết quả.
- Phaser quản lý toàn bộ cảnh đua: road perspective, parallax, xe, chướng ngại, đồng xu, Turbo, camera shake/flash và vạch đích.
- Bộ sprite SVG nằm tại `public/games/knowledge-race/assets` để xe và vật cản sắc nét trên mọi màn hình.

## Các asset mới

- `car-red.svg`, `car-blue.svg`, `car-green.svg`, `car-orange.svg`
- `rock.svg`, `cones.svg`, `oil.svg`, `crate.svg`
- `coin.svg`

## Lưu ý

Cần cài dependency `phaser@3.88.2` trước khi build:

```bash
npm install
npm run build
```
