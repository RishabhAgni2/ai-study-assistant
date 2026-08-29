/**
 * validateStudyData
 * -------------------
 * The single source of truth for "is this a study set we can safely render?"
 *
 * The LLM is asked to return JSON matching a schema, but nothing guarantees
 * it will. It might wrap the JSON in prose, omit a field, return the wrong
 * type, hand back an empty array, or invent an out-of-range answer index.
 * This function is the gate between "whatever the model said" and "what the
 * rest of the app is allowed to assume is true".
 *
 * It never throws. It always returns { valid, errors, data }, where `data`
 * is the cleaned/normalized study set on success, and null on failure.
 * Callers decide what to do with the errors (log them, show a retry, etc).
 */

const MIN_FLASHCARDS = 1;
const MIN_QUIZ_QUESTIONS = 1;
const QUIZ_OPTION_COUNT = 4;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateFlashcard(card, index, errors) {
  const path = `flashcards[${index}]`;
  if (typeof card !== "object" || card === null || Array.isArray(card)) {
    errors.push(`${path} is not an object`);
    return null;
  }
  if (!isNonEmptyString(card.question)) {
    errors.push(`${path}.question is missing or not a non-empty string`);
    return null;
  }
  if (!isNonEmptyString(card.answer)) {
    errors.push(`${path}.answer is missing or not a non-empty string`);
    return null;
  }
  return {
    id: `fc-${index + 1}`,
    question: card.question.trim(),
    answer: card.answer.trim(),
  };
}

function validateQuizQuestion(question, index, errors) {
  const path = `quiz[${index}]`;
  if (typeof question !== "object" || question === null || Array.isArray(question)) {
    errors.push(`${path} is not an object`);
    return null;
  }
  if (!isNonEmptyString(question.question)) {
    errors.push(`${path}.question is missing or not a non-empty string`);
    return null;
  }
  if (!Array.isArray(question.options) || question.options.length !== QUIZ_OPTION_COUNT) {
    errors.push(`${path}.options must be an array of exactly ${QUIZ_OPTION_COUNT} strings`);
    return null;
  }
  if (!question.options.every(isNonEmptyString)) {
    errors.push(`${path}.options contains an empty or non-string value`);
    return null;
  }
  const correctAnswer = question.correctAnswer;
  if (
    typeof correctAnswer !== "number" ||
    !Number.isInteger(correctAnswer) ||
    correctAnswer < 0 ||
    correctAnswer >= question.options.length
  ) {
    errors.push(`${path}.correctAnswer must be an integer index within options`);
    return null;
  }
  return {
    id: `q-${index + 1}`,
    question: question.question.trim(),
    options: question.options.map((opt) => opt.trim()),
    correctAnswer,
    explanation: isNonEmptyString(question.explanation) ? question.explanation.trim() : "",
  };
}

export function validateStudyData(raw) {
  const errors = [];

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { valid: false, errors: ["Response is not a JSON object"], data: null, code: "MALFORMED_SHAPE" };
  }

  // Distinguish "the model returned genuinely nothing" from "the model
  // returned something, but it's shaped wrong" — the frontend shows a
  // different, more specific message for each.
  const looksEmpty =
    (raw.flashcards === undefined || (Array.isArray(raw.flashcards) && raw.flashcards.length === 0)) &&
    (raw.quiz === undefined || (Array.isArray(raw.quiz) && raw.quiz.length === 0));

  if (!isNonEmptyString(raw.title)) {
    errors.push("title is missing or not a non-empty string");
  }
  if (!isNonEmptyString(raw.summary)) {
    errors.push("summary is missing or not a non-empty string");
  }
  if (!Array.isArray(raw.flashcards)) {
    errors.push("flashcards is missing or not an array");
  }
  if (!Array.isArray(raw.quiz)) {
    errors.push("quiz is missing or not an array");
  }

  // Stop early if the top-level shape is already broken — no point
  // descending into arrays that don't exist.
  if (errors.length > 0) {
    return { valid: false, errors, data: null, code: looksEmpty ? "EMPTY_RESULT" : "MALFORMED_SHAPE" };
  }

  const flashcards = raw.flashcards
    .map((card, i) => validateFlashcard(card, i, errors))
    .filter(Boolean);

  const quiz = raw.quiz
    .map((q, i) => validateQuizQuestion(q, i, errors))
    .filter(Boolean);

  if (flashcards.length < MIN_FLASHCARDS) {
    errors.push(`At least ${MIN_FLASHCARDS} valid flashcard is required, got ${flashcards.length}`);
  }
  if (quiz.length < MIN_QUIZ_QUESTIONS) {
    errors.push(`At least ${MIN_QUIZ_QUESTIONS} valid quiz question is required, got ${quiz.length}`);
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      data: null,
      code: flashcards.length === 0 && quiz.length === 0 ? "EMPTY_RESULT" : "MALFORMED_SHAPE",
    };
  }

  return {
    valid: true,
    errors: [],
    code: null,
    data: {
      title: raw.title.trim(),
      summary: raw.summary.trim(),
      flashcards,
      quiz,
    },
  };
}
