export default function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16"
    >
      <div className="relative w-14 h-14 mb-6" aria-hidden="true">
        <div className="absolute inset-0 rounded-lg border-2 border-line" />
        <div className="absolute inset-0 rounded-lg border-2 border-pine border-t-transparent animate-spin" />
      </div>
      <p className="font-display text-lg text-ink font-medium">Creating your study set…</p>
      <p className="text-ink/50 text-sm mt-1">Turning your notes into flashcards and a quiz</p>
    </div>
  );
}
