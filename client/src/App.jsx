import { useRef, useState } from "react";
import TopicInput from "./components/TopicInput";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import FlashcardDeck from "./components/FlashcardDeck";
import Quiz from "./components/Quiz";
import { generateStudySet } from "./services/api";
import { isValidStudyData } from "./utils/validation";

// UI status states. Kept as a flat string union rather than nested booleans
// so "what should be on screen right now" is always answerable by one value.
const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  EMPTY: "empty",
};

export default function App() {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [studyData, setStudyData] = useState(null);
  const [view, setView] = useState("flashcards"); // "flashcards" | "quiz"
  const [errorMessage, setErrorMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [lastInput, setLastInput] = useState("");

  // Stale-response protection: every generate call gets a monotonically
  // increasing ID. When a response comes back, we only apply it if its ID
  // still matches the latest request that was fired. This makes the result
  // correct regardless of network arrival order — if the user fires
  // "JavaScript" then quickly "React", and the JavaScript response happens
  // to arrive second, its ID will be stale and it gets silently discarded.
  //
  // We chose request-ID comparison over AbortController: it needs no
  // signal plumbing through fetch, has no AbortError edge case to catch,
  // and the in-flight request finishing "for nothing" is a harmless,
  // acceptable cost for this app's scale. See README for more.
  const latestRequestId = useRef(0);

  async function handleGenerate(rawInput) {
    const input = rawInput.trim();

    if (!input) {
      setValidationError("Please enter a topic or some notes.");
      return;
    }

    setValidationError("");
    setLastInput(input);
    setStatus(STATUS.LOADING);

    const requestId = ++latestRequestId.current;

    let body;
    try {
      body = await generateStudySet(input);
    } catch (err) {
      if (requestId !== latestRequestId.current) return; // stale — ignore
      console.error("Network error generating study set:", err);
      setErrorMessage("Something went wrong while generating your study set.");
      setStatus(STATUS.ERROR);
      return;
    }

    if (requestId !== latestRequestId.current) return; // a newer request has since started — discard this result

    if (!body.success) {
      if (body.code === "EMPTY_RESULT") {
        setErrorMessage(body.error);
        setStatus(STATUS.EMPTY);
      } else {
        setErrorMessage(body.error || "Something went wrong while generating your study set.");
        setStatus(STATUS.ERROR);
      }
      return;
    }

    // Defense in depth: re-validate on the client even though the server
    // already validated. Protects the UI if the API contract ever drifts.
    if (!isValidStudyData(body.data)) {
      console.error("Client-side validation rejected server data:", body.data);
      setErrorMessage("We couldn't process the generated study content.");
      setStatus(STATUS.ERROR);
      return;
    }

    setStudyData(body.data);
    setView("flashcards");
    setStatus(STATUS.SUCCESS);
  }

  function handleRetry() {
    handleGenerate(lastInput);
  }

  function handleStartOver() {
    setStatus(STATUS.IDLE);
    setStudyData(null);
    setErrorMessage("");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-line bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={handleStartOver}
            className="flex items-center gap-2 font-display font-semibold text-pine-dark"
          >
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <rect x="4" y="6" width="24" height="20" rx="2" fill="#2F5D50" />
              <line x1="8" y1="12" x2="24" y2="12" stroke="#E8A33D" strokeWidth="2" />
              <line x1="8" y1="17" x2="20" y2="17" stroke="#F4F1E8" strokeWidth="2" opacity="0.6" />
              <line x1="8" y1="21" x2="16" y2="21" stroke="#F4F1E8" strokeWidth="2" opacity="0.6" />
            </svg>
            StudyFlow
          </button>

          {status === STATUS.SUCCESS && studyData && (
            <div className="flex items-center gap-4">
              <nav className="flex gap-1 bg-paper rounded-lg p-1 border border-line" aria-label="Study set view">
                <button
                  onClick={() => setView("flashcards")}
                  aria-current={view === "flashcards" ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    view === "flashcards" ? "bg-white shadow-sm text-ink" : "text-ink/50 hover:text-ink"
                  }`}
                >
                  Flashcards
                </button>
                <button
                  onClick={() => setView("quiz")}
                  aria-current={view === "quiz" ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    view === "quiz" ? "bg-white shadow-sm text-ink" : "text-ink/50 hover:text-ink"
                  }`}
                >
                  Quiz
                </button>
              </nav>
              <button
                onClick={handleStartOver}
                className="text-sm font-medium text-ink/50 hover:text-ink transition-colors hidden sm:block"
              >
                New topic
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {status === STATUS.IDLE && (
          <TopicInput
            onGenerate={handleGenerate}
            isLoading={false}
            validationError={validationError}
          />
        )}

        {status === STATUS.LOADING && <LoadingState />}

        {status === STATUS.ERROR && (
          <ErrorState message={errorMessage} onRetry={handleRetry} onStartOver={handleStartOver} />
        )}

        {status === STATUS.EMPTY && (
          <EmptyState message={errorMessage} onRetry={handleRetry} onStartOver={handleStartOver} />
        )}

        {status === STATUS.SUCCESS && studyData && (
          <div>
            <div className="max-w-2xl mx-auto px-4 pt-8 text-center">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
                {studyData.title}
              </h1>
              <p className="text-ink/60 mt-2 text-sm sm:text-base">{studyData.summary}</p>
            </div>

            {view === "flashcards" ? (
              <FlashcardDeck
                flashcards={studyData.flashcards}
                onSwitchToQuiz={() => setView("quiz")}
              />
            ) : (
              <Quiz quiz={studyData.quiz} onBackToFlashcards={() => setView("flashcards")} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
