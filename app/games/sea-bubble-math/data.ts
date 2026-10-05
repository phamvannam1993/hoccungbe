export type BubbleLevel = {
  id: number;
  left: number;
  op: "+" | "-";
  right: number;
  answer: number;
  choices: number[];
};

/**
 * Generate unlimited questions with progressive difficulty based on question count
 * Q0-9: Addition/subtraction within 5
 * Q10-29: Addition/subtraction within 10
 * Q30-49: Addition/subtraction within 20
 * Q50-69: Addition/subtraction within 30
 * Q70+: Progressive increase (50, 100, ...)
 */
export function generateQuestion(questionNumber: number, streak: number): BubbleLevel {
  let left: number;
  let right: number;
  let op: "+" | "-";
  let minNum: number;
  let maxNum: number;
  let useSubtraction: boolean;

  // Determine range based on question number
  if (questionNumber < 10) {
    // Q0-9: Range 1-5, mostly addition
    minNum = 1;
    maxNum = 5;
    useSubtraction = Math.random() > 0.6; // 40% subtraction
  } else if (questionNumber < 30) {
    // Q10-29: Range 1-10, addition and subtraction
    minNum = 1;
    maxNum = 10;
    useSubtraction = Math.random() > 0.5; // 50% subtraction
  } else if (questionNumber < 50) {
    // Q30-49: Range 1-20, addition and subtraction
    minNum = 1;
    maxNum = 20;
    useSubtraction = Math.random() > 0.45; // 55% subtraction
  } else if (questionNumber < 70) {
    // Q50-69: Range 1-30, addition and subtraction
    minNum = 1;
    maxNum = 30;
    useSubtraction = Math.random() > 0.4; // 60% subtraction
  } else {
    // Q70+: Progressive difficulty - range increases every 20 questions
    const level = Math.floor((questionNumber - 70) / 20);
    const progressiveMax = [50, 100, 150, 200][Math.min(level, 3)];
    minNum = 1;
    maxNum = progressiveMax;
    useSubtraction = Math.random() > 0.35; // 65% subtraction
  }

  // Generate the numbers
  if (useSubtraction) {
    // Subtraction: ensure left >= right so answer is positive
    left = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    right = Math.floor(Math.random() * (left - minNum + 1)) + minNum;
    op = "-";
  } else {
    // Addition
    left = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    right = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    op = "+";
  }

  const answer = op === "+" ? left + right : left - right;

  // Generate 4 choices with smart distractors
  const choices: Set<number> = new Set([answer]);

  while (choices.size < 4) {
    let choice: number;
    const rand = Math.random();

    if (rand < 0.35) {
      // Off by small amount (common mistakes)
      const offset = Math.floor(Math.random() * 3) + 1;
      choice = answer + (Math.random() > 0.5 ? offset : -offset);
    } else if (rand < 0.65) {
      // Common mistake: forgot operation or calculated wrong
      if (op === "+") {
        choice = left + left; // doubled first number
      } else {
        choice = left; // forgot subtraction
      }
    } else {
      // Completely different number
      const range = Math.max(answer + 10, 30);
      choice = Math.floor(Math.random() * range);
    }

    if (choice > 0 && choice !== answer && choice < 100) {
      choices.add(choice);
    }
  }

  // Shuffle choices
  const choicesArray = Array.from(choices).sort(() => Math.random() - 0.5);

  return {
    id: questionNumber,
    left,
    op,
    right,
    answer,
    choices: choicesArray,
  };
}
