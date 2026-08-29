import { generateStudySet } from "../services/gemini.service.js";
import { validateStudyData } from "../utils/validateStudyData.js";

const MAX_INPUT_LENGTH = 4000;

function sendError(res, status, message, code = "UNKNOWN") {
  // Never forward internal error details or stack traces to the client —
  // just a stable machine-friendly-ish message and code the frontend can
  // branch on (e.g. to show an empty state vs. a generic error state).
  res.status(status).json({ success: false, error: message, code });
}

export async function generateStudySetHandler(req, res) {
  const input = typeof req.body?.input === "string" ? req.body.input.trim() : "";

  if (!input) {
    return sendError(res, 400, "Please enter a topic or some notes.", "EMPTY_INPUT");
  }

  if (input.length > MAX_INPUT_LENGTH) {
    return sendError(
      res,
      400,
      `That's a lot of notes — please keep input under ${MAX_INPUT_LENGTH} characters.`,
      "INPUT_TOO_LONG"
    );
  }

  let raw;
  try {
    raw = await generateStudySet(input);
  } catch (err) {
    console.error("[ai.controller] generateStudySet failed:", err.code, err.message);

    if (err.code === "EMPTY_RESPONSE") {
      return sendError(res, 502, "The AI didn't return any study content. Please try again.", "EMPTY_RESULT");
    }
    if (err.code === "MALFORMED_JSON") {
      return sendError(res, 502, "We couldn't process the generated study content.", "MALFORMED_SHAPE");
    }
    // PROVIDER_ERROR or anything unexpected
    return sendError(res, 502, "Something went wrong while generating your study set.", "PROVIDER_ERROR");
  }

  const { valid, errors, data, code } = validateStudyData(raw);

  if (!valid) {
    console.error("[ai.controller] Validation failed:", errors);
    const message =
      code === "EMPTY_RESULT"
        ? "The AI came back without any flashcards or quiz questions. Try adding a bit more detail to your topic."
        : "We couldn't process the generated study content.";
    return sendError(res, 502, message, code);
  }

  return res.status(200).json({ success: true, data });
}
