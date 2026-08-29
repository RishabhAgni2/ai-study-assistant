const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Calls the backend to generate a study set.
 *
 * Returns the parsed JSON body on both success and "clean" failure (e.g.
 * a 400/502 with { success: false, error, code }), so the caller can read
 * `error`/`code` either way. Throws only for things that aren't a normal
 * API response at all — a network failure, or an unparseable body.
 *
 * Note: this function does not cancel anything. Stale-response protection
 * (see App.jsx's generate handler) is done via request-ID comparison
 * instead of AbortController — see the README for why.
 */
export async function generateStudySet(input) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/study/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
  } catch (err) {
    const error = new Error("Network request failed");
    error.cause = err;
    throw error;
  }

  let body;
  try {
    body = await response.json();
  } catch (err) {
    const error = new Error("The server returned an unreadable response");
    error.cause = err;
    throw error;
  }

  return body;
}
