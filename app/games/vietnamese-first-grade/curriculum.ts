import { CAU_NGAN, CHU_CAI, TU_NGU, moTaDoCao } from '@/app/lib/luyenViet';
import { DANH_VAN, THANH, THANH_DEMOS, VAN_GROUPS, VN_LETTERS } from '@/app/lib/vietReading';
import { TAP_DOC } from '@/app/lib/tapDoc';
import { tachTieng } from '@/app/lib/danhVan';

export type CurriculumQuestion = {
  prompt: string;
  picture: string;
  answers: string[];
  correct: string;
  passage?: string;
  audioText?: string;
};

export type CurriculumLesson = {
  id: string;
  title: string;
  questions: CurriculumQuestion[];
};

export type CurriculumTopic = {
  id: string;
  title: string;
  emoji: string;
  hint: string;
  tone: string;
  lessons: CurriculumLesson[];
  href?: string;
};

const LETTERS = VN_LETTERS.map((letter) => letter.char);
const VOWELS = ['a', 'ă', 'â', 'e', 'ê', 'i', 'o', 'ô', 'ơ', 'u', 'ư', 'y'];
const CONSONANT_CLUSTERS = [
  { onset: 'ch', word: 'chó', picture: '🐕' },
  { onset: 'gh', word: 'ghế', picture: '🪑' },
  { onset: 'gi', word: 'gió', picture: '🌬️' },
  { onset: 'kh', word: 'khăn', picture: '🧣' },
  { onset: 'ng', word: 'ngô', picture: '🌽' },
  { onset: 'ngh', word: 'nghỉ', picture: '😴' },
  { onset: 'nh', word: 'nhà', picture: '🏠' },
  { onset: 'ph', word: 'phở', picture: '🍜' },
  { onset: 'qu', word: 'quả', picture: '🍎' },
  { onset: 'th', word: 'thỏ', picture: '🐇' },
  { onset: 'tr', word: 'tre', picture: '🎋' },
];

function makeQuestion(
  prompt: string,
  picture: string,
  correct: string,
  pool: string[],
  seed: number,
  extra: Pick<CurriculumQuestion, 'passage' | 'audioText'> = {},
): CurriculumQuestion {
  const distractors = [...new Set(pool.filter((item) => item !== correct))];
  const start = distractors.length ? seed % distractors.length : 0;
  const answers = [correct, ...Array.from({ length: Math.min(2, distractors.length) }, (_, index) => distractors[(start + index) % distractors.length])];
  const shift = answers.length ? seed % answers.length : 0;
  return { prompt, picture, answers: [...answers.slice(shift), ...answers.slice(0, shift)], correct, ...extra };
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
  return chunks;
}

function makeLessons(topicId: string, title: string, questions: CurriculumQuestion[], size = 5): CurriculumLesson[] {
  return chunk(questions, size).map((items, index) => ({
    id: `${topicId}-${index + 1}`,
    title: `${title} ${index + 1}`,
    questions: items,
  }));
}

const alphabetLessons: CurriculumLesson[] = [
  ...chunk(VN_LETTERS, 5).map((letters, index) => ({
    id: `lowercase-${index + 1}`,
    title: `Chữ thường ${letters[0].char}–${letters[letters.length - 1].char}`,
    questions: letters.flatMap((letter, questionIndex) => [
      makeQuestion(
        `Từ “${letter.word}” bắt đầu bằng chữ nào?`, letter.emoji, letter.char, LETTERS, index * 10 + questionIndex * 2,
      ),
      makeQuestion(
        `Từ nào bắt đầu bằng chữ “${letter.char}”?`, letter.emoji, letter.word, VN_LETTERS.map((item) => item.word), index * 10 + questionIndex * 2 + 1,
      ),
    ]),
  })),
  ...chunk(VN_LETTERS, 5).map((letters, index) => ({
    id: `uppercase-${index + 1}`,
    title: `Chữ hoa ${letters[0].char.toUpperCase()}–${letters[letters.length - 1].char.toUpperCase()}`,
    questions: letters.flatMap((letter, questionIndex) => [
      makeQuestion(
        `Chữ hoa của “${letter.char}” là chữ nào?`, '📝', letter.char.toUpperCase(), LETTERS.map((char) => char.toUpperCase()), index * 10 + questionIndex * 2,
      ),
      makeQuestion(
        `Từ “${letter.word}” bắt đầu bằng chữ hoa nào?`, letter.emoji, letter.char.toUpperCase(), LETTERS.map((char) => char.toUpperCase()), index * 10 + questionIndex * 2 + 1,
      ),
    ]),
  })),
];

