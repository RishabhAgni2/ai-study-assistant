import { GoogleGenAI, Type } from "@google/genai";

// Keeping the client a module-level singleton avoids re-reading env vars
// and re-constructing the SDK client on every request.
let client = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set on the server");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

const MODEL = "gemini-2.5-flash";

// Gemini's `responseSchema` feature constrains the model to emit JSON that
// matches this shape at the token-generation level, which makes malformed
// JSON far less likely than plain prompting alone. It is a strong hint, not
// a guarantee — the backend still runs full validation on the result before
// trusting it (see utils/validateStudyData.js). Never skip that step just
// because a schema was supplied here.
const studySetSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ["id", "question", "answer"],
      },
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctAnswer: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
        },
        required: ["id", "question", "options", "correctAnswer", "explanation"],
      },
    },
  },
  required: ["title", "summary", "flashcards", "quiz"],
};

function buildPrompt(userInput) {
  return `You are a study-set generator. Turn the topic or notes below into a study set.

Topic or notes:
"""
${userInput}
"""

Requirements:
- Produce 6 to 10 flashcards covering the most important concepts.
- Produce 5 to 8 multiple-choice quiz questions, each with exactly 4 options.
- Each quiz question needs exactly one correct answer, given as a
  zero-based index into its options array, plus a short explanation of
  why that answer is correct.
- Keep language clear and concise, suitable for a student reviewing the topic.
- Base everything on the given topic or notes. If the input is too vague or
  short to generate real study content from, still do your best to produce
  a reasonable general study set on the closest identifiable subject.
- Return ONLY JSON matching the provided schema. Do not include markdown
  fences, commentary, or any text outside the JSON object.`;
}

/**
 * Calls Gemini and returns the raw parsed JSON (untrusted). Throws a
 * descriptive Error for the controller to translate into an HTTP response.
 * This function's only job is "talk to the AI provider" — it does not know
 * about Express, HTTP status codes, or our validation rules.
 */
export async function generateStudySet(userInput) {
  const ai = getClient();

  let response;
  try {
    response = await ai.models.generateContent({
      model: MODEL,
      contents: buildPrompt(userInput),
      config: {
        responseMimeType: "application/json",
        responseSchema: studySetSchema,
        temperature: 0.6,
      },
    });
  } catch (err) {
    // Network failures, rate limits, and provider-side errors all land here.
    const error = new Error("The AI provider request failed");
    error.cause = err;
    error.code = "PROVIDER_ERROR";
    throw error;
  }

  const text = response?.text;
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    const error = new Error("The AI provider returned an empty response");
    error.code = "EMPTY_RESPONSE";
    throw error;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    // This is the "malformed JSON" failure mode the assignment calls out
    // explicitly. responseSchema makes it rare, but a truncated response
    // (e.g. hitting a token limit) can still produce invalid JSON, so this
    // path must be handled rather than assumed away.
    const error = new Error("The AI provider returned invalid JSON");
    error.code = "MALFORMED_JSON";
    error.cause = err;
    throw error;
  }
}
