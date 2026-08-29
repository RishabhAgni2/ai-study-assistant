import { useState } from "react";
import Flashcard from "./Flashcard";

export default function FlashcardDeck({ flashcards, onSwitchToQuiz }) {
  const [index, setIndex] = useState(0);
  const total = flashcards.length;
  const current = flashcards[index];

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    setIndex((i) => Math.min(total - 1, i + 1));
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  }

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-10 sm:py-14"
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-sm text-ink/50">
          Card {index + 1} of {total}
        </span>
        <div className="flex gap-1" aria-hidden="true">
          {flashcards.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-pine" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
      </div>

      <Flashcard
        key={current.id}
        cardKey={current.id}
        question={current.question}
        answer={current.answer}
      />

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="px-4 py-2.5 rounded-lg border border-line font-medium text-ink
                     hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        {index === total - 1 ? (
          <button
            onClick={onSwitchToQuiz}
            className="px-5 py-2.5 rounded-lg bg-highlighter text-ink font-semibold
                       hover:brightness-95 transition-all"
          >
            Take the quiz →
          </button>
        ) : (
          <button
            onClick={goNext}
            className="px-4 py-2.5 rounded-lg bg-pine text-white font-medium
                       hover:bg-pine-dark transition-colors"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
