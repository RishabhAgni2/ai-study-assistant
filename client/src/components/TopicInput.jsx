import { useState } from "react";

const EXAMPLE_TOPICS = [
  "JavaScript Promises",
  "Operating System Process Scheduling",
  "Computer Networks: TCP/IP",
  "React Hooks",
];

const MAX_LENGTH = 4000;

/**
 * The home screen. Owns only the textarea's local draft value — the actual
 * "generate" action and its validation error are lifted to App so the same
 * error state can be shown consistently regardless of what triggered it.
 */
export default function TopicInput({ onGenerate, isLoading, validationError }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onGenerate(value);
  }

  function handleExampleClick(topic) {
    setValue(topic);
  }

  return (
    <div className="bg-grid min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-5">
            <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
              <rect x="4" y="6" width="24" height="20" rx="2" fill="#2F5D50" />
              <line x1="8" y1="12" x2="24" y2="12" stroke="#E8A33D" strokeWidth="2" />
              <line x1="8" y1="17" x2="20" y2="17" stroke="#F4F1E8" strokeWidth="2" opacity="0.6" />
              <line x1="8" y1="21" x2="16" y2="21" stroke="#F4F1E8" strokeWidth="2" opacity="0.6" />
            </svg>
            <span className="font-display font-semibold text-xl text-pine-dark">StudyFlow</span>
          </div>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-ink leading-tight text-balance">
            Turn any topic into flashcards and a quiz
          </h1>
          <p className="mt-3 text-ink/60 text-base sm:text-lg max-w-lg mx-auto">
            Paste your notes or type a subject. StudyFlow builds a study set you can
            actually practice with — not another chat window.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-line shadow-card p-4 sm:p-6"
        >
          <label htmlFor="topic-input" className="sr-only">
            Paste your notes or enter a topic
          </label>
          <textarea
            id="topic-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste your notes or enter a topic…"
            rows={5}
            maxLength={MAX_LENGTH}
            disabled={isLoading}
            className="w-full resize-none rounded-lg border border-line bg-paper/60 px-4 py-3
                       text-ink placeholder:text-ink/40 focus:bg-white
                       disabled:opacity-60 disabled:cursor-not-allowed
                       text-base leading-relaxed"
          />

          <div className="flex items-center justify-between mt-1 mb-4">
            <span className="text-xs text-ink/40 font-mono">
              {value.length}/{MAX_LENGTH}
            </span>
          </div>

          {validationError && (
            <p role="alert" className="text-incorrect text-sm mb-4 font-medium">
              {validationError}
            </p>
          )}

          <div className="mb-5">
            <p className="text-xs uppercase tracking-wide text-ink/40 font-semibold mb-2">
              Or try an example
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleExampleClick(topic)}
                  disabled={isLoading}
                  className="text-sm px-3 py-1.5 rounded-full border border-line bg-pine-light/50
                             text-pine-dark hover:bg-pine-light hover:border-pine/30
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                       bg-pine text-white font-semibold px-6 py-3 rounded-lg
                       hover:bg-pine-dark active:scale-[0.99] transition-all
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isLoading ? "Creating your study set…" : "Generate study set"}
          </button>
        </form>
      </div>
    </div>
  );
}
