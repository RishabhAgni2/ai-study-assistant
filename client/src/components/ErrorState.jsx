export default function ErrorState({ message, onRetry, onStartOver }) {
  return (
    <div
      role="alert"
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div
        aria-hidden="true"
        className="w-14 h-14 rounded-full bg-incorrect/10 flex items-center justify-center mb-5"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 8v5M12 16h.01M10.3 3.6L2.6 17a1.6 1.6 0 0 0 1.4 2.4h16a1.6 1.6 0 0 0 1.4-2.4L13.7 3.6a1.6 1.6 0 0 0-2.8 0Z"
            stroke="#B3462F"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="font-display text-xl font-semibold text-ink mb-2">
        {message || "Something went wrong while generating your study set."}
      </h2>
      <p className="text-ink/50 text-sm mb-6 max-w-sm">
        This can happen if the AI is overloaded or returned something unexpected.
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