const vowelQuestions = VOWELS.map((vowel, index) => makeQuestion(
  `Chữ “${vowel}” là nguyên âm hay phụ âm?`, '🔊', 'Nguyên âm', ['Nguyên âm', 'Phụ âm'], index,
));
const consonantQuestions = LETTERS.filter((letter) => !VOWELS.includes(letter)).map((consonant, index) => makeQuestion(
  `Chữ “${consonant}” là nguyên âm hay phụ âm?`, '🔤', 'Phụ âm', ['Nguyên âm', 'Phụ âm'], index,
));
const clusterQuestions = CONSONANT_CLUSTERS.map((item, index) => makeQuestion(
  `Từ “${item.word}” bắt đầu bằng cụm chữ nào?`, item.picture, item.onset,
  CONSONANT_CLUSTERS.map((cluster) => cluster.onset), index,
));
const soundLessons = [
  ...makeLessons('vowels', 'Nguyên âm', vowelQuestions, 4),
  ...makeLessons('consonants', 'Phụ âm', consonantQuestions, 5),
  ...makeLessons('clusters', 'Cụm phụ âm', clusterQuestions, 4),
];

const toneQuestions = THANH_DEMOS.flatMap((demo, demoIndex) => demo.items.map((item, toneIndex) => {
  const tone = THANH[toneIndex].label.split(' ')[0].toLowerCase();
  return makeQuestion(
    `Tiếng “${item.tieng}” có thanh nào?`, '🎼', tone,
    THANH.map((entry) => entry.label.split(' ')[0].toLowerCase()), demoIndex * demo.items.length + toneIndex,
    { audioText: item.tieng },
  );
}));
const TONE_SIGNS = [
  { tone: 'ngang', sign: 'Không dấu' },
  { tone: 'huyền', sign: 'Dấu huyền (`)' },
  { tone: 'sắc', sign: 'Dấu sắc (´)' },
  { tone: 'hỏi', sign: 'Dấu hỏi (?)' },
  { tone: 'ngã', sign: 'Dấu ngã (~)' },
  { tone: 'nặng', sign: 'Dấu nặng (.)' },
];
const toneSignQuestions = TONE_SIGNS.map((item, index) => makeQuestion(
  `Thanh ${item.tone} được viết như thế nào?`, '✍️', item.sign, TONE_SIGNS.map((tone) => tone.sign), index,
));
const toneLessons = [...THANH_DEMOS.map((demo, index) => ({
  id: `tone-base-${index + 1}`,
  title: `Sáu thanh với tiếng “${demo.base}”`,
  questions: toneQuestions.slice(index * demo.items.length, (index + 1) * demo.items.length),
})), { id: 'tone-signs', title: 'Nhận biết kí hiệu dấu thanh', questions: toneSignQuestions }];

const rhymePool = VAN_GROUPS.flatMap((group) => group.items.map((item) => item.van));
const rhymeWords = VAN_GROUPS.flatMap((group) => group.items.map((item) => item.word));
const rhymeLessons = VAN_GROUPS.flatMap((group, groupIndex) => chunk(group.items, 5).map((items, partIndex) => ({
  id: `rhyme-${groupIndex + 1}-${partIndex + 1}`,
  title: `${group.label}${partIndex ? ` · phần ${partIndex + 1}` : ''}`,
  questions: items.flatMap((item, index) => [
    makeQuestion(
      `Tiếng “${item.word}” có vần nào?`, item.emoji ?? '🎵', item.van, rhymePool, groupIndex * 50 + partIndex * 10 + index * 2,
    ),
    makeQuestion(
      `Chọn từ có vần “${item.van}”.`, item.emoji ?? '🎵', item.word, rhymeWords, groupIndex * 50 + partIndex * 10 + index * 2 + 1,
    ),
  ]),
})));

