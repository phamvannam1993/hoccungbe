// Tiếng Việt lớp 1 — chép từ "TOÁN - TV 1_1.pdf": phiếu chính tả g/gh (28 tranh), hai phiếu "Bài tập chính tả"
// và Phiếu ôn giữa học kì I số 01. Tranh cắt từ bản scan (public/thi-lop-1). Ô chữ: bấm để chọn âm/vần.

import type { RawPhieu } from './kieu';

/** "gh|ế gỗ" → ô chọn g/gh + phần còn lại của từ. */
const gh = (w: string) => {
  const [a, rest] = w.split('|');
  return `[[t:${a}/g,gh]]${rest}`;
};

const GGH: [string, string][] = [
  ['g', 'à mái'], ['gh', 'ế gỗ'], ['gh', 'i chép'], ['g', 'ói quà'], ['g', 'ấu bông'], ['g', 'ốc cây'], ['g', 'à trống'],
  ['gh', 'ẹ'], ['g', 'ỗ lim'], ['gh', 'ế đá'], ['g', 'à rán'], ['gh', 'i bài'], ['gh', 'im nhỏ'], ['gh', 'ế ngồi'],
  ['g', 'ừng tươi'], ['gh', 'ép hình'], ['gh', 'i nhớ'], ['gh', 'ế dài'], ['gh', 'en tị'], ['gh', 'i tên'], ['g', 'à con'],
  ['gh', 'ế mây'], ['g', 'ấu mèo'], ['g', 'ạo trắng'], ['gh', 'ế sofa'], ['g', 'ương soi'], ['gh', 'ế học sinh'], ['g', 'áo nước'],
];

/** Nối từ ↔ tranh: `bottom` là thứ tự tranh trên giấy, `tu[i]` nối với tranh `dung[i]`. */
const noiTranh = (tu: string[], tranh: string[], dung: string[]) => ({
  t: 'match' as const,
  layout: 'cols' as const,
  top: tu.map((text) => ({ text })),
  bottom: tranh.map((img) => ({ img })),
  pairs: dung.map((d) => tranh.indexOf(d)),
  topShape: 'word',
});

