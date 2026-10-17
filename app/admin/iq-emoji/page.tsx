import { courses, getLessons } from '../../khoa-hoc-iq/lib/catalog';
import { emojiKey, emojiRegex, isClockEmoji } from '../../khoa-hoc-iq/lib/emoji';
import EmojiAdmin, { type EmojiUsage } from './EmojiAdmin';

export const metadata = { title: 'Emoji Toán IQ' };

/** Quét toàn bộ khóa / bài / câu hỏi / lý thuyết, gom các emoji đang dùng. */
function collectEmoji(): EmojiUsage[] {
  const map = new Map<string, EmojiUsage & { placeSet: Set<string> }>();
  const add = (text: string, place: string, sample: string) => {
    for (const m of text.matchAll(emojiRegex())) {
      const ch = m[0];
      if (isClockEmoji(ch)) continue;
      const key = emojiKey(ch);
      let u = map.get(key);
      if (!u) {
        u = { key, emoji: ch.replace(/️/g, ''), count: 0, places: [], sample, placeSet: new Set() };
        map.set(key, u);
      }
      u.count++;
      u.placeSet.add(place);
    }
  };
  const walk = (v: unknown, place: string, sample: string) => {
    if (typeof v === 'string') add(v, place, sample);
    else if (Array.isArray(v)) v.forEach((x) => walk(x, place, sample));
    else if (v && typeof v === 'object') Object.values(v).forEach((x) => walk(x, place, sample));
  };

  for (const c of courses) {
    const code = c.codePrefix;
    add(c.emoji, `${code} · biểu tượng khóa`, c.title);
    getLessons(c.slug).forEach((lesson, i) => {
      const place = `${code} · Bài ${i + 1}`;
      add(lesson.emoji, place, `Biểu tượng bài: ${lesson.title}`);
      if (lesson.theory) walk(lesson.theory, `${place} · lý thuyết`, `Lý thuyết: ${lesson.title}`);
      for (const q of lesson.questions) walk(q, place, q.prompt);
    });
  }
  return [...map.values()]
    .map(({ placeSet, ...u }) => ({ ...u, places: [...placeSet] }))
    .sort((a, b) => b.count - a.count);
}

export default function IqEmojiAdminPage() {
  return <EmojiAdmin items={collectEmoji()} />;
}
