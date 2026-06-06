'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/app/lib/api';
import { toast } from 'sonner';

type Lesson = {
  id: number;
  title: string;
  slug: string;
};

type ParsedQuestion = {
  questionText: string;
  questionType: string;
  difficultyLevel: string;
  exerciseNumber?: number;
  optionsJson?: any[];
  correctAnswerJson?: any;
  explanation?: string;
  questionImageUrl?: string;
  questionAudioUrl?: string;
  explanationAudioUrl?: string;
};

const QUESTION_TYPE_MAP: Record<string, string> = {
  'trắc nghiệm 1 đáp án': 'single_choice',
  'đúng sai': 'true_false',
  'đúng/sai': 'true_false',
  'đúng / sai': 'true_false',
  'chọn theo hình ảnh': 'image_choice',
  'chọn hình': 'image_choice',
  'kéo thả': 'drag_drop',
  'drag drop': 'drag_drop',
  'sắp xếp': 'sorting',
  'sorting': 'sorting',
  'điền vào chỗ trống': 'fill_blank',
  'điền vào': 'fill_blank',
  'đếm': 'counting',
  'đếm và đếm số': 'counting',
  'tô màu': 'coloring',
  'tô chữ': 'letter_tracing',
  'tô chữ (viết tay)': 'letter_tracing',
  'letter tracing': 'letter_tracing',
  'tô số': 'trace_number',
  'tô số (viết tay)': 'trace_number',
  'trace number': 'trace_number',
  'ghép': 'matching',
  'câu nối': 'matching',
  'câu nối (chữ/ảnh)': 'matching',
  'ghép chữ với hình': 'matching',
  'trắc nghiệm nhiều đáp án': 'multiple_choice',
};

