export default function EmptyState({ message, onRetry, onStartOver }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div
        aria-hidden="true"
        className="w-14 h-14 rounded-full bg-highlighter-light flex items-center justify-center mb-5"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="5" width="16" height="14" rx="1.5" stroke="#B8842A" strokeWidth="1.6" />
          <path d="M8 10h8M8 14h5" stroke="#B8842A" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="font-display text-xl font-semibold text-ink mb-2">
        {message || "That topic didn't produce any study material."}
      </h2>
      <p className="text-ink/50 text-sm mb-6 max-w-sm">
        Try a more specific topic, or paste in a bit more of your notes.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="bg-pine text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pine-dark transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onStartOver}
          className="border border-line text-ink font-medium px-5 py-2.5 rounded-lg hover:bg-white transition-colors"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
