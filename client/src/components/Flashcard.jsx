import { useState, useEffect } from "react";

/**
 * A single flippable flashcard. Flip state resets whenever the card itself
 * changes (tracked via `cardKey`), so navigating to the next card always
 * starts on the question side.
 */
export default function Flashcard({ question, answer, cardKey }) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [cardKey]);

  function toggle() {
    setIsFlipped((f) => !f);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      onKeyDown={handleKeyDown}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? "Showing answer. Press to show question." : "Showing question. Press to reveal answer."}
      className="group relative w-full min-h-[16rem] sm:min-h-[18rem] rounded-2xl bg-white
                 border border-line shadow-card hover:shadow-cardHover
                 transition-shadow text-left cursor-pointer overflow-hidden
                 focus-visible:outline-offset-4"
    >
      <div className="card-perforation h-3 w-full bg-pine-light/40" aria-hidden="true" />

      <div className="flex flex-col items-center justify-center text-center px-6 sm:px-10 py-10 min-h-[calc(16rem-0.75rem)] sm:min-h-[calc(18rem-0.75rem)]">
        <span className="text-xs font-mono uppercase tracking-widest text-pine/70 mb-4">
          {isFlipped ? "Answer" : "Question"}
        </span>
        <p className="font-display text-xl sm:text-2xl text-ink leading-snug text-balance">
          {isFlipped ? answer : question}
        </p>
        {!isFlipped && (
          <span className="mt-6 text-sm text-ink/40 group-hover:text-ink/60 transition-colors">
            Click to reveal answer
          </span>
        )}
      </div>
    </button>
  );
}
