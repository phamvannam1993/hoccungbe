"use client";

import { useEffect, useMemo, useState } from "react";
import { missingLetterLevels, Question } from "./data";
import { speakText } from "@/app/components/edu/utils/speech";
import styles from "./MissingLetterGame.module.css";

type Status = "playing" | "correct" | "wrong" | "done";

export default function MissingLetterGame() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("playing");
  const [score, setScore] = useState(0);

  // Flatten all questions from all levels into one array
  const allQuestions = useMemo(() => {
    const questions: (Question & { levelName: string })[] = [];
    missingLetterLevels.forEach((level) => {
      level.questions.forEach((q) => {
        questions.push({ ...q, levelName: level.name });
      });
    });
    return questions;
  }, []);

  const question = allQuestions[questionIndex];
  const totalQuestions = allQuestions.length;
  const progress = useMemo(() => ((questionIndex + (status === "correct" ? 1 : 0)) / totalQuestions) * 100, [questionIndex, status, totalQuestions]);

  useEffect(() => {
    setSelected(null);
    setStatus("playing");
  }, [questionIndex]);

  useEffect(() => {
    if (status === "correct") {
      setTimeout(() => {
        speakText("Đúng rồi! Con trả lời rất giỏi.");
      }, 300);
    } else if (status === "wrong") {
      setTimeout(() => {
        speakText("Sai rồi. Thử lại nhé.");
      }, 300);
    }
  }, [status]);

  // Auto-read hint when question changes
  useEffect(() => {
    if (question && status === "playing") {
      setTimeout(() => {
        const questionNum = questionIndex + 1;
        speakText(`Câu số ${questionNum}. Tìm chữ bị mất. ${question.hint}.`);
      }, 400);
    }
  }, [questionIndex, question, status]);

  const isCorrect = (answer: string | string[]): boolean => {
    if (!question) return false;
    if (Array.isArray(answer)) {
      return Array.isArray(question.answer) && (answer as string[]).every(a => (question.answer as string[]).includes(a));
    }
    return answer === question.answer;
  };

  const choose = (letter: string) => {
    if (status !== "playing" || !question) return;
    setSelected(letter);

    if (isCorrect(letter)) {
      setStatus("correct");
      setScore((s) => s + 1);
      window.setTimeout(() => {
        if (questionIndex < totalQuestions - 1) {
          setQuestionIndex((i) => i + 1);
        } else {
          setStatus("done");
        }
      }, 1100);
    } else {
      setStatus("wrong");
      window.setTimeout(() => {
        setSelected(null);
        setStatus("playing");
      }, 850);
    }
  };

  const restart = () => {
    setQuestionIndex(0);
    setSelected(null);
    setStatus("playing");
    setScore(0);
  };

  const speak = () => {
    if (question) {
      speakText(`Tìm chữ bị mất. ${question.hint}.`);
    }
  };

  if (!question) return null;

  const renderQuestion = () => {
    if (!question) return null;

    if (question.type === "scramble") {
      return (
        <div className={styles.scrambleQuestion}>
          <div className={styles.questionText}>
            {status === "playing" && "Sắp xếp chữ cái để tạo từ"}
            {status === "correct" && <span className={styles.correctText}>Đúng rồi! Con giỏi lắm.</span>}
            {status === "wrong" && <span className={styles.wrongText}>Chưa đúng, thử lại nhé.</span>}
          </div>
          <div className={styles.pictureCard}>
            <div className={styles.bigImage}>{question.emoji}</div>
            <div className={styles.hintText}>{question.hint}</div>
          </div>
          <div className={styles.wordDisplay}>{(Array.isArray(question.question) ? question.question : [question.question]).join(" ")}</div>
        </div>
      );
    }

    return (
      <div className={styles.missingQuestion}>
        <div className={styles.questionText}>
          {status === "playing" && "Điền chữ còn thiếu"}
          {status === "correct" && <span className={styles.correctText}>Đúng rồi! Con giỏi lắm.</span>}
          {status === "wrong" && <span className={styles.wrongText}>Chưa đúng, thử lại nhé.</span>}
        </div>
        <div className={styles.pictureCard}>
          <div className={styles.bigImage}>{question.emoji}</div>
          <div className={styles.hintText}>{question.hint}</div>
        </div>
        <div className={`${styles.wordBox} ${status === "wrong" ? styles.shake : ""}`}>
          {(typeof question.question === "string" ? question.question.split("") : question.question).map((char, idx) => (
            <div key={idx} className={`${styles.letterBox} ${char === "_" ? styles.missingBox : ""}`}>
              {char === "_" ? "?" : char}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className={styles.app}>
      <section className={styles.modal}>
        <header className={styles.header}>
          <div>
            <h1>📝 Tìm Chữ Bị Mất</h1>
            <p>Cấp độ: {question?.levelName} • {question?.emoji}</p>
          </div>
          <button className={styles.closeButton} onClick={restart}>×</button>
        </header>

        <div className={styles.board}>
          <div className={styles.skyGlow} />
          <div className={styles.cloudOne} />
          <div className={styles.cloudTwo} />
          <div className={styles.cloudThree} />
          <div className={styles.grass} />

          <div className={styles.topHud}>
            <div className={styles.levelBadge}>Câu {questionIndex + 1}/{totalQuestions}</div>
            <div className={styles.progressWrap}><span style={{ width: `${progress}%` }} /></div>
            <button className={styles.audioButton} onClick={speak}>🔊</button>
          </div>

          {status === "done" ? (
            <div className={styles.resultCard}>
              <div className={styles.resultIcon}>🏆</div>
              <h2>Hoàn thành rồi!</h2>
              <p>Con đã làm đúng <strong>{score}</strong> / {totalQuestions} câu.</p>
              <button onClick={restart}>Chơi lại</button>
            </div>
          ) : (
            <>
              {renderQuestion()}
              <div className={styles.choices}>
                {question?.choices.map((choice) => {
                  const isSelected = selected === choice;
                  const correct = status === "correct" && isCorrect(choice);
                  const wrong = status === "wrong" && isSelected;

                  return (
                    <button
                      key={choice}
                      className={`${styles.choiceButton} ${isSelected ? styles.selectedChoice : ""} ${correct ? styles.correctChoice : ""} ${wrong ? styles.wrongChoice : ""}`}
                      onClick={() => choose(choice)}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
