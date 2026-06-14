export type BubbleColor = "pink" | "orange" | "purple" | "blue" | "green";

export interface VocabularyItem {
  id: string;
  word: string;
  speakText: string;
  emoji: string;
  color: BubbleColor;
}

export interface VocabularyLesson {
  id: string;
  title: string;
  subtitle: string;
  items: VocabularyItem[];
}

export const lessons: VocabularyLesson[] = [
  {
    id: "animals",
    title: "Con vật đáng yêu",
    subtitle: "Nghe tên con vật rồi bắt đúng bong bóng!",
    items: [
      { id: "cat", word: "mèo", speakText: "mèo", emoji: "🐱", color: "pink" },
      { id: "dog", word: "chó", speakText: "chó", emoji: "🐶", color: "orange" },
      { id: "fish", word: "cá", speakText: "cá", emoji: "🐟", color: "blue" },
      { id: "chicken", word: "gà", speakText: "gà", emoji: "🐔", color: "green" },
      { id: "rabbit", word: "thỏ", speakText: "thỏ", emoji: "🐰", color: "purple" },
    ],
  },
  {
    id: "fruit",
    title: "Trái cây",
    subtitle: "Bé nghe tên quả và chọn hình đúng nhé!",
    items: [
      { id: "apple", word: "táo", speakText: "táo", emoji: "🍎", color: "pink" },
      { id: "banana", word: "chuối", speakText: "chuối", emoji: "🍌", color: "orange" },
      { id: "grape", word: "nho", speakText: "nho", emoji: "🍇", color: "purple" },
      { id: "strawberry", word: "dâu", speakText: "dâu", emoji: "🍓", color: "blue" },
      { id: "orange", word: "cam", speakText: "cam", emoji: "🍊", color: "green" },
    ],
  },
  {
    id: "school",
    title: "Đồ dùng học tập",
    subtitle: "Bé bắt đúng bong bóng đồ dùng trong lớp!",
    items: [
      { id: "book", word: "sách", speakText: "sách", emoji: "📚", color: "blue" },
      { id: "pen", word: "bút", speakText: "bút", emoji: "✏️", color: "orange" },
      { id: "bag", word: "cặp", speakText: "cặp", emoji: "🎒", color: "pink" },
      { id: "notebook", word: "vở", speakText: "vở", emoji: "📒", color: "green" },
      { id: "board", word: "bảng", speakText: "bảng", emoji: "🧾", color: "purple" },
    ],
  },
  {
    id: "nature",
    title: "Thiên nhiên",
    subtitle: "Nghe từ về thiên nhiên rồi chọn hình đúng!",
    items: [
      { id: "flower", word: "hoa", speakText: "hoa", emoji: "🌸", color: "pink" },
      { id: "leaf", word: "lá", speakText: "lá", emoji: "🍃", color: "green" },
      { id: "sun", word: "mặt trời", speakText: "mặt trời", emoji: "☀️", color: "orange" },
      { id: "cloud", word: "mây", speakText: "mây", emoji: "☁️", color: "blue" },
      { id: "mountain", word: "núi", speakText: "núi", emoji: "⛰️", color: "purple" },
    ],
  },
  {
    id: "colors",
    title: "Màu sắc",
    subtitle: "Bé nghe màu và bắt bong bóng đúng!",
    items: [
      { id: "red", word: "đỏ", speakText: "đỏ", emoji: "🔴", color: "pink" },
      { id: "yellow", word: "vàng", speakText: "vàng", emoji: "🟡", color: "orange" },
      { id: "green-color", word: "xanh lá", speakText: "xanh lá", emoji: "🟢", color: "green" },
      { id: "blue-color", word: "xanh dương", speakText: "xanh dương", emoji: "🔵", color: "blue" },
      { id: "purple-color", word: "tím", speakText: "tím", emoji: "🟣", color: "purple" },
    ],
  },
  {
    id: "family",
    title: "Gia đình",
    subtitle: "Bé chọn đúng từ về người thân!",
    items: [
      { id: "grandma", word: "bà", speakText: "bà", emoji: "👵", color: "pink" },
      { id: "dad", word: "bố", speakText: "bố", emoji: "👨", color: "blue" },
      { id: "mom", word: "mẹ", speakText: "mẹ", emoji: "👩", color: "orange" },
      { id: "baby", word: "bé", speakText: "bé", emoji: "👧", color: "green" },
      { id: "teacher", word: "cô", speakText: "cô", emoji: "👩‍🏫", color: "purple" },
    ],
  },
];

export const bubbleLayout = [
  { left: "9%", top: "56%", delay: "0s", duration: "5.8s" },
  { left: "25%", top: "42%", delay: ".3s", duration: "6.3s" },
  { left: "43%", top: "58%", delay: ".1s", duration: "5.5s" },
  { left: "62%", top: "39%", delay: ".45s", duration: "6.1s" },
  { left: "80%", top: "55%", delay: ".15s", duration: "5.9s" },
];
