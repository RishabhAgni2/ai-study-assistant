import { useState } from "react";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";

/**
 * Owns the full lifecycle of taking a quiz: answering one question at a
 * time, scoring, and — per the assignment's retry requirement — re-running
 * just the questions that were answered incorrectly.
 *
 * `activeQuestions` is whatever set is currently being taken (the full quiz
 * on the first pass, or a filtered list of previously-wrong questions on a
 * retry pass). `attemptResults` tracks correctness for the *current* pass
 * only, so retrying doesn't need to touch the original quiz data at all.
 */
export default function Quiz({ quiz, onBackToFlashcards }) {
  const [activeQuestions, setActiveQuestions] = useState(quiz);
  const [isRetryRound, setIsRetryRound] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptResults, setAttemptResults] = useState([]); // [{ id, isCorrect }]
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = activeQuestions[currentIndex];
  const isLastQuestion = currentIndex === activeQuestions.length - 1;

  function handleSelect(optionIndex) {
    setSelectedOption(optionIndex);
  }

  function handleSubmit() {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setAttemptResults((prev) => [...prev, { id: currentQuestion.id, isCorrect }]);
    setIsSubmitted(true);
  }

  function handleNext() {
    if (isLastQuestion) {
      setIsFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
    setIsSubmitted(false);
  }

  function resetAttemptState(questions, retry) {
    setActiveQuestions(questions);
    setIsRetryRound(retry);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAttemptResults([]);
    setIsFinished(false);
  }

  function handleRetryWrong() {
    const wrongIds = new Set(attemptResults.filter((r) => !r.isCorrect).map((r) => r.id));
    const wrongQuestions = activeQuestions.filter((q) => wrongIds.has(q.id));
    resetAttemptState(wrongQuestions, true);
  }

  function handleRestartFull() {
    resetAttemptState(quiz, false);
  }

  if (isFinished) {
    const correctCount = attemptResults.filter((r) => r.isCorrect).length;
    const wrongCount = attemptResults.length - correctCount;
    return (
      <QuizResult
        correctCount={correctCount}
        totalCount={attemptResults.length}
        wrongCount={wrongCount}
        isRetryRound={isRetryRound}
        onRetryWrong={handleRetryWrong}
        onRestartFull={handleRestartFull}
        onBackToFlashcards={onBackToFlashcards}
      />
    );
  }

  return (
    <QuizQuestion
      key={currentQuestion.id}
      question={currentQuestion}
      index={currentIndex}
      total={activeQuestions.length}
      selectedOption={selectedOption}
      isSubmitted={isSubmitted}
      onSelect={handleSelect}
      onSubmit={handleSubmit}
      onNext={handleNext}
      isLastQuestion={isLastQuestion}
    />
  );
}