const syllableQuestions = DANH_VAN.flatMap((item, index) => {
  const parts = tachTieng(item.tieng);
  return [
    makeQuestion(`Âm đầu của tiếng “${item.tieng}” là gì?`, item.emoji, parts.amDau, DANH_VAN.map((word) => tachTieng(word.tieng).amDau), index * 3),
    makeQuestion(`Vần của tiếng “${item.tieng}” là gì?`, item.emoji, parts.van, DANH_VAN.map((word) => tachTieng(word.tieng).van), index * 3 + 1),
    makeQuestion(`Tiếng “${item.tieng}” mang thanh nào?`, item.emoji, parts.thanh, THANH.map((tone) => tone.label.split(' ')[0].toLowerCase()), index * 3 + 2),
  ];
});
const compositionQuestions = DANH_VAN.map((item, index) => {
  const parts = tachTieng(item.tieng);
  return makeQuestion(
    `Ghép âm đầu “${parts.amDau}” với vần “${parts.van}” được tiếng nào?`, item.emoji, item.tieng,
    DANH_VAN.map((word) => word.tieng), index,
  );
});
const syllableLessons = makeLessons('syllables', 'Đánh vần', [...syllableQuestions, ...compositionQuestions], 6);

const vocabularyGroups = TU_NGU.map((group) => ({ title: group.nhom, words: group.ds }));
const vocabularyCategories = vocabularyGroups.map((group) => group.title);
const allVocabularyWords = vocabularyGroups.flatMap((group) => group.words);
const vocabularyLessons = vocabularyGroups.flatMap((group, groupIndex) => {
  const questions = group.words.flatMap((word, index) => {
    const picture = ['👨‍👩‍👧', '✏️', '🐾', '🌳', '🏫', '🏞️'][groupIndex];
    const otherGroupWords = allVocabularyWords.filter((candidate) => !group.words.includes(candidate));
    return [
      makeQuestion(
        `Từ “${word}” thuộc nhóm nào?`, picture, group.title, vocabularyCategories, groupIndex * 20 + index * 2,
      ),
      makeQuestion(
        `Từ nào thuộc nhóm “${group.title}”?`, picture, word, [word, ...otherGroupWords], groupIndex * 20 + index * 2 + 1,
      ),
    ];
  });
  return chunk(questions, 4).map((items, partIndex) => ({
    id: `vocabulary-${groupIndex + 1}-${partIndex + 1}`,
    title: `${group.title}${partIndex ? ` · phần ${partIndex + 1}` : ''}`,
    questions: items,
  }));
});

const sentenceWords = CAU_NGAN.map((sentence) => sentence.match(/([^\s.!?]+)[.!?]$/)?.[1] ?? sentence);
const sentenceQuestions = CAU_NGAN.flatMap((sentence, index) => {
  const answer = sentenceWords[index];
  const withoutPunctuation = sentence.replace(/[.!?]$/, '');
  const prefix = withoutPunctuation.slice(0, withoutPunctuation.length - answer.length);
  const shuffled = withoutPunctuation.split(' ').reverse().join(' / ');
  return [
    makeQuestion(`Điền từ còn thiếu: “${prefix}_____.”`, '📖', answer, sentenceWords, index * 2, {
      audioText: `Điền từ còn thiếu. ${prefix}chỗ trống.`,
    }),
    makeQuestion(`Sắp xếp các từ để thành câu: “${shuffled}”.`, '📖', sentence, CAU_NGAN, index * 2 + 1),
  ];
});

const allStorySentences = TAP_DOC.flatMap((story) => story.sentences);
const readingLessons = TAP_DOC.map((story) => ({
  id: `reading-${story.slug}`,
  title: story.title,
  questions: [
    {
      prompt: story.question.q,
      picture: story.emoji,
      answers: story.question.options,
      correct: story.question.options[story.question.correct],
      passage: story.sentences.join(' '),
    },
    ...story.sentences.map((sentence, index) => makeQuestion(
      'Câu nào có trong bài đọc?', story.emoji, sentence, allStorySentences, TAP_DOC.indexOf(story) * 5 + index,
      { passage: story.sentences.join(' ') },
    )),
  ],
}));

const dictationLessons = vocabularyGroups.flatMap((group, groupIndex) => chunk(group.words, 4).map((words, partIndex) => ({
  id: `dictation-${groupIndex + 1}-${partIndex + 1}`,
  title: `Nghe viết · ${group.title}${partIndex ? ` · phần ${partIndex + 1}` : ''}`,
  questions: words.flatMap((word, index) => [
    makeQuestion(
      'Nghe tiếng và chọn từ được đọc.', '🔊', word, allVocabularyWords, groupIndex * 20 + partIndex * 8 + index * 2,
      { audioText: word },
    ),
    makeQuestion(
      `Từ “${word}” bắt đầu bằng chữ nào?`, '🔤', word[0].toLowerCase(), CHU_CAI.map((letter) => letter), groupIndex * 20 + partIndex * 8 + index * 2 + 1,
      { audioText: word },
    ),
  ]),
})));

