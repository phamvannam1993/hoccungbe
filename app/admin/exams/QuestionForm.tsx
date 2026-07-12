'use client';
import { useState } from 'react';
import { Plus, Trash2, Volume2, X } from 'lucide-react';
// TODO: Audio Library integration for exam questions (Phase 4)
// import AudioLibrarySelector from '../../components/AudioLibrarySelector';

export type QType = 'single_choice' | 'multiple_choice' | 'true_false' | 'matching' | 'fill_blank' | 'number_compare' | 'table_fill' | 'drag_to_position';

export interface ExamQuestion {
  id?: number;
  examId?: number;
  questionText: string;
  questionType: QType;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  optionsJson?: { key: string; text: string; pair?: string; audioUrl?: string }[];
  correctAnswerJson?: unknown;
  explanation?: string;
  questionImageUrl?: string;
  questionAudioUrl?: string;
  explanationAudioUrl?: string;
  points: number;
  sortOrder: number;
}

const TYPE_LABEL: Record<QType, string> = {
  single_choice: 'Chọn 1 đáp án',
  multiple_choice: 'Chọn nhiều đáp án',
  true_false: 'Đúng / Sai',
  matching: 'Câu nối',
  fill_blank: 'Điền vào chỗ trống',
  number_compare: 'So sánh số (> < =)',
  table_fill: 'Điền vào bảng',
  drag_to_position: 'Kéo thả vị trí',
};

interface Props {
  initial?: ExamQuestion;
  onSubmit: (q: ExamQuestion) => Promise<void>;
  onCancel: () => void;
}

