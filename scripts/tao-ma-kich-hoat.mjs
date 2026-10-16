#!/usr/bin/env node
// Tạo mã kích hoạt cho khu /khoa-hoc-vui.
//
//   KHV_SECRET=<bí mật dùng trên server> node scripts/tao-ma-kich-hoat.mjs <TIỀN TỐ> [số lượng]
//
// Tiền tố lấy trong app/khoa-hoc-vui/data/courses.json:
//   L2K01 … L2K12 = từng khóa lớp 2, L2ALL = trọn bộ lớp 2.
// KHV_SECRET phải giống hệt giá trị đặt trên server, nếu không mã sẽ bị từ chối.

import { createHmac, randomInt } from 'node:crypto';
import { readFileSync } from 'node:fs';

const [prefixArg, countArg = '10'] = process.argv.slice(2);
const secret = process.env.KHV_SECRET;

if (!prefixArg) {
  console.error('Cách dùng: KHV_SECRET=... node scripts/tao-ma-kich-hoat.mjs <TIỀN TỐ> [số lượng]');
  process.exit(1);
}
if (!secret) {
  console.error('Thiếu biến môi trường KHV_SECRET.');
  process.exit(1);
}

const prefix = prefixArg.toUpperCase();
const catalog = JSON.parse(readFileSync(new URL('../app/khoa-hoc-vui/data/courses.json', import.meta.url), 'utf8'));
const known = [...catalog.courses, ...catalog.combos].map((c) => c.codePrefix);
if (!known.includes(prefix)) {
  console.error(`Tiền tố "${prefix}" không có trong courses.json. Hợp lệ: ${known.join(', ')}`);
  process.exit(1);
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const count = Math.max(1, Number(countArg) || 1);

for (let i = 0; i < count; i++) {
  const random = Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
  const sig = createHmac('sha256', secret).update(`${prefix}-${random}`).digest('hex').slice(0, 12).toUpperCase();
  console.log(`${prefix}-${random}-${sig}`);
}