export default function ImportQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = Number(params.id);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [csvContent, setCsvContent] = useState('');
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const xlsxRef = useRef<any>(null);

  useEffect(() => {
    apiFetch<Lesson>(`/lessons/${lessonId}`)
      .then(setLesson)
      .catch(() => setError('Không tìm thấy bài học'))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        await parseExcelFile(file);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setCsvContent(content);
          parseQuestions(content);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      const msg = `Lỗi đọc file: ${err}`;
      setError(msg);
      toast.error(msg);
    }
  };

  const parseExcelFile = async (file: File) => {
    if (!xlsxRef.current) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/xlsx/dist/xlsx.full.min.js';
      script.async = true;
      script.onload = () => {
        xlsxRef.current = (window as any).XLSX;
        processExcelFile(file);
      };
      script.onerror = () => {
        const msg = 'Không thể load xlsx library. Vui lòng thử CSV hoặc Google Sheets.';
        setError(msg);
        toast.error(msg);
      };
      document.head.appendChild(script);
    } else {
      processExcelFile(file);
    }
  };

  const processExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = xlsxRef.current.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = xlsxRef.current.utils.sheet_to_csv(worksheet);
        setCsvContent(json);
        parseQuestions(json);
      } catch (err) {
        const msg = `Lỗi parse Excel: ${err}`;
        setError(msg);
        toast.error(msg);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const mapQuestionType = (typeText: string): string => {
    const normalized = typeText.toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');
    // Check specific types first (longer strings) to avoid false positives
    const specifics = [
      'trắc nghiệm nhiều đáp án', 'trắc nghiệm 1 đáp án',
      'điền vào chỗ trống', 'đếm và đếm số',
      'ghép chữ với hình', 'câu nối (chữ/ảnh)',
      'chọn theo hình ảnh',
      'kéo thả', 'sắp xếp', 'tô chữ (viết tay)', 'tô chữ',
      'tô số (viết tay)', 'tô số',
      'đúng / sai', 'đúng / sai', 'đúng sai',
    ];
    for (const key of specifics) {
      const normKey = key.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');
      if (normalized.includes(normKey)) {
        // Need to find the matching key from QUESTION_TYPE_MAP
        for (const mapKey of Object.keys(QUESTION_TYPE_MAP)) {
          const mapNormKey = mapKey.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');
          if (mapNormKey === normKey) {
            return QUESTION_TYPE_MAP[mapKey];
          }
        }
        return 'single_choice';
      }
    }
    // Fallback to generic mapping
    for (const [key, value] of Object.entries(QUESTION_TYPE_MAP)) {
      const normKey = key.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');
      if (normalized.includes(normKey)) return value;
    }
    return 'single_choice';
  };

  const mapDifficulty = (level: string): 'easy' | 'medium' | 'hard' => {
    if (!level) return 'easy';
    const l = level.toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g, '');
    // Remove diacritics for comparison: Dễ→de, Trung→trung, Khó→kho
    if (l.includes('de') || l.includes('easy') || l === '1') return 'easy';
    if (l.includes('trung') || l.includes('medium') || l === '2') return 'medium';
    if (l.includes('kho') || l.includes('hard') || l === '3') return 'hard';
    return 'easy';
  };

  // Helper: Parse CSV line respecting quoted fields
  const parseCSVLine = (line: string, delimiter: string): string[] => {
    const cells: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        // Handle escaped quotes: "" → "
        if (nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current.trim());
    return cells;
  };

  const parseQuestions = (content: string) => {
    try {
      // Skip if content looks like JSON
      if (content.includes('"{') || content.includes('type') && content.includes('correct')) {
        const msg = 'Dữ liệu này dường như là JSON. Vui lòng paste dữ liệu CSV/Excel từ Google Sheets.';
        setError(msg);
        toast.error(msg);
        return;
      }

      const lines = content.split('\n').filter(l => l.trim());
      if (lines.length < 2) {
        const msg = 'File CSV phải có tiêu đề và ít nhất 1 dòng dữ liệu';
        setError(msg);
        toast.error(msg);
        return;
      }

      // Try to detect delimiter (tab or comma)
      const firstLine = lines[0];
      const delimiter = firstLine.includes('\t') ? '\t' : ',';

      const headers = parseCSVLine(lines[0], delimiter);
      const parsed: ParsedQuestion[] = [];

      // Debug: log headers
      console.log('Headers:', headers);

      const colIndexes = {
        exerciseNumber: headers.findIndex(h => h.includes('Bài tập số') || h.includes('STT')),
        questionType: headers.findIndex(h => h.includes('Loại câu hỏi')),
        difficultyLevel: headers.findIndex(h => h.toLowerCase().includes('mức') && (h.includes('độ') || h.includes('đô')) || h.includes('difficulty')),
        questionText: headers.findIndex(h => h.includes('Nội dung câu hỏi')),
        optionA: headers.findIndex(h => h.match(/Phương\s*án\s*A/i)),
        optionB: headers.findIndex(h => h.match(/Phương\s*án\s*B/i)),
        optionC: headers.findIndex(h => h.match(/Phương\s*án\s*C/i)),
        optionD: headers.findIndex(h => h.match(/Phương\s*án\s*D/i)),
        answer: headers.findIndex(h => h.includes('Đáp án')),
        explanation: headers.findIndex(h => h.includes('Hướng dẫn') || h.includes('Giải thích')),
        dragDropData: headers.findIndex(h => h.includes('Dữ liệu kéo thả') || h.includes('Dữ liệu') && h.includes('nối')),
        imageHint: headers.findIndex(h => h.includes('Gợi ý hình ảnh') || h.includes('Hình ảnh')),
        questionAudio: headers.findIndex(h => h.includes('Audio câu hỏi')),
        answerAudio: headers.findIndex(h => h.includes('Audio đáp án')),
      };

      // Debug: log column indexes
      console.log('Column indexes:', colIndexes);

      for (let i = 1; i < lines.length; i++) {
        const cells = parseCSVLine(lines[i], delimiter);
        if (!cells[colIndexes.questionText]?.trim()) continue;

        const questionTypeText = cells[colIndexes.questionType]?.trim() || 'single_choice';
        const difficultyText = cells[colIndexes.difficultyLevel]?.trim() || 'easy';

        const mappedType = mapQuestionType(questionTypeText);
        const diffLevel = mapDifficulty(difficultyText);

        console.log(`Row ${i}: type="${questionTypeText}"→"${mappedType}", difficulty="${difficultyText}"→"${diffLevel}"`);

        const exerciseNum = colIndexes.exerciseNumber >= 0 ? parseInt(cells[colIndexes.exerciseNumber]?.trim() || '1', 10) : 1;
        const question: ParsedQuestion = {
          questionText: cells[colIndexes.questionText]?.trim() || '',
          questionType: mappedType,
          difficultyLevel: diffLevel,
          exerciseNumber: isNaN(exerciseNum) ? 1 : exerciseNum,
          explanation: cells[colIndexes.explanation]?.trim() || '',
          questionImageUrl: cells[colIndexes.imageHint]?.trim() || undefined,
          questionAudioUrl: cells[colIndexes.questionAudio]?.trim() || undefined,
          explanationAudioUrl: cells[colIndexes.answerAudio]?.trim() || undefined,
        };

        // Parse options based on question type
        const optionTexts = [
          cells[colIndexes.optionA]?.trim(),
          cells[colIndexes.optionB]?.trim(),
          cells[colIndexes.optionC]?.trim(),
          cells[colIndexes.optionD]?.trim(),
        ].filter(Boolean);

        const answerText = cells[colIndexes.answer]?.trim() || '';

        // Format according to question type
        if (mappedType === 'true_false') {
          question.optionsJson = undefined;
          question.correctAnswerJson =
            answerText.includes('Đúng') || answerText.includes('true') || answerText === 'Đúng';
        } else if (mappedType === 'single_choice' || mappedType === 'multiple_choice') {
          question.optionsJson = optionTexts.map((text, idx) => ({
            key: String.fromCharCode(65 + idx),
            text,
          }));

          if (mappedType === 'multiple_choice') {
            // Multiple answers: "A,C,D" -> ['A', 'C', 'D']
            question.correctAnswerJson = answerText
              .split(',')
              .map(s => s.trim())
              .filter(Boolean);
          } else {
            // Single answer: "A" -> "A"
            question.correctAnswerJson = answerText.split(',')[0]?.trim() || '';
          }
        } else if (mappedType === 'fill_blank') {
          // fill_blank dùng [b1], [b2]... placeholders trong câu hỏi
          // Convert _ hoặc [b1] patterns thành [b1], [b2], ...
          // Có options → convert answer key (A) to value (a)
          // Không có options → expect JSON format {"b1": "...", "b2": "..."}

          const rawQuestionText = cells[colIndexes.questionText] || '';
          const answerKey = answerText.split(',')[0]?.trim() || '';
          const answerKeyIdx = answerKey.charCodeAt(0) - 65; // A=0, B=1, ...

          // Đếm số blanks: đếm [b1] patterns hoặc underscores
          const existingBlanks = (rawQuestionText.match(/\[b\d+\]/g) || []).length;
          const underscores = (rawQuestionText.match(/_/g) || []).length;
          const blankCount = existingBlanks || underscores || 1;

          // Convert underscores to [b1], [b2], ... format
          let convertedQuestionText = rawQuestionText;
          if (underscores > 0 && existingBlanks === 0) {
            // Replace underscores with [b1], [b2], ...
            let blankIdx = 1;
            convertedQuestionText = rawQuestionText.replace(/_/g, () => `[b${blankIdx++}]`);
          }
          question.questionText = convertedQuestionText;

          if (optionTexts.length > 0) {
            // Có options: convert answer key to option value
            const correctMap: Record<string, string> = {};
            for (let i = 0; i < blankCount; i++) {
              const blankKey = `b${i + 1}`;
              // Nếu chỉ 1 blank → dùng answer key index, nếu multiple → dùng từng option lần lượt
              const optIdx = blankCount === 1 ? answerKeyIdx : i;
              const optValue = optionTexts[optIdx] || optionTexts[0] || '';
              correctMap[blankKey] = optValue;
            }

            // Set optionsJson: tạo blanks cho từng blank trong question
            question.optionsJson = Array.from({ length: blankCount }, (_, i) => ({
              key: `b${i + 1}`,
              text: '', // empty text for blanks
            }));
            question.correctAnswerJson = correctMap;
          } else {
            // Không có options: expect JSON format hoặc "b1 => a | b2 => o"
            if (answerText.startsWith('{')) {
              try {
                question.correctAnswerJson = JSON.parse(answerText);
              } catch {
                question.correctAnswerJson = { answer: answerText };
              }
            } else if (answerText.includes('=>')) {
              // Parse "b1 => a | b2 => o" format
              const map: Record<string, string> = {};
              answerText.split('|').forEach(pair => {
                const [key, val] = pair.split('=>').map(s => s.trim());
                if (key && val) map[key] = val;
              });
              question.correctAnswerJson = Object.keys(map).length > 0 ? map : { answer: answerText };
            } else {
              question.correctAnswerJson = { answer: answerText };
            }
          }
        } else if (mappedType === 'counting') {
          question.optionsJson = optionTexts.map((text, idx) => ({
            key: String.fromCharCode(65 + idx),
            text,
          }));
          question.correctAnswerJson = answerText || '0';
        } else if (mappedType === 'matching') {
          // Matching: support 2 formats
          // 1. dragDropData: "text=>pair|text=>pair" (e.g. "a=>quả táo|o=>cái ô")
          // 2. answerText: "A-pair1|B-pair2" (legacy, keys based)

          const dragDropText = cells[colIndexes.dragDropData]?.trim();
          const textToPairMap: Record<string, string> = {};

          if (dragDropText && dragDropText.includes('=>')) {
            // Parse dragDropData format: "a=>quả táo|o=>cái ô"
            dragDropText.split('|').forEach(pair => {
              const [itemText, pairText] = pair.split('=>').map(s => s.trim());
              if (itemText && pairText) {
                textToPairMap[itemText] = pairText;
              }
            });

            // Only include items that have a corresponding pair in dragDropData
            const dragDropKeys = Object.keys(textToPairMap).sort((a, b) => b.length - a.length); // Longest first
            const leftItems: { text: string; key: string; idx: number }[] = [];

            optionTexts.forEach((text, idx) => {
              // Try exact match first
              let matchedKey = dragDropKeys.find(k => text === k || text.toLowerCase() === k.toLowerCase());

              // If no exact match, try best substring match (prefer longer keys)
              if (!matchedKey && dragDropKeys.length > 0) {
                // Find key that best matches (longest key first due to sort above)
                matchedKey = dragDropKeys.find(k => text.toLowerCase().includes(k.toLowerCase()));
              }

              if (matchedKey) {
                leftItems.push({ text, key: matchedKey, idx });
              }
            });

            question.optionsJson = leftItems.map(({ text }, mapIdx) => ({
              key: String.fromCharCode(65 + mapIdx),
              text,
            }));

            // Build correctAnswerJson: map to pair text
            const pairMap: Record<string, string> = {};
            leftItems.forEach(({ key }, mapIdx) => {
              const mapKey = String.fromCharCode(65 + mapIdx);
              pairMap[mapKey] = textToPairMap[key] || '';
            });
            question.correctAnswerJson = pairMap;
          } else {
            // Legacy format: parse answerText "A-pair1|B-pair2"
            question.optionsJson = optionTexts.map((text, idx) => ({
              key: String.fromCharCode(65 + idx),
              text,
            }));

            const pairMap: Record<string, string> = {};
            const pairs = answerText.split('|');
            optionTexts.forEach((_, idx) => {
              const key = String.fromCharCode(65 + idx);
              const pairText = pairs[idx]?.split('-')[1]?.trim() || pairs[idx]?.trim() || '';
              pairMap[key] = pairText;
            });
            question.correctAnswerJson = pairMap;
          }
        } else if (mappedType === 'coloring') {
          // Coloring: items from dragDropData, answers like "A;A;B" = which item texts to color
          const coloringItemsText = cells[colIndexes.dragDropData]?.trim() || optionTexts.join('|');
          const coloringItems = coloringItemsText.split('|').map(s => s.trim()).filter(Boolean);

          question.optionsJson = coloringItems.map((text, idx) => ({
            key: String.fromCharCode(65 + idx),
            text,
          }));

          // Parse answer: "A;A;B" = color items whose text matches A or B
          // Handle both text values and indices
          const answerParts = answerText.split(';').map(s => s.trim()).filter(Boolean);
          const coloredIndices = new Set<number>();

          answerParts.forEach(part => {
            // Check if it's a single letter (text value from items)
            if (part.length >= 1) {
              // Find all indices where item text matches
              coloringItems.forEach((itemText, idx) => {
                if (itemText === part) {
                  coloredIndices.add(idx);
                }
              });
            }
            // Also support numeric indices (1-based)
            const num = parseInt(part, 10);
            if (!isNaN(num) && num >= 1 && num <= coloringItems.length) {
              coloredIndices.add(num - 1); // Convert 1-based to 0-based
            }
          });

          const coloringMap: Record<string, string> = {};
          coloringItems.forEach((_, idx) => {
            const key = String.fromCharCode(65 + idx);
            // Use 'red' for colored items, 'white' for uncolored
            coloringMap[key] = coloredIndices.has(idx) ? 'red' : 'white';
          });

          question.correctAnswerJson = coloringMap;
        } else if (mappedType === 'image_choice') {
          question.optionsJson = optionTexts.map((text, idx) => ({
            key: String.fromCharCode(65 + idx),
            text,
          }));
          question.correctAnswerJson = answerText.split(',')[0]?.trim() || '';
        } else if (mappedType === 'drag_drop' || mappedType === 'sorting') {
          // Drag drop / sorting: data like "b|a" or "Ba|có|cá"
          const dragDropText = cells[colIndexes.dragDropData]?.trim() || answerText;
          const items = dragDropText.split('|').map(s => s.trim()).filter(Boolean);
          question.optionsJson = items.map((text, idx) => ({
            key: String.fromCharCode(65 + idx),
            text,
          }));
          // correctAnswerJson: array of keys in correct order (A, B, C...)
          question.correctAnswerJson = items.map((_, idx) => String.fromCharCode(65 + idx));
        } else if (mappedType === 'letter_tracing' || mappedType === 'trace_number') {
          // Letter tracing / trace number: data like "trace:a" or "a" or "1"
          const traceText = cells[colIndexes.dragDropData]?.trim() || answerText;
          const letter = traceText.replace('trace:', '').trim();
          question.optionsJson = undefined;
          question.correctAnswerJson = { letter };
        } else {
          question.optionsJson = optionTexts.map((text, idx) => ({
            key: String.fromCharCode(65 + idx),
            text,
          }));
          question.correctAnswerJson = answerText || '';
        }

        parsed.push(question);
      }

      setQuestions(parsed);
      setError('');
      if (parsed.length > 0) {
        toast.success(`✓ Phân tích được ${parsed.length} câu hỏi`);
      }
    } catch (err) {
      const msg = `Lỗi parse: ${err}`;
      setError(msg);
      toast.error(msg);
    }
  };

  const toggleSelectQuestion = (index: number) => {
    const newSelected = new Set(selectedIndexes);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIndexes(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIndexes.size === questions.length) {
      setSelectedIndexes(new Set());
    } else {
      setSelectedIndexes(new Set(questions.map((_, i) => i)));
    }
  };

  const handleDeleteSelected = () => {
    const newQuestions = questions.filter((_, i) => !selectedIndexes.has(i));
    setQuestions(newQuestions);
    setSelectedIndexes(new Set());
    toast.success(`✓ Đã xóa ${selectedIndexes.size} câu hỏi`);
  };

  const handleImport = async () => {
    if (questions.length === 0) {
      const msg = 'Chưa có câu hỏi để import';
      setError(msg);
      toast.error(msg);
      return;
    }

    setImporting(true);
    try {
      // If questions are selected, only import selected ones
      const importIndexes = selectedIndexes.size > 0
        ? selectedIndexes
        : new Set(questions.map((_, i) => i));
      const quizToImport = questions.filter((_, i) => importIndexes.has(i));

      const response = await fetch('/api/quizzes/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          questions: quizToImport,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Remove imported questions from the list
      const remainingQuestions = questions.filter((_, i) => !importIndexes.has(i));
      setQuestions(remainingQuestions);
      setSelectedIndexes(new Set());

      toast.success(`✓ Đã import ${quizToImport.length} câu hỏi thành công!`);

      // If no more questions, go back after 1 second
      if (remainingQuestions.length === 0) {
        setTimeout(() => router.back(), 1000);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Import thất bại';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-red-600 font-bold">{error || 'Không tìm thấy bài học'}</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-bold">
          ← Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <button onClick={() => router.back()} className="text-blue-600 font-bold mb-4">
          ← Quay lại
        </button>
        <h1 className="text-3xl font-black text-slate-900 mb-2">📥 Import Câu Hỏi</h1>
        <p className="text-slate-600">Bài học: <span className="font-bold">{lesson.title}</span></p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">1. Chọn File CSV hoặc dán dữ liệu</h2>

        <div className="mb-6">
          <label className="text-sm font-bold text-slate-900 block mb-2">📎 Upload File</label>
          <input
            type="file"
            accept=".csv,.tsv,.txt,.xlsx,.xls"
            onChange={handleFileUpload}
            className="w-full px-4 py-2 rounded-xl border border-slate-300"
          />
          <p className="text-xs text-slate-500 mt-1">Hỗ trợ: CSV, TSV, TXT, Excel (.xlsx, .xls)</p>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-900 block mb-2">📋 Hoặc dán dữ liệu</label>
          <textarea
            value={csvContent}
            onChange={(e) => {
              setCsvContent(e.target.value);
              if (e.target.value) parseQuestions(e.target.value);
            }}
            placeholder="Dán dữ liệu từ Google Sheets (Ctrl+C → Ctrl+V)"
            rows={8}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 font-mono text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-3 mb-6">
          <p className="text-red-700 font-bold">❌ {error}</p>
        </div>
      )}

      {questions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">2. Preview ({questions.length} câu hỏi)</h2>
            {selectedIndexes.size > 0 && (
              <div className="flex gap-2 items-center">
                <span className="text-sm text-slate-600 font-bold">
                  Đã chọn: {selectedIndexes.size}/{questions.length}
                </span>
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                >
                  🗑️ Xóa ({selectedIndexes.size})
                </button>
              </div>
            )}
          </div>

          {/* Select All Checkbox */}
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-3">
            <input
              type="checkbox"
              checked={selectedIndexes.size === questions.length && questions.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 cursor-pointer"
            />
            <label className="text-sm font-bold text-slate-700 cursor-pointer flex-1">
              Chọn tất cả
            </label>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex gap-3 cursor-pointer transition ${
                  selectedIndexes.has(idx)
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIndexes.has(idx)}
                  onChange={() => toggleSelectQuestion(idx)}
                  className="w-4 h-4 cursor-pointer mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm">
                    {idx + 1}. {q.questionText}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Loại: <span className="font-semibold">{q.questionType}</span> |
                    Độ khó: <span className="font-semibold">{q.difficultyLevel}</span>
                  </p>

                  {q.optionsJson && q.optionsJson.length > 0 && (
                    <ul className="mt-2 ml-2 text-xs text-slate-600">
                      {q.optionsJson.map((opt: any, i: number) => (
                        <li key={i} className={q.correctAnswerJson === opt.label ? 'font-bold text-green-700' : ''}>
                          {opt.label}. {opt.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={handleImport}
              disabled={importing || questions.length === 0}
              className="flex-1 px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 disabled:opacity-50"
            >
              {importing ? '⏳ Đang import...' : `✓ Import ${selectedIndexes.size > 0 ? selectedIndexes.size : questions.length} câu hỏi`}
            </button>
            <button
              onClick={() => {
                setCsvContent('');
                setQuestions([]);
                setSelectedIndexes(new Set());
                setError('');
              }}
              className="px-6 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300"
            >
              ✕ Clear
            </button>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-300 rounded-lg px-4 py-3">
        <p className="text-blue-900 font-bold mb-2">💡 Hướng dẫn:</p>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>✓ Copy từ Google Sheets hoặc upload file CSV/Excel</li>
          <li>✓ <strong>Cột bắt buộc:</strong> Loại câu hỏi, Mục độ, Nội dung câu hỏi, Phương án A/B/C/D, Đáp án</li>
          <li>✓ <strong>Loại câu hỏi:</strong> Trắc nghiệm 1 đáp án, Đúng/Sai, Chọn theo hình ảnh, Điền vào, Ghép, Đếm, Tô màu</li>
          <li>✓ System sẽ tự động nhận diện loại câu hỏi và parse dữ liệu đúng format</li>
        </ul>
      </div>
    </div>
  );
}