const KEY_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuestionForm({ initial, onSubmit, onCancel }: Props) {
  const [q, setQ] = useState<ExamQuestion>(initial ?? {
    questionText: '',
    questionType: 'single_choice',
    difficultyLevel: 'easy',
    optionsJson: [{ key: 'A', text: '' }, { key: 'B', text: '' }],
    correctAnswerJson: 'A',
    explanation: '',
    points: 1,
    sortOrder: 1,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [audioSelectorOpen, setAudioSelectorOpen] = useState(false);
  const [audioSelectorType, setAudioSelectorType] = useState<'question' | 'explanation' | { type: 'option'; index: number } | null>(null);

  const update = <K extends keyof ExamQuestion>(k: K, v: ExamQuestion[K]) => setQ((p) => ({ ...p, [k]: v }));

  const openAudioSelector = (type: 'question' | 'explanation' | { type: 'option'; index: number }) => {
    setAudioSelectorType(type);
    setAudioSelectorOpen(true);
  };

  const handleAudioSelect = (audioUrl: string) => {
    if (!audioSelectorType) return;

    if (audioSelectorType === 'question') {
      update('questionAudioUrl', audioUrl);
    } else if (audioSelectorType === 'explanation') {
      update('explanationAudioUrl', audioUrl);
    } else if (typeof audioSelectorType === 'object' && audioSelectorType.type === 'option') {
      const opts = q.optionsJson ?? [];
      const updated = [...opts];
      updated[audioSelectorType.index] = { ...updated[audioSelectorType.index], audioUrl };
      update('optionsJson', updated);
    }

    setAudioSelectorOpen(false);
    setAudioSelectorType(null);
  };

  const setType = (t: QType) => {
    let opts: { key: string; text: string; pair?: string }[] = [];
    let correct: unknown = null;
    if (t === 'single_choice' || t === 'multiple_choice') {
      opts = [{ key: 'A', text: '' }, { key: 'B', text: '' }];
      correct = t === 'single_choice' ? 'A' : ['A'];
    } else if (t === 'true_false') {
      correct = true;
    } else if (t === 'matching') {
      opts = [{ key: 'A', text: '', pair: '' }, { key: 'B', text: '', pair: '' }];
      correct = { A: '', B: '' };
    } else if (t === 'fill_blank') {
      opts = [{ key: 'b1', text: '' }];
      correct = { b1: '' };
    } else if (t === 'number_compare') {
      correct = '>';
    } else if (t === 'table_fill') {
      opts = [{ key: 'headers', text: 'Số|Liền trước|Liền sau' }, { key: 'r1', text: '5|_a|_b' }];
      correct = { a: '4', b: '6' };
    } else if (t === 'drag_to_position') {
      opts = [{ key: '1', text: '' }, { key: '2', text: '' }];
      correct = ['1', '2'];
    }
    setQ((p) => ({ ...p, questionType: t, optionsJson: opts, correctAnswerJson: correct }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!q.questionText.trim()) { setError('Nhập câu hỏi'); return; }
    setSaving(true);
    try {
      await onSubmit(q);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  // Option editors
  const opts = q.optionsJson ?? [];
  const addOpt = () => {
    const key = q.questionType === 'drag_to_position'
      ? String(opts.length + 1)
      : q.questionType === 'fill_blank'
        ? `b${opts.length + 1}`
        : KEY_LABELS[opts.length] ?? `K${opts.length + 1}`;
    const newOpt = q.questionType === 'matching' ? { key, text: '', pair: '' } : { key, text: '' };
    update('optionsJson', [...opts, newOpt]);
  };
  const removeOpt = (i: number) => update('optionsJson', opts.filter((_, idx) => idx !== i));
  const updateOpt = (i: number, patch: Partial<{ key: string; text: string; pair: string; audioUrl: string }>) =>
    update('optionsJson', opts.map((o, idx) => idx === i ? { ...o, ...patch } : o));

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Dạng câu *</label>
          <select value={q.questionType} onChange={(e) => setType(e.target.value as QType)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none">
            {Object.entries(TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Độ khó</label>
          <select value={q.difficultyLevel} onChange={(e) => update('difficultyLevel', e.target.value as 'easy' | 'medium' | 'hard')}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none">
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Câu hỏi *</label>
        <textarea value={q.questionText} onChange={(e) => update('questionText', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none resize-y"
          placeholder={
            q.questionType === 'fill_blank' ? 'VD: 5 + [b1] = 8'
            : q.questionType === 'number_compare' ? 'VD: 7 [?] 5'
            : 'Nội dung câu hỏi...'
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">URL ảnh câu hỏi (tùy chọn)</label>
        <input type="text" value={q.questionImageUrl ?? ''}
          onChange={(e) => update('questionImageUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
          <Volume2 size={14} /> Audio đọc câu hỏi (tùy chọn)
        </label>
        <div className="flex items-center gap-2">
          {q.questionAudioUrl ? (
            <>
              <audio src={q.questionAudioUrl} controls className="h-8 flex-1 min-w-0" />
              <button
                type="button"
                onClick={() => update('questionAudioUrl', '')}
                className="shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Xóa audio"
              >
                <X size={14} />
              </button>
            </>
          ) : null}
          <button
            type="button"
            onClick={() => openAudioSelector('question')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-300 rounded-lg text-xs text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
          >
            <Volume2 size={13} />
            {q.questionAudioUrl ? 'Đổi' : 'Thêm'}
          </button>
        </div>
      </div>

      {/* Type-specific editor */}
      {(q.questionType === 'single_choice' || q.questionType === 'multiple_choice') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án</label>
          <div className="space-y-3">
            {opts.map((o, i) => {
              const isCorrect = q.questionType === 'single_choice'
                ? q.correctAnswerJson === o.key
                : Array.isArray(q.correctAnswerJson) && (q.correctAnswerJson as string[]).includes(o.key);
              return (
                <div key={i} className="p-2.5 border border-gray-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type={q.questionType === 'single_choice' ? 'radio' : 'checkbox'}
                      name="correct"
                      checked={isCorrect}
                      onChange={() => {
                        if (q.questionType === 'single_choice') {
                          update('correctAnswerJson', o.key);
                        } else {
                          const cur = Array.isArray(q.correctAnswerJson) ? (q.correctAnswerJson as string[]) : [];
                          update('correctAnswerJson', cur.includes(o.key) ? cur.filter((k) => k !== o.key) : [...cur, o.key]);
                        }
                      }}
                    />
                    <span className="w-8 text-center font-bold text-gray-600">{o.key}</span>
                    <input type="text" value={o.text}
                      onChange={(e) => updateOpt(i, { text: e.target.value })}
                      className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-sm"
                      placeholder={`Đáp án ${o.key}`}
                    />
                    {opts.length > 2 && (
                      <button type="button" onClick={() => removeOpt(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="pl-7 flex items-center gap-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Volume2 size={11} /> Audio
                    </span>
                    {o.audioUrl ? (
                      <>
                        <audio src={o.audioUrl} controls className="h-6 flex-1 min-w-0" />
                        <button
                          type="button"
                          onClick={() => updateOpt(i, { audioUrl: '' })}
                          className="shrink-0 p-1 text-gray-400 hover:text-red-500"
                          title="Xóa audio"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => openAudioSelector({ type: 'option', index: i })}
                      className="flex items-center gap-1 px-2 py-1 border border-blue-300 rounded text-xs text-blue-600 hover:bg-blue-50 shrink-0"
                    >
                      <Volume2 size={11} />
                      {o.audioUrl ? 'Đổi' : 'Thêm'}
                    </button>
                  </div>
                </div>
              );
            })}
            {opts.length < 6 && (
              <button type="button" onClick={addOpt}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                <Plus size={14} /> Thêm đáp án
              </button>
            )}
          </div>
        </div>
      )}

      {q.questionType === 'true_false' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án đúng</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="tf" checked={q.correctAnswerJson === true}
                onChange={() => update('correctAnswerJson', true)} /> Đúng
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="tf" checked={q.correctAnswerJson === false}
                onChange={() => update('correctAnswerJson', false)} /> Sai
            </label>
          </div>
        </div>
      )}

      {q.questionType === 'matching' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cặp nối</label>
          <div className="space-y-2">
            {opts.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-8 text-center font-bold text-gray-600">{o.key}</span>
                <input type="text" value={o.text}
                  onChange={(e) => updateOpt(i, { text: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                  placeholder="Vế trái" />
                <span className="text-gray-400">↔</span>
                <input type="text" value={o.pair ?? ''}
                  onChange={(e) => {
                    updateOpt(i, { pair: e.target.value });
                    const cur = (q.correctAnswerJson as Record<string, string>) ?? {};
                    update('correctAnswerJson', { ...cur, [o.key]: e.target.value });
                  }}
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                  placeholder="Vế phải (đáp án đúng)" />
                {opts.length > 2 && (
                  <button type="button" onClick={() => removeOpt(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addOpt}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
              <Plus size={14} /> Thêm cặp
            </button>
          </div>
        </div>
      )}

      {q.questionType === 'fill_blank' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Các ô trống (dùng dạng <code className="bg-gray-100 px-1">[b1]</code>, <code className="bg-gray-100 px-1">[b2]</code>... trong câu hỏi)
          </label>
          <div className="space-y-2">
            {opts.map((o, i) => {
              const map = (q.correctAnswerJson as Record<string, string>) ?? {};
              return (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={o.key}
                    onChange={(e) => updateOpt(i, { key: e.target.value })}
                    className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm font-mono"
                    placeholder="b1" />
                  <span className="text-gray-400">=</span>
                  <input type="text" value={map[o.key] ?? ''}
                    onChange={(e) => update('correctAnswerJson', { ...map, [o.key]: e.target.value })}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                    placeholder="Đáp án đúng" />
                  {opts.length > 1 && (
                    <button type="button" onClick={() => removeOpt(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={addOpt}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
              <Plus size={14} /> Thêm ô trống
            </button>
          </div>
        </div>
      )}

      {q.questionType === 'number_compare' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án (dấu so sánh)</label>
          <select value={String(q.correctAnswerJson ?? '>')}
            onChange={(e) => update('correctAnswerJson', e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none">
            <option value=">">Lớn hơn ( &gt; )</option>
            <option value="<">Nhỏ hơn ( &lt; )</option>
            <option value="=">Bằng ( = )</option>
          </select>
        </div>
      )}

      {q.questionType === 'table_fill' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cấu trúc bảng — header dùng key=<code className="bg-gray-100 px-1">headers</code>, ô trống dùng <code className="bg-gray-100 px-1">_key</code>
          </label>
          <div className="space-y-2">
            {opts.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="text" value={o.key}
                  onChange={(e) => updateOpt(i, { key: e.target.value })}
                  className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-sm font-mono" />
                <input type="text" value={o.text}
                  onChange={(e) => updateOpt(i, { text: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-sm font-mono"
                  placeholder="VD: 5|_a|_b (| phân tách cột, _ là ô trống)" />
                <button type="button" onClick={() => removeOpt(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addOpt}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
              <Plus size={14} /> Thêm dòng
            </button>
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Đáp án đúng (JSON: {`{key: "đáp án"}`})</label>
            <input type="text" value={JSON.stringify(q.correctAnswerJson ?? {})}
              onChange={(e) => { try { update('correctAnswerJson', JSON.parse(e.target.value)); } catch { /* ignore */ } }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-sm font-mono"
              placeholder='{"a": "4", "b": "6"}'
            />
          </div>
        </div>
      )}

      {q.questionType === 'drag_to_position' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Các phần tử (thứ tự đúng từ trên xuống)</label>
          <div className="space-y-2">
            {opts.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-8 text-center font-bold text-gray-600">{i + 1}</span>
                <input type="text" value={o.text}
                  onChange={(e) => updateOpt(i, { text: e.target.value })}
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500" />
                {opts.length > 2 && (
                  <button type="button" onClick={() => removeOpt(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => {
              addOpt();
              setTimeout(() => {
                const ks = (q.optionsJson ?? []).map((o) => o.key);
                update('correctAnswerJson', [...ks, String(ks.length + 1)]);
              }, 0);
            }}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
              <Plus size={14} /> Thêm
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Đáp án đúng tự động lấy thứ tự hiện tại của danh sách.</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Giải thích (tùy chọn)</label>
        <textarea value={q.explanation ?? ''}
          onChange={(e) => update('explanation', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none resize-y"
          placeholder="Giải thích sau khi học sinh chọn đáp án..."
        />
        <div className="mt-1.5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
            <Volume2 size={14} /> Audio giải thích (tùy chọn)
          </label>
          <div className="flex items-center gap-2">
            {q.explanationAudioUrl ? (
              <>
                <audio src={q.explanationAudioUrl} controls className="h-8 flex-1 min-w-0" />
                <button
                  type="button"
                  onClick={() => update('explanationAudioUrl', '')}
                  className="shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Xóa audio"
                >
                  <X size={14} />
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => openAudioSelector('explanation')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-300 rounded-lg text-xs text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
            >
              <Volume2 size={13} />
              {q.explanationAudioUrl ? 'Đổi' : 'Thêm'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Điểm</label>
          <input type="number" min={1} value={q.points}
            onChange={(e) => update('points', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Thứ tự</label>
          <input type="number" min={1} value={q.sortOrder}
            onChange={(e) => update('sortOrder', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none" />
        </div>
      </div>

      <div className="flex gap-3 pt-3 border-t border-gray-100">
        <button type="submit" disabled={saving}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Đang lưu...' : initial?.id ? 'Cập nhật' : 'Thêm câu hỏi'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50">
          Hủy
        </button>
      </div>

      {/* TODO: Audio Library Selector Modal (Phase 4) */}
      {/*
      <AudioLibrarySelector
        isOpen={audioSelectorOpen}
        onClose={() => {
          setAudioSelectorOpen(false);
          setAudioSelectorType(null);
        }}
        onSelect={(audioUrl) => handleAudioSelect(audioUrl)}
        currentAudioUrl={
          audioSelectorType === 'question'
            ? q.questionAudioUrl
            : audioSelectorType === 'explanation'
            ? q.explanationAudioUrl
            : typeof audioSelectorType === 'object' && audioSelectorType.type === 'option'
            ? (q.optionsJson?.[audioSelectorType.index]?.audioUrl)
            : undefined
        }
        allowUpload={true}
      />
      */}
    </form>
  );
}
