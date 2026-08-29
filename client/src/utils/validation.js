/**
 * The backend already validates the AI's output (see
 * server/utils/validateStudyData.js) and only ever forwards a clean shape.
 * This client-side check exists as a second, independent layer: it's cheap,
 * it protects the UI if the API contract ever drifts, and it means the
 * rendering components below can trust their props completely instead of
 * sprinkling defensive `?.` checks through the flashcard/quiz UI.
 */

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidStudyData(data) {
  if (typeof data !== "object" || data === null) return false;
  if (!isNonEmptyString(data.title) || !isNonEmptyString(data.summary)) return false;

  if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) return false;
  const flashcardsValid = data.flashcards.every(
    (card) =>
      card &&
      isNonEmptyString(card.id) &&
      isNonEmptyString(card.question) &&
      isNonEmptyString(card.answer)
  );
  if (!flashcardsValid) return false;

  if (!Array.isArray(data.quiz) || data.quiz.length === 0) return false;
  const quizValid = data.quiz.every(
    (q) =>
      q &&
      isNonEmptyString(q.id) &&
      isNonEmptyString(q.question) &&
      Array.isArray(q.options) &&
      q.options.length >= 2 &&
      q.options.every(isNonEmptyString) &&
      Number.isInteger(q.correctAnswer) &&
      q.correctAnswer >= 0 &&
      q.correctAnswer < q.options.length
  );
  if (!quizValid) return false;

  return true;
}
