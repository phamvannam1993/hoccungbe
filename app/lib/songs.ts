// Bài hát & vè tiếng Anh cho bé — các bài đồng dao/nhạc thiếu nhi truyền thống (public domain).
// Mỗi bài: lời tiếng Anh + nghĩa tiếng Việt. Hát theo bằng speakSequence (đọc lần lượt các dòng).

export type SongLine = { en: string; vi: string };

export type Song = {
  slug: string;
  emoji: string;
  title: string;
  viTitle: string;
  lines: SongLine[];
};

export const SONGS: Song[] = [
  {
    slug: 'abc-song', emoji: '🔤', title: 'The ABC Song', viTitle: 'Bài hát bảng chữ cái',
    lines: [
      { en: 'A B C D E F G,', vi: 'A B C D E F G,' },
      { en: 'H I J K L M N O P,', vi: 'H I J K L M N O P,' },
      { en: 'Q R S, T U V,', vi: 'Q R S, T U V,' },
      { en: 'W X, Y and Z.', vi: 'W X, Y và Z.' },
      { en: 'Now I know my ABCs,', vi: 'Giờ mình đã thuộc bảng chữ cái,' },
      { en: 'next time won’t you sing with me?', vi: 'lần sau bạn hát cùng mình nhé?' },
    ],
  },
  {
    slug: 'numbers', emoji: '🔢', title: 'Count from One to Ten', viTitle: 'Đếm từ 1 đến 10',
    lines: [
      { en: 'One, two, three, four, five,', vi: 'Một, hai, ba, bốn, năm,' },
      { en: 'once I caught a fish alive.', vi: 'có lần mình bắt được một con cá.' },
      { en: 'Six, seven, eight, nine, ten,', vi: 'Sáu, bảy, tám, chín, mười,' },
      { en: 'then I let it go again.', vi: 'rồi mình lại thả nó đi.' },
    ],
  },
  {
    slug: 'days-of-the-week', emoji: '📅', title: 'Days of the Week', viTitle: 'Các ngày trong tuần',
    lines: [
      { en: 'Sunday, Monday, Tuesday,', vi: 'Chủ Nhật, Thứ Hai, Thứ Ba,' },
      { en: 'Wednesday, Thursday, Friday,', vi: 'Thứ Tư, Thứ Năm, Thứ Sáu,' },
      { en: 'Saturday.', vi: 'Thứ Bảy.' },
      { en: 'There are seven days in a week.', vi: 'Một tuần có bảy ngày.' },
    ],
  },
  {
    slug: 'head-shoulders', emoji: '🧑', title: 'Head, Shoulders, Knees and Toes', viTitle: 'Đầu, vai, đầu gối, ngón chân',
    lines: [
      { en: 'Head, shoulders, knees and toes,', vi: 'Đầu, vai, đầu gối và ngón chân,' },
      { en: 'knees and toes.', vi: 'đầu gối và ngón chân.' },
      { en: 'Eyes and ears and mouth and nose.', vi: 'Mắt và tai và miệng và mũi.' },
      { en: 'Head, shoulders, knees and toes!', vi: 'Đầu, vai, đầu gối và ngón chân!' },
    ],
  },
  {
    slug: 'twinkle', emoji: '⭐', title: 'Twinkle, Twinkle, Little Star', viTitle: 'Ngôi sao nhỏ lấp lánh',
    lines: [
      { en: 'Twinkle, twinkle, little star,', vi: 'Lấp lánh, lấp lánh, ngôi sao nhỏ,' },
      { en: 'how I wonder what you are.', vi: 'mình tự hỏi bạn là gì.' },
      { en: 'Up above the world so high,', vi: 'Trên cao tít giữa bầu trời,' },
      { en: 'like a diamond in the sky.', vi: 'như một viên kim cương trên trời.' },
    ],
  },
  {
    slug: 'if-youre-happy', emoji: '😄', title: 'If You’re Happy and You Know It', viTitle: 'Nếu bạn vui và bạn biết điều đó',
    lines: [
      { en: 'If you’re happy and you know it, clap your hands!', vi: 'Nếu bạn vui và bạn biết điều đó, hãy vỗ tay!' },
      { en: 'If you’re happy and you know it, clap your hands!', vi: 'Nếu bạn vui và bạn biết điều đó, hãy vỗ tay!' },
      { en: 'If you’re happy and you know it, and you really want to show it,', vi: 'Nếu bạn vui và bạn biết, và bạn thật sự muốn thể hiện,' },
      { en: 'if you’re happy and you know it, clap your hands!', vi: 'nếu bạn vui và bạn biết điều đó, hãy vỗ tay!' },
    ],
  },
  {
    slug: 'rain-rain', emoji: '🌧️', title: 'Rain, Rain, Go Away', viTitle: 'Mưa ơi, mưa tạnh đi',
    lines: [
      { en: 'Rain, rain, go away,', vi: 'Mưa ơi, mưa ơi, tạnh đi,' },
      { en: 'come again another day.', vi: 'hãy đến vào một ngày khác nhé.' },
      { en: 'Little children want to play.', vi: 'Các bạn nhỏ muốn ra chơi.' },
      { en: 'Rain, rain, go away!', vi: 'Mưa ơi, mưa ơi, tạnh đi!' },
    ],
  },
];

export const totalSongLines = () => SONGS.reduce((n, s) => n + s.lines.length, 0);