export const DE_TV: RawPhieu[] = [
  {
    slug: 'tieng-viet-chinh-ta-g-gh',
    title: 'Phiếu bài tập chính tả lớp 1 – Phân biệt g/gh',
    description: '28 tranh: điền g hoặc gh vào chỗ trống. Ghi nhớ: gh đứng trước i, e, ê.',
    mon: 'tieng-viet',
    kieu: 'ct-gh',
    head: ['Phiếu bài tập chính tả lớp 1', 'Phân biệt g/gh'],
    thoiGian: 30,
    bai: [
      {
        title: 'Điền g hoặc gh vào chỗ trống:',
        blocks: [{ t: 'cards', cols: 7, numbered: true, items: GGH.map(([a, r], i) => ({ img: `gh-${i + 1}`, word: `${i + 1}. ${gh(`${a}|${r}`)}` })) }],
      },
    ],
  },
  {
    slug: 'tieng-viet-chinh-ta-phieu-1',
    title: 'Bài tập chính tả lớp 1 – Phiếu 1',
    description: 'Nối từ với tranh, điền x hay s, điền g hay gh.',
    mon: 'tieng-viet',
    kieu: 'ct',
    head: ['BÀI TẬP CHÍNH TẢ'],
    thoiGian: 30,
    bai: [
      {
        title: 'Bài 1: Nối',
        blocks: [
          noiTranh(
            ['thợ nề', 'lá thư', 'chả cá', 'quả na', 'phố xá', 'bẻ ngô', 'trẻ nhỏ', 'cá kho'],
            ['ct1-na', 'ct1-cakho', 'ct1-tre', 'ct1-thone', 'ct1-ngo', 'ct1-thu', 'ct1-phoxa', 'ct1-chaca'],
            ['ct1-thone', 'ct1-thu', 'ct1-chaca', 'ct1-na', 'ct1-phoxa', 'ct1-ngo', 'ct1-tre', 'ct1-cakho'],
          ),
        ],
      },
      {
        title: 'Bài 2: Điền x hay s',
        blocks: [
          {
            t: 'cards',
            cols: 4,
            items: [
              { img: 'ct1-susu', word: 'quả [[t:s/x,s]]u [[t:s/x,s]]u' },
              { img: 'ct1-xeca', word: '[[t:x/x,s]]e ca' },
              { img: 'ct1-sutu', word: '[[t:s/x,s]]ư tử' },
              { img: 'ct1-xo', word: '[[t:x/x,s]]ô' },
            ],
          },
        ],
      },
      {
        title: 'Bài 3: Điền g hay gh',
        blocks: [
          {
            t: 'cards',
            cols: 4,
            items: [
              { img: 'ct1-tu', word: `tủ ${gh('g|ỗ')}` },
              { img: 'ct1-vo', word: `${gh('gh|i')} vở` },
              { img: 'ct1-ga', word: `${gh('g|à')} đẻ` },
              { img: 'ct1-ghe', word: `${gh('gh|ẻ')} lở` },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'tieng-viet-chinh-ta-phieu-2',
    title: 'Bài tập chính tả lớp 1 – Phiếu 2',
    description: 'Nối từ với tranh, điền ua hay ưa, điền ch hay tr.',
    mon: 'tieng-viet',
    kieu: 'ct',
    head: ['BÀI TẬP CHÍNH TẢ'],
    thoiGian: 30,
    bai: [
      {
        title: 'Bài 1: Nối',
        blocks: [
          noiTranh(
            ['chú thỏ', 'chú hề', 'phở bò', 'ghẹ đỏ', 'cha mẹ', 'chú khỉ', 'bí ngô', 'giá đỗ'],
            ['ct2-ghe', 'ct2-chame', 'ct2-gia', 'ct2-he', 'ct2-bi', 'ct2-khi', 'ct2-pho', 'ct2-tho'],
            ['ct2-tho', 'ct2-he', 'ct2-pho', 'ct2-ghe', 'ct2-chame', 'ct2-khi', 'ct2-bi', 'ct2-gia'],
          ),
        ],
      },
      {
        title: 'Bài 2: Điền ua hay ưa',
        blocks: [
          {
            t: 'cards',
            cols: 4,
            items: [
              { img: 'ct2-lua1', word: 'l[[t:ưa/ua,ưa]]' },
              { img: 'ct2-lua2', word: 'l[[t:ua/ua,ưa]]' },
              { img: 'ct2-mua', word: 'm[[t:ua/ua,ưa]]' },
              { img: 'ct2-cua', word: 'c[[t:ưa/ua,ưa]]' },
            ],
          },
        ],
      },
      {
        title: 'Bài 3: Điền ch hay tr',
        blocks: [
          {
            t: 'cards',
            cols: 4,
            items: [
              { img: 'ct2-chi', word: '[[t:ch/ch,tr]]ì gỗ' },
              { img: 'ct2-cho', word: '[[t:ch/ch,tr]]ó xù' },
              { img: 'ct2-tre', word: 'cá [[t:tr/ch,tr]]ê' },
              { img: 'ct2-tra', word: '[[t:tr/ch,tr]]à đá' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'tieng-viet-on-giua-ki-1-phieu-1',
    title: 'Phiếu ôn giữa học kì 1 – Tiếng Việt lớp 1 – Phiếu số 01',
    description: 'Đọc thành tiếng (phụ huynh nghe bé đọc) và Đọc hiểu: tìm tiếng có vần, điền âm – vần, nối thành câu.',
    mon: 'tieng-viet',
    kieu: 'tv-phieu',
    head: ['PHIẾU SỐ: 01', 'PHIẾU ÔN GIỮA HỌC KÌ I', 'NĂM HỌC 2026 - 2027', 'MÔN: TIẾNG VIỆT 1 (Thời gian làm bài 40 phút)'],
    thoiGian: 40,
    phan: { 0: 'PHẦN 1: ĐỌC', 1: 'Đọc hiểu – Thời gian 10 phút (3 điểm)' },
    bai: [
      {
        title: 'A. Đọc thành tiếng: (7 điểm) — phụ huynh nghe bé đọc, phần này không chấm trên máy',
        diem: 0,
        blocks: [
          { t: 'text', italic: true, text: '1 – (2 điểm)   ngh   v   r   tr   gi   ·   êm   ưa   ăm   ây   ôi' },
          { t: 'text', italic: true, text: '2 – (2 điểm)   nhảy dây   ·   sữa chua   ·   lá thư   ·   phi ngựa' },
          { t: 'text', italic: true, text: '3 – (3 điểm)   Mẹ chỉ cho bé nghé, ngô.' },
        ],
      },
      {
        title: '1 – Tiếng nào có vần ăm? (1,0 điểm)  (Khoanh tròn chữ cái trước câu trả lời đúng)',
        diem: 1,
        blocks: [
          { t: 'row', cols: [[{ t: 'img', src: 'tv-cham', w: 90 }], [{ t: 'img', src: 'tv-leu', w: 110 }], [{ t: 'img', src: 'tv-nam', w: 90 }]] },
          { t: 'mc', opts: ['chăm', 'lều', 'nấm'], ans: 'chăm', cols: 3 },
        ],
      },
      {
        title: '2 – Điền âm, vần:  a) ai hay ơm? (0,5 điểm)',
        diem: 0.5,
        blocks: [{ t: 'cards', cols: 2, items: [{ img: 'tv-bat', word: 'bát c[[t:ơm/ai,ơm]]' }, { img: 'tv-gamai', word: 'gà m[[t:ai/ai,ơm]]' }] }],
      },
      {
        title: 'b) gi hay gh? (0,5 điểm)',
        diem: 0.5,
        blocks: [{ t: 'cards', cols: 2, items: [{ img: 'tv-cua', word: 'cụ [[t:gi/gi,gh]]à' }, { img: 'tv-ghe', word: '[[t:gh/gi,gh]]ế gỗ' }] }],
      },
      {
        title: '4 – Nối: (1 điểm)',
        diem: 1,
        blocks: [{ t: 'match', layout: 'cols', top: [{ text: 'Phố cổ' }, { text: 'Em mở' }, { text: 'Bé ăn' }], bottom: [{ text: 'sữa chua.' }, { text: 'Hà Nội.' }, { text: 'cửa sổ.' }], pairs: [1, 2, 0], topShape: 'box', bottomShape: 'box' }],
      },
    ],
  },
];
