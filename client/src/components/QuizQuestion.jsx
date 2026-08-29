const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

export default function QuizQuestion({
  question,
  index,
  total,
  selectedOption,
  isSubmitted,
  onSelect,
  onSubmit,
  onNext,
  isLastQuestion,
}) {
  const isCorrect = isSubmitted && selectedOption === question.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-sm text-ink/50">
          Question {index + 1} of {total}
        </span>
        <div className="flex gap-1" aria-hidden="true">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-pine" : i < index ? "w-1.5 bg-pine/40" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-card p-6 sm:p-8">
        <p className="font-display text-xl sm:text-2xl text-ink leading-snug mb-6 text-balance">
          {question.question}
        </p>

        <fieldset disabled={isSubmitted}>
          <legend className="sr-only">Answer options</legend>
          <div className="flex flex-col gap-3">
            {question.options.map((option, i) => {
              const isSelected = selectedOption === i;
              const isCorrectOption = i === question.correctAnswer;

              let stateClasses = "border-line hover:border-pine/40 hover:bg-pine-light/20";
              if (isSubmitted) {
                if (isCorrectOption) {
                  stateClasses = "border-correct bg-correct/10";
                } else if (isSelected && !isCorrectOption) {
                  stateClasses = "border-incorrect bg-incorrect/10";
                } else {
                  stateClasses = "border-line opacity-60";
                }
              } else if (isSelected) {
                stateClasses = "border-pine bg-pine-light/40";
              }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-pressed={isSelected}
                  className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border-2
                              transition-colors disabled:cursor-not-allowed ${stateClasses}`}
                >
                  <span
                    className="flex-none w-7 h-7 rounded-full bg-white border border-line
                               flex items-center justify-center text-xs font-mono font-semibold text-ink/70"
                    aria-hidden="true"
                  >
                    {OPTION_LABELS[i]}
                  </span>
                  <span className="text-ink font-medium">{option}</span>
                  {isSubmitted && isCorrectOption && (
                    <span className="ml-auto text-correct text-sm font-semibold">Correct</span>
                  )}
                  {isSubmitted && isSelected && !isCorrectOption && (
                    <span className="ml-auto text-incorrect text-sm font-semibold">Your answer</span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        {isSubmitted && (
          <div
            role="status"
            className={`mt-6 rounded-xl p-4 border ${
              isCorrect ? "border-correct/30 bg-correct/5" : "border-incorrect/30 bg-incorrect/5"
            }`}
          >
            <p className={`font-semibold mb-1 ${isCorrect ? "text-correct" : "text-incorrect"}`}>
              {isCorrect ? "Correct!" : "Not quite."}
            </p>
            {question.explanation && (
              <p className="text-ink/70 text-sm leading-relaxed">{question.explanation}</p>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          {!isSubmitted ? (
            <button
              onClick={onSubmit}
              disabled={selectedOption === null}
              className="px-5 py-2.5 rounded-lg bg-pine text-white font-semibold
                         hover:bg-pine-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-5 py-2.5 rounded-lg bg-highlighter text-ink font-semibold hover:brightness-95 transition-all"
            >
              {isLastQuestion ? "See results →" : "Next question →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
