'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import LetterTracingGame, { type LetterTracingGameRef } from '../../games/letter-tracing/LetterTracingGame';

interface QuestionLetterTracingProps {
  letter: string;
  instruction?: string; // e.g., "Tô theo nét câu: Mai ăn na."
  onScoreReady?: (score: number) => void;
}

export interface QuestionLetterTracingRef {
  getScore: () => number;
}

/**
 * Letter tracing component optimized for quiz questions.
 * - Displays instruction text
 * - Shows only the target letter
 * - Hides letter selection grid
 * - Hides "Chữ tiếp theo" (next letter) button
 * - Keeps "Làm lại" (reset) button
 */
const QuestionLetterTracing = forwardRef<QuestionLetterTracingRef, QuestionLetterTracingProps>(
  function QuestionLetterTracing({ letter, instruction, onScoreReady }, ref) {
    const gameRef = React.useRef<LetterTracingGameRef>(null);

    useImperativeHandle(ref, () => ({
      getScore: () => gameRef.current?.getScore() ?? 0,
    }), []);

    return (
      <div className="w-full">
        {instruction && (
          <div className="text-center mb-4 text-gray-700 font-medium">
            {instruction}
          </div>
        )}
        <div className="flex justify-center py-4">
          <LetterTracingGame
            ref={gameRef}
            letter={letter}
            onScoreReady={onScoreReady}
            displayMode="question"
          />
        </div>
      </div>
    );
  }
);

QuestionLetterTracing.displayName = 'QuestionLetterTracing';
export default QuestionLetterTracing;