const handwritingQuestions = [
  ...CHU_CAI.map((letter, index) => makeQuestion(
    `Chọn chữ thường để luyện viết chữ hoa “${letter.toUpperCase()}”.`, '✍️', letter,
    CHU_CAI.filter((char) => char !== letter), index,
  )),
  ...CHU_CAI.map((letter, index) => makeQuestion(
    `Chữ “${letter}” cao bao nhiêu ô li?`, '📏', moTaDoCao(letter), CHU_CAI.map((char) => moTaDoCao(char)), index,
  )),
  ...CAU_NGAN.map((sentence, index) => makeQuestion(
    `Chọn câu con sẽ luyện viết: “${sentence}”`, '📓', sentence, CAU_NGAN, index + CHU_CAI.length,
  )),
];
const handwritingLessons = makeLessons('handwriting', 'Luyện nét chữ', handwritingQuestions, 5);

const reviewQuestions = [
  ...alphabetLessons.flatMap((lesson) => lesson.questions).filter((_, index) => index % 5 === 0).slice(0, 12),
  ...toneQuestions.filter((_, index) => index % 2 === 0),
  ...toneSignQuestions,
  ...rhymeLessons.flatMap((lesson) => lesson.questions).filter((_, index) => index % 7 === 0).slice(0, 12),
  ...syllableQuestions.filter((_, index) => index % 4 === 0),
  ...sentenceQuestions,
  ...dictationLessons.flatMap((lesson) => lesson.questions).filter((_, index) => index % 5 === 0).slice(0, 12),
  ...TAP_DOC.map((story) => ({
    prompt: story.question.q,
    picture: story.emoji,
    answers: story.question.options,
    correct: story.question.options[story.question.correct],
    passage: story.sentences.join(' '),
  })),
];
const reviewLessons = makeLessons('review', 'Ôn tập tổng hợp', reviewQuestions, 8);

export const VIETNAMESE_GRADE_ONE_CURRICULUM: CurriculumTopic[] = [
  { id: 'letters', title: 'Chữ cái và âm', emoji: '🔤', hint: '29 chữ cái, nguyên âm và phụ âm', tone: '#ef668f', lessons: [...alphabetLessons, ...soundLessons] },
  { id: 'tones', title: 'Dấu thanh', emoji: '✨', hint: 'Nhận biết đủ 6 thanh tiếng Việt', tone: '#ed8a43', lessons: toneLessons },
  { id: 'rhymes', title: 'Vần', emoji: '🎵', hint: `${rhymePool.length} vần chia theo nhóm âm cuối`, tone: '#427ad4', lessons: rhymeLessons },
  { id: 'blend', title: 'Ghép tiếng', emoji: '🧩', hint: 'Âm đầu, vần và thanh', tone: '#50a773', lessons: syllableLessons },
  { id: 'words', title: 'Từ ngữ', emoji: '🍎', hint: 'Từ vựng theo 6 chủ đề quen thuộc', tone: '#c95252', lessons: vocabularyLessons },
  { id: 'sentences', title: 'Đọc câu', emoji: '📘', hint: 'Đọc và hoàn thành 10 câu ngắn', tone: '#318d9e', lessons: makeLessons('sentences', 'Câu ngắn', sentenceQuestions, 5) },
  { id: 'reading', title: 'Đọc đoạn', emoji: '📖', hint: '6 bài đọc kèm câu hỏi hiểu bài', tone: '#705cb9', lessons: readingLessons },
  { id: 'spelling', title: 'Chính tả', emoji: '✍️', hint: 'Nghe từ và chọn cách viết', tone: '#d4a22c', lessons: dictationLessons },
  { id: 'handwriting', title: 'Tập viết', emoji: '🖍️', hint: '29 chữ cái và câu mẫu', tone: '#db6e45', lessons: handwritingLessons, href: '/luyen-viet-chu' },
  { id: 'review', title: 'Tổng hợp', emoji: '🏆', hint: 'Ôn chữ, vần, từ, câu và đọc hiểu', tone: '#c58a26', lessons: reviewLessons },
];

export const TOTAL_CURRICULUM_LESSONS = VIETNAMESE_GRADE_ONE_CURRICULUM.reduce((total, topic) => total + topic.lessons.length, 0);
export const TOTAL_CURRICULUM_QUESTIONS = VIETNAMESE_GRADE_ONE_CURRICULUM.reduce(
  (total, topic) => total + topic.lessons.reduce((topicTotal, lesson) => topicTotal + lesson.questions.length, 0),
  0,
);