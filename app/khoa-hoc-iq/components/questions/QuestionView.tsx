'use client';

import type { AnswerState, Question } from '../../lib/types';
import ChoiceQuestion from './ChoiceQuestion';
import FillBlankQuestion from './FillBlankQuestion';
import InputQuestion from './InputQuestion';
import MatchQuestion from './MatchQuestion';
import OrderQuestion from './OrderQuestion';
import PickOrderQuestion from './PickOrderQuestion';
import PuzzleQuestion from './PuzzleQuestion';
import RevealMatchQuestion from './RevealMatchQuestion';

export const QUESTION_TYPE_LABEL: Record<Question['type'], string> = {
  choice: 'Trắc nghiệm',
  multi_choice: 'Chọn nhiều đáp án',
  input: 'Điền đáp án',
  match: 'Nối cặp',
  match_vertical: 'Nối trên – dưới',
  match_multi: 'Nối vào nhóm',
  reveal_match: 'Lật ô ghép đôi',
  fill_blank: 'Điền vào chỗ trống',
  order: 'Kéo thả sắp xếp',
  pick_order: 'Xếp thẻ thành câu',
  puzzle: 'Ghép hình',
};

type Props = { q: Question; done: boolean; verdict?: 'correct' | 'wrong' | 'timeout' | null; onChange: (s: AnswerState) => void };

export default function QuestionView({ q, done, verdict, onChange }: Props) {
  switch (q.type) {
    case 'choice':
    case 'multi_choice':
      return <ChoiceQuestion q={q} done={done} onChange={onChange} />;
    case 'input':
      return <InputQuestion q={q} done={done} verdict={verdict} onChange={onChange} />;
    case 'match':
    case 'match_vertical':
    case 'match_multi':
      return <MatchQuestion q={q} done={done} onChange={onChange} />;
    case 'reveal_match':
      return <RevealMatchQuestion q={q} done={done} onChange={onChange} />;
    case 'fill_blank':
      return <FillBlankQuestion q={q} done={done} onChange={onChange} />;
    case 'order':
      return <OrderQuestion q={q} done={done} onChange={onChange} />;
    case 'pick_order':
      return <PickOrderQuestion q={q} done={done} verdict={verdict} onChange={onChange} />;
    case 'puzzle':
      return <PuzzleQuestion q={q} done={done} onChange={onChange} />;
  }
}
