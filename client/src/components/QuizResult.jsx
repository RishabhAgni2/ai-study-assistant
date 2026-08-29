export default function QuizResult({
  correctCount,
  totalCount,
  wrongCount,
  onRetryWrong,
  onRestartFull,
  onBackToFlashcards,
  isRetryRound,
}) {
  const allCorrect = wrongCount === 0;

  return (
    <div className="max-w-xl mx-auto px-4 py-14 sm:py-20 text-center">
      <span className="text-xs font-mono uppercase tracking-widest text-ink/40">
        {isRetryRound ? "Retry results" : "Quiz complete"}
      </span>

      <p className="font-display text-5xl sm:text-6xl font-semibold text-ink mt-3 mb-2">
        {correctCount}/{totalCount}
      </p>
      <p className="text-ink/60 mb-8">
        {allCorrect
          ? "Perfect score — nice work."
          : `${correctCount} correct, ${wrongCount} to review.`}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {!allCorrect && (
          <button
            onClick={onRetryWrong}
            className="px-5 py-2.5 rounded-lg bg-pine text-white font-semibold hover:bg-pine-dark transition-colors"
          >
            Retry Wrong Answers ({wrongCount})
          </button>
        )}
        <button
          onClick={onRestartFull}
          className="px-5 py-2.5 rounded-lg border border-line font-medium text-ink hover:bg-white transition-colors"
        >
          Restart full quiz
        </button>
        <button
          onClick={onBackToFlashcards}
          className="px-5 py-2.5 rounded-lg border border-line font-medium text-ink hover:bg-white transition-colors"
        >
          Back to flashcards
        </button>
      </div>
    </div>
  );
}
